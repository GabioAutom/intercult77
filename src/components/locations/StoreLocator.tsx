import { useState, useMemo } from "react";
import { useLocations } from "@/hooks/useLocations";
import LocationMap from "./LocationMap";
import LocationSearch from "./LocationSearch";
import LocationList from "./LocationList";
import { Location } from "@/types/location";
import { Skeleton } from "@/components/ui/skeleton";

const StoreLocator = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const { data: locations, isLoading, error } = useLocations(searchQuery);

  const filteredLocations = useMemo(() => {
    return locations || [];
  }, [locations]);

  if (error) {
    return (
      <div className="p-4 text-center text-destructive">
        Erreur lors du chargement des lieux
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[600px]">
      {/* Sidebar with search and list */}
      <div className="w-full lg:w-96 flex flex-col border border-border rounded-lg overflow-hidden bg-card">
        <div className="p-4 border-b border-border">
          <LocationSearch value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <LocationList
              locations={filteredLocations}
              selectedLocation={selectedLocation}
              onLocationSelect={setSelectedLocation}
            />
          )}
        </div>

        <div className="p-3 border-t border-border bg-muted/50 text-sm text-muted-foreground">
          {filteredLocations.length} lieu{filteredLocations.length !== 1 ? "x" : ""} trouvé{filteredLocations.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 rounded-lg overflow-hidden border border-border">
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <LocationMap
            locations={filteredLocations}
            selectedLocation={selectedLocation}
            onLocationSelect={setSelectedLocation}
          />
        )}
      </div>
    </div>
  );
};

export default StoreLocator;
