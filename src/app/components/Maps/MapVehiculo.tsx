import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

//Hay que hacer que leaflet solo se ejecute en el cliente y no en el servidor
//por eso vamos a usar este nuevo hook que se llama dynamic

import dynamic from 'next/dynamic';


interface MapVehiculoProps {
  coordinates: {
    latitude: number;
    longitude: number;
  }
}

const MapVehiculo = ({coordinates}:MapVehiculoProps) => {
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
      <Marker position={[coordinates.latitude, coordinates.longitude]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default dynamic(()=> Promise.resolve(MapVehiculo), {ssr: false});