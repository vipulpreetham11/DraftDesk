-- Add ai_generations_count to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ai_generations_count integer DEFAULT 0;
