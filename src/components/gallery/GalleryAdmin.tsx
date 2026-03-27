import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  useAlbums,
  useAlbumImages,
  useCreateAlbum,
  useDeleteAlbum,
  useDeleteImage,
  uploadGalleryFile,
  getGalleryPublicUrl,
} from "@/hooks/useGallery";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import AdminLogin from "@/components/locations/AdminLogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  LogOut,
  Plus,
  Trash2,
  Upload,
  Image,
  FolderPlus,
  Settings,
  Play,
} from "lucide-react";

interface GalleryAdminProps {
  galleryType: string;
  galleryLabel: string;
}

const GalleryAdmin = ({ galleryType, galleryLabel }: GalleryAdminProps) => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const { data: albums = [], isLoading: albumsLoading } = useAlbums(galleryType);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const { data: images = [] } = useAlbumImages(selectedAlbum);
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeThumbnail, setYoutubeThumbnail] = useState("");
  const [youtubeTitle, setYoutubeTitle] = useState("");
  const createAlbum = useCreateAlbum();
  const deleteAlbum = useDeleteAlbum();
  const deleteImage = useDeleteImage();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  if (authLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!user) return <AdminLogin />;

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-medium mb-2">Accès restreint</h3>
        <p className="text-muted-foreground mb-4">Vous n'avez pas les droits d'administration.</p>
        <Button variant="outline" onClick={signOut}>
          <LogOut className="h-4 w-4 mr-2" />Se déconnecter
        </Button>
      </div>
    );
  }

  const handleCreateAlbum = async () => {
    if (!newAlbumTitle.trim()) return;
    const slug = newAlbumTitle
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    try {
      await createAlbum.mutateAsync({
        title: newAlbumTitle,
        slug,
        gallery_type: galleryType,
        sort_order: albums.length,
      });
      setNewAlbumTitle("");
      toast({ title: "Album créé" });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erreur";
      toast({ title: "Erreur", description: msg, variant: "destructive" });
    }
  };

  const handleDeleteAlbum = async (id: string) => {
    if (!confirm("Supprimer cet album et toutes ses images ?")) return;
    try {
      await deleteAlbum.mutateAsync(id);
      if (selectedAlbum === id) setSelectedAlbum(null);
      toast({ title: "Album supprimé" });
    } catch {
      toast({ title: "Erreur de suppression", variant: "destructive" });
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedAlbum || !e.target.files?.length) return;
    setUploading(true);
    const files = Array.from(e.target.files);
    let count = 0;

    for (const file of files) {
      try {
        const filePath = await uploadGalleryFile(selectedAlbum, file);
        const isVideo = file.type.startsWith("video/");
        const { error } = await supabase.from("gallery_images").insert({
          album_id: selectedAlbum,
          file_path: filePath,
          alt: file.name.replace(/\.[^.]+$/, ""),
          caption: "",
          media_type: isVideo ? "video" : "image",
          sort_order: images.length + count,
        });
        if (error) throw error;
        count++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erreur";
        toast({ title: "Erreur d'upload", description: msg, variant: "destructive" });
      }
    }

    setUploading(false);
    queryClient.invalidateQueries({ queryKey: ["gallery-images", selectedAlbum] });
    toast({ title: `${count} fichier(s) uploadé(s)` });
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Gestion — {galleryLabel}</h3>
          <p className="text-sm text-muted-foreground">Connecté en tant que {user.email}</p>
        </div>
        <Button variant="outline" size="icon" onClick={signOut}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      {/* Create album */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <FolderPlus className="w-4 h-4 text-primary" />
          Créer un album
        </h4>
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              value={newAlbumTitle}
              onChange={(e) => setNewAlbumTitle(e.target.value)}
              placeholder="Nom de l'album"
              onKeyDown={(e) => e.key === "Enter" && handleCreateAlbum()}
            />
          </div>
          <Button onClick={handleCreateAlbum} disabled={!newAlbumTitle.trim() || createAlbum.isPending}>
            <Plus className="w-4 h-4 mr-2" />
            Créer
          </Button>
        </div>
      </div>

      {/* Album list */}
      {albumsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {albums.map((album) => (
            <div
              key={album.id}
              onClick={() => setSelectedAlbum(album.id)}
              className={`cursor-pointer bg-card border rounded-lg p-4 transition-colors ${
                selectedAlbum === album.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{album.title}</h4>
                  <p className="text-xs text-muted-foreground">{album.slug}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAlbum(album.id);
                  }}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload + images for selected album */}
      {selectedAlbum && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium flex items-center gap-2">
              <Image className="w-4 h-4 text-primary" />
              {albums.find((a) => a.id === selectedAlbum)?.title}
            </h4>
            <label className="cursor-pointer">
              <Button asChild disabled={uploading} className="gap-2">
                <span>
                  <Upload className="w-4 h-4" />
                  {uploading ? "Upload..." : "Uploader"}
                </span>
              </Button>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleUpload}
                className="hidden"
              />
            </label>
          </div>

          {images.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">
              Aucun fichier. Uploadez des images ou vidéos.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {images.map((img) => (
                <div key={img.id} className="group relative rounded-sm overflow-hidden border border-border">
                  <img
                    src={getGalleryPublicUrl(img.file_path)}
                    alt={img.alt}
                    className="w-full aspect-square object-cover"
                  />
                  {img.media_type === "video" && (
                    <div className="absolute top-2 left-2">
                      <Play className="w-5 h-5 text-primary-foreground drop-shadow-lg" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteImage.mutate({ id: img.id, filePath: img.file_path })}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GalleryAdmin;
