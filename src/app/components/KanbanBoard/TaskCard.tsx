import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"

interface Control {
  asunto: string;
  tipo: string;
  vehiculo: string;
  fecha: string;
  responsable: string;
  prioridad: string;
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

  if(isDragging){
    return (
      <div ref={setNodeRef} style={style} className="opacity-30 bg-gray-900 p-4 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 ring-blue-500 cursor-pointer justify-between relative">
      </div>
    );
  }

  return (
    <div 
    ref={setNodeRef}
    style={style}
    {...attributes}
    {...listeners}
    className="bg-gray-900 p-4 flex flex-col text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-blue-500 cursor-pointer justify-between relative gap-4">
      <div className="flex justify-between">
        <p className="text-md font-bold">
        {control.asunto}
        </p>
        {control.prioridad}
      </div>
      <div>
        <div>
        {control.tipo}
        </div>
        {control.vehiculo}
      </div>
      <div className="flex justify-between">
        <p>
        {control.fecha}
        </p>
        {control.responsable}
      </div>
    </div>
  );
};

export default TaskCard;
