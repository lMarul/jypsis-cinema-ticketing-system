import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

interface Cinema {
  id: number;
  name: string;
  lat?: number;
  lng?: number;
}

interface MapViewProps {
  cinemas: Cinema[];
  onMarkerClick?: (id: number) => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const MapView: React.FC<MapViewProps> = ({ cinemas, onMarkerClick }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

  const defaultCenter = cinemas && cinemas.length && cinemas[0].lat && cinemas[0].lng
    ? { lat: cinemas[0].lat as number, lng: cinemas[0].lng as number }
    : { lat: 14.5547, lng: 121.0244 }; // default to Metro Manila

  if (apiKey) {
    return (
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={12}
        >
          {cinemas.map((c) =>
            c.lat && c.lng ? (
              <Marker
                key={c.id}
                position={{ lat: c.lat as number, lng: c.lng as number }}
                title={c.name}
                onClick={() => onMarkerClick?.(c.id)}
              />
            ) : null
          )}
        </GoogleMap>
      </LoadScript>
    );
  }

  // Fallback: OpenStreetMap iframe centered on first cinema (no API key required)
  const center = defaultCenter;
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${center.lng - 0.05}%2C${center.lat - 0.03}%2C${center.lng + 0.05}%2C${center.lat + 0.03}&layer=mapnik&marker=${center.lat}%2C${center.lng}`;

  return (
    <div className="h-full w-full">
      <iframe
        title="Cinema map"
        src={osmUrl}
        style={{ border: 0, width: "100%", height: "100%" }}
      />
      <div className="mt-2 text-xs text-muted-foreground">No Google Maps API key found. Showing OpenStreetMap fallback. Set VITE_GOOGLE_MAPS_API_KEY to enable interactive markers.</div>
    </div>
  );
};

export default MapView;
