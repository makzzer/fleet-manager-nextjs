'use client'
import React, { useEffect } from "react";
import VehiculoCard from "../components/Cards/VehiculoCards";
import { useVehiculo } from "../context/VehiculoContext";

const Vehiculos = () => {
  // Desestructuramos el contexto de vehículos
  const { vehiculos, fetchVehiculos } = useVehiculo();

  // Usamos useEffect para obtener los vehículos del backend
  useEffect(() => {
    fetchVehiculos();
  }, []);

  return (
    <div className="p-6 bg-gray-700 min-h-screen rounded-lg text-white">
      <h1 className="text-2xl font-bold mb-4">Vehículos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* itero sobre la lista de vehiculos que me traigo del context de la  api backend */}
        {vehiculos.map((vehiculo, index) => (
          <VehiculoCard key={index} vehiculo={vehiculo} />
        ))}
      </div>
    </div>
  );
};

export default Vehiculos;
