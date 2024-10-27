"use client";
import React, { useEffect, useState } from "react";
import { useReserva } from "@/app/context/ReservesContext";
import { Reserva } from "@/app/context/ReservesContext";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

interface ListadoReservasProps {
  startDate: Date | null;
  endDate: Date | null;
  filtroEstado: string;
}

const ListadoReservas: React.FC<ListadoReservasProps> = ({
  startDate,
  endDate,
  filtroEstado,
}) => {
  const { reservas, fetchReservas } = useReserva();
  const { authenticatedUser } = useAuth();
  const [reservasFiltradas, setReservasFiltradas] = useState<Reserva[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchReservas();
  }, [fetchReservas]);

  useEffect(() => {
    // Filtrar las reservas según el usuario autenticado
    const reservasUsuario = reservas.filter(
      (reserva) => reserva.user_id === authenticatedUser?.id
    );

    let reservasFiltradasPorFecha = reservasUsuario;

    // Filtrar por rango de fechas
    if (startDate && endDate) {
      reservasFiltradasPorFecha = reservasFiltradasPorFecha.filter((reserva) => {
        const fechaReserva = new Date(reserva.date_created);
        // Crear copias de las fechas para evitar mutaciones
        const inicio = new Date(startDate);
        inicio.setHours(0, 0, 0, 0);
        const fin = new Date(endDate);
        fin.setHours(23, 59, 59, 999);
        return fechaReserva >= inicio && fechaReserva <= fin;
      });
    }

    // Filtrar por estado
    let reservasFiltradasPorEstado = reservasFiltradasPorFecha;
    if (filtroEstado !== "Todos") {
      reservasFiltradasPorEstado = reservasFiltradasPorFecha.filter(
        (reserva) => reserva.status === filtroEstado
      );
    }

    setReservasFiltradas(reservasFiltradasPorEstado);
  }, [reservas, authenticatedUser, startDate, endDate, filtroEstado]);

  return (
    <div>
      {reservasFiltradas.length > 0 ? (
        <ul className="space-y-4">
          {reservasFiltradas.map((reserva) => (
            <li
              key={reserva.id}
              className="bg-gray-800 p-6 rounded-lg shadow-md cursor-pointer hover:bg-gray-700 transition"
              onClick={() => router.push(`/detalleReserva/${reserva.id}`)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    Reserva ID: {reserva.id}
                  </h2>
                  <p className="text-gray-400">
                    Fecha de creación:{" "}
                    {new Date(reserva.date_created).toLocaleDateString()}
                  </p>
                  <p className="text-gray-400">
                    Fecha de inicio:{" "}
                    {new Date(reserva.date_reserve).toLocaleDateString()}
                  </p>
                  <p className="text-gray-400">
                    Fecha de fin:{" "}
                    {new Date(reserva.date_finish_reserve).toLocaleDateString()}
                  </p>
                </div>
                <div
                  className={`text-sm font-semibold ${
                    reserva.status === "COMPLETED"
                      ? "text-green-400"
                      : reserva.status === "CANCELED"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {reserva.status}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">
          {startDate || endDate || filtroEstado !== "Todos"
            ? "No tienes reservas que coincidan con los filtros aplicados."
            : "No tienes reservas registradas."}
        </p>
      )}
    </div>
  );
};

export default ListadoReservas;