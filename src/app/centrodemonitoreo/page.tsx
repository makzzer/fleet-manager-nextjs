"use client";
import { useEffect, useState } from "react";
import { useReserva } from "@/app/context/ReservesContext";
import MapCentroMonitoreo from "../components/Maps/MapCentroMonitoreo"; // Componente del mapa

const CentroDeMonitoreo = () => {
  const { reservas, fetchReservas } = useReserva(); // Obtener reservas desde el contexto
  const [vehiculosEnViaje, setVehiculosEnViaje] = useState<
    { id: string; model: string; brand: string; coordinates: { latitude: number; longitude: number } }[]
  >([]);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<string | null>(null); // Estado para el vehículo seleccionado

  useEffect(() => {
    const cargarReservas = async () => {
      await fetchReservas();
    };

    cargarReservas(); // Cargar las reservas desde el backend al montar el componente
  }, [fetchReservas]);

  useEffect(() => {
    // Filtrar las reservas activas y extraer una coordenada aleatoria de los steps
    const vehiculosFiltrados = reservas
      .filter((reserva) => reserva.status === "ACTIVATED") // Filtrar reservas activas
      .map((reserva) => {
        // Verificar si la reserva tiene al menos una ruta con steps
        if (reserva.trip.routes.length > 0 && reserva.trip.routes[0].steps.length > 0) {
          // Obtener una coordenada aleatoria de los steps del viaje
          const randomRouteIndex = Math.floor(Math.random() * reserva.trip.routes.length);
          const randomStepIndex = Math.floor(Math.random() * reserva.trip.routes[randomRouteIndex].steps.length);
          const randomStep = reserva.trip.routes[randomRouteIndex].steps[randomStepIndex];

          // Verificar que las coordenadas no sean null o undefined
          if (randomStep && randomStep.latitude && randomStep.longitude) {
            return {
              id: reserva.vehicle_id,
              model: "Modelo del vehículo", // Asigna el modelo si tienes esta info
              brand: "Marca del vehículo", // Asigna la marca si tienes esta info
              coordinates: {
                latitude: randomStep.latitude,
                longitude: randomStep.longitude,
              },
            };
          }
        }

        // Si no hay steps o coordenadas válidas, usar valores predeterminados
        return {
          id: reserva.vehicle_id,
          model: "Modelo desconocido",
          brand: "Marca desconocida",
          coordinates: {
            latitude: -34.603722, // Coordenadas predeterminadas
            longitude: -58.381592,
          },
        };
      });

    setVehiculosEnViaje(vehiculosFiltrados); // Actualizar los vehículos en viaje en el estado
  }, [reservas]);

  // Manejar la selección de un vehículo
  const handleSeleccionarVehiculo = (vehiculoId: string) => {
    setVehiculoSeleccionado(vehiculoId);
  };

  return (
    <div className="p-6 bg-gray-900 rounded-xl min-h-screen text-white">
      <div className="flex flex-col lg:flex-row h-screen relative overflow-hidden bg-gray-900 text-white">
        {/* Sidebar de vehículos en viaje */}
        <div className="w-full lg:w-1/4 bg-gray-800 p-6 space-y-6 border-r border-gray-700 shadow-lg z-10">
          <h2 className="text-2xl font-semibold mb-4">Vehículos en viaje</h2>
          <ul className="space-y-4">
            {vehiculosEnViaje.length > 0 ? (
              vehiculosEnViaje.map((vehiculo) => (
                <li
                  key={vehiculo.id}
                  className={`bg-gray-700 hover:bg-gray-600 transition p-4 rounded-lg shadow-md cursor-pointer ${
                    vehiculo.id === vehiculoSeleccionado ? "bg-blue-500" : ""
                  }`}
                  onClick={() => handleSeleccionarVehiculo(vehiculo.id)} // Manejar selección al hacer clic
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
          <MapCentroMonitoreo vehiculos={vehiculosEnViaje} vehiculoSeleccionado={vehiculoSeleccionado} />
        </div>
      </div>
    </div>
  );
};

export default CentroDeMonitoreo;
