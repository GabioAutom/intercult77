import { useLocations } from "@/hooks/useLocations";
import { useAuth } from "@/hooks/useAuth";
import { LocationFormDialog, LocationAdminList } from "./LocationAdmin";
import AdminLogin from "./AdminLogin";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, Settings } from "lucide-react";

const AdminDashboard = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const { data: locations, isLoading } = useLocations();

  if (authLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-medium mb-2">Accès restreint</h3>
        <p className="text-muted-foreground mb-4">
          Vous n'avez pas les droits d'administration pour gérer les lieux.
        </p>
        <Button variant="outline" onClick={signOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Se déconnecter
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Gestion des lieux</h3>
          <p className="text-sm text-muted-foreground">
            Connecté en tant que {user.email}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <LocationFormDialog />
          <Button variant="outline" size="icon" onClick={signOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border border-border rounded-lg bg-card">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <LocationAdminList locations={locations || []} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
