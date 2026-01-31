import { useEffect, useRef, useState } from "react";
import { Location } from "@/types/location";
import "leaflet/dist/leaflet.css";

interface LocationMapProps {
  locations: Location[];
  selectedLocation?: Location | null;
  onLocationSelect?: (location: Location) => void;
}

const LocationMap = ({
  locations,
  selectedLocation,
  onLocationSelect,
}: LocationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);

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

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = await import("leaflet");

      // Fix for default marker icon
      const defaultIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      L.Marker.prototype.options.icon = defaultIcon;

      const map = L.map(mapRef.current!, {
        center: center,
        zoom: 12,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapInstanceRef.current = map;
      setIsMapReady(true);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;

    const L = (window as unknown as { L: typeof import("leaflet") }).L;
    if (!L) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    locations.forEach((location) => {
      const marker = L.marker([location.latitude, location.longitude]).addTo(
        mapInstanceRef.current!
      );

      const popupContent = `
        <div style="min-width: 200px;">
          ${location.image_url ? `<img src="${location.image_url}" alt="${location.name}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 6px; margin-bottom: 8px;" onerror="this.style.display='none'" />` : ""}
          <h3 style="font-weight: 600; font-size: 1.1rem; margin-bottom: 4px;">${location.name}</h3>
          <p style="font-size: 0.875rem; opacity: 0.7; margin-bottom: 8px;">${location.address}</p>
          ${location.description ? `<p style="font-size: 0.875rem; margin-bottom: 8px;">${location.description}</p>` : ""}
          ${location.phone ? `<p style="font-size: 0.875rem;"><strong>Tél:</strong> ${location.phone}</p>` : ""}
          ${location.hours ? `<p style="font-size: 0.875rem;"><strong>Horaires:</strong> ${location.hours}</p>` : ""}
          ${location.category ? `<span style="display: inline-block; margin-top: 8px; padding: 2px 8px; background: hsl(45, 60%, 92%); font-size: 0.75rem; border-radius: 4px;">${location.category}</span>` : ""}
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on("click", () => {
        onLocationSelect?.(location);
      });

      markersRef.current.push(marker);
    });

    // Fit bounds if we have locations
    if (locations.length > 0 && markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [locations, isMapReady, onLocationSelect]);

  // Handle selected location change
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedLocation) return;

    mapInstanceRef.current.flyTo(
      [selectedLocation.latitude, selectedLocation.longitude],
      15,
      { duration: 1 }
    );

    // Open popup for selected location
    const selectedMarker = markersRef.current.find((marker) => {
      const pos = marker.getLatLng();
      return (
        pos.lat === selectedLocation.latitude &&
        pos.lng === selectedLocation.longitude
      );
    });

    if (selectedMarker) {
      selectedMarker.openPopup();
    }
  }, [selectedLocation]);

  return (
    <div
      ref={mapRef}
      className="h-full w-full rounded-lg"
      style={{ minHeight: "400px" }}
    />
  );
};

export default LocationMap;
