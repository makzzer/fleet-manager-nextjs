// /app/vehiculos/pivot/[id]/page.tsx

"use client";

import Link from "next/link";
import React from "react";
import { useParams } from "next/navigation";
import { useVehiculo } from "@/app/context/VehiculoContext";
import { FiEye, FiClipboard, FiTool } from "react-icons/fi"; // Importar íconos de react-icons

const VehiculoPivotPage = () => {
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
    <div className="p-6 bg-gray-900 min-h-screen flex flex-col items-center justify-center text-white">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-400">
        Acciones para el Vehículo {vehiculoData.brand} {vehiculoData.model}
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Ver Detalles del Vehículo */}
        <Link
          href={`/vehiculos/${vehiculoData.id}`}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105"
        >
          <FiEye className="text-2xl mr-2" />
          <span>Ver Detalles</span>
        </Link>

        {/* Reservar */}
        <Link
          href={`/reservar?vehiculoId=${vehiculoData.id}`}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105"
        >
          <FiClipboard className="text-2xl mr-2" />
          <span>Reservar</span>
        </Link>

        {/* Solicitar Asistencia */}
        <Link
          href={`/solicitarasistencia?vehiculoId=${vehiculoData.id}`}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105"
        >
          <FiTool className="text-2xl mr-2" />
          <span>Solicitar Asistencia</span>
        </Link>
      </div>

      {/* Botón de Volver */}
      <div className="flex justify-center mt-10">
        <Link
          href={`/vehiculos/${vehiculoData.id}`}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
        >
          Volver al Detalle del Vehículo
        </Link>
      </div>
    </div>
  );
};

export default VehiculoPivotPage;
