"use client";
import { Reserva } from "@/app/context/ReservesContext";
import { useAuth } from "@/app/context/AuthContext";
import { useVehiculo, Vehiculo } from "@/app/context/VehiculoContext";
import dynamic from "next/dynamic";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

// Cargar LeafletMap dinámicamente para evitar problemas con SSR
const LeafletMap = dynamic(() => import("../../components/Maps/MapTrazadoRuta"), { ssr: false });

interface DetalleReservaProps {
  reserva: Reserva;
  reservaId: string; // Recibimos el id de la reserva
}

const DetalleReserva = ({ reserva: initialReserva, reservaId }: DetalleReservaProps) => {
  const { authenticatedUser } = useAuth();
  const { vehiculos } = useVehiculo();
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);

  const [reserva, setReserva] = useState<Reserva>(initialReserva); // Utilizamos un estado para manejar la reserva localmente
  const [loading, setLoading] = useState(false); // Estado de carga
  const router = useRouter();

  useEffect(() => {
    const vehiculoEncontrado = vehiculos.find((v) => v.id === reserva.vehicle_id);
    if (vehiculoEncontrado) {
      setVehiculo(vehiculoEncontrado);
    }
  }, [vehiculos, reserva.vehicle_id]);

  // Función para cambiar el estado de la reserva a COMPLETED
  const completarReserva = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `https://fleet-manager-vrxj.onrender.com/api/reserves/${reservaId}/status/COMPLETED`
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Éxito",
          text: "La reserva ha sido completada.",
          icon: "success",
        });

        // Actualizamos el estado de la reserva en el componente
        setReserva((prevReserva) => ({
          ...prevReserva,
          status: "COMPLETED",
        }));
      }
    } catch (error) {
      console.error("Error al completar la reserva:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al completar la reserva.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-8 text-blue-400">Detalle de la Reserva</h1>
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-3xl mb-6">
        {/* Estado del Viaje */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-white mb-2">Estado del Viaje</h2>
          <p
            className={`text-lg font-bold py-2 rounded-lg ${reserva.status === "COMPLETED"
                ? "bg-green-600"
                : reserva.status === "CANCELED"
                  ? "bg-red-600"
                  : reserva.status === "ACTIVATED"
                    ? "bg-blue-600 text-white"
                    : "bg-yellow-500 text-white"
              }`}
          >
            {reserva.status}
          </p>
        </div>

        {/* Detalles del Usuario */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Detalles del Usuario</h2>
          <div className="flex items-center mb-4">
            <div className="rounded-full bg-blue-600 w-16 h-16 flex items-center justify-center text-white font-bold text-2xl">
              {authenticatedUser?.full_name.charAt(0)}
            </div>
            <div className="ml-4">
              <p className="text-lg font-medium">{authenticatedUser?.full_name}</p>
              <p className="text-gray-400 text-sm">{authenticatedUser?.username}</p>
            </div>
          </div>
        </div>

        {/* Detalles del Vehículo */}
        {vehiculo && (
          <div className="mb-6 bg-gray-700 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-white mb-4">Detalles del Vehículo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-lg">
                  <strong>Marca:</strong> {vehiculo.brand}
                </p>
              </div>
              <div>
                <p className="text-lg">
                  <strong>Modelo:</strong> {vehiculo.model}
                </p>
              </div>
              <div>
                <p className="text-lg">
                  <strong>ID del Vehículo:</strong> {vehiculo.id}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Detalles de la Reserva */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Detalles de la Reserva</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-lg">
                <strong>Fecha de Inicio:</strong>{" "}
                {new Date(reserva.date_reserve).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-lg">
                <strong>Fecha de Fin:</strong>{" "}
                {new Date(reserva.date_finish_reserve).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-lg">
                <strong>Fecha de Creación:</strong>{" "}
                {new Date(reserva.date_created).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Detalles del Viaje */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4">Detalles del Viaje</h2>
          <p className="mb-2">
            <strong>Origen:</strong> {reserva.trip.origin.address}
          </p>
          <p className="mb-2">
            <strong>Destino:</strong> {reserva.trip.destination.address}
          </p>
          <p className="mb-2">
            <strong>Consumo de combustible estimado:</strong> {reserva.fuel_consumption}
          </p>
        </div>

        {/* Ruta del Viaje */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Ruta del Viaje</h2>
          <div className="w-full h-64 rounded-lg overflow-hidden relative z-0">
            {typeof window !== "undefined" && (
              <LeafletMap routes={reserva.trip.routes} />
            )}
          </div>
        </div>

        {/* Mostrar el botón solo si el estado no es COMPLETED */}
        {reserva.status !== "COMPLETED" && reserva.status !== "CREATED" && (
          <div className="w-full mt-4">
            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
              onClick={completarReserva}
              disabled={loading} // Deshabilitar el botón mientras se realiza la petición
            >
              {loading ? "Cambiando estado..." : "Marcar como Completada"}
            </button>
          </div>
        )}

        {/* Botón de Volver más responsivo */}
        <div className="w-full mt-4 ">





          <button
            className="bg-red-600 hover:bg-red-700 mb-2 w-full text-white font-bold py-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
            onClick={() =>
              router.push(
                `/solicitarasistencia?vehiculoId=${vehiculo?.id}&reservaId=${encodeURIComponent(reservaId)}`
              )
            }
          >
            Solicitar Asistencia
          </button>


          <button
            className="bg-yellow-600 hover:bg-yellow-700 mb-2 w-full text-white font-bold py-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
            onClick={() =>
              router.push(
                `/verControlesAuto?vehiculoId=${encodeURIComponent(
                  vehiculo?.id || ""
                )}`
              )
            }
          >
            Ver Controles
          </button>


          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
            onClick={() => window.history.back()}
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleReserva;
