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
    let selectedTaskType: string | null = null; // Variable para almacenar el tipo de control seleccionado
  
    await Swal.fire({
      title: 'Selecciona el tipo de control',
      background: 'rgb(55 65 81)',
      color: 'white',

      //No encontré un SVG con el icono pulse para el botón de predictivo :(
      html: `
        <div class="flex justify-center space-x-4 p-4">
          <button id="correctivo" class="flex flex-col items-center justify-center w-40 h-40 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200">
            <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.867 19.125h.008v.008h-.008v-.008Z" />
            </svg>
            <span class="font-semibold">Correctivo</span>
          </button>
          <button id="preventivo" class="flex flex-col items-center justify-center w-40 h-40 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200">
            <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="font-semibold">Preventivo</span>
          </button>
          <button id="predictivo" class="flex flex-col items-center justify-center w-40 h-40 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
            <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            <span class="font-semibold">Predictivo</span>
          </button>
        </div>
      `,
      showCancelButton: true,
      
      // Se va a ocultar el botón de confirmación por defecto, porque se usan botones personalizados para acceder a los diferentes forms
      showConfirmButton: false, 
      
      didOpen: () => {
        // Escucha de click a los botones
        document.getElementById('correctivo')?.addEventListener('click', () => {
          selectedTaskType = 'CORRECTIVO';
          Swal.close(); // Cierra la alerta despues de seleccionar una opción
        });
        document.getElementById('preventivo')?.addEventListener('click', () => {
          selectedTaskType = 'PREVENTIVO';
          Swal.close();
        });
        document.getElementById('predictivo')?.addEventListener('click', () => {
          selectedTaskType = 'PREDICTIVO';
          Swal.close();
        });
      }
    });
  
    //Acá se van a implementar forms perosnalizados dependiendo de que control se quiera crear
    if (selectedTaskType) {
      const { value: formValues } = await Swal.fire({
        title: `Crear control ${selectedTaskType}`,
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
            tipo: selectedTaskType
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
