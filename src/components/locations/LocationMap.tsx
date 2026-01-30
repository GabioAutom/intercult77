import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import { Location } from "@/types/location";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon
const defaultIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface LocationMapProps {
  locations: Location[];
  selectedLocation?: Location | null;
  onLocationSelect?: (location: Location) => void;
}

// Component to handle map view updates
const MapUpdater = ({ location }: { location?: Location | null }) => {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.flyTo([location.latitude, location.longitude], 15, {
        duration: 1,
      });
    }
  }, [location, map]);

  return null;
};

const LocationMap = ({
  locations,
  selectedLocation,
  onLocationSelect,
}: LocationMapProps) => {
  // Default center: Brussels, Belgium
  const defaultCenter: [number, number] = [50.8503, 4.3517];

  // Calculate center based on locations or use default
  const center: [number, number] =
    locations.length > 0
      ? [
          locations.reduce((sum, loc) => sum + loc.latitude, 0) / locations.length,
          locations.reduce((sum, loc) => sum + loc.longitude, 0) / locations.length,
        ]
      : defaultCenter;

  return (
    <MapContainer
      center={center}
      zoom={12}
      className="h-full w-full rounded-lg"
      style={{ minHeight: "400px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater location={selectedLocation} />
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.latitude, location.longitude]}
          icon={defaultIcon}
          eventHandlers={{
            click: () => onLocationSelect?.(location),
          }}
        >
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-semibold text-lg mb-1">{location.name}</h3>
              <p className="text-sm opacity-70 mb-2">{location.address}</p>
              {location.description && (
                <p className="text-sm mb-2">{location.description}</p>
              )}
              {location.phone && (
                <p className="text-sm">
                  <strong>Tél:</strong> {location.phone}
                </p>
              )}
              {location.hours && (
                <p className="text-sm">
                  <strong>Horaires:</strong> {location.hours}
                </p>
              )}
              {location.category && (
                <span className="inline-block mt-2 px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                  {location.category}
                </span>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LocationMap;
