-- Create the profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  wallet_address TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  bio TEXT,
  metadata_uri TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read profiles (SELECT)
CREATE POLICY "Profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

-- Create a policy that allows inserts (you may want to tighten this later based on your auth setup)
CREATE POLICY "Anyone can insert a profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (true);