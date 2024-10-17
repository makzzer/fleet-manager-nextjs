"use client";
import { useReserva } from "@/app/context/ReservesContext";
import { useEffect, useState } from "react";
import ReservaCard from "./ReservaCard";
import ProtectedRoute from "../Routes/ProtectedRoutes";
import { useRouter } from "next/navigation";

const ListadoReservas = () => {
  const { reservas, fetchReservas } = useReserva();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter()

  useEffect(() => {
    const loadReservas = async () => {
      setIsLoading(true);
      await fetchReservas();
      setIsLoading(false);
    };
    loadReservas();
  }, [fetchReservas]);

  const handleVerDetalles = (id: string) => {
    router.push(`/detalleReserva/${id}`);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-4xl font-bold text-blue-400 mb-8">Mis Reservas</h1>
        {isLoading ? (
          <p className="text-gray-400">Cargando reservas...</p>
        ) : reservas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservas.map((reserva) => (
              <ReservaCard key={reserva.id} reserva={reserva} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No tienes reservas disponibles.</p>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default ListadoReservas;
