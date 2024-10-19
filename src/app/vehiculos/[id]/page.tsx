"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useVehiculo, tiposCombustible, unidadesCombustible, estadosVehiculo, tiposVehiculo } from "../../context/VehiculoContext";

//importo aca tambien el hook dynamic para usar 
//el componente del mapa
import dynamic from "next/dynamic";

//y ahora voy a cargar el componente MapsVehiculo
//de forma dinamica tambien

const MapVehiculo = dynamic(() => import("@/app/components/Maps/MapVehiculo"), {
  ssr: false,
});

const VehiculoDinamicoPage = () => {
  const { id } = useParams();
  const { vehiculos } = useVehiculo();

  const vehiculoData = vehiculos.find((vehiculo) => vehiculo.id === id);

  if (!vehiculoData) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen flex items-center justify-center text-white">
        <h2 className="text-xl font-semibold">Vehículo no encontrado</h2>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-400">
        Detalles del Vehículo
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium mb-4 text-blue-200">
            Información del Vehículo
          </h3>
          <p className="mb-2">
            <strong className="text-blue-300">ID:</strong> {vehiculoData.id}
          </p>
          <p className="mb-2">
            <strong className="text-blue-300">Marca: </strong>
            {vehiculoData.brand}
          </p>
          <p className="mb-2">
            <strong className="text-blue-300">Modelo: </strong>
            {vehiculoData.model}
          </p>
          <p className="mb-2">
            <strong className="text-blue-300">Año:</strong> {vehiculoData.year}
          </p>
          <p className="mb-2">
            <strong className="text-blue-300">Tipo: </strong>
            {tiposVehiculo[vehiculoData.type] || vehiculoData.type}
          </p>
          <p className="mb-2">
            <strong className="text-blue-300">Tipo de combustible: </strong>
            {tiposCombustible[vehiculoData.fuel_type] || vehiculoData.fuel_type}
          </p>
          <p className="mb-2">
            <strong className="text-blue-300">Consumo: </strong>
            {vehiculoData.fuel_consumption}
          </p>
          <p className="mb-2">
            <strong className="text-blue-300">Carga máxima: </strong>
            {vehiculoData.load}
          </p>
          <p className="mb-2">
            <strong className="text-blue-300">Acoplado: </strong>
            {vehiculoData.has_trailer ? "Sí" : "No"}
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium mb-4 text-blue-200">
            Resumen de Controles
          </h3>
          <p className="mb-2">
            <strong className="text-blue-300">Cantidad de controles:</strong> 5
          </p>
          <p className="mb-2">
            <strong className="text-blue-300">Cantidad de reservas:</strong> 3
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-medium mb-4 text-blue-200">Ubicación</h3>
        <div className="bg-gray-800 h-64 rounded-lg shadow-lg flex items-center justify-center">
          <MapVehiculo coordinates={vehiculoData.coordinates}/>
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
          <a href="/vehiculos">Volver</a>
        </button>
      </div>
    </div>
  );
};

export default VehiculoDinamicoPage;