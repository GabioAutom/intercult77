import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import StoreLocator from "@/components/locations/StoreLocator";
import AdminDashboard from "@/components/locations/AdminDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Settings } from "lucide-react";

const Lieux = () => {
  const [activeTab, setActiveTab] = useState("map");

  return (
    <MainLayout pageTitle="Lieux">
      <div className="w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-primary mb-2">Nos Lieux</h2>
          <p className="text-muted-foreground">
            Découvrez les espaces où Intercult77 organise ses événements
            et activités culturelles.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Carte
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Administration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map">
            <StoreLocator />
          </TabsContent>

          <TabsContent value="admin">
            <AdminDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Lieux;
