import { useEffect, useState } from "react";
import TaskCard from "./KanbanBoard/TaskCard";

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

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const [internalListTasks, setInternalListTasks] = useState(tasks);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    if (activeFilter) {
      const filteredTasks = tasks.filter(task => task.columnId === activeFilter);
      setInternalListTasks(filteredTasks);
    } else {
      setInternalListTasks(tasks);
    }
  }, [activeFilter, tasks]);

  const handleFilterChange = (filter: string | null) => {
    if (filter === activeFilter) {
      setActiveFilter(null);
    } else {
      setActiveFilter(filter);
    }
  };

  return (
    <>
      <div className="flex gap-2 text-xs mb-4">
        <button
          className={`px-4 py-1 rounded-full ${
            activeFilter === "TODO"
              ? "bg-blue-500/20 text-blue-500"
              : "bg-gray-700/50 text-white/80"
          }`}
          onClick={() => handleFilterChange("TODO")}
        >
          Pendientes
        </button>
        <button
          className={`px-4 py-1 rounded-full ${
            activeFilter === "DOING"
              ? "bg-blue-500/20 text-blue-500"
              : "bg-gray-700/50 text-white/80"
          }`}
          onClick={() => handleFilterChange("DOING")}
        >
          En proceso
        </button>
        <button
          className={`px-4 py-1 rounded-full ${
            activeFilter === "DONE"
              ? "bg-blue-500/20 text-blue-500"
              : "bg-gray-700/50 text-white/80"
          }`}
          onClick={() => handleFilterChange("DONE")}
        >
          Terminados
        </button>
      </div>
      <div className="grid grid-col-1 gap-4 bg-gray-800 p-2 rounded-md">
        {internalListTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </>
  );
};

export default TaskList;
