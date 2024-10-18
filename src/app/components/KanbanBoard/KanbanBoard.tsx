"use client";

import { useEffect, useState } from "react";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  useSensors,
  PointerSensor,
  useSensor,
  DragOverEvent,
  TouchSensor,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
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

interface KanbanBoardProps {
  initialTasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setStatusTask: (control_id: string, new_status: string) => void;
  addControlTask: () => void;
  assignOperator: (control_id: string, operator_id: string) => Promise<void>;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ initialTasks, setStatusTask, addControlTask, assignOperator }) => {

  const [columns] = useState<Column[]>([
    { id: "TODO", title: "Por hacer" },
    { id: "DOING", title: "En proceso" },
    { id: "DONE", title: "Terminado" },
  ]);

  const [internalTasks, setInternalTasks] = useState(initialTasks);
  const [onSetOperator, setOnSetOperator] = useState(false);

  useEffect(() => {
    if(initialTasks.length !== internalTasks.length || onSetOperator){
      console.log("refresh")
      setInternalTasks(initialTasks);
      setOnSetOperator(false);
    }
  }, [initialTasks, internalTasks, onSetOperator]);
  
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 2,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 2,
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    //Dropeando una tarea encima de otra
    if (isActiveATask && isOverATask) {
      setInternalTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";
    //Dropeando una tarea encima de una columna
    if (isActiveATask && isOverAColumn) {
      setInternalTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  };

  const onDragEnd = () => {
    compareTasks();
  };
  
  const compareTasks = () => {
    internalTasks.forEach((task) => {
      initialTasks.forEach((OGtask) => {
        if(task.content.id !== OGtask.content.id){
          return;
        }
        if(task.columnId !== OGtask.columnId){
          setStatusTask(OGtask.content.id as string, task.columnId as string);
        }
      })
    });
  };
  

  return (
    <div className="min-h-screen w-full overflow-x-auto overflow-y-hidden">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex gap-4">
          {columns.map((col, index) =>
            index === 0 ? (
              <ColumnContainer
                key={col.id}
                column={col}
                createTask={addControlTask}
                tasks={internalTasks.filter((task) => task.columnId === col.id)}
                assignOperator={assignOperator}
                setOnSetOperator={setOnSetOperator}
              />
            ) : (
              <ColumnContainer
                key={col.id}
                column={col}
                tasks={internalTasks.filter((task) => task.columnId === col.id)}
                assignOperator={assignOperator}
                setOnSetOperator={setOnSetOperator}
              />
            )
          )}
        </div>

        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} />}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
