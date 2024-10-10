import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Column {
  id: string | number;
  title: string;
}

interface ColumnContainerProps {
  column: Column;
  deleteColumn: (id: string | number) => void;
}

const ColumnContainer: React.FC<ColumnContainerProps> = ({
  column,
  deleteColumn,
}) => {
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
          0<div className="text-md font-bold">{column.title}</div>
        </div>
        <button onClick={() => deleteColumn(column.id)}>Delete</button>
      </div>
      <div className="flex flex-grow px-4 py-4">Content</div>
      <div className="px-4 py-4">Footer</div>
    </div>
  );
};

export default ColumnContainer;
