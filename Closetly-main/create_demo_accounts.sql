-- DEMO ACCOUNTS CREATION SCRIPT
-- Run this script in your Supabase SQL Editor to create demo accounts
-- 
-- IMPORTANT: This is for development/demo purposes only
-- Remove or modify for production use

-- Demo Account Credentials:
-- Admin:    admin@fashiongen.demo    / admin123
-- Customer: customer@fashiongen.demo / customer123

BEGIN;

-- Create demo users using Supabase auth functions (preferred method)
-- Note: This requires the auth schema to be accessible

-- Admin User
SELECT auth.users_create_user(
    'admin@fashiongen.demo',
    'admin123',
    '{"full_name": "Admin Demo User", "role": "admin"}',
    '{"provider": "email", "providers": ["email"], "role": "admin"}'
);

-- Customer User  
SELECT auth.users_create_user(
    'customer@fashiongen.demo',
    'customer123',
    '{"full_name": "Customer Demo User", "role": "customer"}',
    '{"provider": "email", "providers": ["email"], "role": "customer"}'
);

-- Create user profiles
DO $$
DECLARE
    admin_user_id UUID;
    customer_user_id UUID;
    pro_plan_id UUID;
BEGIN
    -- Get user IDs
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@fashiongen.demo';
    SELECT id INTO customer_user_id FROM auth.users WHERE email = 'customer@fashiongen.demo';
    SELECT id INTO pro_plan_id FROM public.subscription_plans WHERE name = 'Professional' LIMIT 1;
    
    -- Admin profile
    INSERT INTO public.user_profiles (
        id, email, full_name, current_api_credits, role, is_admin,
        storage_limit_bytes, preferences
    ) VALUES (
        admin_user_id,
        'admin@fashiongen.demo',
        'Admin Demo User',
        10000,
        'admin',
        true,
        10737418240, -- 10GB
        '{"theme": "dark", "notifications": true}'::jsonb
    ) ON CONFLICT (id) DO UPDATE SET
        current_api_credits = 10000,
        role = 'admin',
        is_admin = true;

    -- Customer profile
    INSERT INTO public.user_profiles (
        id, email, full_name, current_api_credits, role, is_admin,
        storage_limit_bytes, preferences
    ) VALUES (
        customer_user_id,
        'customer@fashiongen.demo',
        'Customer Demo User',
        300,
        'customer',
        false,
        1073741824, -- 1GB
        '{"theme": "light", "notifications": true}'::jsonb
    ) ON CONFLICT (id) DO UPDATE SET
        current_api_credits = 300,
        role = 'customer',
        is_admin = false;

    -- Customer subscription
    IF pro_plan_id IS NOT NULL THEN
        INSERT INTO public.user_subscriptions (
            user_id, subscription_plan_id, status,
            current_period_start, current_period_end,
            billing_interval,
            stripe_subscription_id, stripe_customer_id
        ) VALUES (
            customer_user_id,
            pro_plan_id,
            'active',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP + INTERVAL '1 month',
            'monthly',
            'demo_sub_' || customer_user_id,
            'demo_cus_' || customer_user_id
        ) ON CONFLICT DO NOTHING;
    END IF;

    RAISE NOTICE 'Demo accounts created successfully!';
    RAISE NOTICE 'Admin: admin@fashiongen.demo / admin123';
    RAISE NOTICE 'Customer: customer@fashiongen.demo / customer123';
END $$;

COMMIT;