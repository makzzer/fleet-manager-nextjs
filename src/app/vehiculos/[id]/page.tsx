"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useVehiculo,
  tiposCombustible,
  unidadesCombustible,
  estadosVehiculo,
  tiposVehiculo,
} from "../../context/VehiculoContext";
import dynamic from "next/dynamic";
import QRCode from "react-qr-code"; // Importamos el componente QRCode

const MapVehiculo = dynamic(() => import("@/app/components/Maps/MapVehiculo"), {
  ssr: false,
});

const VehiculoDinamicoPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { vehiculos } = useVehiculo();

  const vehiculoData = vehiculos.find((vehiculo) => vehiculo.id === id);

  if (!vehiculoData) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen flex items-center justify-center text-white">
        <h2 className="text-xl font-semibold">Vehículo no encontrado</h2>
      </div>
    );
  }


  // Usamos una ruta relativa en el QR para evitar problemas con diferentes dominios
  const qrValue = `/vehiculos/${vehiculoData.id}`;

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
            {tiposCombustible[vehiculoData.fuel_type] ||
              vehiculoData.fuel_type}
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
          {/* Código QR */}
          <div className="mt-6 flex flex-col items-center">
            <h3 className="text-lg font-medium mb-4 text-blue-200">
              Código QR
            </h3>
            <QRCode
              value={qrValue}
              size={128}
              bgColor="#1a202c"
              fgColor="#ffffff"
            />
          </div>
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
          <MapVehiculo coordinates={vehiculoData.coordinates} />
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={() => router.push("/vehiculos")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default VehiculoDinamicoPage;