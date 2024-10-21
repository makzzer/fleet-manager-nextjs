import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import { useEffect } from 'react';

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

interface Step {
  latitude: number;
  longitude: number;
}

interface Vehiculo {
  id: string;
  model: string;
  brand: string;
  steps: Step[];  // Las coordenadas de la ruta (steps)
}

interface MapVehiculosProps {
  vehiculoSeleccionado: Vehiculo | null;
}

const MapTrazadoRuta2 = ({ vehiculoSeleccionado }: MapVehiculosProps) => {
  const map = useMap();

  useEffect(() => {
    if (vehiculoSeleccionado && vehiculoSeleccionado.steps.length > 0) {
      // Centramos el mapa en la primera coordenada del camino
      const firstStep = vehiculoSeleccionado.steps[0];
      map.setView([firstStep.latitude, firstStep.longitude], 13);
    }
  }, [map, vehiculoSeleccionado]);

  if (!vehiculoSeleccionado || vehiculoSeleccionado.steps.length === 0) {
    return null;
  }

  const routeCoordinates = vehiculoSeleccionado.steps.map(step => [step.latitude, step.longitude] as [number, number]);

  return (
    <>
      {/* Mostramos la ruta usando Polyline */}
      <Polyline positions={routeCoordinates} color="blue" />
      
      {/* Mostramos los marcadores al inicio y al final del viaje */}
      <Marker position={routeCoordinates[0]} icon={customMarker}>
        <Popup>Inicio del viaje</Popup>
      </Marker>
      <Marker position={routeCoordinates[routeCoordinates.length - 1]} icon={customMarker}>
        <Popup>Fin del viaje</Popup>
      </Marker>
    </>
  );
};

export default dynamic(() => Promise.resolve(MapTrazadoRuta2), { ssr: false });
