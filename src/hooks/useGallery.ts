import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface GalleryAlbum {
  id: string;
  title: string;
  slug: string;
  gallery_type: string;
  sort_order: number;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  album_id: string;
  file_path: string;
  alt: string;
  caption: string;
  media_type: string;
  video_url: string | null;
  sort_order: number;
  created_at: string;
}

export const useAlbums = (galleryType: string) => {
  return useQuery({
    queryKey: ["gallery-albums", galleryType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_albums")
        .select("*")
        .eq("gallery_type", galleryType)
        .order("sort_order");
      if (error) throw error;
      return data as GalleryAlbum[];
    },
  });
};

export const useAlbumImages = (albumId: string | null) => {
  return useQuery({
    queryKey: ["gallery-images", albumId],
    queryFn: async () => {
      if (!albumId) return [];
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .eq("album_id", albumId)
        .order("sort_order");
      if (error) throw error;
      return data as GalleryImage[];
    },
    enabled: !!albumId,
  });
};

export const useCreateAlbum = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (album: { title: string; slug: string; gallery_type: string; sort_order: number }) => {
      const { data, error } = await supabase.from("gallery_albums").insert(album).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gallery-albums"] }),
  });
};

export const useDeleteAlbum = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      // Delete storage files first
      const { data: imgs } = await supabase
        .from("gallery_images")
        .select("file_path")
        .eq("album_id", id);
      if (imgs?.length) {
        await supabase.storage.from("gallery").remove(imgs.map((i) => i.file_path));
      }
      const { error } = await supabase.from("gallery_albums").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gallery-albums"] });
      qc.invalidateQueries({ queryKey: ["gallery-images"] });
    },
  });
};

export const useDeleteImage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, filePath }: { id: string; filePath: string }) => {
      await supabase.storage.from("gallery").remove([filePath]);
      const { error } = await supabase.from("gallery_images").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gallery-images"] }),
  });
};

export const uploadGalleryFile = async (albumId: string, file: File): Promise<string> => {
  const ext = file.name.split(".").pop();
  const path = `${albumId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("gallery").upload(path, file);
  if (error) throw error;
  return path;
};

export const getGalleryPublicUrl = (path: string) => {
  const { data } = supabase.storage.from("gallery").getPublicUrl(path);
  return data.publicUrl;
};
