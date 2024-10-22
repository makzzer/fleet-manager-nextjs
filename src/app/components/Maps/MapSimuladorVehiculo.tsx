/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import dynamic from 'next/dynamic';
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerRetina from 'leaflet/dist/images/marker-icon-2x.png';

// Configurar el ícono personalizado de Leaflet
const customMarker = new L.Icon({
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
  iconRetinaUrl: markerRetina.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const customVehicle = new L.Icon({
  iconUrl: '/icons/rocket.png', // Ruta relativa desde la carpeta `public`
  iconSize: [40, 40], // Ajusta el tamaño del icono a tus necesidades
  iconAnchor: [20, 40], // Ajusta la ancla del icono según su tamaño
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapSimuladorVehiculoProps {
  startPosition: [number, number];
  endPosition: [number, number];
  onActualizarCoordenadas: (nuevasCoordenadas: { latitude: number; longitude: number }) => void; // Prop para actualizar coordenadas
}

const MapSimuladorVehiculo = ({ startPosition, endPosition, onActualizarCoordenadas }: MapSimuladorVehiculoProps) => {
  const mapRef = useRef<L.Map | null>(null); // Referencia al mapa
  const vehicleMarkerRef = useRef<L.Marker | null>(null); // Referencia al marcador del vehículo
  const [isSimulating, setIsSimulating] = useState(false); // Estado para manejar la simulación
  const routingControlRef = useRef<any>(null); // Referencia para el control de enrutamiento
  const intervalRef = useRef<any>(null); // Referencia al intervalo de simulación

  // Función para iniciar la simulación
  const startSimulation = () => {
    setIsSimulating(true);
    if (mapRef.current) {
      // Eliminar cualquier control de enrutamiento existente antes de iniciar uno nuevo
      if (routingControlRef.current) {
        mapRef.current.removeControl(routingControlRef.current);
      }

      // Crear el control de enrutamiento
      routingControlRef.current = (L as any).Routing.control({
        waypoints: [L.latLng(startPosition), L.latLng(endPosition)], // Puntos de inicio y fin
        lineOptions: {
          styles: [{ color: "#6FA1EC", weight: 4 }],
        },
        createMarker: (i: number, waypoint: any, n: number) => {
          return L.marker(waypoint.latLng, {
            icon: customMarker,
          });
        },
        routeWhileDragging: false,
        showAlternatives: false, // Deshabilita rutas alternativas
        addWaypoints: false, // No permitir agregar más waypoints
        plan: L.Routing.plan([L.latLng(startPosition), L.latLng(endPosition)], {
          createMarker: (i, waypoint) => L.marker(waypoint.latLng, { icon: customMarker }),
          show: false, // Intenta ocultar las instrucciones visibles
        }),
      }).addTo(mapRef.current);

      // Eliminar manualmente el cuadro de instrucciones
      setTimeout(() => {
        const controlContainer = document.querySelector('.leaflet-routing-container');
        if (controlContainer) {
          controlContainer.remove(); // Eliminar el cuadro de instrucciones de rutas
        }
      }, 500);

      // Evento cuando se encuentra una ruta
      routingControlRef.current.on("routesfound", (e: any) => {
        const route = e.routes[0];
        const coordinates = route.coordinates;

        // Colocar un marcador en la posición inicial del vehículo
        if (!vehicleMarkerRef.current) {
          vehicleMarkerRef.current = L.marker(startPosition, { icon: customVehicle }).addTo(mapRef.current!);
        }

        // Simular el movimiento del vehículo a lo largo de la ruta
        let index = 0;
        intervalRef.current = setInterval(() => {
          if (index < coordinates.length && isSimulating) {
            const latLng = coordinates[index];

            // Imprimir las coordenadas por las que va pasando
            console.log(`Coordenadas actuales: Latitud ${latLng.lat}, Longitud ${latLng.lng}`);

            // Mover el marcador del vehículo
            if (vehicleMarkerRef.current) {
              vehicleMarkerRef.current.setLatLng([latLng.lat, latLng.lng]);
            }

            // Actualizar las coordenadas en el componente padre
            onActualizarCoordenadas({ latitude: latLng.lat, longitude: latLng.lng });

            index++;
          } else {
            clearInterval(intervalRef.current); // Detener el intervalo cuando llega al destino o se detiene la simulación
          }
        }, 1000); // Avanzar cada segundo
      });
    }
  };

  // Función para detener la simulación
  const stopSimulation = () => {
    setIsSimulating(false);
    clearInterval(intervalRef.current); // Detener el intervalo
  };

  return (
    <div>
      <div style={{ height: "500px", width: "100%" }}>
        <MapContainer
          center={startPosition}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
          whenReady={(map: any) => {
            mapRef.current = map.target; // Guardar la referencia al mapa cuando esté listo
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={startPosition} icon={customMarker} />
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

export default dynamic(() => Promise.resolve(MapSimuladorVehiculo), { ssr: false });
