import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

interface Column {
  id: string | number;
  title: string;
}

interface ColumnContainerProps {
  column: Column;
  deleteColumn: (id: string | number) => void;
  updateColumn: (id: string | number, title: string) => void;
}

const ColumnContainer: React.FC<ColumnContainerProps> = ({
  column,
  deleteColumn,
  updateColumn,
}) => {
  const [editMode, setEditMode] = useState(false);

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
        onClick={() => setEditMode(true)}
        className="flex items-center justify-between py-4 px-4 bg-blue-500"
      >
        <div className="flex gap-2">
          0
          <div className="text-md font-bold">
            {!editMode && column.title}
            {editMode && (
              <input
              className="bg-gray-900 focus:border-blue-500 border rounded outline-none px-2"
              value={column.title}
              onChange={e => updateColumn(column.id, e.target.value)}
                autoFocus
                onBlur={() => setEditMode(false)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  setEditMode(false);
                }}
              ></input>
            )}
          </div>
        </div>
        <button onClick={() => deleteColumn(column.id)}>Delete</button>
      </div>
      <div className="flex flex-grow px-4 py-4">Content</div>
      <div className="px-4 py-4">Footer</div>
    </div>
  );
};

export default ColumnContainer;
