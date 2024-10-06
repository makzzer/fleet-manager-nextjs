import React from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useVehiculo } from "@/app/context/VehiculoContext";
import { FiEdit, FiEye, FiTrash, FiCheckCircle } from "react-icons/fi"; // Feather Icons (más modernos)

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

interface VehiculoCardProps {
  vehiculo: Vehiculo;
}

const VehiculoCard = ({ vehiculo }: VehiculoCardProps) => {
  const router = useRouter();
  const { modifyVehiculo, deleteVehiculo, enableVehiculo } = useVehiculo();

  const handleViewVehiculo = (id: string) => {
    if (vehiculo.status === "AVAILABLE") {
      router.push(`/vehiculos/${id}`);
    }
  };

  const handleDisableVehicle = async () => {
    const newStatus = vehiculo.status === "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE";
    const updatedVehiculo = { ...vehiculo, status: newStatus };
    try {
      if (vehiculo.status === "AVAILABLE") {
        await deleteVehiculo(updatedVehiculo); // Deshabilita el vehículo
        Swal.fire({
          title: "Vehículo deshabilitado",
          text: "El vehículo ha sido deshabilitado correctamente.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
      } else {
        await enableVehiculo(updatedVehiculo.id); // Habilita el vehículo
        Swal.fire({
          title: "Vehículo habilitado",
          text: "El vehículo ha sido habilitado correctamente.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al cambiar el estado del vehículo. Por favor, intenta de nuevo.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleEdit = () => {
    // Aquí iría la lógica para editar el vehículo
  };

  return (
    <div className="p-6 rounded-lg shadow-lg text-white transition duration-300 ease-in-out bg-gray-800 hover:bg-gray-900 h-full flex flex-col justify-between">
      <div className="min-h-[120px]">
        <h2 className="text-2xl font-bold mb-3 truncate max-w-full" title={`${vehiculo.brand} ${vehiculo.model}`}>
          {vehiculo.brand} {vehiculo.model} - {vehiculo.year}
        </h2>
        <p className="text-lg text-gray-300">ID: {vehiculo.id}</p>
      </div>

      <div className="mt-4 text-gray-400">
        <p className="text-sm">Creado el: {new Date(vehiculo.date_created).toLocaleString()}</p>
        <p className="text-sm">Actualizado el: {new Date(vehiculo.date_updated).toLocaleString()}</p>
      </div>

      <div className="flex justify-between mt-6 space-x-2">
        <button
          title="Detalle"
          onClick={() => handleViewVehiculo(vehiculo.id)}
          disabled={vehiculo.status !== "AVAILABLE"}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 flex items-center justify-center w-full"
        >
          <FiEye className="w-5 h-5 mr-2" />
          
        </button>

        <button
          title="Editar"
          onClick={handleEdit}
          disabled={vehiculo.status !== "AVAILABLE"}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 flex items-center justify-center w-full"
        >
          <FiEdit className="w-5 h-5 mr-2" />
          
        </button>

        {vehiculo.status === "AVAILABLE" ? (
          <button
            title="Deshabilitar"
            onClick={handleDisableVehicle}
            className="font-bold py-2 px-4 rounded bg-red-500 hover:bg-red-600 flex items-center justify-center w-full"
          >
            <FiTrash className="w-5 h-5 mr-2" />
            
          </button>
        ) : (
          <button
            title="Habilitar"
            onClick={handleDisableVehicle}
            className="font-bold py-2 px-4 rounded bg-blue-500 hover:bg-blue-600 flex items-center justify-center w-full"
          >
            <FiCheckCircle className="w-5 h-5 mr-2" />
            
          </button>
        )}
      </div>
    </div>
  );
};

export default VehiculoCard;