import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IoIosArrowUp,
  IoIosArrowDown,
  IoIosRemove,
} from "react-icons/io";
import {
  FiTool,
  FiAlertCircle,
  FiTruck,
  FiX,
} from "react-icons/fi";
import { IoPulse } from "react-icons/io5";
import {
  FaRegCalendarAlt,
  FaUserCircle,
  FaRegEye,
  FaTools,
  FaBox,
  FaRegGrinAlt,
} from "react-icons/fa";
import { TbArrowsExchange } from "react-icons/tb";
import { Dispatch, SetStateAction, useState } from "react";
import { useUser } from "@/app/context/UserContext";

// Importamos dynamic y MapVehiculo
import dynamic from "next/dynamic";
import { Button, InputAdornment, MenuItem, TextField } from "@mui/material";

const MapVehiculo = dynamic(
  () => import("@/app/components/Maps/MapVehiculo"),
  {
    ssr: false,
  }
);

//Lista de categorias de repuestos en productos
const categorias = ['Aceite', 'Aire Acondicionado', 'Amortiguadores', 'Baterías', 'Carrocería', 'Correas',
  'Cristales', 'Dirección', 'Escape', 'Espejos', 'Filtros', 'Frenos', 'Líquido de frenos', 'Lubricantes', 'Luces',
  'Motores', 'Motor', 'Neumáticos ', 'Paragolpes', 'Radiadores', 'Sistemas eléctricos', 'Sensores',
  'Suspensión', 'Transmisión',
];

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
  setStatusTask?: (
    control_id: string,
    new_status: string
  ) => void;
  assignOperator?: (
    control_id: string,
    operator_id: string
  ) => Promise<void>;
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
  const [showModal, setShowModal] = useState(false);
  const hasOperator = control.operator;
  const { users } = useUser();
  const usuarios = users;
  const operadores = usuarios
    .filter((usuario) => usuario.roles.includes("OPERATOR"))
    .map((usuario) => ({
      id: usuario.id,
      full_name: usuario.full_name,
    }));

  const priorityLogo = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return <IoIosArrowUp className="w-8 h-8 text-red-500" />;
      case "MEDIUM":
        return (
          <IoIosRemove className="w-8 h-8 text-yellow-500" />
        );
      default:
        return (
          <IoIosArrowDown className="w-8 h-8 text-blue-500" />
        );
    }
  };

  const typeLogo = (type: string) => {
    const typeStyles =
      "flex inline-flex items-center gap-2 px-4 py-0.5 text-gray-200 font-semibold rounded-full mb-2 ";
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
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (isMobile) {
    return (
      <>
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
                  <TbArrowsExchange
                    className={`w-6 h-6 ${!hasOperator
                      ? "text-gray-500"
                      : "text-gray-300 hover:text-gray-100"
                      }`}
                  />
                </button>
                {showDropdown && (
                  <div className="absolute z-20 top-8 right-0 bg-gray-800 shadow-lg rounded-md p-2">
                    <button
                      onClick={() => handleStatusChange("TODO")}
                      className={`block text-left w-full px-4 py-2 text-sm ${control.status === "TODO"
                        ? "cursor-not-allowed text-gray-700"
                        : "hover:bg-gray-700 text-white"
                        }`}
                      disabled={control.status === "TODO"}
                    >
                      Pendientes
                    </button>
                    <button
                      onClick={() => handleStatusChange("DOING")}
                      className={`block text-left w-full px-4 py-2 text-sm ${control.status === "DOING"
                        ? "cursor-not-allowed text-gray-700"
                        : "hover:bg-gray-700 text-white"
                        }`}
                      disabled={control.status === "DOING"}
                    >
                      En proceso
                    </button>
                    <button
                      onClick={() => handleStatusChange("DONE")}
                      className={`block text-left w-full px-4 py-2 text-sm ${control.status === "DONE"
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
            {/* Muestra el mapa si el tipo es CORRECTIVE */}
            {/* {control.type === "CORRECTIVE" && (
              <div className="mt-4">
                <MapVehiculo
                  coordinates={control.vehicle.coordinates}
                />
              </div>
            )} */}
          </div>
          <div className="flex justify-between items-center border-t pt-3 border-gray-700">
            <div className="flex items-center gap-2 text-gray-300">
              <FaRegCalendarAlt />
              <p>{control.date_created.slice(0, 10)}</p>
            </div>
            <FaUserCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Modal para versión móvil */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-900 text-white p-6 rounded-lg max-w-3xl w-full relative max-h-screen overflow-y-auto">
              <button
                className="absolute top-2 right-2 text-gray-300 hover:text-gray-100"
                onClick={closeModal}
              >
                <FiX className="w-6 h-6" />
              </button>
              <div className="flex flex-col gap-6 w-full">
                <div className="flex gap-2 md:gap-5 text-xs justify-start align-start">
                  {typeLogo(control.type)}
                  /
                  <p>
                    ({control.vehicle.id}) - {control.vehicle.brand}{" "}
                    {control.vehicle.model} {control.vehicle.year}
                  </p>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                  <div className="flex flex-col gap-2 items-start">
                    <h3 className="text-3xl mb-6 font-bold text-left">
                      {control.subject}
                    </h3>
                    <h4 className="text-xl font-semibold text-left">
                      Descripción
                    </h4>
                    <p className="text-base text-left">
                      {control.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 items-start">
                    <h4 className="text-xl font-semibold">
                      Productos para el caso
                    </h4>
                  </div>

                  <div className="flex flex-col gap-2 items-start md:px-4 md:border-l-2 border-gray-700">
                    <h4 className="text-xl font-semibold">Detalles</h4>
                    {hasOperator ? (
                      <p className="text-left">
                        Persona asignada:{" "}
                        {control.operator.full_name}
                      </p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="operator-select"
                          className="text-left"
                        >
                          Asignar operador:
                        </label>
                        <select
                          id="operator-select"
                          className="bg-gray-800 text-white rounded-md p-2"
                          onChange={async (e) => {
                            const selectedOperatorId = e.target.value;
                            if (
                              selectedOperatorId &&
                              assignOperator
                            ) {
                              try {
                                await assignOperator(
                                  control.id,
                                  selectedOperatorId
                                );
                                if (setOnSetOperator) {
                                  setOnSetOperator(true);
                                }
                                closeModal();
                              } catch (error) {
                                console.error(error);
                                // Mostrar mensaje de error
                              }
                            }
                          }}
                        >
                          <option value="">
                            Seleccionar operador
                          </option>
                          {operadores.map((operador) => (
                            <option
                              key={operador.id}
                              value={operador.id}
                            >
                              {operador.full_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div className="flex gap-2 justify-start">
                      <p className="text-left">Estado:</p>
                      <p className="text-left">
                        {control.status === "TODO"
                          ? "Pendiente"
                          : control.status === "DOING"
                            ? "En proceso"
                            : "Hecho"}
                      </p>
                    </div>
                    <p className="text-left">
                      Prioridad:{" "}
                      {control.priority === "HIGH"
                        ? "Alta"
                        : control.priority === "MEDIUM"
                          ? "Media"
                          : "Baja"}
                    </p>
                  </div>
                </div>

                {/* Muestra el mapa si el tipo es CORRECTIVE */}
                {control.type === "CORRECTIVE" && (
                  <div className="mt-4">
                    <h4 className="text-xl font-semibold">
                      Ubicación
                    </h4>
                    <div className="h-64 rounded-lg shadow-lg flex items-center justify-center">
                      <MapVehiculo
                        coordinates={control.vehicle.coordinates}
                      />
                    </div>
                  </div>
                )}

                {/* Botón de cerrar en el contenido */}
                <button
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  onClick={closeModal}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </>
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
    <>
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
          {/* Muestra el mapa si el tipo es CORRECTIVE */}
          {control.type === "CORRECTIVE" && (
            <div className="mt-4">
              <MapVehiculo
                coordinates={control.vehicle.coordinates}
              />
            </div>
          )}
        </div>
        <div className="flex justify-between items-center border-t pt-3 border-gray-700">
          <div className="flex items-center gap-2 text-gray-300">
            <FaRegCalendarAlt />
            <p>{control.date_created.slice(0, 10)}</p>
          </div>
          {hasOperator ? (
            <FaUserCircle className="w-5 h-5" />
          ) : (
            ""
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 text-white p-6 rounded-lg max-w-3xl w-full relative max-h-screen overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-300 hover:text-gray-100"
              onClick={closeModal}
            >
              <FiX className="w-6 h-6" />
            </button>
            <div className="flex flex-col gap-6 w-full">
              <div className="flex gap-2 md:gap-5 text-xs justify-start align-start">
                {typeLogo(control.type)}
                /
                <p>
                  ({control.vehicle.id}) - {control.vehicle.brand}{" "}
                  {control.vehicle.model} {control.vehicle.year}
                </p>
              </div>

              <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                <div className="flex flex-col gap-2 items-start">
                  <h3 className="text-3xl mb-6 font-bold text-left">
                    {control.subject}
                  </h3>
                  <h4 className="text-xl font-semibold text-left">
                    Descripción
                  </h4>
                  <p className="text-base text-left">
                    {control.description}
                  </p>
                </div>

                <div className="flex flex-col gap-2 items-start md:px-4 md:border-l-2 border-gray-700">
                  <h4 className="text-xl font-semibold">Detalles</h4>
                  {hasOperator ? (
                    <p className="text-left">
                      Persona asignada:{" "}
                      {control.operator.full_name}
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="operator-select"
                        className="text-left"
                      >
                        Asignar operador:
                      </label>
                      <select
                        id="operator-select"
                        className="bg-gray-800 text-white rounded-md p-2"
                        onChange={async (e) => {
                          const selectedOperatorId = e.target.value;
                          if (
                            selectedOperatorId &&
                            assignOperator
                          ) {
                            try {
                              await assignOperator(
                                control.id,
                                selectedOperatorId
                              );
                              if (setOnSetOperator) {
                                setOnSetOperator(true);
                              }
                              closeModal();
                            } catch (error) {
                              console.error(error);
                              // Mostrar mensaje de error
                            }
                          }
                        }}
                      >
                        <option value="">
                          Seleccionar operador
                        </option>
                        {operadores.map((operador) => (
                          <option
                            key={operador.id}
                            value={operador.id}
                          >
                            {operador.full_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="flex gap-2 justify-start">
                    <p className="text-left">Estado:</p>
                    <p className="text-left">
                      {control.status === "TODO"
                        ? "Pendiente"
                        : control.status === "DOING"
                          ? "En proceso"
                          : "Hecho"}
                    </p>
                  </div>
                  <p className="text-left">
                    Prioridad:{" "}
                    {control.priority === "HIGH"
                      ? "Alta"
                      : control.priority === "MEDIUM"
                        ? "Media"
                        : "Baja"}
                  </p>
                </div>
              </div>

              {/** Se muestra este menu para seleccionar productos solo en los controles predictivos y correctivos de segunda y tercer columna */}
              {(control.type === "CORRECTIVE" || control.type === "PREVENTIVE") &&
                (control.status === "DOING" || control.status === "DONE")
                && (
                  <div className="flex flex-col gap-2 items-start w-full">
                    <h4 className="text-xl font-semibold">
                      Productos para el caso:
                      {control.status === "DONE" && (
                        <>
                        <p>!Lista de productos!</p>
                        </>
                      )}
                    </h4>
                    <div className="flex flex-col md:flex-row gap-6 mb-6 w-full">
                      {/* Solo se muestra la lista para agregar productos en los controles en proceso */}
                      {control.status === "DOING" && (
                        <>
                          <TextField
                            select
                            label="Seleccionar productos"
                            // value={newProduct}
                            // onChange={handleProductSelect}
                            className="bg-gray-800 text-white rounded-lg border border-gray-600 w-full mt-2"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <FaBox className="text-gray-300" />
                                </InputAdornment>
                              ),
                            }}
                            InputLabelProps={{ style: { color: "#e2e2e2" } }}
                            SelectProps={{ MenuProps: { PaperProps: { style: { maxHeight: 200, width: 400 } } } }}
                          >
                            {categorias.map((categoria, index) => (
                              <MenuItem key={index} value={categoria}>
                                {categoria}
                              </MenuItem>
                            ))}
                          </TextField>

                          <TextField
                            label="Cantidad"
                            // value={quantity}
                            // onChange={handleQuantityChange}
                            className="bg-gray-800 text-white rounded-lg border border-gray-600 w-full mt-2"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <FaRegGrinAlt className="text-gray-300" />
                                </InputAdornment>
                              ),
                            }}
                            InputLabelProps={{ style: { color: "#e2e2e2" } }}
                            SelectProps={{ MenuProps: { PaperProps: { style: { maxHeight: 200, width: 400 } } } }}
                          />

                          <Button
                            // onClick={handleAddProduct}
                            variant="contained"
                            color="primary"
                            className="mt-2"
                          >
                            Agregar a la lista
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )}

              {/* Muestra el mapa si el tipo es CORRECTIVE */}
              {control.type === "CORRECTIVE" && (
                <div className="mt-4">
                  <h4 className="text-xl font-semibold">
                    Ubicación
                  </h4>
                  <div className="h-64 rounded-lg shadow-lg flex items-center justify-center">
                    <MapVehiculo
                      coordinates={control.vehicle.coordinates}
                    />
                  </div>
                </div>
              )}

              {/* Botón de cerrar en el contenido */}
              <button
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                onClick={closeModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard;