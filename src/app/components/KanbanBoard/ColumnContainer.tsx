import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useMemo } from "react";
import TaskCard from "./TaskCard";

interface Control {
  asunto: string;
  tipo: string;
  vehiculo: string;
  fecha: string;
  responsable: string;
  prioridad: string;
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
}

const ColumnContainer: React.FC<ColumnContainerProps> = ({
  column,
  tasks,
}) => {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-700 flex flex-col w-[350px] h-[500px] max-h-[500px] gap-4"
    >
      <div
        className="flex items-center justify-between py-4 px-4 bg-blue-500"
      >
        <div className="flex gap-2">
          0
          <div className="text-md font-bold">
            {column.title}
          </div>
        </div>
      </div>
      <div className="flex flex-grow flex-col gap-4 overflow-x-hidden overflow-y-auto px-4 py-4">
        <SortableContext items={tasksIds}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task}/>
        ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default ColumnContainer;
