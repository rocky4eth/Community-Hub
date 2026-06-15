-- add new fields to profile

ALTER TABLE public.profiles
ADD COLUMN name TEXT,
ADD COLUMN guide BOOLEAN,
ADD COLUMN connections INTEGER,
ADD COLUMN answered INTEGER,
ADD COLUMN cities INTEGER;
