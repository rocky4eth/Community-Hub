-- Create the posts table for the noticeboard
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_address TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('REQUEST', 'OFFER')),
  city TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view posts
CREATE POLICY "Anyone can view posts" 
  ON public.posts FOR SELECT 
  USING (true);

-- Allow anyone to insert posts (can be tightened later with auth)
CREATE POLICY "Anyone can insert posts" 
  ON public.posts FOR INSERT 
  WITH CHECK (true);

-- Allow anyone to update posts (can be tightened later with auth)
CREATE POLICY "Anyone can update posts" 
  ON public.posts FOR UPDATE 
  USING (true)
  WITH CHECK (true);