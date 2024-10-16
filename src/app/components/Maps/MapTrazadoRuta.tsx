"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Interfaz para las rutas
interface Step {
  latitude: number;
  longitude: number;
}

interface Route {
  distance: string;
  duration: string;
  steps: Step[];
}

interface LeafletMapProps {
  routes: Route[];
}

// Icono personalizado para Leaflet
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LeafletMap: React.FC<LeafletMapProps> = ({ routes }) => {
  // Extraer los pasos y convertirlos en coordenadas [lat, lng]
  const coordinates = routes.flatMap((route) =>
    route.steps.map((step) => [step.latitude, step.longitude] as [number, number])
  );

  // Centro inicial del mapa (puede ser la primera coordenada de la ruta)
  const initialPosition: [number, number] =
    coordinates.length > 0 ? coordinates[0] : [-34.6012424, -58.3861497]; // Coordenadas de Buenos Aires como fallback

  return (
    <MapContainer center={initialPosition} zoom={15} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* Agregar marcadores y trazar la línea */}
      {coordinates.length > 0 && (
        <>
          {/* Marcador en la primera posición */}
          <Marker position={coordinates[0]} icon={customIcon} />
          {/* Marcador en la última posición */}
          <Marker position={coordinates[coordinates.length - 1]} icon={customIcon} />
          {/* Línea que conecta los puntos */}
          <Polyline positions={coordinates} color="blue" />
        </>
      )}
    </MapContainer>
  );
};

export default LeafletMap;
