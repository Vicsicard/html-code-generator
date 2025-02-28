-- COMPLETE SUPABASE SETUP FOR HTML CODE CREATOR
-- Run this SQL in the Supabase SQL Editor

-- 1. SETUP USER METADATA TABLE
-- This table stores additional information about users
CREATE TABLE IF NOT EXISTS public.user_metadata (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  login_timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  subscription_tier TEXT DEFAULT 'free',
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_metadata ENABLE ROW LEVEL SECURITY;

-- Create policies for user_metadata table
-- Users can view only their own data
CREATE POLICY "Users can view their own metadata" 
  ON public.user_metadata 
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update only their own data
CREATE POLICY "Users can update their own metadata" 
  ON public.user_metadata 
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can insert only their own data
CREATE POLICY "Users can insert their own metadata" 
  ON public.user_metadata 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 2. SETUP USER CREDITS TABLE
-- This table tracks usage credits for generating HTML
CREATE TABLE IF NOT EXISTS public.user_credits (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_remaining INTEGER DEFAULT 10,
  total_credits_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

-- Create policies for user_credits table
-- Users can view only their own credits
CREATE POLICY "Users can view their own credits"
  ON public.user_credits
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update only their own credits (usually handled by server functions)
CREATE POLICY "Users can update their own credits"
  ON public.user_credits
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can insert only their own credit records
CREATE POLICY "Users can insert their own credit records"
  ON public.user_credits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. SETUP GENERATION HISTORY TABLE
-- This table stores history of HTML generations
CREATE TABLE IF NOT EXISTS public.generation_history (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  generated_html TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  credits_used INTEGER DEFAULT 1
);

-- Enable Row Level Security
ALTER TABLE public.generation_history ENABLE ROW LEVEL SECURITY;

-- Create policies for generation_history table
-- Users can view only their own history
CREATE POLICY "Users can view their own history"
  ON public.generation_history
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own history records
CREATE POLICY "Users can insert their own history"
  ON public.generation_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. CREATE FUNCTIONS FOR USER MANAGEMENT

-- Function to handle new user signup
-- This automatically creates entries in user_metadata and user_credits
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into user_metadata
  INSERT INTO public.user_metadata (user_id, email)
  VALUES (new.id, new.email);
  
  -- Insert into user_credits
  INSERT INTO public.user_credits (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user when a new user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to use credits
CREATE OR REPLACE FUNCTION public.use_credits(credits_to_use INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  user_credits_remaining INTEGER;
BEGIN
  -- Get current credits for the user
  SELECT credits_remaining INTO user_credits_remaining
  FROM public.user_credits
  WHERE user_id = auth.uid();
  
  -- Check if user has enough credits
  IF user_credits_remaining >= credits_to_use THEN
    -- Update user credits
    UPDATE public.user_credits
    SET 
      credits_remaining = credits_remaining - credits_to_use,
      total_credits_used = total_credits_used + credits_to_use,
      updated_at = now()
    WHERE user_id = auth.uid();
    
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. CREATE TEST USER
-- This will create a user with email test@example.com and password Test123456!
-- If the user already exists, this won't create a duplicate

-- First check if user exists
DO $$
DECLARE
  user_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO user_count FROM auth.users WHERE email = 'test@example.com';
  
  IF user_count = 0 THEN
    -- Insert a new user
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      confirmation_sent_at,
      confirmed_at,
      is_sso_user,
      created_at,
      updated_at
    ) VALUES (
      uuid_generate_v4(),
      'test@example.com',
      crypt('Test123456!', gen_salt('bf')),
      now(),
      now(),
      now(),
      now(),
      FALSE,
      now(),
      now()
    );
  END IF;
END $$;

-- 6. VERIFY SETUP
-- This query checks if everything is set up correctly
SELECT 
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_metadata') AS user_metadata_exists,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_credits') AS user_credits_exists,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'generation_history') AS generation_history_exists,
  (SELECT COUNT(*) FROM auth.users WHERE email = 'test@example.com') AS test_user_exists,
  (SELECT COUNT(*) FROM pg_trigger WHERE tgname = 'on_auth_user_created') AS new_user_trigger_exists;
