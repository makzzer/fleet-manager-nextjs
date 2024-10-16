import Swal from "sweetalert2";
import { useVehiculo } from "../context/VehiculoContext";
import { useUser } from "../context/UserContext";

interface POSTPredictiveControl {
  subject: string;
  description: string;
  brand: string;
  model: string;
  year: number;
  priority: string;
  operator_id: string;
}

const useTaskCreation = (
  addControlTask: (newControl: POSTPredictiveControl) => void
) => {
  const { vehiculos } = useVehiculo();
  const { users } = useUser();

  const coches = vehiculos;
  const usuarios = users;

  const opcionesMarcasVehiculos = coches.map((coches) => `<option value="${coches.brand}">${coches.brand}</option>`);
  const opcionesModelosVehiculos = coches.map((coches) => `<option value="${coches.model}">${coches.model}</option>`);
  const opcionesAniosVehiculos = coches.map((coches) => `<option value="${coches.year}">${coches.year}</option>`);

  const opcionesOperadores = usuarios
    .filter((usuario) => usuario.roles.includes("OPERATOR"))
    .map(
      (usuario) =>
        `<option value="${usuario.id}">${usuario.full_name}</option>`
    )
    .join("");

  const createTask = async () => {
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
            brand: (document.getElementById("vehiculo-brand") as HTMLInputElement).value,
            model: (document.getElementById("vehiculo-model") as HTMLInputElement).value,
            year: parseInt((document.getElementById("vehiculo-year") as HTMLInputElement).value),
            priority: (document.querySelector(
              'input[name="priority"]:checked'
            ) as HTMLInputElement).value,
            operator_id: (
              document.getElementById("operador") as HTMLInputElement
            ).value,
          };
        },
      });

      if (formValues) {
        const newPredictiveControl: POSTPredictiveControl = {
          ...formValues,
        };
        console.log(newPredictiveControl);
        addControlTask(newPredictiveControl);

        Swal.fire("¡Control correctivo creado!", "", "success");
      }
    }

    return { createTask };
};

export default useTaskCreation;
