"use client";
import React, { useEffect, useState } from "react";
import DetalleReserva from "@/app/components/Reservas/DetalleReserva";
import { useReserva } from "@/app/context/ReservesContext";
import { Reserva } from "@/app/context/ReservesContext";
import ProtectedRoute from "@/app/components/Routes/ProtectedRoutes";
import { useVehiculo } from "@/app/context/VehiculoContext";
import { useRouter } from "next/navigation";

const DetalleReservaPage = ({ params }: { params: { id: string } }) => {
  const { reservas, fetchReservas } = useReserva();
  const { vehiculos, fetchVehiculos } = useVehiculo();
  const [reservaSeleccionada, setReservaSeleccionada] = useState<Reserva | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const { id } = params;
  const router = useRouter();

  useEffect(() => {
    const cargarDatos = async () => {
      setIsLoading(true);
      await fetchReservas();
      await fetchVehiculos();

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
      cargarDatos();
    } else if (id && reservas.length > 0) {
      const reservaEncontrada = reservas.find((reserva) => reserva.id === id);
      setReservaSeleccionada(reservaEncontrada || null);
      setIsLoading(false);
    }
  }, [id, reservas.length, fetchReservas, fetchVehiculos]);

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
        <p className="text-gray-400">
          La reserva solicitada no existe o no está disponible.
        </p>
      </div>
    );
  }

  const vehiculoReserva = reservaSeleccionada.vehicle_id;

  return (
    <ProtectedRoute>
      <div className="bg-gray-900 text-white p-4 min-h-screen">
        <DetalleReserva reserva={reservaSeleccionada} reservaId={id} />
      </div>
    </ProtectedRoute>
  );
};

export default DetalleReservaPage;
