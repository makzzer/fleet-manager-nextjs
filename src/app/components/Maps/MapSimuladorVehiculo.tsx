"use client";
//mod this map --> push a vercel

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import dynamic from 'next/dynamic';
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerRetina from 'leaflet/dist/images/marker-icon-2x.png';
import { useApi } from "@/app/context/ApiContext"; // Importamos useApi

const customMarker = new L.Icon({
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
  iconRetinaUrl: markerRetina.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// **Nuevo icono para el vehículo**
const vehicleIcon = L.divIcon({
  html: `<div style="
    background-color: orange;
    border: 2px solid red;
    width: 20px;
    height: 20px;
    border-radius: 50%;
  "></div>`,
  className: '',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

interface MapSimuladorVehiculoProps {
  startPosition: [number, number];
  endPosition: [number, number];
  vehicleId: string;
  onActualizarCoordenadas: (nuevasCoordenadas: { latitude: number; longitude: number }) => void;
}

const MapSimuladorVehiculo = ({
  startPosition,
  endPosition,
  vehicleId,
  onActualizarCoordenadas,
}: MapSimuladorVehiculoProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const vehicleMarkerRef = useRef<L.Marker | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const routingControlRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);

  const api = useApi(); // Obtenemos la instancia de la API

  const startSimulation = () => {
    if (!startPosition || !endPosition) {
      console.error('Start or End position is undefined');
      return;
    }

    setIsSimulating(true);

    if (mapRef.current) {
      if (routingControlRef.current) {
        //mapRef.current.removeControl(routingControlRef.current);
        routingControlRef.current.remove()
      }

      routingControlRef.current = (L as any).Routing.control({
        waypoints: [L.latLng(startPosition), L.latLng(endPosition)],
        lineOptions: {
          styles: [{ color: "#6FA1EC", weight: 4 }],
        },
        createMarker: (i: number, waypoint: any, n: number) => {
          return L.marker(waypoint.latLng, {
            icon: customMarker,
          });
        },
        routeWhileDragging: false,
        showAlternatives: false,
        addWaypoints: false,
        plan: L.Routing.plan([L.latLng(startPosition), L.latLng(endPosition)], {
          createMarker: (i, waypoint) => L.marker(waypoint.latLng, { icon: customMarker }),
          show: false,
        }),
      }).addTo(mapRef.current);

      setTimeout(() => {
        const controlContainer = document.querySelector('.leaflet-routing-container');
        if (controlContainer) {
          controlContainer.remove();
        }
      }, 500);

      routingControlRef.current.on("routesfound", (e: any) => {
        const route = e.routes[0];
        const coordinates = route.coordinates;

        if (!vehicleMarkerRef.current) {
          vehicleMarkerRef.current = L.marker(startPosition, { icon: vehicleIcon }).addTo(mapRef.current!);

          // Añadimos el tooltip permanente con el ID del vehículo
          vehicleMarkerRef.current.bindTooltip(vehicleId, {
            permanent: true,
            direction: 'top',
            offset: [0, -10],
            className: 'vehicle-id-tooltip',
          });
        }

        let index = 0;
        intervalRef.current = setInterval(async () => {
          if (index < coordinates.length && isSimulating) {
            const latLng = coordinates[index];
            console.log(`Coordenadas actuales: Latitud ${latLng.lat}, Longitud ${latLng.lng}`);

            if (vehicleMarkerRef.current) {
              vehicleMarkerRef.current.setLatLng([latLng.lat, latLng.lng]);
            }

            onActualizarCoordenadas({ latitude: latLng.lat, longitude: latLng.lng });

            // Enviar PUT al backend con las coordenadas
            try {
              await api.put(`/vehicles/${vehicleId}`, {
                coordinates: { latitude: latLng.lat, longitude: latLng.lng },
              });
            } catch (error) {
              console.error("Error al actualizar las coordenadas del vehículo:", error);
            }

            index++;
          } else {
            clearInterval(intervalRef.current);
          }
        }, 200);
      });
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
      if (routingControlRef.current && mapRef.current) {
        //mapRef.current.removeControl(routingControlRef.current);
        routingControlRef.current.remove()
        routingControlRef.current = null;
      }
      if (vehicleMarkerRef.current && mapRef.current) {
        mapRef.current.removeLayer(vehicleMarkerRef.current);
        vehicleMarkerRef.current = null;
      }
    };
  }, []);

  return (
    <div>
      <div style={{ height: "500px", width: "100%" }}>
        <MapContainer
          center={startPosition}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
          whenReady={(map: any) => {
            mapRef.current = map.target;
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {/* Marcador de inicio */}
          <Marker position={startPosition} icon={customMarker} />
          {/* Marcador de destino */}
          <Marker position={endPosition} icon={customMarker} />
        </MapContainer>
      </div>

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

export default dynamic(() => Promise.resolve(MapSimuladorVehiculo), { ssr: false });