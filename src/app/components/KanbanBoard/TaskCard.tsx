import { useSortable } from "@dnd-kit/sortable";
import { useState } from "react";
import { CSS } from "@dnd-kit/utilities"

interface Task {
  id: string | number;
  columnId: string | number;
  content: string;
}

interface TaskCardProps {
  task: Task;
  deleteTask: (id: string | number) => void;
  updateTask: (id: string | number, content: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, deleteTask, updateTask }) => {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

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
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  }

  if(isDragging){
    return (
      <div ref={setNodeRef} style={style} className="opacity-30 bg-gray-900 p-4 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 ring-blue-500 cursor-pointer justify-between relative">
      </div>
    );
  }

  if (editMode) {
    return (
      <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-900 p-4 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-blue-500 cursor-pointer justify-between relative">
        <textarea
          className="h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
          value={task.content}
          autoFocus
          placeholder="Escribí el contenido de la task acá"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "enter" && e.shiftKey) toggleEditMode();
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        >
        </textarea>
      </div>
    );
  }

  return (
    <div 
    ref={setNodeRef}
    style={style}
    {...attributes}
    {...listeners}
    onClick={toggleEditMode}
    className="bg-gray-900 p-4 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-blue-500 cursor-pointer justify-between relative"
    onMouseEnter={() => setMouseIsOver(true)}
    onMouseLeave={() => setMouseIsOver(false)}>
      {task.content}
      {mouseIsOver && (<button onClick={() => deleteTask(task.id)}>Delete</button>
  )}
    </div>
  );
};

export default TaskCard;
