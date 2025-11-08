import React, { useCallback, useEffect, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";

interface Cinema {
  id: number;
  name: string;
  lat?: number;
  lng?: number;
}

interface MapViewProps {
  cinemas: Cinema[];
  onMarkerClick?: (id: number) => void;
  selectedId?: number;
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

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || "",
  });

  const mapRef = useRef<any>(null);
  const [activeId, setActiveId] = useState<number | null>(null);

  const onLoad = useCallback((map: any) => {
    mapRef.current = map;
  }, []);

  // Fit map to all markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !cinemas || cinemas.length === 0) return;

    const googleObj = (window as any).google;
    let bounds: any = null;
    if (googleObj && googleObj.maps && typeof googleObj.maps.LatLngBounds === 'function') {
      bounds = new googleObj.maps.LatLngBounds();
    }

    let hasCoords = false;
    cinemas.forEach((c) => {
      if (c.lat && c.lng && bounds) {
        bounds.extend({ lat: c.lat as number, lng: c.lng as number });
        hasCoords = true;
      }
    });

    if (hasCoords && bounds) {
      try {
        map.fitBounds(bounds);
      } catch (e) {
        // ignore
      }
    } else {
      map.setCenter(defaultCenter);
      map.setZoom(12);
    }
  }, [cinemas, isLoaded]);

  if (apiKey && !loadError) {
    if (!isLoaded) {
      return <div className="h-full w-full">Loading map...</div>;
    }

    return (
      <div className="h-full w-full">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={12}
          onLoad={onLoad}
        >
          {cinemas.map((c) =>
            c.lat && c.lng ? (
              <Marker
                key={c.id}
                position={{ lat: c.lat as number, lng: c.lng as number }}
                title={c.name}
                onClick={() => {
                  setActiveId(c.id);
                  onMarkerClick?.(c.id);
                }}
                icon={
                  c.id === activeId
                    ? undefined
                    : undefined
                }
              />
            ) : null
          )}

          {activeId != null && (() => {
            const cinema = cinemas.find(c => c.id === activeId);
            if (!cinema || !cinema.lat || !cinema.lng) return null;
            return (
              <InfoWindow
                position={{ lat: cinema.lat as number, lng: cinema.lng as number }}
                onCloseClick={() => setActiveId(null)}
              >
                <div className="max-w-xs">
                  <strong>{cinema.name}</strong>
                </div>
              </InfoWindow>
            );
          })()}
        </GoogleMap>
      </div>
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
