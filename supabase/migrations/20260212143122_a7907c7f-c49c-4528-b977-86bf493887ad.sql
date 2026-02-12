
-- Create media table
CREATE TABLE public.media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  video_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Anyone can view visible media
CREATE POLICY "Anyone can view visible media"
ON public.media
FOR SELECT
USING (is_visible = true);

-- Admins can do everything
CREATE POLICY "Admins can insert media"
ON public.media
FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Admins can update media"
ON public.media
FOR UPDATE
USING (is_admin());

CREATE POLICY "Admins can delete media"
ON public.media
FOR DELETE
USING (is_admin());

-- Admins can see all media including hidden
CREATE POLICY "Admins can view all media"
ON public.media
FOR SELECT
USING (is_admin());

-- Trigger for updated_at
CREATE TRIGGER update_media_updated_at
BEFORE UPDATE ON public.media
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for media files
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

-- Storage policies
CREATE POLICY "Anyone can view media files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'media');

CREATE POLICY "Admins can upload media files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'media' AND (SELECT is_admin()));

CREATE POLICY "Admins can update media files"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'media' AND (SELECT is_admin()));

CREATE POLICY "Admins can delete media files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'media' AND (SELECT is_admin()));
