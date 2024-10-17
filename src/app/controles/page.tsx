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
  const { controls, fetchControls, setControlStatus, createPredictiveControl, exportControlesToExcel } =
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

  const handleSetStatus = async (control_id: string, new_status: string) => {
    await setControlStatus(control_id, new_status);
    await fetchControls();
  }

  const handleCreatePredictiveControl = async () => {
    const coches = vehiculos;
    const usuarios = users;

    const brandModelMap = new Map()
    coches.forEach((coche) => {
      if (!brandModelMap.has(coche.brand)) {
        brandModelMap.set(coche.brand, new Map())
      }
      if (!brandModelMap.get(coche.brand).has(coche.model)) {
        brandModelMap.get(coche.brand).set(coche.model, new Set())
      }
      brandModelMap.get(coche.brand).get(coche.model).add(coche.year)
    })

    // Convert the map to an array of unique brands
    const uniqueBrands = Array.from(brandModelMap.keys())

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
          ${uniqueBrands.map(brand => `<option value="${brand}">${brand}</option>`).join('')}
        </select>
        <select id="vehiculo-model" class="swal2-select" disabled>
          <option value="" disabled selected>Seleccione un modelo</option>
        </select>
        <select id="vehiculo-year" class="swal2-select" disabled>
          <option value="" disabled selected>Seleccione un año</option>
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
      didOpen: () => {
        const brandSelect = document.getElementById('vehiculo-brand') as HTMLSelectElement
        const modelSelect = document.getElementById('vehiculo-model') as HTMLSelectElement
        const yearSelect = document.getElementById('vehiculo-year') as HTMLSelectElement

        brandSelect.addEventListener('change', (e) => {
          selectedBrand = (e.target as HTMLSelectElement).value
          modelSelect.innerHTML = '<option value="" disabled selected>Seleccione un modelo</option>'
          yearSelect.innerHTML = '<option value="" disabled selected>Seleccione un año</option>'
          
          if (selectedBrand) {
            const models: string[] = Array.from(brandModelMap.get(selectedBrand).keys())
            models.forEach(model => {
              const option = document.createElement('option')
              option.value = model
              option.textContent = model
              modelSelect.appendChild(option)
            })
            modelSelect.disabled = false
            yearSelect.disabled = true
          } else {
            modelSelect.disabled = true
            yearSelect.disabled = true
          }
        })

        modelSelect.addEventListener('change', (e) => {
          selectedModel = (e.target as HTMLSelectElement).value
          yearSelect.innerHTML = '<option value="" disabled selected>Seleccione un año</option>'
          
          if (selectedModel) {
            const years: number[] = Array.from(brandModelMap.get(selectedBrand).get(selectedModel))
            years.forEach(year => {
              const option = document.createElement('option')
              option.value = year.toString()
              option.textContent = year.toString()
              yearSelect.appendChild(option)
            })
            yearSelect.disabled = false
          } else {
            yearSelect.disabled = true
          }
        })
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
           className="md:px-4 bg-green-500 hover:bg-green-600 rounded-md font-bold">
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
