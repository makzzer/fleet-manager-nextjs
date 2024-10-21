"use client";
import { useEffect, useState } from "react";
import { useReserva } from "@/app/context/ReservesContext";
import MapTrazadoRuta2 from "../components/Maps/MapTrazadoRuta2";
import { MapContainer } from "react-leaflet";
import { TileLayer } from "react-leaflet";

const CentroDeMonitoreoRuta = () => {
  const { reservas, fetchReservas } = useReserva(); // Obtener reservas desde el contexto
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<{
    id: string;
    model: string;
    brand: string;
    steps: { latitude: number; longitude: number }[];
  } | null>(null);

  useEffect(() => {
    const cargarReservas = async () => {
      await fetchReservas();
    };

    cargarReservas(); // Cargar las reservas desde el backend al montar el componente
  }, [fetchReservas]);

  const handleSeleccionarVehiculo = (reservaId: string) => {
    const reservaSeleccionada = reservas.find(
      (reserva) => reserva.vehicle_id === reservaId
    );

    if (reservaSeleccionada) {
      const steps = reservaSeleccionada.trip.routes.flatMap((route) =>
        route.steps.map((step) => ({
          latitude: step.latitude,
          longitude: step.longitude,
        }))
      );
      setVehiculoSeleccionado({
        id: reservaSeleccionada.vehicle_id,
        model: "Modelo del vehículo", // Asigna el modelo si tienes esta info
        brand: "Marca del vehículo", // Asigna la marca si tienes esta info
        steps: steps,
      });
    }
  };

  return (
    <div className="p-6 bg-gray-900 rounded-xl min-h-screen text-white">
      <div className="flex flex-col lg:flex-row h-screen relative overflow-hidden bg-gray-900 text-white">
        {/* Sidebar de vehículos en viaje */}
        <div className="w-full lg:w-1/4 bg-gray-800 p-6 space-y-6 border-r border-gray-700 shadow-lg z-10">
          <h2 className="text-2xl font-semibold mb-4">Vehículos en viaje</h2>
          <ul className="space-y-4">
            {reservas.length > 0 ? (
              reservas.map((reserva) => (
                <li
                  key={reserva.vehicle_id}
                  className="bg-gray-700 hover:bg-gray-600 transition p-4 rounded-lg shadow-md cursor-pointer"
                  onClick={() => handleSeleccionarVehiculo(reserva.vehicle_id)} // Selecciona el vehículo
                >
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold">
                      Marca del vehículo {reserva.vehicle_id}
                    </div>
                    <div className="text-sm text-gray-400">ID: {reserva.vehicle_id}</div>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No hay vehículos en viaje</li>
            )}
          </ul>
        </div>

        {/* Mapa con el trazado de la ruta */}
        <div className="w-full lg:w-3/4 h-full relative z-0">
          <MapContainer
            center={[-34.493027, -58.639397]} // Coordenadas predeterminadas
            zoom={14} // Zoom inicial
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {vehiculoSeleccionado && (
              <MapTrazadoRuta2 vehiculoSeleccionado={vehiculoSeleccionado} />
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default CentroDeMonitoreoRuta;
