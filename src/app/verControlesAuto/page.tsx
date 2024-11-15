"use client";

import React from 'react';
import ListadoControles from '../listadoControles/page';
import ProtectedRoute from '@/app/components/Routes/ProtectedRoutes';
import { useRouter } from 'next/navigation';

const VerControlesAutoPage = () => {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="bg-gray-900 text-white p-4 min-h-screen">
        <h1 className="text-4xl font-bold mb-6">Estado de los Controles</h1>
        <ListadoControles />
        {/* Botón para volver a mis reservas */}
        <div className="mt-6">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all"
            onClick={() => router.push('/misreservas')}
          >
            Volver a mis reservas
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default VerControlesAutoPage;
