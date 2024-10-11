import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import TaskCard from "./TaskCard";

interface Column {
  id: string | number;
  title: string;
}

interface Task {
  id: string | number;
  columnId: string | number;
  content: string;
}


interface ColumnContainerProps {
  column: Column;
  tasks: Task[];
}

const ColumnContainer: React.FC<ColumnContainerProps> = ({
  column,
  tasks,
}) => {
  const [editMode, setEditMode] = useState(false);
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    isDragging,
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
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
        className="bg-gray-700 flex flex-col w-[350px] h-[500px] max-h-[500px] gap-4 border-blue-500 opacity-40 border-2"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-700 flex flex-col w-[350px] h-[500px] max-h-[500px] gap-4"
    >
      <div
        {...attributes}
        {...listeners}
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
