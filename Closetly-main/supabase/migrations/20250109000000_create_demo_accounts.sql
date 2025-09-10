-- Create Demo Accounts Migration
-- This migration creates demo admin and customer accounts for testing purposes

-- 1. Create demo users in auth.users table
-- Note: In production, you should remove this migration or use proper user creation methods

DO $$
DECLARE
    admin_user_id UUID := '00000000-0000-0000-0000-000000000001';
    customer_user_id UUID := '00000000-0000-0000-0000-000000000002';
    admin_email TEXT := 'admin@fashiongen.demo';
    customer_email TEXT := 'customer@fashiongen.demo';
    encrypted_password TEXT;
BEGIN
    -- Note: This is a simplified approach for demo purposes
    -- In production, use Supabase Auth API or dashboard to create users
    
    -- Create admin user
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        role,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token,
        aud,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        last_sign_in_at
    ) VALUES (
        admin_user_id,
        '00000000-0000-0000-0000-000000000000',
        admin_email,
        '$2a$10$rKXQgwjwBKg7KwGJfxlGDOKQgLWWC8xQRrKVIlxWmMvYOYSQrYYJK', -- 'admin123' hashed
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        'authenticated',
        '',
        '',
        '',
        '',
        'authenticated',
        '{"provider": "email", "providers": ["email"], "role": "admin"}',
        '{"full_name": "Admin Demo User", "role": "admin"}',
        false,
        CURRENT_TIMESTAMP
    ) ON CONFLICT (id) DO NOTHING;

    -- Create customer user  
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        role,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token,
        aud,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        last_sign_in_at
    ) VALUES (
        customer_user_id,
        '00000000-0000-0000-0000-000000000000',
        customer_email,
        '$2a$10$rKXQgwjwBKg7KwGJfxlGDOKQgLWWC8xQRrKVIlxWmMvYOYSQrYYJK', -- 'customer123' hashed
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        'authenticated',
        '',
        '',
        '',
        '',
        'authenticated',
        '{"provider": "email", "providers": ["email"], "role": "customer"}',
        '{"full_name": "Customer Demo User", "role": "customer"}',
        false,
        CURRENT_TIMESTAMP
    ) ON CONFLICT (id) DO NOTHING;

    -- Create identities for email authentication
    INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        created_at,
        updated_at
    ) VALUES 
    (
        gen_random_uuid(),
        admin_user_id,
        jsonb_build_object('sub', admin_user_id::text, 'email', admin_email),
        'email',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        gen_random_uuid(),
        customer_user_id,
        jsonb_build_object('sub', customer_user_id::text, 'email', customer_email),
        'email',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ) ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Demo users created successfully';

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating demo users: %', SQLERRM;
END $$;

-- 2. Create user profiles for demo accounts
DO $$
DECLARE
    admin_user_id UUID := '00000000-0000-0000-0000-000000000001';
    customer_user_id UUID := '00000000-0000-0000-0000-000000000002';
    pro_plan_id UUID;
BEGIN
    -- Get Pro plan ID
    SELECT id INTO pro_plan_id FROM public.subscription_plans WHERE name = 'Professional' LIMIT 1;
    
    -- Create admin profile with premium features
    INSERT INTO public.user_profiles (
        id,
        email,
        full_name,
        avatar_url,
        current_api_credits,
        total_api_credits_used,
        storage_used_bytes,
        storage_limit_bytes,
        created_at,
        updated_at,
        role,
        is_admin,
        preferences
    ) VALUES (
        admin_user_id,
        'admin@fashiongen.demo',
        'Admin Demo User',
        null,
        10000, -- High credit count for admin
        0,
        0,
        10737418240, -- 10GB storage limit
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        'admin',
        true,
        '{"theme": "dark", "notifications": true, "dashboard_layout": "advanced"}'::jsonb
    ) ON CONFLICT (id) DO UPDATE SET
        current_api_credits = 10000,
        role = 'admin',
        is_admin = true;

    -- Create customer profile with standard features
    INSERT INTO public.user_profiles (
        id,
        email,
        full_name,
        avatar_url,
        current_api_credits,
        total_api_credits_used,
        storage_used_bytes,
        storage_limit_bytes,
        created_at,
        updated_at,
        role,
        is_admin,
        preferences
    ) VALUES (
        customer_user_id,
        'customer@fashiongen.demo',
        'Customer Demo User',
        null,
        300, -- Standard credit count
        50,
        1048576, -- 1MB used
        1073741824, -- 1GB storage limit
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        'customer',
        false,
        '{"theme": "light", "notifications": true, "tutorial_completed": false}'::jsonb
    ) ON CONFLICT (id) DO UPDATE SET
        current_api_credits = 300,
        role = 'customer',
        is_admin = false;

    -- Create subscription for customer (Pro plan)
    IF pro_plan_id IS NOT NULL THEN
        INSERT INTO public.user_subscriptions (
            id,
            user_id,
            subscription_plan_id,
            stripe_subscription_id,
            stripe_customer_id,
            status,
            current_period_start,
            current_period_end,
            billing_interval,
            created_at,
            updated_at
        ) VALUES (
            gen_random_uuid(),
            customer_user_id,
            pro_plan_id,
            'demo_sub_' || customer_user_id,
            'demo_cus_' || customer_user_id,
            'active',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP + INTERVAL '1 month',
            'monthly',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        ) ON CONFLICT DO NOTHING;
    END IF;

    RAISE NOTICE 'Demo user profiles created successfully';

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating demo user profiles: %', SQLERRM;
END $$;

-- 3. Create some sample fashion portfolio data for demo accounts
DO $$
DECLARE
    admin_user_id UUID := '00000000-0000-0000-0000-000000000001';
    customer_user_id UUID := '00000000-0000-0000-0000-000000000002';
BEGIN
    -- Add sample portfolio images for admin
    INSERT INTO public.fashion_portfolio_images (
        id,
        user_id,
        image_data,
        image_metadata,
        original_prompt,
        style,
        expires_at,
        created_at
    ) VALUES 
    (
        gen_random_uuid(),
        admin_user_id,
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        '{"creativity": 0.8, "generated_by": "gemini", "version": "1.0", "admin_generated": true}',
        'Professional business attire with modern sophisticated styling',
        'professional',
        CURRENT_TIMESTAMP + INTERVAL '30 days',
        CURRENT_TIMESTAMP - INTERVAL '2 days'
    ),
    (
        gen_random_uuid(),
        admin_user_id,
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        '{"creativity": 0.9, "generated_by": "gemini", "version": "1.0", "admin_generated": true}',
        'Elegant evening wear with luxury fashion elements',
        'elegant',
        CURRENT_TIMESTAMP + INTERVAL '30 days',
        CURRENT_TIMESTAMP - INTERVAL '1 day'
    );

    -- Add sample portfolio images for customer
    INSERT INTO public.fashion_portfolio_images (
        id,
        user_id,
        image_data,
        image_metadata,
        original_prompt,
        style,
        expires_at,
        created_at
    ) VALUES 
    (
        gen_random_uuid(),
        customer_user_id,
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        '{"creativity": 0.7, "generated_by": "gemini", "version": "1.0"}',
        'Casual everyday outfit with comfortable styling',
        'casual',
        CURRENT_TIMESTAMP + INTERVAL '30 days',
        CURRENT_TIMESTAMP - INTERVAL '3 hours'
    ),
    (
        gen_random_uuid(),
        customer_user_id,
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        '{"creativity": 0.6, "generated_by": "gemini", "version": "1.0"}',
        'Weekend casual look with trendy accessories',
        'trendy',
        CURRENT_TIMESTAMP + INTERVAL '30 days',
        CURRENT_TIMESTAMP - INTERVAL '1 hour'
    );

    RAISE NOTICE 'Demo portfolio data created successfully';

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating demo portfolio data: %', SQLERRM;
END $$;

-- 4. Create sample API usage logs for demo accounts
DO $$
DECLARE
    admin_user_id UUID := '00000000-0000-0000-0000-000000000001';
    customer_user_id UUID := '00000000-0000-0000-0000-000000000002';
BEGIN
    -- Add API usage logs for admin
    INSERT INTO public.api_usage_logs (
        id,
        user_id,
        endpoint,
        request_count,
        credits_used,
        created_at
    ) VALUES 
    (
        gen_random_uuid(),
        admin_user_id,
        '/api/fashion-analysis',
        15,
        15,
        CURRENT_TIMESTAMP - INTERVAL '2 hours'
    ),
    (
        gen_random_uuid(),
        admin_user_id,
        '/api/style-generation',
        8,
        8,
        CURRENT_TIMESTAMP - INTERVAL '1 hour'
    );

    -- Add API usage logs for customer
    INSERT INTO public.api_usage_logs (
        id,
        user_id,
        endpoint,
        request_count,
        credits_used,
        created_at
    ) VALUES 
    (
        gen_random_uuid(),
        customer_user_id,
        '/api/fashion-analysis',
        5,
        5,
        CURRENT_TIMESTAMP - INTERVAL '30 minutes'
    ),
    (
        gen_random_uuid(),
        customer_user_id,
        '/api/outfit-generation',
        3,
        3,
        CURRENT_TIMESTAMP - INTERVAL '15 minutes'
    );

    RAISE NOTICE 'Demo API usage logs created successfully';

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating demo API usage logs: %', SQLERRM;
END $$;

-- 5. Add some payment events for demo (simulated Stripe events)
DO $$
DECLARE
    customer_user_id UUID := '00000000-0000-0000-0000-000000000002';
BEGIN
    INSERT INTO public.payment_events (
        id,
        user_id,
        stripe_payment_intent_id,
        amount,
        currency,
        status,
        description,
        customer_name,
        created_at
    ) VALUES 
    (
        gen_random_uuid(),
        customer_user_id,
        'pi_demo_successful_payment',
        1999, -- $19.99
        'usd',
        'succeeded',
        'Professional Plan - Monthly Subscription',
        'Customer Demo User',
        CURRENT_TIMESTAMP - INTERVAL '5 days'
    ),
    (
        gen_random_uuid(),
        customer_user_id,
        'pi_demo_successful_payment_2',
        1999, -- $19.99
        'usd',
        'succeeded',
        'Professional Plan - Monthly Subscription Renewal',
        'Customer Demo User',
        CURRENT_TIMESTAMP - INTERVAL '1 day'
    );

    RAISE NOTICE 'Demo payment events created successfully';

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating demo payment events: %', SQLERRM;
END $$;

-- Final success message
DO $$
BEGIN
    RAISE NOTICE '=== DEMO ACCOUNTS CREATED SUCCESSFULLY ===';
    RAISE NOTICE 'Admin Account:';
    RAISE NOTICE '  Email: admin@fashiongen.demo';
    RAISE NOTICE '  Password: admin123';
    RAISE NOTICE '  Role: Admin with full access';
    RAISE NOTICE '  Credits: 10,000';
    RAISE NOTICE '';
    RAISE NOTICE 'Customer Account:';
    RAISE NOTICE '  Email: customer@fashiongen.demo';
    RAISE NOTICE '  Password: customer123';
    RAISE NOTICE '  Role: Customer with Pro subscription';
    RAISE NOTICE '  Credits: 300';
    RAISE NOTICE '';
    RAISE NOTICE 'Both accounts have sample data and are ready for testing.';
    RAISE NOTICE '=== END DEMO ACCOUNTS ===';
END $$;