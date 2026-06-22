-- Add notice_id to posts to link with the smart contract's uint256 noticeId
ALTER TABLE public.posts ADD COLUMN notice_id TEXT;