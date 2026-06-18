-- add new fields to profile

ALTER TABLE public.profiles
ADD COLUMN avatar_url TEXT;
