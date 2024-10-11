"use client";

import { useMemo, useState } from "react";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  useSensors,
  PointerSensor,
  useSensor,
  DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
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

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([
    { id: "todo", title: "Por hacer" },
    { id: "inProgress", title: "En proceso" },
    { id: "done", title: "Terminado" },
  ]);
  
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, columnId: "todo", content: "Task 1: Preparar el informe" },
    { id: 2, columnId: "todo", content: "Task 2: Diseñar el dashboard" },
    { id: 3, columnId: "inProgress", content: "Task 3: Implementar el backend" },
    { id: 4, columnId: "done", content: "Task 4: Revisar el diseño UI" },
  ]);

  const columnsId = columns.map((col) => col.id);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 2,
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

    if(!isActiveATask) return;

    //Dropeando una tarea encima de otra
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";
    //Dropeando una tarea encima de una columna
    if(isActiveATask && isOverAColumn){
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
    
  }

  return (
    <div className="min-h-screen w-full m-auto flex items-center overflow-x-auto overflow-y-hidden">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
            {columns.map((col) => (
              <ColumnContainer
                key={col.id}
                column={col}
                tasks={tasks.filter((task) => task.columnId === col.id)}
              />
            ))}
        </div>

        <DragOverlay>
          {activeColumn && (
            <ColumnContainer
              column={activeColumn}
              tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
            />
          )}
          {activeTask && (
            <TaskCard
              task={activeTask}
            />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
