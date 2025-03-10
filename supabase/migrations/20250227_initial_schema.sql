-- Create user_metadata table for storing user subscription information
CREATE TABLE IF NOT EXISTS user_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  login_timestamp TIMESTAMP WITH TIME ZONE,
  stripe_customer_id TEXT,
  stripe_session_id TEXT,
  subscription_id TEXT,
  subscription_status TEXT,
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_metadata ENABLE ROW LEVEL SECURITY;

-- Create policies for user_metadata
CREATE POLICY "Users can view their own metadata"
  ON user_metadata
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own metadata"
  ON user_metadata
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create ai_usage table for tracking AI usage
CREATE TABLE IF NOT EXISTS ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_length INTEGER,
  response_length INTEGER,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;

-- Create policies for ai_usage
CREATE POLICY "Users can view their own AI usage"
  ON ai_usage
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI usage"
  ON ai_usage
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to automatically set updated_at on user_metadata
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_metadata_updated_at
BEFORE UPDATE ON user_metadata
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
