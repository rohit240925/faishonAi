-- Update existing subscription plans to match FashionGen requirements
-- Remove existing plans and add new FashionGen tiers

DO $$
BEGIN
    -- Clear existing subscription plans
    DELETE FROM public.subscription_plans WHERE name IN ('Starter', 'Professional');
    
    -- Insert new FashionGen subscription plans
    INSERT INTO public.subscription_plans (
        id,
        name,
        description,
        price_monthly,
        price_yearly,
        api_credits_monthly,
        api_credits_yearly,
        features,
        max_image_generations,
        is_active
    ) VALUES
    (
        gen_random_uuid(),
        'Basic',
        'Perfect for fashion enthusiasts starting their journey',
        10.00,
        100.00,
        1000,
        12000,
        '["1000 API requests monthly", "Basic fashion generation", "Email support", "Up to 1GB storage"]'::jsonb,
        50,
        true
    ),
    (
        gen_random_uuid(),
        'Pro',
        'Ideal for fashion professionals and influencers',
        25.00,
        250.00,
        5000,
        60000,
        '["5000 API requests monthly", "Inspiration photo uploads", "Priority support", "Advanced style selection", "Up to 1GB storage"]'::jsonb,
        250,
        true
    ),
    (
        gen_random_uuid(),
        'Premium',
        'For fashion studios and power users',
        50.00,
        500.00,
        10000,
        120000,
        '["10000 API requests monthly", "Inspiration photo uploads", "24/7 priority support", "Advanced customization", "Unlimited storage"]'::jsonb,
        500,
        true
    );
    
    RAISE NOTICE 'FashionGen subscription plans updated successfully';
END $$;

-- Add new table for API credit recharges
CREATE TABLE IF NOT EXISTS public.api_credit_recharges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    credits_amount INTEGER NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    final_cost DECIMAL(10,2) NOT NULL,
    stripe_payment_intent_id TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'api_credit_recharges' AND indexname = 'idx_api_credit_recharges_user_id') THEN
        CREATE INDEX idx_api_credit_recharges_user_id ON public.api_credit_recharges(user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'api_credit_recharges' AND indexname = 'idx_api_credit_recharges_status') THEN
        CREATE INDEX idx_api_credit_recharges_status ON public.api_credit_recharges(status);
    END IF;
END $$;

-- Enable RLS if not already enabled
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'api_credit_recharges' 
        AND n.nspname = 'public'
        AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.api_credit_recharges ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- RLS Policy for API credit recharges (drop and recreate to avoid conflicts)
DO $$
BEGIN
    -- Drop existing policy if it exists
    DROP POLICY IF EXISTS "users_manage_own_credit_recharges" ON public.api_credit_recharges;
    
    -- Create the policy
    CREATE POLICY "users_manage_own_credit_recharges"
    ON public.api_credit_recharges
    FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
END $$;

-- Function to calculate recharge cost with discount
CREATE OR REPLACE FUNCTION public.calculate_recharge_cost(credits INTEGER)
RETURNS TABLE(base_cost DECIMAL, discount_percent DECIMAL, final_cost DECIMAL)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    cost_per_thousand DECIMAL := 10.00;
    discount DECIMAL := 0;
BEGIN
    -- Base cost calculation
    base_cost := (credits / 1000.0) * cost_per_thousand;
    
    -- Apply 10% discount for purchases over 5000 credits
    IF credits >= 5000 THEN
        discount := 10.0;
        final_cost := base_cost * 0.9;
    ELSE
        final_cost := base_cost;
    END IF;
    
    discount_percent := discount;
    
    RETURN QUERY SELECT base_cost, discount_percent, final_cost;
END;
$$;

-- Add storage usage tracking to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS storage_used_bytes BIGINT DEFAULT 0,
ADD COLUMN IF NOT EXISTS storage_limit_bytes BIGINT DEFAULT 1073741824; -- 1GB default

-- Create storage bucket for fashion images if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'fashion-images',
    'fashion-images',
    false,
    10485760, -- 10MB limit per file
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies for fashion images (drop existing policies first to avoid conflicts)
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "users_view_own_fashion_images" ON storage.objects;
    DROP POLICY IF EXISTS "users_upload_fashion_images" ON storage.objects;
    DROP POLICY IF EXISTS "users_update_own_fashion_images" ON storage.objects;
    DROP POLICY IF EXISTS "users_delete_own_fashion_images" ON storage.objects;
    
    -- Create policies
    CREATE POLICY "users_view_own_fashion_images"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (bucket_id = 'fashion-images' AND owner = auth.uid());

    CREATE POLICY "users_upload_fashion_images" 
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'fashion-images' 
        AND owner = auth.uid()
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

    CREATE POLICY "users_update_own_fashion_images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'fashion-images' AND owner = auth.uid())
    WITH CHECK (bucket_id = 'fashion-images' AND owner = auth.uid());

    CREATE POLICY "users_delete_own_fashion_images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'fashion-images' AND owner = auth.uid());
    
    RAISE NOTICE 'Storage policies for fashion-images bucket created successfully';
END $$;

-- Function to update storage usage
CREATE OR REPLACE FUNCTION public.update_user_storage_usage(user_uuid UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    total_size BIGINT;
BEGIN
    -- Calculate total storage used by user
    SELECT COALESCE(SUM(metadata->>'size')::BIGINT, 0)
    INTO total_size
    FROM storage.objects
    WHERE bucket_id = 'fashion-images' 
    AND owner = user_uuid;
    
    -- Update user profile
    UPDATE public.user_profiles
    SET storage_used_bytes = total_size,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = user_uuid;
END;
$$;

-- Function to check storage limit
CREATE OR REPLACE FUNCTION public.check_storage_limit(user_uuid UUID, file_size BIGINT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_usage BIGINT;
    storage_limit BIGINT;
BEGIN
    SELECT storage_used_bytes, storage_limit_bytes
    INTO current_usage, storage_limit
    FROM public.user_profiles
    WHERE id = user_uuid;
    
    RETURN (current_usage + file_size) <= storage_limit;
END;
$$;