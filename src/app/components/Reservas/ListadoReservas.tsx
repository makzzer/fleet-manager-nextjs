"use client";
import React, { useEffect, useState } from "react";
import { useReserva } from "@/app/context/ReservesContext";
import { Reserva } from "@/app/context/ReservesContext";
import { useAuth } from "@/app/context/AuthContext";
import { useVehiculo } from "@/app/context/VehiculoContext";
import { useRouter } from "next/navigation";
import { Vehiculo } from "@/app/context/VehiculoContext";

interface ListadoReservasProps {
  startDate: Date | null;
  endDate: Date | null;
  filtroEstado: string;
  filtroPatente: string;
}

interface ReservaConVehiculo extends Reserva {
  vehiculoReserva?: Vehiculo | undefined;
}

const ListadoReservas: React.FC<ListadoReservasProps> = ({
  startDate,
  endDate,
  filtroEstado,
  filtroPatente,
}) => {
  const { reservas, fetchReservas } = useReserva();
  const { vehiculos, fetchVehiculos } = useVehiculo();
  const { authenticatedUser } = useAuth();
  const [reservasFiltradas, setReservasFiltradas] = useState<
    ReservaConVehiculo[]
  >([]);
  const router = useRouter();

  useEffect(() => {
    fetchReservas();
    fetchVehiculos();
  }, [fetchReservas, fetchVehiculos]);

  useEffect(() => {
    const reservasUsuario = reservas.filter(
      (reserva) => reserva.user_id === authenticatedUser?.id
    );

    // Filtrar por rango de fechas
    let reservasFiltradasPorFecha = reservasUsuario;

    if (startDate || endDate) {
      reservasFiltradasPorFecha = reservasFiltradasPorFecha.filter((reserva) => {
        const fechaReserva = new Date(reserva.date_reserve);
        fechaReserva.setHours(0, 0, 0, 0);
        let cumpleInicio = true;
        let cumpleFin = true;

        if (startDate) {
          const inicio = new Date(startDate);
          inicio.setHours(0, 0, 0, 0);
          cumpleInicio = fechaReserva >= inicio;
        }

        if (endDate) {
          const fin = new Date(endDate);
          fin.setHours(23, 59, 59, 999);
          cumpleFin = fechaReserva <= fin;
        }

        return cumpleInicio && cumpleFin;
      });
    }

    // Mapear para incluir datos del vehículo
    const reservasConVehiculo = reservasFiltradasPorFecha.map((reserva) => {
      const vehiculoReserva = vehiculos.find(
        (vehiculo) => vehiculo.id === reserva.vehicle_id
      );
      return {
        ...reserva,
        vehiculoReserva,
      };
    });

    // Filtrar por patente
    let reservasFiltradasPorPatente = reservasConVehiculo;
    if (filtroPatente) {
      const filtroPatenteLower = filtroPatente.toLowerCase();
      reservasFiltradasPorPatente = reservasConVehiculo.filter((reserva) => {
        const patente = reserva.vehiculoReserva?.id?.toLowerCase() || "";
        return patente.includes(filtroPatenteLower);
      });
    }

    // Filtrar por estado
    let reservasFiltradasPorEstado = reservasFiltradasPorPatente;
    if (filtroEstado !== "Todos") {
      reservasFiltradasPorEstado = reservasFiltradasPorPatente.filter(
        (reserva) => reserva.status === filtroEstado
      );
    }

    // Ordenar de más nuevas a más antiguas según la fecha de inicio de la reserva
    reservasFiltradasPorEstado.sort((a, b) => {
      const dateA = new Date(a.date_reserve);
      const dateB = new Date(b.date_reserve);
      return dateB.getTime() - dateA.getTime();
    });

    setReservasFiltradas(reservasFiltradasPorEstado);
  }, [
    reservas,
    authenticatedUser,
    startDate,
    endDate,
    filtroEstado,
    filtroPatente,
    vehiculos,
  ]);

  return (
    <div>
      {reservasFiltradas.length > 0 ? (
        <ul className="space-y-4">
          {reservasFiltradas.map((reserva) => {
            const { vehiculoReserva } = reserva;

            return (
              <li
                key={reserva.id}
                className="bg-gray-800 p-6 rounded-lg shadow-md transition"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => router.push(`/detalleReserva/${reserva.id}`)}
                >
                  <div className="flex items-center justify-between border-b border-gray-700 pb-2 mb-4">
                    <h2 className="text-xl font-bold text-blue-400">
                      Reserva #{reserva.id}
                    </h2>
                    <div
                      className={`text-sm font-semibold rounded-full px-3 py-1 ${
                        reserva.status === "ACTIVATED"
                          ? "bg-blue-600 text-white"
                          : reserva.status === "CREATED"
                          ? "bg-yellow-500 text-white"
                          : reserva.status === "COMPLETED"
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {reserva.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-gray-400">
                        <strong>Fecha de creación:</strong>{" "}
                        {new Date(reserva.date_created).toLocaleDateString()}
                      </p>
                      <p className="text-gray-400">
                        <strong>Fecha de inicio:</strong>{" "}
                        {new Date(reserva.date_reserve).toLocaleDateString()}
                      </p>
                      <p className="text-gray-400">
                        <strong>Fecha de fin:</strong>{" "}
                        {new Date(reserva.date_finish_reserve).toLocaleDateString()}
                      </p>
                    </div>

                    {vehiculoReserva ? (
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-blue-300 mb-2">
                          Vehículo Reservado
                        </h3>
                        <p className="text-gray-300">
                          <strong>Marca:</strong> {vehiculoReserva.brand}
                        </p>
                        <p className="text-gray-300">
                          <strong>Modelo:</strong> {vehiculoReserva.model}
                        </p>
                        <p className="text-gray-300">
                          <strong>Patente:</strong> {vehiculoReserva.id}
                        </p>
                      </div>
                    ) : (
                      <p className="text-red-400">
                        Información del vehículo no disponible
                      </p>
                    )}
                  </div>
                </div>

                {/* Botones adicionales */}
                <div className="mt-4 flex space-x-4">
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all"
                    onClick={() =>
                      router.push(
                        `/solicitarasistencia?vehiculoId=${encodeURIComponent(
                          vehiculoReserva?.id || ""
                        )}&reservaId=${encodeURIComponent(reserva.id)}`
                      )
                    }
                  >
                    Solicitar Asistencia
                  </button>
                  <button
                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all"
                    onClick={() =>
                      router.push(
                        `/verControlesAuto?vehiculoId=${encodeURIComponent(
                          vehiculoReserva?.id || ""
                        )}`
                      )
                    }
                  >
                    Estado de Controles
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-400">
          {startDate || endDate || filtroEstado !== "Todos" || filtroPatente
            ? "No tienes reservas que coincidan con los filtros aplicados."
            : "No tienes reservas registradas."}
        </p>
      )}
    </div>
  );
};

export default ListadoReservas;
