"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useVehiculo } from "../../context/VehiculoContext";

const OCPage = () => {
  const { id } = useParams();
  const { vehiculos } = useVehiculo();

  const vehiculoData = vehiculos.find((vehiculo) => vehiculo.id === id);

  if (!vehiculoData) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen text-white">
        Vehiculo no encontrado
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-700 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-2 text-blue-200">
            Detalles del Vehículo
          </h3>
          <p>
            <strong className="text-blue-300">ID:</strong> {vehiculoData.id}
          </p>
          <p>
            <strong className="text-blue-300">Marca: </strong>
            {vehiculoData.brand}
          </p>
          <p>
            <strong className="text-blue-300">Modelo: </strong>
            {vehiculoData.model}
          </p>
          <p>
            <strong className="text-blue-300">Año:</strong> {vehiculoData.year}
          </p>
        </div>
        <div className="bg-gray-700 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-2 text-blue-200">Detalle</h3>
          <p>
            <strong className="text-blue-300">Cantidad de controles:</strong> 5
          </p>
          <p>
            <strong className="text-blue-300">Cantidad de reservas:</strong> 3
          </p>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2 text-blue-200">Mapa</h3>
        <div className="bg-gray-700 h-64 rounded-md flex items-center justify-center">
          <div className="text-center">Mapa</div>
        </div>
      </div>
    </div>
  );
};

export default OCPage;
