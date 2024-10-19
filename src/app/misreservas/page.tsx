// misreservas.tsx

"use client";
import React from "react";
import ListadoReservas from "../components/Reservas/ListadoReservas";
import ProtectedRoute from "../components/Routes/ProtectedRoutes";
import { useRouter } from "next/navigation";

const MisReservas = () => {

  const router = useRouter()
  return (
    <ProtectedRoute>
      <div className=" bg-gray-900 text-white p-6">
        {/*<h1 className="text-4xl font-bold text-blue-400 mb-8">Mis Reservas</h1>*/}
        <ListadoReservas />
     
      <div>
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-300 transform "
          onClick={() => router.push("/reservas")}
        >
          Volver
        </button>
      </div>
      </div>
    </ProtectedRoute >
  );
};

export default MisReservas;
