import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MediaItem {
  id: string;
  title: string;
  description: string | null;
  media_type: "image" | "video";
  file_url: string;
  thumbnail_url: string | null;
  video_url: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export const useMedia = () => {
  return useQuery({
    queryKey: ["media"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("media")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as MediaItem[];
    },
  });
};

export const useCreateMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (media: {
      title: string;
      description?: string;
      media_type: "image" | "video";
      file_url: string;
      thumbnail_url?: string;
      video_url?: string;
    }) => {
      const { data, error } = await supabase
        .from("media")
        .insert(media)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["media"] }),
  });
};

export const useUpdateMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<MediaItem> & { id: string }) => {
      const { data, error } = await supabase
        .from("media")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["media"] }),
  });
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("media").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["media"] }),
  });
};

export const uploadMediaFile = async (file: File): Promise<string> => {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
  const { error } = await supabase.storage
    .from("media")
    .upload(fileName, file);
  if (error) throw error;
  const { data } = supabase.storage.from("media").getPublicUrl(fileName);
  return data.publicUrl;
};
