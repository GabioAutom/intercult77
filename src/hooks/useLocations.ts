import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Location, LocationFormData } from "@/types/location";

const withTimeout = async <T,>(
  promiseLike: PromiseLike<T>,
  ms = 15000,
  label = "Requête"
): Promise<T> => {
  let timeoutId: number | undefined;

  // Supabase returns a thenable builder, not a real Promise in types.
  const promise = Promise.resolve(promiseLike);

  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = window.setTimeout(() => {
      reject(new Error(`${label} a expiré (${Math.round(ms / 1000)}s)`));
    }, ms);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
  }
};

export const useLocations = (searchQuery?: string) => {
  return useQuery({
    queryKey: ["locations", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("locations")
        .select("*")
        .order("name", { ascending: true });

      if (searchQuery && searchQuery.trim()) {
        query = query.or(
          `name.ilike.%${searchQuery}%,address.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Location[];
    },
  });
};

export const useCreateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (location: LocationFormData) => {
      const { data, error } = await withTimeout(
        supabase.from("locations").insert([location]).select().single(),
        15000,
        "Enregistrement du lieu"
      );

      if (error) throw error;
      return data as Location;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<LocationFormData>;
    }) => {
      const { data: result, error } = await withTimeout(
        supabase.from("locations").update(data).eq("id", id).select().single(),
        15000,
        "Mise à jour du lieu"
      );

      if (error) throw error;
      return result as Location;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await withTimeout(
        supabase.from("locations").delete().eq("id", id),
        15000,
        "Suppression du lieu"
      );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
};
