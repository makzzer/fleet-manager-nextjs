"use client";

import { useEffect, useState } from "react";
import KanbanBoard from "../components/KanbanBoard/KanbanBoard";
import ProtectedRoute from "../components/Routes/ProtectedRoutes";
import { useControl } from "../context/ControlContext";
import { useVehiculo } from "../context/VehiculoContext";
import { useUser } from "../context/UserContext";
import Swal from "sweetalert2";
import TaskList from "../components/TaskList";

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

interface POSTPredictiveControl {
  subject: string;
  description: string;
  brand: string;
  model: string;
  year: number;
  priority: string;
  operator_id: string;
}

const Controles = () => {
  const { controls, fetchControls, setControlStatus, createPredictiveControl } =
    useControl();
  const [controlTaskCards, setControlTaskCards] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { vehiculos } = useVehiculo();
  const { users } = useUser();

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
      setLoading(false); // Detenemos el estado de carga cuando los datos estén listos.
    }
  }, [controls]);

  const handleCreatePredictiveControl = async () => {
    const coches = vehiculos;
    const usuarios = users;

    const opcionesMarcasVehiculos = coches.map(
      (coches) => `<option value="${coches.brand}">${coches.brand}</option>`
    );
    const opcionesModelosVehiculos = coches.map(
      (coches) => `<option value="${coches.model}">${coches.model}</option>`
    );
    const opcionesAniosVehiculos = coches.map(
      (coches) => `<option value="${coches.year}">${coches.year}</option>`
    );

    const opcionesOperadores = usuarios
      .filter((usuario) => usuario.roles.includes("OPERATOR"))
      .map(
        (usuario) =>
          `<option value="${usuario.id}">${usuario.full_name}</option>`
      )
      .join("");

    const { value: formValues } = await Swal.fire({
      title: `Crear control Correctivo`,
      background: "rgb(55 65 81)",
      color: "white",
      html: `
            <style>
            select.swal2-select {
              background-color: rgb(55, 65, 81);
              color: white;
            }
            </style>

            <input id="asunto" class="swal2-input" placeholder="Asunto">
            <input id="descripcion" class="swal2-input" placeholder="Descripción">
            <select id="vehiculo-brand" class="swal2-select">
            <option value="" disabled selected>Seleccione una marca</option>
            ${opcionesMarcasVehiculos}
            </select>
            <select id="vehiculo-model" class="swal2-select">
            <option value="" disabled selected>Seleccione un modelo</option>
            ${opcionesModelosVehiculos}
            </select>
            <select id="vehiculo-year" class="swal2-select">
            <option value="" disabled selected>Seleccione un año</option>
            ${opcionesAniosVehiculos}
            </select>

            <div class="swal2-input mt-4">
              <label >Prioridad:</label><br>
              <div class="flex gap-2 align-center justify-center">
              <input type="radio" id="priority-high" name="priority" value="HIGH">
              <label for="priority-high">Alta</label><br>
              <input type="radio" id="priority-medium" name="priority" value="MEDIUM">
              <label for="priority-medium">Media</label><br>
              <input type="radio" id="priority-low" name="priority" value="LOW">
              <label for="priority-low">Baja</label>
              </div>
            </div>
            
            <select id="operador" class="swal2-select">
            <option value="" disabled selected>Seleccione un operador</option>
            ${opcionesOperadores}
        `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          subject: (document.getElementById("asunto") as HTMLInputElement)
            .value,
          description: (
            document.getElementById("descripcion") as HTMLInputElement
          ).value,
          brand: (document.getElementById("vehiculo-brand") as HTMLInputElement)
            .value,
          model: (document.getElementById("vehiculo-model") as HTMLInputElement)
            .value,
          year: parseInt(
            (document.getElementById("vehiculo-year") as HTMLInputElement).value
          ),
          priority: (
            document.querySelector(
              'input[name="priority"]:checked'
            ) as HTMLInputElement
          ).value,
          operator_id: (document.getElementById("operador") as HTMLInputElement)
            .value,
        };
      },
    });

    if (formValues) {
      const newPredictiveControl: POSTPredictiveControl = {
        ...formValues,
      };
      console.log(newPredictiveControl);
      createPredictiveControl(newPredictiveControl);

      Swal.fire("¡Control correctivo creado!", "", "success");
    }
  };

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
        <div className="hidden md:block overflow-x-auto">
          <KanbanBoard
            initialTasks={controlTaskCards}
            setTasks={setControlTaskCards}
            setStatusTask={setControlStatus}
            addControlTask={handleCreatePredictiveControl}
          />
        </div>
        <div className="md:hidden grid grid-cols-1 gap-6 mt-6">
          <TaskList 
          tasks={controlTaskCards}
          addControlTask={handleCreatePredictiveControl}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Controles;
