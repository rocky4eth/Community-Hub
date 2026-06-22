-- Add transaction hash column to profiles and posts tables
ALTER TABLE public.profiles ADD COLUMN txid TEXT;
ALTER TABLE public.posts ADD COLUMN txid TEXT;