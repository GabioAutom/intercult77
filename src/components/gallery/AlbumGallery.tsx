import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useAlbums, useAlbumImages, getGalleryPublicUrl } from "@/hooks/useGallery";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon, Play } from "lucide-react";
import Lightbox from "@/components/gallery/Lightbox";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const AlbumGallery = ({ galleryType }: { galleryType: string }) => {
  const { data: albums = [], isLoading: albumsLoading } = useAlbums(galleryType);
  const [activeAlbum, setActiveAlbum] = useState<string>("");
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [videoItem, setVideoItem] = useState<{ url: string; title: string } | null>(null);

  const currentAlbumId = activeAlbum || albums[0]?.id || "";
  const { data: images = [], isLoading: imagesLoading } = useAlbumImages(currentAlbumId);

  const lightboxImages = images
    .filter((img) => img.media_type === "image")
    .map((img) => ({
      src: getGalleryPublicUrl(img.file_path),
      alt: img.alt,
      caption: img.caption || undefined,
    }));

  const isOpen = lightboxIndex >= 0;
  const closeLightbox = () => setLightboxIndex(-1);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev <= 0 ? lightboxImages.length - 1 : prev - 1));
  }, [lightboxImages.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => (prev >= lightboxImages.length - 1 ? 0 : prev + 1));
  }, [lightboxImages.length]);

  const handleAlbumChange = (id: string) => {
    setActiveAlbum(id);
    setLightboxIndex(-1);
  };

  if (albumsLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full" />
        ))}
      </div>
    );
  }

  if (albums.length === 0) {
    return (
      <div className="text-center py-16">
        <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground">Aucun album pour le moment.</p>
      </div>
    );
  }

  // Track image-only index for lightbox
  let imageOnlyIndex = 0;

  return (
    <>
      <Tabs value={currentAlbumId} onValueChange={handleAlbumChange} className="mb-10">
        <TabsList className="bg-muted/50 border border-border flex-wrap h-auto">
          {albums.map((album) => (
            <TabsTrigger
              key={album.id}
              value={album.id}
              className="text-xs tracking-widest uppercase data-[state=active]:text-primary data-[state=active]:bg-background/80"
            >
              {album.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {albums.map((album) => (
          <TabsContent key={album.id} value={album.id}>
            <p className="text-sm text-muted-foreground mb-6">
              {album.id === currentAlbumId ? images.length : "—"} éléments
            </p>
            {album.id === currentAlbumId && (
              imagesLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="aspect-square w-full" />
                  ))}
                </div>
              ) : images.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">Aucun contenu dans cet album.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {(() => { imageOnlyIndex = 0; return null; })()}
                  {images.map((img, i) => {
                    const isVideo = img.media_type === "video";
                    const currentImageIndex = isVideo ? -1 : imageOnlyIndex++;
                    return (
                      <motion.div
                        key={img.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.4 }}
                        className="group relative cursor-pointer overflow-hidden rounded-sm border border-border hover:border-primary/40 transition-colors"
                        onClick={() => {
                          if (isVideo && img.video_url) {
                            setVideoItem({ url: img.video_url, title: img.alt });
                          } else if (!isVideo) {
                            setLightboxIndex(currentImageIndex);
                          }
                        }}
                      >
                        <img
                          src={getGalleryPublicUrl(img.file_path)}
                          alt={img.alt}
                          className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        {isVideo && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center">
                              <Play className="h-5 w-5 text-primary-foreground ml-0.5" />
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                          <p className="text-xs text-primary truncate">{img.caption || img.alt}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )
            )}
          </TabsContent>
        ))}
      </Tabs>

      <Lightbox
        images={lightboxImages}
        currentIndex={lightboxIndex}
        isOpen={isOpen}
        onClose={closeLightbox}
        onPrev={goPrev}
        onNext={goNext}
      />

      {/* Video dialog */}
      <Dialog open={!!videoItem} onOpenChange={() => setVideoItem(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {videoItem && (
            <div className="aspect-video">
              <iframe
                src={videoItem.url}
                className="w-full h-full"
                allowFullScreen
                title={videoItem.title}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AlbumGallery;
