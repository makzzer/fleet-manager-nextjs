"use client";
import React, { useEffect, useState } from "react";
import DetalleReserva from "@/app/components/Reservas/DetalleReserva";
import { useReserva } from "@/app/context/ReservesContext";
import { Reserva } from "@/app/context/ReservesContext";
import ProtectedRoute from "@/app/components/Routes/ProtectedRoutes";

const DetalleReservaPage = ({ params }: { params: { id: string } }) => {
  const { reservas, fetchReservas } = useReserva();
  const [reservaSeleccionada, setReservaSeleccionada] = useState<Reserva | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Estado para manejar el cargando
  const { id } = params;

  useEffect(() => {
    const cargarReserva = async () => {
      setIsLoading(true);
      await fetchReservas();
      
      const reservaEncontrada = reservas.find((reserva) => reserva.id === id);
      if (reservaEncontrada) {
        setReservaSeleccionada(reservaEncontrada);
        console.log("Reserva encontrada:", reservaEncontrada);
      } else {
        console.log("No se encontró la reserva");
      }
      
      setIsLoading(false);
    };

    if (id && reservas.length === 0) {
      cargarReserva(); // Solo carga reservas si no las tiene cargadas
    } else if (id && reservas.length > 0) {
      const reservaEncontrada = reservas.find((reserva) => reserva.id === id);
      setReservaSeleccionada(reservaEncontrada || null);
      setIsLoading(false); // Evita el ciclo de render
    }
  }, [id, reservas.length, fetchReservas]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <p className="text-2xl font-bold">Cargando reservas...</p>
      </div>
    );
  }

  if (!reservaSeleccionada) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <h1 className="text-4xl font-bold mb-6">Reserva no encontrada</h1>
        <p className="text-gray-400">La reserva solicitada no existe o no está disponible.</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <DetalleReserva reserva={reservaSeleccionada} reservaId={id} /> {/* Pasar el ID de la reserva */}
    </ProtectedRoute>
  );
};

export default DetalleReservaPage;
