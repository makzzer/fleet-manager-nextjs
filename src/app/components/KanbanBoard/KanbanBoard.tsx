"use client";

import { useState } from "react";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  useSensors,
  PointerSensor,
  useSensor,
  DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import Swal from "sweetalert2";

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

const KanbanBoard = () => {
  const controls: Control[] = [
    {
      asunto: "Pinchadura de rueda",
      tipo: "CORRECTIVO",
      vehiculo: "AAA-BBB",
      fecha: "2024-11-24",
      responsable: "Pepito",
      prioridad: "ALTA",
    },
    {
      asunto: "Mantenimiento",
      tipo: "PREVENTIVO",
      vehiculo: "AAA-CCC",
      fecha: "2024-11-23",
      responsable: "Pepita",
      prioridad: "MEDIA",
    },
    {
      asunto: "Control de caja de cambios",
      tipo: "PREDICTIVO",
      vehiculo: "AA-123-BC",
      fecha: "2024-10-23",
      responsable: "Pepe",
      prioridad: "BAJA",
    },
  ];

  const [columns] = useState<Column[]>([
    { id: "todo", title: "Por hacer" },
    { id: "inProgress", title: "En proceso" },
    { id: "done", title: "Terminado" },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, columnId: "todo", content: controls[0] },
    { id: 2, columnId: "todo", content: controls[1] },
    { id: 3, columnId: "inProgress", content: controls[2] },
  ]);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const handleCreateTask = async () => {
    const { value: taskType } = await Swal.fire({
      title: 'Selecciona el tipo de control',
      input: 'select',
      inputOptions: {
        'CORRECTIVO': 'Correctivo',
        'PREVENTIVO': 'Preventivo',
        'PREDICTIVO': 'Predictivo',
      },
      inputPlaceholder: 'Selecciona un tipo',
      showCancelButton: true,
    });

    if (taskType) {
      const { value: formValues } = await Swal.fire({
        title: `Crear control ${taskType}`,
        html: `
          <input id="asunto" class="swal2-input" placeholder="Asunto">
          <input id="vehiculo" class="swal2-input" placeholder="Vehículo">
          <input id="fecha" class="swal2-input" type="date" placeholder="Fecha">
          <input id="responsable" class="swal2-input" placeholder="Responsable">
          <input id="prioridad" class="swal2-input" placeholder="Prioridad (ALTA, MEDIA, BAJA)">
        `,
        focusConfirm: false,
        preConfirm: () => {
          return {
            asunto: (document.getElementById('asunto') as HTMLInputElement).value,
            vehiculo: (document.getElementById('vehiculo') as HTMLInputElement).value,
            fecha: (document.getElementById('fecha') as HTMLInputElement).value,
            responsable: (document.getElementById('responsable') as HTMLInputElement).value,
            prioridad: (document.getElementById('prioridad') as HTMLInputElement).value,
            tipo: taskType
          };
        }
      });

      if (formValues) {
        const newTask: Task = {
          id: Date.now().toString(),
          columnId: 'todo',
          content: formValues,
        };

        setTasks((prevTasks) => [...prevTasks, newTask]);
        Swal.fire('¡Control creado!', '', 'success');
      }
    }
  };

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

    if (!isActiveATask) return;

    //Dropeando una tarea encima de otra
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (
          activeIndex !== overIndex &&
          tasks[activeIndex].columnId === tasks[overIndex].columnId
        ) {
          // Solo reordena si las posiciones son diferentes.
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex);
        }

        return tasks;
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";
    //Dropeando una tarea encima de una columna
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        if (tasks[activeIndex].columnId !== overId) {
          tasks[activeIndex].columnId = overId;
        }

        return tasks;
      });
    }
  };

  const onDragEnd = () => {
    setActiveTask(null);
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
                createTask={handleCreateTask}
                tasks={tasks.filter((task) => task.columnId === col.id)}
              />
            ) : (
              <ColumnContainer
                key={col.id}
                column={col}
                tasks={tasks.filter((task) => task.columnId === col.id)}
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
