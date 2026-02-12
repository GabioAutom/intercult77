import { useState } from "react";
import { useMedia, useCreateMedia, useDeleteMedia, useUpdateMedia, uploadMediaFile, MediaItem } from "@/hooks/useMedia";
import { useAuth } from "@/hooks/useAuth";
import AdminLogin from "@/components/locations/AdminLogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Plus, Trash2, Edit, Loader2, Settings, Eye, EyeOff, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const MediaFormDialog = ({ media, onClose }: { media?: MediaItem; onClose?: () => void }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(media?.title || "");
  const [description, setDescription] = useState(media?.description || "");
  const [mediaType, setMediaType] = useState<"image" | "video">(media?.media_type || "image");
  const [videoUrl, setVideoUrl] = useState(media?.video_url || "");
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createMedia = useCreateMedia();
  const updateMedia = useUpdateMedia();
  const { toast } = useToast();

  const isEditing = !!media;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);

    try {
      let fileUrl = media?.file_url || "";
      let thumbnailUrl = media?.thumbnail_url || "";

      if (file) {
        fileUrl = await uploadMediaFile(file);
      }
      if (thumbnailFile) {
        thumbnailUrl = await uploadMediaFile(thumbnailFile);
      }

      if (!fileUrl && !isEditing) {
        toast({ title: "Veuillez sélectionner un fichier", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }

      if (isEditing) {
        await updateMedia.mutateAsync({
          id: media.id,
          title,
          description: description || null,
          media_type: mediaType,
          ...(fileUrl && { file_url: fileUrl }),
          thumbnail_url: thumbnailUrl || null,
          video_url: mediaType === "video" ? videoUrl || null : null,
        });
        toast({ title: "Média mis à jour" });
      } else {
        await createMedia.mutateAsync({
          title,
          description: description || undefined,
          media_type: mediaType,
          file_url: fileUrl,
          thumbnail_url: thumbnailUrl || undefined,
          video_url: mediaType === "video" ? videoUrl || undefined : undefined,
        });
        toast({ title: "Média ajouté" });
      }

      setOpen(false);
      onClose?.();
      if (!isEditing) {
        setTitle("");
        setDescription("");
        setFile(null);
        setThumbnailFile(null);
        setVideoUrl("");
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Erreur";
      toast({ title: "Erreur", description: msg, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
        ) : (
          <Button><Plus className="h-4 w-4 mr-2" />Ajouter un média</Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier le média" : "Ajouter un média"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Titre *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
          <div>
            <Label>Type</Label>
            <Select value={mediaType} onValueChange={(v) => setMediaType(v as "image" | "video")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Vidéo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{mediaType === "video" ? "Fichier vidéo ou image de couverture" : "Fichier image"} {!isEditing && "*"}</Label>
            <Input type="file" accept={mediaType === "video" ? "video/*,image/*" : "image/*"} onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
          {mediaType === "video" && (
            <>
              <div>
                <Label>Miniature (optionnel)</Label>
                <Input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
              </div>
              <div>
                <Label>URL vidéo externe (YouTube, Vimeo embed)</Label>
                <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/embed/..." />
              </div>
            </>
          )}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isEditing ? "Mettre à jour" : "Ajouter"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const MediaAdmin = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const { data: media, isLoading } = useMedia();
  const deleteMedia = useDeleteMedia();
  const updateMedia = useUpdateMedia();
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
        <p className="text-muted-foreground mb-4">
          Vous n'avez pas les droits d'administration.
        </p>
        <Button variant="outline" onClick={signOut}>
          <LogOut className="h-4 w-4 mr-2" />Se déconnecter
        </Button>
      </div>
    );
  }

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Supprimer "${item.title}" ?`)) return;
    try {
      await deleteMedia.mutateAsync(item.id);
      toast({ title: "Média supprimé" });
    } catch {
      toast({ title: "Erreur de suppression", variant: "destructive" });
    }
  };

  const toggleVisibility = async (item: MediaItem) => {
    try {
      await updateMedia.mutateAsync({ id: item.id, is_visible: !item.is_visible });
      toast({ title: item.is_visible ? "Média masqué" : "Média visible" });
    } catch {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Gestion des médias</h3>
          <p className="text-sm text-muted-foreground">Connecté en tant que {user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <MediaFormDialog />
          <Button variant="outline" size="icon" onClick={signOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border border-border rounded-lg bg-card">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : !media?.length ? (
          <div className="p-8 text-center text-muted-foreground">
            <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Aucun média. Cliquez sur "Ajouter un média" pour commencer.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {media.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4">
                <div className="w-16 h-12 bg-muted overflow-hidden flex-shrink-0">
                  <img
                    src={item.thumbnail_url || item.file_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{item.media_type}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => toggleVisibility(item)} title={item.is_visible ? "Masquer" : "Afficher"}>
                    {item.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                  <MediaFormDialog media={item} />
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaAdmin;
