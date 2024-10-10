"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic"; // Para cargar el mapa dinámicamente
import { useRouter } from "next/navigation";

// Cargar el componente Map solo en el cliente (sin SSR)
const MapComponent = dynamic(() => import("../components/Maps/MapGoogleComponent"), { ssr: false });

const ReservaViaje = () => {
  const router = useRouter();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat: number; lng: number } | null>(null); // Para las coordenadas

  const handleSelectVehicle = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
  };

  const handleSelectCoordinates = (coordinates: { lat: number; lng: number }) => {
    setSelectedCoordinates(coordinates);
  };

  const handleContinue = () => {
    if (selectedVehicle && selectedCoordinates) {
      console.log(`Vehículo: ${selectedVehicle}`);
      console.log(`Coordenadas: ${JSON.stringify(selectedCoordinates)}`);
      router.push(`/reservar/confirmacion?vehicle=${selectedVehicle}&lat=${selectedCoordinates.lat}&lng=${selectedCoordinates.lng}`);
    } else {
      alert("Por favor selecciona un vehículo y un destino.");
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen rounded-xl flex flex-col p-4">
      {/* Encabezado */}
      <div className="flex-shrink-0">
        <h1 className="text-4xl font-bold mb-6 text-blue-400">Reservar Viaje</h1>
      </div>

      {/* Seleccionar Vehículo */}
      <div className="flex-shrink-0 mb-4">
        <h2 className="text-2xl font-semibold mb-3">Seleccionar Vehículo</h2>
        <div className="flex space-x-4">
          <button
            className={`py-2 px-4 rounded ${selectedVehicle === "AAA-001" ? "bg-blue-600" : "bg-gray-700"}`}
            onClick={() => handleSelectVehicle("AAA-001")}
          >
            Vehículo 1
          </button>
          <button
            className={`py-2 px-4 rounded ${selectedVehicle === "BBB-002" ? "bg-blue-600" : "bg-gray-700"}`}
            onClick={() => handleSelectVehicle("BBB-002")}
          >
            Vehículo 2
          </button>
        </div>
      </div>

      {/* Mapa para seleccionar destino */}
      <div className="flex-grow mb-4">
        <h2 className="text-2xl font-semibold mb-3">Seleccionar Destino</h2>
        <div className="w-full h-48 md:h-64">
          <MapComponent onSelectCoordinates={handleSelectCoordinates} />
        </div>
      </div>

      {/* Botón para continuar */}
      <div className="flex-shrink-0 mt-4">
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all"
          onClick={handleContinue}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default ReservaViaje;
