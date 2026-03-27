
-- Create gallery_albums table
CREATE TABLE public.gallery_albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL,
  gallery_type text NOT NULL DEFAULT 'medias',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create gallery_images table
CREATE TABLE public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid REFERENCES public.gallery_albums(id) ON DELETE CASCADE NOT NULL,
  file_path text NOT NULL,
  alt text NOT NULL DEFAULT '',
  caption text DEFAULT '',
  media_type text NOT NULL DEFAULT 'image',
  video_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- RLS policies for gallery_albums
CREATE POLICY "Anyone can view albums" ON public.gallery_albums FOR SELECT USING (true);
CREATE POLICY "Admins can insert albums" ON public.gallery_albums FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update albums" ON public.gallery_albums FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete albums" ON public.gallery_albums FOR DELETE USING (is_admin());

-- RLS policies for gallery_images
CREATE POLICY "Anyone can view images" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Admins can insert images" ON public.gallery_images FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update images" ON public.gallery_images FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete images" ON public.gallery_images FOR DELETE USING (is_admin());

-- Create gallery storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for gallery bucket
CREATE POLICY "Anyone can view gallery files" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Admins can upload gallery files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery' AND (SELECT is_admin()));
CREATE POLICY "Admins can delete gallery files" ON storage.objects FOR DELETE USING (bucket_id = 'gallery' AND (SELECT is_admin()));
