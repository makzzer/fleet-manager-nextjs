"use client";

import { useMemo, useState } from "react";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragOverlay, DragStartEvent, DragEndEvent, useSensors, PointerSensor, useSensor } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";

interface Column {
  id: string | number;
  title: string;
}

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 2,
    },
  })
  );

  const generateId = () => {
    return Math.floor(Math.random() * 1000);
  };

  const createColumn = () => {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  };

  const deleteColumn = (id: string | number) => {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);
  };

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if(!over) return;
    const activeColumnId = active.id;
    const overColumnId = over.id;

    if(activeColumnId === overColumnId) return;

    setColumns(columns => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeColumnId)

      const overColumnIndex = columns.findIndex((col) => col.id === overColumnId)

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    })
  }

  const updateColumn = (id: string | number, title: string ) => {
    const newColumns = columns.map((col) => {
      if(col.id !== id) return col;
      return {...col, title};
    })

    setColumns(newColumns);
  }

  return (
    <div className="min-h-screen w-full m-auto flex items-center overflow-x-auto overflow-y-hidden">
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="m-auto flex gap-4">
          <SortableContext items={columnsId}>
            {columns.map((col) => (
              <ColumnContainer
              updateColumn={updateColumn}
                key={col.id}
                column={col}
                deleteColumn={deleteColumn}
              />
            ))}
          </SortableContext>
        </div>

        <button onClick={createColumn}>Agregar columna</button>
        <DragOverlay>
          {activeColumn && (
            <ColumnContainer
            updateColumn={updateColumn}
              column={activeColumn}
              deleteColumn={deleteColumn}
            />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
