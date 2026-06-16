-- Create a policy that allows updates
CREATE POLICY "Anyone can update a profile"
  ON public.profiles FOR UPDATE
  USING (true)
  WITH CHECK (true);