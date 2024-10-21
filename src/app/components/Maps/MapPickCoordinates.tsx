import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerRetina from 'leaflet/dist/images/marker-icon-2x.png';
import { useState } from 'react';
import { Popup } from 'react-leaflet';

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

// Componente para detectar el doble clic y obtener las coordenadas
const LocationMarker = ({ setPickedCoordinates }: any) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    dblclick(e) {
      const { lat, lng } = e.latlng;
      console.log(`Coordenadas seleccionadas: Lat: ${lat}, Lng: ${lng}`);
      setPosition(e.latlng);
      setPickedCoordinates(e.latlng); // Guardar las coordenadas en el estado padre
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={customMarker}>
      <Popup>Coordenadas seleccionadas: {`${position.lat}, ${position.lng}`}</Popup>
    </Marker>
  );
};

const MapPickCoordinates = ({ setPickedCoordinates }: any) => {
  const [pickedCoordinates, setLocalPickedCoordinates] = useState(null);

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4">Selecciona un punto en el mapa</h2>
      <div style={{ height: '500px', width: '100%' }}>
        <MapContainer
          center={[-34.603722, -58.381592]} // Coordenadas iniciales (Buenos Aires como ejemplo)
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker setPickedCoordinates={setPickedCoordinates} />
        </MapContainer>
      </div>

      {/* Mostrar las coordenadas seleccionadas en la interfaz, si hay */}
      {pickedCoordinates && (
        <div className="mt-4">
          <h3 className="text-lg font-bold text-white">Coordenadas seleccionadas:</h3>
          <p className="text-white">Latitud: {pickedCoordinates.lat}, Longitud: {pickedCoordinates.lng}</p>
        </div>
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(MapPickCoordinates), { ssr: false });
