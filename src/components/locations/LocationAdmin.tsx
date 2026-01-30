import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateLocation, useUpdateLocation, useDeleteLocation } from "@/hooks/useLocations";
import { Location, LocationFormData } from "@/types/location";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, MapPin, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formatError = (error: unknown) => {
  if (!error) return "Erreur inconnue";
  if (typeof error === "string") return error;
  if (error instanceof Error) {
    const anyErr = error as any;
    const parts = [anyErr?.message, anyErr?.details, anyErr?.hint, anyErr?.code]
      .filter(Boolean)
      .map(String);
    return parts.length ? parts.join(" — ") : error.message;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return "Erreur inconnue";
  }
};

const locationSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  description: z.string().optional(),
  phone: z.string().optional(),
  hours: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal("")),
  category: z.string().optional(),
});

type LocationFormValues = z.infer<typeof locationSchema>;

interface LocationFormDialogProps {
  location?: Location;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

const LocationFormDialog = ({
  location,
  trigger,
  onSuccess,
}: LocationFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createLocation = useCreateLocation();
  const updateLocation = useUpdateLocation();

  const isEditing = !!location;

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: location?.name || "",
      address: location?.address || "",
      latitude: location?.latitude || 50.8503,
      longitude: location?.longitude || 4.3517,
      description: location?.description || "",
      phone: location?.phone || "",
      hours: location?.hours || "",
      image_url: location?.image_url || "",
      category: location?.category || "",
    },
  });

  const onSubmit = async (data: LocationFormValues) => {
    try {
      const formData: LocationFormData = {
        name: data.name,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        description: data.description || undefined,
        phone: data.phone || undefined,
        hours: data.hours || undefined,
        image_url: data.image_url || undefined,
        category: data.category || undefined,
      };

      if (isEditing) {
        await updateLocation.mutateAsync({ id: location.id, data: formData });
        toast({ title: "Lieu modifié avec succès" });
      } else {
        await createLocation.mutateAsync(formData);
        toast({ title: "Lieu créé avec succès" });
        form.reset();
      }
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du lieu:", error);
      toast({
        title: "Erreur",
        description: formatError(error),
        variant: "destructive",
      });
    }
  };

  const isPending = createLocation.isPending || updateLocation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un lieu
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier le lieu" : "Ajouter un lieu"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du lieu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse *</FormLabel>
                  <FormControl>
                    <Input placeholder="Adresse complète" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude *</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude *</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description du lieu"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="+32 ..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Salle de spectacle" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horaires</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Lun-Ven 9h-18h" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de l'image</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://..."
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isEditing ? "Enregistrer" : "Créer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

interface DeleteLocationButtonProps {
  location: Location;
}

const DeleteLocationButton = ({ location }: DeleteLocationButtonProps) => {
  const { toast } = useToast();
  const deleteLocation = useDeleteLocation();

  const handleDelete = async () => {
    try {
      await deleteLocation.mutateAsync(location.id);
      toast({ title: "Lieu supprimé avec succès" });
    } catch (error) {
      console.error("Erreur lors de la suppression du lieu:", error);
      toast({
        title: "Erreur",
        description: formatError(error),
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer ce lieu ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Le lieu "{location.name}" sera
            définitivement supprimé.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface LocationAdminListProps {
  locations: Location[];
}

const LocationAdminList = ({ locations }: LocationAdminListProps) => {
  if (locations.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Aucun lieu enregistré</p>
        <p className="text-sm mt-2">Cliquez sur "Ajouter un lieu" pour commencer</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {locations.map((location) => (
        <div
          key={location.id}
          className="flex items-center justify-between p-4 hover:bg-muted/50"
        >
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate">
              {location.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {location.address}
            </p>
            {location.category && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded">
                {location.category}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 ml-4">
            <LocationFormDialog
              location={location}
              trigger={
                <Button variant="ghost" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
              }
            />
            <DeleteLocationButton location={location} />
          </div>
        </div>
      ))}
    </div>
  );
};

export { LocationFormDialog, LocationAdminList, DeleteLocationButton };
