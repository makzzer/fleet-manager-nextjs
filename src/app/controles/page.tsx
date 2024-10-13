'use client'

import KanbanBoard from "../components/KanbanBoard/KanbanBoard";
import ProtectedRoute from "../components/Routes/ProtectedRoutes";
import { useControl } from "../context/ControlContext";

const Controles = () => {
  const { controls } = useControl();

  console.log(controls);

  return (
    <ProtectedRoute>
      <div className="p-6 bg-gray-900 min-h-screen text-white rounded-lg">
        <div className="mb-6">
          <h1 className="md:text-4xl text-3xl font-bold text-blue-400 mb-4 sm:mb-0">
            Gestión de controles
          </h1>
        </div>
        <div>
          <KanbanBoard />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Controles;