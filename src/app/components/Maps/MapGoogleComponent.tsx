"use client";

import { useEffect, useRef, useState } from "react";

interface MapGoogleComponentProps {
  onSelectCoordinates: (coordinates: { lat: number; lng: number }) => void;
}

const MapGoogleComponent = ({ onSelectCoordinates }: MapGoogleComponentProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null); // Estado para el marcador

  useEffect(() => {
    // Función para cargar el script de Google Maps
    const loadGoogleMapsScript = () => {
      return new Promise<void>((resolve) => {
        const existingScript = document.getElementById("googleMaps");

        if (!existingScript) {
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
          script.id = "googleMaps";
          script.async = true;
          script.defer = true;
          script.onload = () => {
            resolve();
          };
          document.body.appendChild(script);
        } else {
          resolve(); // Si ya existe el script, lo resolvemos inmediatamente
        }
      });
    };

    const initMap = () => {
      if (mapRef.current && typeof google !== "undefined") {
        const initializedMap = new google.maps.Map(mapRef.current, {
          center: { lat: -34.6012424, lng: -58.3861497 }, // Ubicación de Buenos Aires
          zoom: 12,
        });

        // Guardar el mapa en el estado
        setMap(initializedMap);

        // Evento de clic en el mapa
        initializedMap.addListener("click", (event: google.maps.MapMouseEvent) => {
          const clickedLatLng = event.latLng;
          if (clickedLatLng) {
            const coordinates = {
              lat: clickedLatLng.lat(),
              lng: clickedLatLng.lng(),
            };
            console.log("Coordenadas seleccionadas:", coordinates);
            onSelectCoordinates(coordinates);

            // Si ya existe un marcador, lo movemos; si no, creamos uno nuevo
            if (marker) {
              marker.setPosition(clickedLatLng);
            } else {
              const newMarker = new google.maps.Marker({
                map: initializedMap,
                position: clickedLatLng,
                title: "Destino seleccionado",
              });
              setMarker(newMarker);
            }
          }
        });
      }
    };

    // Cargar el script y luego inicializar el mapa
    loadGoogleMapsScript().then(() => {
      initMap();
    });
  }, [marker, onSelectCoordinates]);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "400px", border: "1px solid #ccc" }}
    />
  );
};

export default MapGoogleComponent;
