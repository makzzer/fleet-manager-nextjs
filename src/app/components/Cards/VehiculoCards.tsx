import React from "react";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Vehiculo {
  id: string;
  status: string;
  model: string;
  brand: string;
  year: number;
  coordinates: Coordinates;
  date_created: string;
  date_updated: string;
}

interface VehiculoCardProps {
    vehiculo: Vehiculo;
}


const VehiculoCard = ({ vehiculo }: VehiculoCardProps) => {
  return (
    <div className="bg-gray-800 border border-gray-600 p-6 rounded-lg shadow-lg text-white hover:bg-gray-900 transition duration-300 ease-in-out">
      <h2 className="text-2xl font-bold mb-3">
        {vehiculo.brand} {vehiculo.model} - {vehiculo.year}
      </h2>
      <p className="text-lg text-gray-300">ID: {vehiculo.id}</p>
      <p className={`text-lg mt-1 ${vehiculo.status === 'AVAILABLE' ? 'text-green-400' : 'text-red-400'}`}>
        Estado: {vehiculo.status}
      </p>
      <div className="mt-4">
        <h3 className="text-xl font-semibold text-gray-400">Coordenadas</h3>
        <p className="text-lg text-gray-300">
          Latitud: {vehiculo.coordinates.latitude}
        </p>
        <p className="text-lg text-gray-300">
          Longitud: {vehiculo.coordinates.longitude}
        </p>
      </div>
      <div className="mt-4 text-gray-400">
        <p className="text-sm">Creado el: {new Date(vehiculo.date_created).toLocaleString()}</p>
        <p className="text-sm">Actualizado el: {new Date(vehiculo.date_updated).toLocaleString()}</p>
      </div>
    </div>
  );
  };

  export default VehiculoCard;