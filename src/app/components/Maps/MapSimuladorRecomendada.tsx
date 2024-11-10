// MapSimuladorRecomendada.tsx

"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import dynamic from 'next/dynamic';
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import 'leaflet/dist/leaflet.css';

// Configurar el ícono personalizado de Leaflet
const customMarker = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const customVehicle = new L.Icon({
  iconUrl: '/icons/rocket.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Step {
  latitude: number;
  longitude: number;
}

interface MapSimuladorRecomendadaProps {
  steps: Step[];
}

const MapSimuladorRecomendada = ({ steps }: MapSimuladorRecomendadaProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const vehicleMarkerRef = useRef<L.Marker | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const intervalRef = useRef<any>(null);

  const startSimulation = () => {
    if (!steps || steps.length === 0) {
      console.error('No steps provided for simulation');
      return;
    }

    setIsSimulating(true);

    if (mapRef.current) {
      if (vehicleMarkerRef.current) {
        mapRef.current.removeLayer(vehicleMarkerRef.current);
        vehicleMarkerRef.current = null;
      }

      // Inicializar marcador del vehículo en el primer paso
      vehicleMarkerRef.current = L.marker([steps[0].latitude, steps[0].longitude], { icon: customVehicle }).addTo(mapRef.current);

      let index = 0;
      intervalRef.current = setInterval(() => {
        if (index < steps.length && isSimulating) {
          const step = steps[index];
          console.log(`Coordenadas actuales: Latitud ${step.latitude}, Longitud ${step.longitude}`);

          if (vehicleMarkerRef.current) {
            vehicleMarkerRef.current.setLatLng([step.latitude, step.longitude]);
          }

          index++;
        } else {
          clearInterval(intervalRef.current);
        }
      }, 1000);
    }
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    return () => {
      // Limpieza al desmontar el componente
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (vehicleMarkerRef.current && mapRef.current) {
        mapRef.current.removeLayer(vehicleMarkerRef.current);
        vehicleMarkerRef.current = null;
      }
    };
  }, []);

  if (!steps || steps.length === 0) {
    return <p>No hay ruta disponible para simular.</p>;
  }

  const routeCoordinates = steps.map(step => [step.latitude, step.longitude] as [number, number]);

  return (
    <div>
      <div style={{ height: "500px", width: "100%" }}>
        <MapContainer
          center={[steps[0].latitude, steps[0].longitude]}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
          whenReady={(map) => {
            mapRef.current = map.target;
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {/* Mostrar la ruta usando Polyline */}
          <Polyline positions={routeCoordinates} color="blue" />

          {/* Marcadores de inicio y fin */}
          <Marker position={routeCoordinates[0]} icon={customMarker} />
          <Marker position={routeCoordinates[routeCoordinates.length - 1]} icon={customMarker} />
        </MapContainer>
      </div>

      {/* Botones para iniciar y detener la simulación */}
      <div className="mt-4 flex space-x-4 ms-2">
        <button
          onClick={startSimulation}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Iniciar Simulación
        </button>
        <button
          onClick={stopSimulation}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Detener Simulación
        </button>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(MapSimuladorRecomendada), { ssr: false });
