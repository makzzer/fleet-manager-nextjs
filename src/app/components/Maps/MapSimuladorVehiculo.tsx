/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import React, { useEffect, useRef } from "react";
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



// Coordenadas de inicio y fin
const startPosition: L.LatLngTuple = [-34.52297802040008, -58.70043468786001]; // UNGS
const endPosition: L.LatLngTuple = [-34.531080562233505, -58.70299354553004]; // CARREFOUR

const MapSimuladorVehiculo = () => {
  const mapRef = useRef<L.Map | null>(null); // Referencia al mapa
  const vehicleMarkerRef = useRef<L.Marker | null>(null); // Referencia al marcador del vehículo

  useEffect(() => {
    if (mapRef.current) {
      // Crear el control de enrutamiento
      const routingControl = (L as any).Routing.control({
        waypoints: [L.latLng(startPosition), L.latLng(endPosition)], // Puntos de inicio y fin
        lineOptions: {
          styles: [{ color: "#6FA1EC", weight: 4 }],
        },
        createMarker: (i: number, waypoint: any, n: number) => {
          return L.marker(waypoint.latLng, {
            icon: customMarker,
          });
        },
        // Evitar que aparezcan los popups con la información de la ruta
        routeWhileDragging: true,
        showAlternatives: false, // Deshabilita rutas alternativas
        altLineOptions: {
          show: false, // No mostrar la línea alternativa
        },
        addWaypoints: false, // No permitir agregar más waypoints
      }).addTo(mapRef.current);

      
      
      // Evento cuando se encuentra una ruta
      routingControl.on("routesfound", (e: any) => {
        const route = e.routes[0];
        const coordinates = route.coordinates;

        // Colocar un marcador en la posición inicial del vehículo
        if (!vehicleMarkerRef.current) {
          vehicleMarkerRef.current = L.marker(startPosition, { icon: customVehicle }).addTo(mapRef.current!);
        }

        // Simular el movimiento del vehículo a lo largo de la ruta
        let index = 0;
        const interval = setInterval(() => {
          if (index < coordinates.length) {
            const latLng = coordinates[index];

            // Mover el marcador del vehículo
            if (vehicleMarkerRef.current) {
              vehicleMarkerRef.current.setLatLng([latLng.lat, latLng.lng]);
            }

            // Mostrar las coordenadas en consola (puedes enviar al backend)
            console.log("Coordenadas actuales:", latLng);

            index++;
          } else {
            clearInterval(interval); // Detener el intervalo cuando llega al destino
          }
        }, 1000); // Avanzar cada segundo
      });
    }
  }, []);

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <MapContainer
        center={startPosition}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        whenReady={(map:any) => {
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
  );
};

export default dynamic(() => Promise.resolve(MapSimuladorVehiculo), { ssr: false });
