import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IoIosArrowUp, IoIosArrowDown, IoIosRemove } from "react-icons/io";
import { FiTool, FiAlertCircle, FiTruck } from "react-icons/fi";
import { IoPulse } from "react-icons/io5";
import { FaRegCalendarAlt, FaUserCircle, FaRegEye } from "react-icons/fa";
import { TbArrowsExchange } from "react-icons/tb";
import { Dispatch, SetStateAction, useState } from "react";
import Swal from "sweetalert2";
import { useUser } from "@/app/context/UserContext";

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

interface TaskCardProps {
  task: Task;
  isMobile?: boolean;
  setStatusTask?: (control_id: string, new_status: string) => void;
  assignOperator?: (control_id: string, operator_id: string) => Promise<void>;
  setOnSetOperator?: Dispatch<SetStateAction<boolean>>;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isMobile,
  setStatusTask,
  assignOperator,
  setOnSetOperator,
}) => {
  const control: Control = task.content;
  const [showDropdown, setShowDropdown] = useState(false);
  const hasOperator = control.operator;
  const { users } = useUser();
  const usuarios = users;
  const operadores = usuarios
    .filter((usuario) => usuario.roles.includes("OPERATOR"))
    .map(
      (usuario) => `<option value="${usuario.id}">${usuario.full_name}</option>`
    )
    .join("");

  const priorityLogo = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return <IoIosArrowUp className="w-8 h-8 text-red-500" />;
      case "MEDIUM":
        return <IoIosRemove className="w-8 h-8 text-yellow-500" />;
      default:
        return <IoIosArrowDown className="w-8 h-8 text-blue-500" />;
    }
  };

  const typeLogo = (type: string) => {
    const typeStyles =
      "flex inline-flex items-center gap-2   px-4 py-0.5 text-gray-200 font-semibold rounded-full mb-2 ";
    switch (type) {
      case "CORRECTIVE":
        return (
          <div className={`${typeStyles} bg-red-500`}>
            <FiTool />
            <p>Correctivo</p>
          </div>
        );
      case "PREVENTIVE":
        return (
          <div className={`${typeStyles} bg-green-500`}>
            <FiAlertCircle />
            <p>Preventivo</p>
          </div>
        );
      default:
        return (
          <div className={`${typeStyles} bg-blue-500`}>
            <IoPulse />
            <p>Predictivo</p>
          </div>
        );
    }
  };

  const {
    isDragging,
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleStatusChange = (newStatus: string) => {
    setShowDropdown(false);

    if (setStatusTask) {
      setStatusTask(control.id, newStatus);
    }
  };

  const handleViewDetails = (control: Control) => {
    const tipoControlEsp =
      control.type === "CORRECTIVE"
        ? `<div class="bg-red-500/50 px-2 rounded-md">Correctivo</div>`
        : control.type === "PREVENTIVE"
        ? `<div class="bg-green-500/50 px-2 rounded-md">Preventivo</div>`
        : `<div class="bg-blue-500/50 px-2 rounded-md">Predictivo</div>`;

    const estadoControlEsp =
      control.status === "TODO"
        ? `<div class="text-gray-400">Pendiente</div>`
        : control.status === "DOING"
        ? `<div class="text-blue-500">En proceso</div>`
        : `<div class="text-emerald-500">Hecho</div>`;

    const prioridadControlEsp =
      control.priority === "HIGH"
        ? "Alta"
        : control.priority === "MEDIUM"
        ? "Media"
        : "Baja";

    Swal.fire({
      html: `
          <div class="flex flex-col gap-6 w-full">

            <div class="flex gap-2 md:gap-5 text-xs justify-start align-start">
              ${tipoControlEsp}
              /
              <p>(${control.vehicle.id}) - ${control.vehicle.brand} ${
        control.vehicle.model
      } ${control.vehicle.year}</p>
            </div>

          <div class="flex flex-col gap-4 md:flex-row md:justify-between">
            <div class="flex flex-col gap-2 items-start">
              <h3 class="text-3xl mb-6 font-bold text-left">${
                control.subject
              }</h3>
              <h4 class="text-xl font-semibold text-left">Descripción</h4>
              <p class="text-base text-left">${control.description}</p>
            </div>

            <div class="flex flex-col gap-2 items-start md:px-4 md:border-l-2 border-gray-700">
              <h4 class="text-xl font-semibold">Detalles</h4>
              ${
                hasOperator
                  ? `<p class="text-left">Persona asignada: ${control.operator.full_name}</p>`
                  : `<div class="flex flex-col gap-2">
                      <label for="operator-select" class="text-left">Asignar operador:</label>
                      <select id="operator-select" class="bg-gray-800 text-white rounded-md p-2">
                        <option value="">Seleccionar operador</option>
                        ${operadores}
                      </select>
                    </div>`
              }
              <div class="flex gap-2 justify-start">
              <p class="text-left">Estado:</p>
              ${estadoControlEsp}
              </div>
              <p class="text-left">Prioridad: ${prioridadControlEsp}</p>
            </div>
          </div>

          </div>
          `,
      confirmButtonText: "Cerrar",
      customClass: {
        popup: "bg-gray-900 text-white w-4/5",
      },
      didOpen: async () => {
        const select = document.getElementById('operator-select') as HTMLSelectElement;
        if (select) {
          select.addEventListener('change', async (e) => {
            const selectedOperatorId = (e.target as HTMLSelectElement).value;
            if (selectedOperatorId && assignOperator) {
              try {
                await assignOperator(control.id, selectedOperatorId);
                if(setOnSetOperator){
                  setOnSetOperator(true);
                }
                Swal.close();
              } catch(error) {
                console.error(error);
                Swal.showValidationMessage('Error al asignar un operador')
              }
            }
          });
        }
      },
    });
  };

  if (isMobile) {
    return (
      <div className="bg-gray-900 p-4 flex flex-col text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-blue-500 justify-between relative gap-4">
        <div className="flex justify-between items-center">
          <p className="text-md font-bold">{control.subject}</p>
          {priorityLogo(control.priority)}
        </div>
        <div>
          <div className="flex justify-between items-center">
            {typeLogo(control.type)}
            <button onClick={() => handleViewDetails(control)}>
              <FaRegEye className="w-6 h-6 text-gray-300 hover:text-gray-100" />
            </button>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-300">
              <FiTruck />
              <p>{control.vehicle.id}</p>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative z-10"
                disabled={!hasOperator}
              >
                <TbArrowsExchange className={`w-6 h-6 ${!hasOperator ? "text-gray-500" : "text-gray-300 hover:text-gray-100"}`} />
              </button>
              {showDropdown && (
                <div className="absolute z-20 top-8 right-0 bg-gray-800 shadow-lg rounded-md p-2">
                  <button
                    onClick={() => handleStatusChange("TODO")}
                    className={`block text-left w-full px-4 py-2 text-sm ${
                      control.status === "TODO"
                        ? "cursor-not-allowed text-gray-700"
                        : "hover:bg-gray-700 text-white"
                    }`}
                    disabled={control.status === "TODO"}
                  >
                    Pendientes
                  </button>
                  <button
                    onClick={() => handleStatusChange("DOING")}
                    className={`block text-left w-full px-4 py-2 text-sm ${
                      control.status === "DOING"
                        ? "cursor-not-allowed text-gray-700"
                        : "hover:bg-gray-700 text-white"
                    }`}
                    disabled={control.status === "DOING"}
                  >
                    En proceso
                  </button>
                  <button
                    onClick={() => handleStatusChange("DONE")}
                    className={`block text-left w-full px-4 py-2 text-sm ${
                      control.status === "DONE"
                        ? "cursor-not-allowed text-gray-700"
                        : "hover:bg-gray-700 text-white"
                    }`}
                    disabled={control.status === "DONE"}
                  >
                    Terminados
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center border-t pt-3 border-gray-700">
          <div className="flex items-center gap-2 text-gray-300">
            <FaRegCalendarAlt />
            <p>{control.date_created.slice(0, 10)}</p>
          </div>
          <FaUserCircle className="w-5 h-5" />
        </div>
      </div>
    );
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-gray-900 p-4 h-[200px] min-h-[200px] items-center flex text-left rounded-xl border-2 ring-blue-500 cursor-pointer justify-between relative"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(hasOperator ? listeners : {})}
      className="bg-gray-900 p-4 flex flex-col text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-blue-500 cursor-pointer justify-between relative gap-4"
      onClick={() => handleViewDetails(control)}
    >
      <div className="flex justify-between items-center">
        <p className="text-md font-bold">{control.subject}</p>
        {priorityLogo(control.priority)}
      </div>
      <div>
        {typeLogo(control.type)}
        <div className="flex items-center gap-2 text-gray-300">
          <FiTruck />
          <p>{control.vehicle.id}</p>
        </div>
      </div>
      <div className="flex justify-between items-center border-t pt-3 border-gray-700">
        <div className="flex items-center gap-2 text-gray-300">
          <FaRegCalendarAlt />
          <p>{control.date_created.slice(0, 10)}</p>
        </div>
        {hasOperator ? <FaUserCircle className="w-5 h-5" /> : ""}
      </div>
    </div>
  );
};

export default TaskCard;
