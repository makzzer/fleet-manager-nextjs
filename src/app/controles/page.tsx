"use client";

import { useEffect, useState } from "react";
import KanbanBoard from "../components/KanbanBoard/KanbanBoard";
import ProtectedRoute from "../components/Routes/ProtectedRoutes";
import { useControl } from "../context/ControlContext";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Vehiculo {
  id: string;
  status: string;
  model: string;
  brand: string;
  year: number;
  coordinates: Coordinates;
  date_created: string;
  date_updated: string;
}

interface Operador {
  id: string;
  username: string;
  full_name: string;
  roles: string[];
  permissions: Permissions[];
  date_created: string;
  date_updated: string;
}

interface Control {
  id: string;
  type: string;
  subject: string;
  description: string;
  vehicle: Vehiculo;
  priority: string;
  date_created: string;
  date_updated: string;
  status: string;
  operator: Operador;
}

interface Task {
  id: string | number;
  columnId: string | number;
  content: Control;
}

const Controles = () => {
  const { controls, fetchControls, setControlStatus } = useControl();
  const [controlTaskCards, setControlTaskCards] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadControls = async () => {
      await fetchControls();
    };

    loadControls();

  }, [fetchControls]);

  useEffect(() => {
    if (controls && controls.length > 0) {
      const tasks: Task[] = controls.map((control, index) => ({
        id: String(index),
        columnId: control.status,
        content: control,
      }));

      setControlTaskCards(tasks);
      setLoading(false);  // Detenemos el estado de carga cuando los datos estén listos.
    }
  }, [controls]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="p-6 bg-gray-900 min-h-screen text-white rounded-lg">
        <div className="mb-6">
          <h1 className="md:text-4xl text-3xl font-bold text-blue-400 mb-4 sm:mb-0">
            Gestión de controles
          </h1>
        </div>
        <div>
          <KanbanBoard initialTasks={controlTaskCards} setTasks={setControlTaskCards} setStatusTask={setControlStatus}/>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Controles;
