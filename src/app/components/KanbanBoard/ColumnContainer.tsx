import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Dispatch, SetStateAction, useMemo } from "react";
import TaskCard from "./TaskCard";

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
  products: Item[];
}

// Esto es para la query.
interface Item {
  product: Product;
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  category: string;
  quantity: number;
  measurement: string;
  price: number;
  preferenceProviderId: string;
  minStock: number;
  autoPurchase: string;
}

interface Column {
  id: string | number;
  title: string;
}

interface Task {
  id: string | number;
  columnId: string | number;
  content: Control;
}

interface ColumnContainerProps {
  column: Column;
  tasks: Task[];
  createTask?: () => void;
  assignOperator: (control_id: string, operator_id: string) => Promise<void>;
  setOnSetOperator: Dispatch<SetStateAction<boolean>>;
}

const ColumnContainer: React.FC<ColumnContainerProps> = ({
  column,
  tasks,
  createTask,
  assignOperator,
  setOnSetOperator,
}) => {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const { setNodeRef } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-800 min-h-screen flex flex-col w-full gap-4"
    >
      <div className="flex items-center justify-between py-4 px-4 bg-blue-700">
        <div className="flex gap-2 justify-between w-full">
          <div className="text-md font-bold">{column.title}</div>
          <div className="rounded-full bg-white px-2 text-blue-700 font-bold">
            {tasks.length}
          </div>
        </div>
      </div>
      <div className="flex flex-grow flex-col gap-4 overflow-x-hidden overflow-y-auto px-4 py-4">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} assignOperator={assignOperator} setOnSetOperator={setOnSetOperator}/>
          ))}
        </SortableContext>
      </div>
      {createTask && (
        <button className="w-full p-4 text-left" onClick={createTask}>+ Crear control</button>
      )}
    </div>
  );
};

export default ColumnContainer;
