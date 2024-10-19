import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import L from 'leaflet';

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
}

const MapCentroMonitoreo = ({ vehiculos }: MapVehiculosProps) => {
  return (
    <MapContainer
      center={[-34.493027, -58.639397]} // Centrar el mapa en Don Torcuato
      zoom={14}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {vehiculos.map((vehiculo) => (
        <Marker
          key={vehiculo.id}
          position={[vehiculo.coordinates.latitude, vehiculo.coordinates.longitude]}
          icon={customMarker}
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
