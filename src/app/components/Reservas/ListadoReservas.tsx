"use client";
import { useReserva } from "@/app/context/ReservesContext";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import ReservaCard from "./ReservaCard";
import ProtectedRoute from "../Routes/ProtectedRoutes";
import { Reserva } from "@/app/context/ReservesContext";
import * as XLSX from 'xlsx';

const ListadoReservas = () => {
  const { reservas, fetchReservas } = useReserva();
  const { authenticatedUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [userReservas, setUserReservas] = useState<Reserva[]>([]);

  // Fetch reservas when authenticatedUser changes
  useEffect(() => {
    const loadReservas = async () => {
      setIsLoading(true);
      await fetchReservas();
    };

    if (authenticatedUser) {
      loadReservas();
    }
  }, [fetchReservas, authenticatedUser]);

  // Filter reservas when reservas change
  useEffect(() => {
    if (authenticatedUser && reservas.length > 0) {
      const reservasFiltradas = reservas.filter(
        (reserva) => reserva.user_id === authenticatedUser.id
      );
      setUserReservas(reservasFiltradas);
      console.log("Reservas filtradas para el usuario:", reservasFiltradas);
      setIsLoading(false);
    }
  }, [authenticatedUser, reservas]);

  const exportReservasToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(userReservas);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservas');
    XLSX.writeFile(workbook, 'reservas.xlsx');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-4xl font-bold text-blue-400 mb-8">Mis Reservas</h1>
        {isLoading ? (
          <p className="text-gray-400">Cargando reservas...</p>
        ) : userReservas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userReservas.map((reserva) => (
              <ReservaCard key={reserva.id} reserva={reserva} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No tienes reservas disponibles.</p>
        )}
         <button
            onClick={exportReservasToExcel}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            Exportar a Excel
          </button>
      </div>
    </ProtectedRoute>
  );
};

export default ListadoReservas;
