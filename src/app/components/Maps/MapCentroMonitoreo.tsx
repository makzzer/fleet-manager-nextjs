import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import { useEffect, useRef } from 'react';

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

interface Vehiculo {
  id: string;
  model: string;
  brand: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface MapVehiculosProps {
  vehiculos: Vehiculo[];
  vehiculoSeleccionado: string | null;
}

// Componente para ajustar la vista inicial a todos los vehículos
const AjustarVistaInicial = ({ vehiculos }: MapVehiculosProps) => {
  const map = useMap();

  useEffect(() => {
    if (vehiculos.length > 0) {
      const bounds = L.latLngBounds(
        vehiculos.map((vehiculo) => [vehiculo.coordinates.latitude, vehiculo.coordinates.longitude] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50] }); // Ajustar la vista del mapa a los vehículos con padding
    }
  }, [map, vehiculos]);

  return null;
};

// Componente para centrar y abrir el popup del vehículo seleccionado
const CentrarEnVehiculo = ({ vehiculoSeleccionado, vehiculos, markersRef }: MapVehiculosProps & { markersRef: any }) => {
  const map = useMap();

  useEffect(() => {
    if (vehiculoSeleccionado) {
      const vehiculo = vehiculos.find((v) => v.id === vehiculoSeleccionado);
      if (vehiculo) {
        map.setView([vehiculo.coordinates.latitude, vehiculo.coordinates.longitude], 16, {
          animate: true,
        });

        // Abrir el popup del marker seleccionado
        const marker = markersRef.current[vehiculo.id];
        if (marker) {
          marker.openPopup();
        }
      }
    }
  }, [vehiculoSeleccionado, vehiculos, map, markersRef]);

  return null;
};

const MapCentroMonitoreo = ({ vehiculos, vehiculoSeleccionado }: MapVehiculosProps) => {
  const markersRef = useRef<{ [key: string]: L.Marker }>({}); // Referencia para todos los markers

  return (
    <MapContainer
      center={[-34.493027, -58.639397]} // Coordenadas predeterminadas
      zoom={14} // Zoom inicial
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Ajustar vista inicial a todos los vehículos */}
      <AjustarVistaInicial vehiculos={vehiculos} vehiculoSeleccionado={vehiculoSeleccionado} />

      {/* Centramos en el vehículo seleccionado y abrimos su popup */}
      <CentrarEnVehiculo vehiculoSeleccionado={vehiculoSeleccionado} vehiculos={vehiculos} markersRef={markersRef} />

      {vehiculos.map((vehiculo) => (
        <Marker
          key={vehiculo.id}
          position={[vehiculo.coordinates.latitude, vehiculo.coordinates.longitude]}
          icon={customMarker}
          ref={(marker) => {
            if (marker) {
              markersRef.current[vehiculo.id] = marker;
            }
          }} // Guardamos una referencia a cada marker
        >
          <Popup>
            <div>
              <strong>{vehiculo.brand} {vehiculo.model}</strong>
              <p>Vehículo ID: {vehiculo.id}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default dynamic(() => Promise.resolve(MapCentroMonitoreo), { ssr: false });
