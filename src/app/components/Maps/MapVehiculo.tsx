import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import L from 'leaflet';
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

interface MapVehiculoProps {
  coordinates: {
    latitude: number;
    longitude: number;
  }
}

const MapVehiculo = ({ coordinates }: MapVehiculoProps) => {
  return (
    <MapContainer
      center={[coordinates.latitude, coordinates.longitude]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }} // Importante para ocupar todo el contenedor
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={[coordinates.latitude, coordinates.longitude]}
        icon={customMarker} // Usar el ícono personalizado
      >
        <Popup>
          Vehículo localizado aquí.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default dynamic(() => Promise.resolve(MapVehiculo), { ssr: false });