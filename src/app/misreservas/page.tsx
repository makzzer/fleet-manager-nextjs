"use client";
import React, { useState } from "react";
import ListadoReservas from "../components/Reservas/ListadoReservas";
import ProtectedRoute from "../components/Routes/ProtectedRoutes";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";

const MisReservas = () => {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>("Todos");

  const opcionesEstado = ["Todos", "CREATED", "ACTIVATED", "COMPLETED", "CANCELED"];

  return (
    <ProtectedRoute>
      <div className="bg-gray-900 text-white p-6 min-h-screen">
        <h1 className="text-4xl font-bold mb-6">Reservas</h1>

        {/* Selector de Rango de Fechas y Estado */}
        <div className="flex flex-col md:flex-row items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
          {/* Fecha de inicio */}
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium mb-2">
              Fecha de inicio
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecciona fecha de inicio"
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              locale={es}
            />
          </div>
          {/* Fecha de fin */}
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium mb-2">
              Fecha de fin
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecciona fecha de fin"
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              locale={es}
              minDate={startDate || undefined}
            />
          </div>
          {/* Filtro por estado */}
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium mb-2">
              Filtrar por estado
            </label>
            <select
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        </div>

        {/* Listado de Reservas */}
        <ListadoReservas
          startDate={startDate}
          endDate={endDate}
          filtroEstado={filtroEstado}
        />

        {/* Botón de Volver */}
        <div className="mt-6">
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-300 transform"
            onClick={() => router.push("/reservas")}
          >
            Volver
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MisReservas;