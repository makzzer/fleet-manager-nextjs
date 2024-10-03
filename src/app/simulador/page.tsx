/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import dynamic from "next/dynamic";

// Cargamos el componente de mapa dinámicamente para deshabilitar SSR
const MapSimuladorVehiculo = dynamic(
  () => import("../components/Maps/MapSimuladorVehiculo"),
  {
    ssr: false,
  }
);

const SimuladorDeViajePage = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-blue-400 text-center mb-8">
        Simulador de Viaje de Vehículo
      </h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-blue-200 mb-4">
          Ruta simulada en el mapa
        </h2>
        <div style={{ height: "500px", width: "100%" }}>
          <MapSimuladorVehiculo />
        </div>
      </div>
    </div>
  );
};

export default SimuladorDeViajePage;
