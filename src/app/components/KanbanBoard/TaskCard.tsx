import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IoIosArrowUp, IoIosArrowDown, IoIosRemove } from "react-icons/io";
import { FiTool, FiAlertCircle, FiTruck } from "react-icons/fi";
import { IoPulse } from "react-icons/io5";
import { FaRegCalendarAlt, FaUserCircle } from "react-icons/fa";


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
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const control: Control = task.content;

  const priorityLogo = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return <IoIosArrowUp className="w-8 h-8 text-red-500"/>
      case "MEDIUM":
        return <IoIosRemove className="w-8 h-8 text-yellow-500"/>
      default:
        return <IoIosArrowDown className="w-8 h-8 text-blue-500"/>
    }
  };

  const typeLogo = (type: string) => {
    const typeStyles = "flex inline-flex items-center gap-2   px-4 py-0.5 text-gray-200 font-semibold rounded-full mb-2 "
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
  }

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
      {...listeners}
      className="bg-gray-900 p-4 flex flex-col text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-blue-500 cursor-pointer justify-between relative gap-4"
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
        <FaUserCircle className="w-5 h-5"/>
      </div>
    </div>
  );
};

export default TaskCard;
