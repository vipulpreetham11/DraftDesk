-- Run this in your InsForge SQL Editor to configure the Thumbnail bucket

-- 1. Add thumbnail_url to projects table
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS thumbnail_url text;

-- 2. Create the 'Thumbnail' storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('Thumbnail', 'Thumbnail', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. Set up Storage RLS Policies for the 'Thumbnail' bucket
-- Enable RLS just in case it's not enabled by default
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to Thumbnail
CREATE POLICY "Public Access to Thumbnails" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'Thumbnail');

-- Allow authenticated users to upload their own thumbnails
CREATE POLICY "Auth Upload Thumbnails" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'Thumbnail' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own thumbnails
CREATE POLICY "Auth Update Thumbnails" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'Thumbnail' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own thumbnails
CREATE POLICY "Auth Delete Thumbnails" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'Thumbnail' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
