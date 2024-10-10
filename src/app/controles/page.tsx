'use client'

import KanbanBoard from "../components/KanbanBoard/KanbanBoard";
import ProtectedRoute from "../components/Routes/ProtectedRoutes";

const Controles = () => {
  return (
    <ProtectedRoute>
      <div className="p-6 bg-gray-900 min-h-screen text-white rounded-lg">
        <div className="flex justify-between mb-6">
          <h1 className="md:text-4xl text-3xl font-bold text-blue-400 mb-4 sm:mb-0">
            Gestión de controles
          </h1>
          <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Agregar control
          </button>
        </div>
        <div>
          <KanbanBoard />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Controles;