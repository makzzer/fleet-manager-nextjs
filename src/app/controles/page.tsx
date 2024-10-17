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
  const {
    controls,
    fetchControls,
    setControlStatus,
    createPredictiveControl,
    exportControlesToExcel,
  } = useControl();
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

  const handleSetStatus = async (control_id: string, new_status: string) => {
    await setControlStatus(control_id, new_status);
    await fetchControls();
  };

  const handleCreatePredictiveControl = async () => {
    const coches = vehiculos;
    const usuarios = users;

    const brandModelMap = new Map();
    coches.forEach((coche) => {
      if (!brandModelMap.has(coche.brand)) {
        brandModelMap.set(coche.brand, new Map());
      }
      if (!brandModelMap.get(coche.brand).has(coche.model)) {
        brandModelMap.get(coche.brand).set(coche.model, new Set());
      }
      brandModelMap.get(coche.brand).get(coche.model).add(coche.year);
    });

    const uniqueBrands = Array.from(brandModelMap.keys());

    const opcionesOperadores = usuarios
      .filter((usuario) => usuario.roles.includes("OPERATOR"))
      .map(
        (usuario) =>
          `<option value="${usuario.id}">${usuario.full_name}</option>`
      )
      .join("");

    let selectedBrand = "";
    let selectedModel = "";

    const { value: formValues } = await Swal.fire({
      title: `Crear control Correctivo`,
      color: "white",
      html: `
            <div class="flex flex-col md:flex-row justify-center gap-6 w-full max-w-4xl mx-auto">
      <div class="flex flex-col gap-4 w-full md:w-1/2">
        <h3 class="text-left font-bold text-sm">Informe</h3>
        <input id="asunto" class="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Asunto">
        <textarea id="descripcion" class="w-full h-40 px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Descripción"></textarea>
      </div>

      <div class="hidden md:block w-px bg-gray-600 mx-2"></div>

      <div class="flex flex-col gap-4 w-full md:w-1/2">
      <h3 class="text-left font-bold text-sm">Vehículo</h3>
        <select id="vehiculo-brand" class="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="" disabled selected>Seleccione una marca</option>
          ${uniqueBrands
            .map((brand) => `<option value="${brand}">${brand}</option>`)
            .join("")}
        </select>
        <select id="vehiculo-model" class="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" disabled>
          <option value="" disabled selected>Seleccione un modelo</option>
        </select>
        <select id="vehiculo-year" class="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" disabled>
          <option value="" disabled selected>Seleccione un año</option>
        </select>

        <div class="mt-4">
          <h3 class="text-left font-bold mb-4 text-sm">Prioridad:</h3>
          <div class="flex gap-4 items-center">
            <div class="flex items-center">
              <input type="radio" id="priority-high" name="priority" value="HIGH" class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500">
              <label for="priority-high" class="ml-2 text-sm font-medium text-gray-300">Alta</label>
            </div>
            <div class="flex items-center">
              <input type="radio" id="priority-medium" name="priority" value="MEDIUM" class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500">
              <label for="priority-medium" class="ml-2 text-sm font-medium text-gray-300">Media</label>
            </div>
            <div class="flex items-center">
              <input type="radio" id="priority-low" name="priority" value="LOW" class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500">
              <label for="priority-low" class="ml-2 text-sm font-medium text-gray-300">Baja</label>
            </div>
          </div>
        </div>
        
        <h3 class="text-left font-bold text-sm">Responsable</h3>
        <select id="operador" class="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="" disabled selected>Seleccione un operador</option>
          ${opcionesOperadores}
        </select>
      </div>
    </div>
        `,
      focusConfirm: false,
      customClass: {
        popup: "bg-gray-800 text-white w-full max-w-4xl p-6 rounded-lg",
        title: "text-2xl font-bold mb-4",
        confirmButton:
          "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",
      },
      didOpen: () => {
        const brandSelect = document.getElementById(
          "vehiculo-brand"
        ) as HTMLSelectElement;
        const modelSelect = document.getElementById(
          "vehiculo-model"
        ) as HTMLSelectElement;
        const yearSelect = document.getElementById(
          "vehiculo-year"
        ) as HTMLSelectElement;

        brandSelect.addEventListener("change", (e) => {
          selectedBrand = (e.target as HTMLSelectElement).value;
          modelSelect.innerHTML =
            '<option value="" disabled selected>Seleccione un modelo</option>';
          yearSelect.innerHTML =
            '<option value="" disabled selected>Seleccione un año</option>';

          if (selectedBrand) {
            const models: string[] = Array.from(
              brandModelMap.get(selectedBrand).keys()
            );
            models.forEach((model) => {
              const option = document.createElement("option");
              option.value = model;
              option.textContent = model;
              modelSelect.appendChild(option);
            });
            modelSelect.disabled = false;
            yearSelect.disabled = true;
          } else {
            modelSelect.disabled = true;
            yearSelect.disabled = true;
          }
        });

        modelSelect.addEventListener("change", (e) => {
          selectedModel = (e.target as HTMLSelectElement).value;
          yearSelect.innerHTML =
            '<option value="" disabled selected>Seleccione un año</option>';

          if (selectedModel) {
            const years: number[] = Array.from(
              brandModelMap.get(selectedBrand).get(selectedModel)
            );
            years.forEach((year) => {
              const option = document.createElement("option");
              option.value = year.toString();
              option.textContent = year.toString();
              yearSelect.appendChild(option);
            });
            yearSelect.disabled = false;
          } else {
            yearSelect.disabled = true;
          }
        });
      },
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
        <div className="mb-6 flex flex-col md:flex-row md:justify-between">
          <h1 className="md:text-4xl text-3xl font-bold text-blue-400 mb-4 sm:mb-4">
            Gestión de controles
          </h1>
          <button
            onClick={exportControlesToExcel}
            className="md:px-4 bg-green-500 hover:bg-green-600 rounded-md font-bold"
          >
            Descargar XML
          </button>
        </div>
        <div className="hidden md:block overflow-x-auto">
          <KanbanBoard
            initialTasks={controlTaskCards}
            setTasks={setControlTaskCards}
            setStatusTask={handleSetStatus}
            addControlTask={handleCreatePredictiveControl}
          />
        </div>
        <div className="md:hidden grid grid-cols-1 gap-6 mt-6">
          <TaskList
            tasks={controlTaskCards}
            addControlTask={handleCreatePredictiveControl}
            setStatusTask={handleSetStatus}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Controles;
