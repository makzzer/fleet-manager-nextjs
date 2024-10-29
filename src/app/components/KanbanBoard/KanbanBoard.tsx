"use client";

import { useEffect, useMemo, useState } from "react";
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
  pointerWithin,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import { InputAdornment, MenuItem, TextField } from "@mui/material";
import { FaRegCalendarAlt, FaTools, FaUserCircle } from "react-icons/fa";
import { useUser } from "@/app/context/UserContext";

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

  const { users } = useUser();
  const operators = users.filter(user => user.roles.includes("OPERATOR"));

  const [internalTasks, setInternalTasks] = useState(initialTasks);
  const [filter, setFilter] = useState("ALL")
  const [dateFilter, setDateFilter] = useState("ALL")
  const [operatorFilter, setOperatorFilter] = useState("ALL")
  const [onSetOperator, setOnSetOperator] = useState(false);

  useEffect(() => {
    if(initialTasks.length !== internalTasks.length || onSetOperator){
      console.log("refresh")
      setInternalTasks(initialTasks);
      setOnSetOperator(false);
    }
  }, [initialTasks, internalTasks, onSetOperator]);
  
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  
  const filteredTasks = useMemo(() => {
    return internalTasks.filter(task => {
      const typeMatch = filter === "ALL" || task.content.type === filter
      const operatorMatch = operatorFilter === "ALL" || task.content.operator?.id === operatorFilter
      
      let dateMatch = true
      const taskDate = new Date(task.content.date_created)
      const today = new Date()
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

      switch (dateFilter) {
        case "TODAY":
          dateMatch = taskDate.toDateString() === today.toDateString()
          break
        case "THIS_WEEK":
          dateMatch = taskDate >= weekAgo && taskDate <= today
          break
        default:
          dateMatch = true
      }

      return typeMatch && operatorMatch && dateMatch
    })
  }, [internalTasks, filter, dateFilter, operatorFilter])

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

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value)
  }
  
  const handleDateFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter(event.target.value)
  }

  const handleOperatorFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOperatorFilter(event.target.value)
  }

  return (
    <div className="min-h-screen w-full overflow-x-auto overflow-y-hidden">
      <div className="flex flex-col md:flex-row gap-6 mb-6 mt-2 w-full">
        <TextField
          select
          label="Filtrar por tipo"
          value={filter}
          onChange={handleFilterChange}
          className="bg-gray-800 text-white rounded-lg shadow-md border w-full border-gray-600 transition-all duration-300 ease-in-out hover:shadow-lg focus:shadow-lg"
          InputProps={{
            style: { color: "#fff" },
            startAdornment: (
              <InputAdornment position="start">
                <FaTools className="text-gray-300" />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{
            style: { color: "#b0b0b0" },
          }}
        >
          <MenuItem value="ALL"><em>Todos los tipos</em></MenuItem>
          <MenuItem value="CORRECTIVE"><em>Correctivo</em></MenuItem>
          <MenuItem value="PREVENTIVE"><em>Preventivo</em></MenuItem>
          <MenuItem value="PREDICTIVE"><em>Predictivo</em></MenuItem>
        </TextField>
        <TextField
          select
          label="Filtrar por fecha"
          value={dateFilter}
          onChange={handleDateFilterChange}
          className="bg-gray-800 text-white rounded-lg shadow-md border w-full border-gray-600 transition-all duration-300 ease-in-out hover:shadow-lg focus:shadow-lg"
          InputProps={{
            style: { color: "#fff" },
            startAdornment: (
              <InputAdornment position="start">
                <FaRegCalendarAlt className="text-gray-300" />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{
            style: { color: "#b0b0b0" },
          }}
        >
          <MenuItem value="ALL"><em>Todas las fechas</em></MenuItem>
          <MenuItem value="TODAY"><em>Hoy</em></MenuItem>
          <MenuItem value="THIS_WEEK"><em>Esta semana</em></MenuItem>
        </TextField>
        <TextField
          select
          label="Filtrar por operador"
          value={operatorFilter}
          onChange={handleOperatorFilterChange}
          className="bg-gray-800 text-white rounded-lg shadow-md border w-full border-gray-600 transition-all duration-300 ease-in-out hover:shadow-lg focus:shadow-lg"
          InputProps={{
            style: { color: "#fff" },
            startAdornment: (
              <InputAdornment position="start">
                <FaUserCircle className="text-gray-300" />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{
            style: { color: "#b0b0b0" },
          }}
        >
          <MenuItem value="ALL"><em>Todos los operadores</em></MenuItem>
          {operators && operators.map((operator) => (
            <MenuItem key={operator.id} value={operator.id}>
              <em>{operator.full_name}</em>
            </MenuItem>
          ))}
        </TextField>
      </div>
      <DndContext
      collisionDetection={pointerWithin}
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
                tasks={filteredTasks.filter((task) => task.columnId === col.id)}
                assignOperator={assignOperator}
                setOnSetOperator={setOnSetOperator}
              />
            ) : (
              <ColumnContainer
                key={col.id}
                column={col}
                tasks={filteredTasks.filter((task) => task.columnId === col.id)}
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
