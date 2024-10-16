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


  return (
    <div className="grid grid-col-1 gap-4 bg-gray-800 p-2 rounded-md">
      {tasks.map((task) => <TaskCard key={task.id} task={task} />)}
    </div>
  );
}

export default TaskList;