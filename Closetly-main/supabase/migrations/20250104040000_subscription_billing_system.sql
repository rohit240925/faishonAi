-- Location: supabase/migrations/20250104040000_subscription_billing_system.sql
-- Schema Analysis: Existing user_profiles and fashion_portfolio_images tables
-- Integration Type: Addition - Adding subscription and billing features
-- Dependencies: user_profiles (existing)

-- 1. Create subscription-related types
CREATE TYPE public.subscription_status AS ENUM (
    'active', 'inactive', 'canceled', 'past_due', 'paused'
);

CREATE TYPE public.plan_interval AS ENUM (
    'monthly', 'yearly'
);

CREATE TYPE public.billing_status AS ENUM (
    'paid', 'pending', 'failed', 'refunded'
);

-- 2. Subscription Plans table
CREATE TABLE public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10,2) NOT NULL,
    price_yearly DECIMAL(10,2) NOT NULL,
    api_credits_monthly INTEGER NOT NULL DEFAULT 100,
    api_credits_yearly INTEGER NOT NULL DEFAULT 1200,
    max_image_generations INTEGER NOT NULL DEFAULT 10,
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. User Subscriptions table
CREATE TABLE public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    status public.subscription_status DEFAULT 'inactive',
    billing_interval public.plan_interval DEFAULT 'monthly',
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT false,
    canceled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. API Usage Tracking table
CREATE TABLE public.api_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.user_subscriptions(id) ON DELETE SET NULL,
    credits_used INTEGER NOT NULL DEFAULT 1,
    operation_type TEXT NOT NULL, -- 'image_generation', 'fashion_analysis', etc.
    generation_style TEXT,
    max_images_requested INTEGER,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Billing History table
CREATE TABLE public.billing_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.user_subscriptions(id) ON DELETE SET NULL,
    stripe_invoice_id TEXT UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status public.billing_status DEFAULT 'pending',
    invoice_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    paid_date TIMESTAMPTZ,
    description TEXT,
    invoice_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Fashion Analysis Results (enhanced)
CREATE TABLE public.fashion_analysis_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    generation_style TEXT NOT NULL DEFAULT 'realistic',
    creativity_level DECIMAL(2,1) DEFAULT 0.7,
    max_images INTEGER DEFAULT 1,
    original_prompt TEXT NOT NULL,
    analysis_result JSONB NOT NULL,
    generation_metadata JSONB DEFAULT '{}'::jsonb,
    credits_consumed INTEGER DEFAULT 1,
    processing_time_ms INTEGER,
    success BOOLEAN DEFAULT true,
    error_details TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ DEFAULT (CURRENT_TIMESTAMP + INTERVAL '72 hours')
);

-- 7. Create indexes
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX idx_user_subscriptions_stripe_id ON public.user_subscriptions(stripe_subscription_id);

CREATE INDEX idx_api_usage_user_id ON public.api_usage(user_id);
CREATE INDEX idx_api_usage_created_at ON public.api_usage(created_at);
CREATE INDEX idx_api_usage_operation_type ON public.api_usage(operation_type);

CREATE INDEX idx_billing_history_user_id ON public.billing_history(user_id);
CREATE INDEX idx_billing_history_status ON public.billing_history(status);
CREATE INDEX idx_billing_history_invoice_date ON public.billing_history(invoice_date);

CREATE INDEX idx_fashion_analysis_user_id ON public.fashion_analysis_results(user_id);
CREATE INDEX idx_fashion_analysis_created_at ON public.fashion_analysis_results(created_at);
CREATE INDEX idx_fashion_analysis_expires_at ON public.fashion_analysis_results(expires_at);

-- 8. Add stripe_customer_id to existing user_profiles if not exists
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS current_api_credits INTEGER DEFAULT 0;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS total_credits_used INTEGER DEFAULT 0;

-- 9. Functions for subscription management
CREATE OR REPLACE FUNCTION public.get_user_subscription_status(user_uuid UUID)
RETURNS TABLE(
    plan_name TEXT,
    status TEXT,
    credits_remaining INTEGER,
    subscription_expires TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT 
        sp.name,
        COALESCE(us.status::TEXT, 'inactive'),
        GREATEST(up.current_api_credits, 0),
        us.current_period_end
    FROM public.user_profiles up
    LEFT JOIN public.user_subscriptions us ON up.id = us.user_id AND us.status = 'active'
    LEFT JOIN public.subscription_plans sp ON us.plan_id = sp.id
    WHERE up.id = user_uuid;
$$;

CREATE OR REPLACE FUNCTION public.consume_api_credits(user_uuid UUID, credits_to_consume INTEGER, operation_type TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_credits INTEGER;
    subscription_active BOOLEAN;
BEGIN
    -- Get current credits and subscription status
    SELECT up.current_api_credits, (us.status = 'active')
    INTO current_credits, subscription_active
    FROM public.user_profiles up
    LEFT JOIN public.user_subscriptions us ON up.id = us.user_id
    WHERE up.id = user_uuid;
    
    -- Check if user has enough credits and active subscription
    IF current_credits >= credits_to_consume AND subscription_active THEN
        -- Deduct credits
        UPDATE public.user_profiles 
        SET current_api_credits = current_api_credits - credits_to_consume,
            total_credits_used = total_credits_used + credits_to_consume
        WHERE id = user_uuid;
        
        -- Log usage
        INSERT INTO public.api_usage (user_id, credits_used, operation_type)
        VALUES (user_uuid, credits_to_consume, operation_type);
        
        RETURN true;
    ELSE
        RETURN false;
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.refill_monthly_credits()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    refilled_count INTEGER := 0;
BEGIN
    UPDATE public.user_profiles up
    SET current_api_credits = sp.api_credits_monthly
    FROM public.user_subscriptions us
    JOIN public.subscription_plans sp ON us.plan_id = sp.id
    WHERE up.id = us.user_id 
    AND us.status = 'active'
    AND us.billing_interval = 'monthly'
    AND us.current_period_start <= CURRENT_TIMESTAMP
    AND us.current_period_end > CURRENT_TIMESTAMP;
    
    GET DIAGNOSTICS refilled_count = ROW_COUNT;
    RETURN refilled_count;
END;
$$;

-- 10. Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fashion_analysis_results ENABLE ROW LEVEL SECURITY;

-- 11. RLS Policies
-- Public can read subscription plans
CREATE POLICY "public_can_read_subscription_plans"
ON public.subscription_plans
FOR SELECT
TO public
USING (is_active = true);

-- Users manage own subscriptions
CREATE POLICY "users_manage_own_subscriptions"
ON public.user_subscriptions
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users view own API usage
CREATE POLICY "users_view_own_api_usage"
ON public.api_usage
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users view own billing history
CREATE POLICY "users_view_own_billing_history"
ON public.billing_history
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users manage own fashion analysis results
CREATE POLICY "users_manage_own_fashion_analysis"
ON public.fashion_analysis_results
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 12. Insert default subscription plans
DO $$
DECLARE
    starter_plan_id UUID := gen_random_uuid();
    pro_plan_id UUID := gen_random_uuid();
    premium_plan_id UUID := gen_random_uuid();
BEGIN
    INSERT INTO public.subscription_plans (id, name, description, price_monthly, price_yearly, api_credits_monthly, api_credits_yearly, max_image_generations, features) VALUES
    (starter_plan_id, 'Starter', 'Perfect for personal fashion exploration', 9.99, 99.99, 100, 1200, 5, 
     '["AI Fashion Analysis", "Basic Style Recommendations", "Monthly Credits"]'::jsonb),
    (pro_plan_id, 'Professional', 'Ideal for fashion enthusiasts and stylists', 19.99, 199.99, 300, 3600, 15,
     '["Advanced AI Analysis", "Style Guide Generation", "Multiple Generation Styles", "Priority Support"]'::jsonb),
    (premium_plan_id, 'Premium', 'Complete solution for fashion professionals', 39.99, 399.99, 1000, 12000, 50,
     '["Unlimited Fashion Analysis", "Custom Style Profiles", "Bulk Generation", "API Access", "White-label Options"]'::jsonb);
END $$;

-- 13. Cleanup function for expired analysis results
CREATE OR REPLACE FUNCTION public.cleanup_expired_fashion_analysis()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.fashion_analysis_results
    WHERE expires_at < CURRENT_TIMESTAMP;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$;