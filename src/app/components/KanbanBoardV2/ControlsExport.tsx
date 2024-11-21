import { useControl } from "@/app/context/ControlContext";
import { FaFileExcel } from "react-icons/fa";

const ControlsExport = () => {

  const { exportControlesToExcel } = useControl();

  return (
    <button
      onClick={exportControlesToExcel}
      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center gap-2"
    >
      <FaFileExcel />
      Exportar controles
    </button>
  );
}

export default ControlsExport;