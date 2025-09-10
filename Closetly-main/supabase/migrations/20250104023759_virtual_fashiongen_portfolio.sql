-- Location: supabase/migrations/20250104023759_virtual_fashiongen_portfolio.sql
-- Schema Analysis: Creating user portfolio and image management for Virtual FashionGen
-- Integration Type: Addition - Personal portfolio with 72-hour retention policy
-- Dependencies: auth.users (Supabase managed)

-- Create user profiles table (intermediary for auth.users)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create fashion portfolio table for image storage
CREATE TABLE public.fashion_portfolio_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    image_data TEXT NOT NULL, -- Base64 encoded image data
    image_metadata JSONB NOT NULL DEFAULT '{}', -- Store style, creativity, etc.
    original_prompt TEXT,
    style TEXT NOT NULL DEFAULT 'realistic',
    generated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    saved_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ NOT NULL, -- 72 hours from saved_at
    is_expired BOOLEAN DEFAULT false,
    file_size_bytes INTEGER DEFAULT 0,
    mime_type TEXT DEFAULT 'image/png',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create storage bucket for fashion images (private bucket)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'fashion-portfolio-images',
    'fashion-portfolio-images',
    false, -- Private bucket - only user can access their images
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
);

-- Essential indexes for performance
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_fashion_portfolio_user_id ON public.fashion_portfolio_images(user_id);
CREATE INDEX idx_fashion_portfolio_expires_at ON public.fashion_portfolio_images(expires_at);
CREATE INDEX idx_fashion_portfolio_saved_at ON public.fashion_portfolio_images(saved_at);
CREATE INDEX idx_fashion_portfolio_style ON public.fashion_portfolio_images(style);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fashion_portfolio_images ENABLE ROW LEVEL SECURITY;

-- Functions for automatic user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$;

-- Function to automatically expire old portfolio images
CREATE OR REPLACE FUNCTION public.cleanup_expired_portfolio_images()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    expired_count INTEGER;
BEGIN
    -- Mark expired images and count them
    UPDATE public.fashion_portfolio_images
    SET is_expired = true, updated_at = CURRENT_TIMESTAMP
    WHERE expires_at < CURRENT_TIMESTAMP AND is_expired = false;
    
    GET DIAGNOSTICS expired_count = ROW_COUNT;
    
    -- Delete expired images older than 1 day
    DELETE FROM public.fashion_portfolio_images
    WHERE is_expired = true AND expires_at < (CURRENT_TIMESTAMP - INTERVAL '1 day');
    
    RETURN expired_count;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies using Pattern 1 for user_profiles (core user table)
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- RLS Policies using Pattern 2 for fashion_portfolio_images (simple user ownership)
CREATE POLICY "users_manage_own_portfolio_images"
ON public.fashion_portfolio_images
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Storage RLS Policies for fashion portfolio bucket
CREATE POLICY "users_view_own_fashion_images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'fashion-portfolio-images' AND owner = auth.uid());

CREATE POLICY "users_upload_own_fashion_images" 
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'fashion-portfolio-images' 
    AND owner = auth.uid()
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "users_update_own_fashion_images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'fashion-portfolio-images' AND owner = auth.uid())
WITH CHECK (bucket_id = 'fashion-portfolio-images' AND owner = auth.uid());

CREATE POLICY "users_delete_own_fashion_images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'fashion-portfolio-images' AND owner = auth.uid());

-- Mock data for testing (reference existing auth users if they exist)
DO $$
DECLARE
    test_user_id UUID;
    portfolio_image_id UUID := gen_random_uuid();
BEGIN
    -- Try to get existing user first
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    -- If no users exist, create placeholder comment
    IF test_user_id IS NULL THEN
        RAISE NOTICE 'No existing users found. Portfolio table ready for use when users are created.';
    ELSE
        -- Add sample portfolio image
        INSERT INTO public.fashion_portfolio_images (
            id, 
            user_id, 
            image_data, 
            image_metadata, 
            original_prompt, 
            style, 
            expires_at
        )
        VALUES (
            portfolio_image_id,
            test_user_id,
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', -- 1x1 transparent PNG
            '{"creativity": 0.7, "generated_by": "gemini", "version": "1.0"}',
            'Elegant evening wear with sophisticated details',
            'elegant',
            CURRENT_TIMESTAMP + INTERVAL '72 hours'
        );
        
        RAISE NOTICE 'Sample portfolio image added for existing user';
    END IF;
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- Create a function to check portfolio storage usage
CREATE OR REPLACE FUNCTION public.get_user_portfolio_stats(target_user_id UUID DEFAULT auth.uid())
RETURNS TABLE(
    total_images INTEGER,
    active_images INTEGER,
    expired_images INTEGER,
    total_storage_mb NUMERIC,
    expires_soon INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::INTEGER as total_images,
        COUNT(*) FILTER (WHERE is_expired = false)::INTEGER as active_images,
        COUNT(*) FILTER (WHERE is_expired = true)::INTEGER as expired_images,
        ROUND(SUM(file_size_bytes)::NUMERIC / 1024.0 / 1024.0, 2) as total_storage_mb,
        COUNT(*) FILTER (WHERE expires_at < CURRENT_TIMESTAMP + INTERVAL '24 hours' AND is_expired = false)::INTEGER as expires_soon
    FROM public.fashion_portfolio_images
    WHERE user_id = target_user_id;
END;
$$;

-- Add comment for documentation
COMMENT ON TABLE public.fashion_portfolio_images IS 'Stores user fashion portfolio images with 72-hour retention policy';
COMMENT ON FUNCTION public.cleanup_expired_portfolio_images() IS 'Automatically expires and cleans up portfolio images older than 72 hours';
COMMENT ON FUNCTION public.get_user_portfolio_stats(UUID) IS 'Returns portfolio statistics for a specific user including storage usage';