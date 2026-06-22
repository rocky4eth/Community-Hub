-- Allow anyone to delete posts (can be tightened later with auth)
CREATE POLICY "Anyone can delete posts" 
  ON public.posts FOR DELETE 
  USING (true);