import { useState } from "react";
import { useMedia, MediaItem } from "@/hooks/useMedia";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Play, ImageIcon } from "lucide-react";

const MediaGallery = ({ category }: { category?: string }) => {
  const { data: media, isLoading } = useMedia(category);
  const [selected, setSelected] = useState<MediaItem | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="aspect-video w-full" />
        ))}
      </div>
    );
  }

  if (!media?.length) {
    return (
      <div className="text-center py-16">
        <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground">Aucun média pour le moment.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {media.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelected(item)}
            className="group relative aspect-video overflow-hidden bg-muted border border-border hover:border-primary transition-colors"
          >
            <img
              src={item.thumbnail_url || item.file_url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            {item.media_type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center">
                  <Play className="h-5 w-5 text-primary-foreground ml-0.5" />
                </div>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <p className="text-sm font-medium text-white text-left truncate">
                {item.title}
              </p>
            </div>
          </button>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {selected && (
            <div>
              {selected.media_type === "video" ? (
                selected.video_url ? (
                  <div className="aspect-video">
                    <iframe
                      src={selected.video_url}
                      className="w-full h-full"
                      allowFullScreen
                      title={selected.title}
                    />
                  </div>
                ) : (
                  <video
                    src={selected.file_url}
                    controls
                    className="w-full aspect-video"
                  />
                )
              ) : (
                <img
                  src={selected.file_url}
                  alt={selected.title}
                  className="w-full max-h-[80vh] object-contain"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {selected.title}
                </h3>
                {selected.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {selected.description}
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MediaGallery;
