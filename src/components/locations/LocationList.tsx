import { MapPin, Phone, Clock, Tag } from "lucide-react";
import { Location } from "@/types/location";
import { cn } from "@/lib/utils";

interface LocationListProps {
  locations: Location[];
  selectedLocation?: Location | null;
  onLocationSelect: (location: Location) => void;
}

const LocationList = ({
  locations,
  selectedLocation,
  onLocationSelect,
}: LocationListProps) => {
  if (locations.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Aucun lieu trouvé
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {locations.map((location) => (
        <button
          key={location.id}
          onClick={() => onLocationSelect(location)}
          className={cn(
            "w-full p-4 text-left transition-colors hover:bg-secondary/50",
            selectedLocation?.id === location.id && "bg-secondary"
          )}
        >
          <div className="flex gap-3">
            {location.image_url && (
              <img
                src={location.image_url}
                alt={location.name}
                className="w-16 h-16 rounded-md object-cover flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground mb-1">{location.name}</h3>
              
              <div className="flex items-start gap-2 text-sm text-muted-foreground mb-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="truncate">{location.address}</span>
              </div>

              {location.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{location.phone}</span>
                </div>
              )}

              {location.hours && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span>{location.hours}</span>
                </div>
              )}

              {location.category && (
                <div className="flex items-center gap-2 mt-2">
                  <Tag className="h-3 w-3 text-primary" />
                  <span className="text-xs text-primary font-medium">
                    {location.category}
                  </span>
                </div>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default LocationList;
