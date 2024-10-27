"use client";
import { useReserva } from "@/app/context/ReservesContext";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import ReservaCard from "./ReservaCard";
import ProtectedRoute from "../Routes/ProtectedRoutes";
import { Reserva } from "@/app/context/ReservesContext";
import * as XLSX from 'xlsx';
import { FaFileExcel } from 'react-icons/fa'; // Importamos el ícono de Excel

const ListadoReservas = () => {
  const { reservas, fetchReservas } = useReserva();
  const { authenticatedUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [userReservas, setUserReservas] = useState<Reserva[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>("Todos");

  // Opciones de estado para el filtro
  const opcionesEstado = ["Todos", "CREATED", "ACTIVATED", "COMPLETED", "CANCELED"];

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

  // Función para exportar a Excel
  const exportReservasToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(userReservas);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservas');
    XLSX.writeFile(workbook, 'reservas.xlsx');
  };

  // Filtrar las reservas según el estado seleccionado
  const reservasFiltradasPorEstado = userReservas.filter((reserva) =>
    filtroEstado === "Todos" ? true : reserva.status === filtroEstado
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-4xl font-bold text-blue-400 mb-8">Mis Reservas</h1>

        {/* Filtro por estado */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <label className="block text-sm font-medium mb-2">
              Filtrar por estado:
            </label>
            <select
              className="w-full sm:w-64 bg-gray-800 text-white rounded-md p-2"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              {opcionesEstado.map((estado) => (
                <option key={estado} value={estado}>
                  {estado === "Todos" ? "Todos los estados" : estado}
                </option>
              ))}
            </select>
          </div>

          {/* Botón de exportar a Excel */}
          <button
            onClick={exportReservasToExcel}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
          >
            <FaFileExcel className="mr-2" />
            Exportar a Excel
          </button>
        </div>

        {isLoading ? (
          <p className="text-gray-400">Cargando reservas...</p>
        ) : reservasFiltradasPorEstado.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservasFiltradasPorEstado.map((reserva) => (
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