-- Add deleted flag and txid_deleted to posts for soft-deletes
ALTER TABLE public.posts ADD COLUMN deleted BOOLEAN DEFAULT false NOT NULL;
