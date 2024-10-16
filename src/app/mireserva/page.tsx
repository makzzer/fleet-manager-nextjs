"use client";
import { useReserva } from "../context/ReservesContext";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Reserva } from "../context/ReservesContext";
import dynamic from "next/dynamic";

// Cargar LeafletMap dinámicamente para evitar problemas con SSR
const LeafletMap = dynamic(() => import("../components/Maps/MapTrazadoRuta"), { ssr: false });

const MiReserva = () => {
  const { reservas, fetchReservas } = useReserva();
  const { authenticatedUser } = useAuth();
  const [userReserva, setUserReserva] = useState<Reserva | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (authenticatedUser && authenticatedUser.id) {
      fetchReservas();
      const reservaDelUsuario = reservas.find(
        (reserva) => reserva.user_id === authenticatedUser.id
      );
      setUserReserva(reservaDelUsuario || null);
    }
  }, [authenticatedUser, fetchReservas, reservas]);

  if (!userReserva) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <h1 className="text-4xl font-bold mb-6">Mi Reserva</h1>
        <p className="text-gray-400">Aún no tienes ninguna reserva.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-8 text-blue-400">Mi Reserva</h1>

      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-2xl mb-6">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-white mb-2">Estado del Viaje</h2>
          <p className={`text-lg font-bold py-2 rounded-lg ${userReserva.status === "COMPLETED" ? "bg-green-600" : "bg-yellow-600"}`}>
            {userReserva.status}
          </p>
        </div>

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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-lg">
                <strong>Vehículo:</strong> {userReserva.vehicle_id}
              </p>
            </div>
            <div>
              <p className="text-lg">
                <strong>Fecha:</strong> {new Date(userReserva.date_created).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Detalles del Viaje</h2>
          <p className="mb-2">
            <strong>Origen:</strong> {userReserva.trip.origin.address}
          </p>
          <p className="mb-2">
            <strong>Destino:</strong> {userReserva.trip.destination.address}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Ruta del Viaje</h2>
          <div className="w-full h-64 rounded-lg overflow-hidden">
            {/* Aquí integramos el componente del mapa y pasamos las rutas */}
            <LeafletMap routes={userReserva.trip.routes} />
          </div>
        </div>
      </div>

      <div className="flex-auto w-full sm:w-64 mt-2">
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
          onClick={() => router.push("/reservas")}
        >
          Volver
        </button>
      </div>


    </div>
  );
};

export default MiReserva;
