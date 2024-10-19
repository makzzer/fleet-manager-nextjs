"use client";
import dynamic from "next/dynamic";

const MapCentroMonitoreo = dynamic(() => import("../components/Maps/MapCentroMonitoreo"), { ssr: false });

const CentroDeMonitoreo = () => {
  const vehiculosEnViaje = [
    {
      id: "OKI-412",
      model: "Modelo A",
      brand: "Marca del vehículo A",
      coordinates: {
        latitude: -34.493027,
        longitude: -58.639397,
      },
    },
    {
      id: "ABC-123",
      model: "Modelo B",
      brand: "Marca del vehículo B",
      coordinates: {
        latitude: -34.492612,
        longitude: -58.645897,
      },
    },
    {
      id: "XYZ-987",
      model: "Modelo C",
      brand: "Marca del vehículo C",
      coordinates: {
        latitude: -34.496128,
        longitude: -58.641257,
      },
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-screen relative overflow-hidden bg-gray-900 text-white">
      {/* Sidebar de vehículos en viaje */}
      <div className="w-full lg:w-1/4 bg-gray-800 p-6 space-y-6 border-r border-gray-700 shadow-lg z-10">
        <h2 className="text-2xl font-semibold mb-4">Vehículos en viaje</h2>
        <ul className="space-y-4">
          {vehiculosEnViaje.length > 0 ? (
            vehiculosEnViaje.map((vehiculo) => (
              <li
                key={vehiculo.id}
                className="bg-gray-700 hover:bg-gray-600 transition p-4 rounded-lg shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold">
                    {vehiculo.brand} {vehiculo.model}
                  </div>
                  <div className="text-sm text-gray-400">ID: {vehiculo.id}</div>
                </div>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No hay vehículos en viaje</li>
          )}
        </ul>
      </div>

      {/* Mapa de vehículos */}
      <div className="w-full lg:w-3/4 h-full relative z-0">
        <MapCentroMonitoreo vehiculos={vehiculosEnViaje} />
      </div>
    </div>
  );
};

export default CentroDeMonitoreo;
