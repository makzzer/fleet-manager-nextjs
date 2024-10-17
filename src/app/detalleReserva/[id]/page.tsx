// app/detalleReserva/[id]/page.tsx

"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DetalleReserva from "@/app/components/Reservas/DetalleReserva";
import { useReserva } from "@/app/context/ReservesContext";
import { Reserva } from "@/app/context/ReservesContext";
import ProtectedRoute from "@/app/components/Routes/ProtectedRoutes";

const DetalleReservaPage = ({ params }: { params: { id: string } }) => {
  const { reservas, fetchReservas } = useReserva();
  const [reservaSeleccionada, setReservaSeleccionada] = useState<Reserva | null>(null);
  const { id } = params;

  useEffect(() => {
    const cargarReserva = async () => {
      await fetchReservas();
      const reservaEncontrada = reservas.find((reserva) => reserva.id === id);
      setReservaSeleccionada(reservaEncontrada || null);
    };

    if (id) {
      cargarReserva();
    }
  }, [id, fetchReservas, reservas]);

  if (!reservaSeleccionada) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <h1 className="text-4xl font-bold mb-6">Reserva no encontrada</h1>
        <p className="text-gray-400">La reserva solicitada no existe o no está disponible.</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <DetalleReserva reserva={reservaSeleccionada} />
    </ProtectedRoute>
  );
};

export default DetalleReservaPage;
