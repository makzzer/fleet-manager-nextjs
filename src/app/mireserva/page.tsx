"use client";
import { useReserva } from "../context/ReservesContext"; // Asegúrate de que la ruta sea correcta
import { useAuth } from "../context/AuthContext"; // Importa el AuthContext
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Reserva } from "../context/ReservesContext"; // Importa la interfaz Reserva

const MiReserva = () => {
  const { reservas, fetchReservas } = useReserva(); // Obtener las reservas del context
  const { authenticatedUser } = useAuth(); // Obtener el usuario autenticado
  const [userReserva, setUserReserva] = useState<Reserva | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (authenticatedUser && authenticatedUser.id) {
      // Cargar todas las reservas
      fetchReservas();

      // Filtrar la reserva del usuario
      const reservaDelUsuario = reservas.find(
        (reserva) => reserva.user_id === authenticatedUser.id
      );
      setUserReserva(reservaDelUsuario || null);
    }
  }, [authenticatedUser, fetchReservas, reservas]);

  // Si no hay reservas o el usuario no tiene una, mostramos un mensaje
  if (!userReserva) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <h1 className="text-4xl font-bold mb-6">Mi Reserva</h1>
        <p className="text-white">Aún no tienes ninguna reserva.</p>
      </div>
    );
  }

  // Si el usuario tiene una reserva, mostramos los detalles
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-6">Mi Reserva</h1>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
        <p className="text-lg">
          <strong>Estado:</strong> {userReserva.status}
        </p>
        <p className="text-lg">
          <strong>Vehículo:</strong> {userReserva.vehicle_id}
        </p>
        <p className="text-lg">
          <strong>Usuario:</strong> {userReserva.user_id}
        </p>
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Detalles del Viaje</h2>
          <p>
            <strong>Origen:</strong> {userReserva.trip.origin.address}
          </p>
          <p>
            <strong>Destino:</strong> {userReserva.trip.destination.address}
          </p>

          <h3 className="text-lg font-semibold mt-4">Rutas</h3>
          <ul>
            {userReserva.trip.routes.map(
              (
                route: {
                  distance: string;
                  duration: string;
                  steps: { latitude: number; longitude: number }[];
                },
                index
              ) => (
                <li key={index} className="mb-2">
                  <p>
                    <strong>Distancia:</strong> {route.distance}
                  </p>
                  <p>
                    <strong>Duración:</strong> {route.duration}
                  </p>
                  <p>
                    <strong>Pasos:</strong>
                  </p>
                  <ul>
                    {route.steps.map(
                      (
                        step: { latitude: number; longitude: number },
                        stepIndex
                      ) => (
                        <li key={stepIndex}>
                          Lat: {step.latitude}, Long: {step.longitude}
                        </li>
                      )
                    )}
                  </ul>
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      <div className="flex-auto w-64 mt-4">
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all"
          onClick={() => router.push("/reservas")}
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default MiReserva;
