// misreservas.tsx

"use client";
import React from "react";
import ListadoReservas from "../components/Reservas/ListadoReservas";
import ProtectedRoute from "../components/Routes/ProtectedRoutes";

const MisReservas = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white p-6">
        {/*<h1 className="text-4xl font-bold text-blue-400 mb-8">Mis Reservas</h1>*/}
        <ListadoReservas />
      </div>
    </ProtectedRoute>
  );
};

export default MisReservas;
