import React from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useVehiculo, VehiculoProvider } from "@/app/context/VehiculoContext";
import axios from "axios";

const apiVehiculosBackend = `https://fleet-manager-gzui.onrender.com/api/vehicles`;

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Vehiculo {
  id: string;
  model: string;
  brand: string;
  year: number;
  coordinates: Coordinates;
  date_created: string;
  date_updated: string;
  activo: boolean;
}

interface VehiculoCardProps {
  vehiculo: Vehiculo;
  onVehicleUpdated: (VehiculoID: Vehiculo) => void;
}

const VehiculoCard = ({ vehiculo, onVehicleUpdated }: VehiculoCardProps) => {
  const router = useRouter();
  const { modifyVehiculo } = useVehiculo();

  const handleViewVehiculo = (id: string) => {
    router.push(`/vehiculos/${id}`);
  };

  {
    /*
  const handleDelete = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Aquí puedes agregar la lógica para eliminar el vehículo
        Swal.fire(
          'Eliminado!',
          'El vehículo ha sido eliminado.',
          'success'
        )
      }
    });
  };
  */
  }

  // const handleDisableVehicle = async () => {
  //   const updateUrl = `${apiVehiculosBackend}/${vehiculo.id}`;
  //   const newStatus = !vehiculo.activo;

  //   try {
  //     const response = await axios.put(updateUrl, {
  //       data: { activo: newStatus },
  //     });

  //     const updatedVehiculo = { ...vehiculo, activo: newStatus };
  //     onVehicleUpdated(updatedVehiculo);

  //     Swal.fire({
  //       title: `Vehículo ${newStatus ? "habilitado" : "deshabilitado"}`,
  //       text: `El vehículo ha sido ${newStatus ? "habilitado" : "deshabilitado"} correctamente.`,
  //       icon: "success",
  //       confirmButtonColor: "#3085d6",
  //     });
  //   } catch (error) {
  //     Swal.fire({
  //       title: "Error",
  //       text: "Hubo un problema al cambiar el estado del vehículo. Por favor, intenta de nuevo.",
  //       icon: "error",
  //       confirmButtonColor: "#d33",
  //     });
  //   }
  // };

  const handleDisableVehicle = async (vehiculo: Vehiculo) => {
    const updateUrl = `${apiVehiculosBackend}${vehiculo.id}`;

    Swal.fire({
        title: '¿Estás seguro?',
        text: `El vehículo será ${vehiculo.activo ? 'deshabilitado' : 'habilitado'} y su estado cambiará a ${vehiculo.activo ? 'inactivo' : 'activo'}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: vehiculo.activo ? 'Deshabilitar' : 'Habilitar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                // Hacer la solicitud PUT para actualizar el estado del vehículo
                await axios.put(updateUrl, {
                    data: { activo: !vehiculo.activo }
                });

                Swal.fire({
                    title: `Vehículo ${vehiculo.activo ? 'deshabilitado' : 'habilitado'}`,
                    text: `El vehículo ha sido ${vehiculo.activo ? 'deshabilitado' : 'habilitado'} correctamente.`,
                    icon: 'success',
                    confirmButtonColor: '#3085d6'
                });

                // Llamar a la función para actualizar el estado del vehículo en la tabla
                onVehicleUpdated({ ...vehiculo, activo: !vehiculo.activo });

            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al cambiar el estado del vehículo. Por favor, intenta de nuevo.',
                    icon: 'error',
                    confirmButtonColor: '#d33'
                });
            }
        }
    });
};

  const handleEdit = () => {
    Swal.fire({
      title: "Editar vehículo",
      html: `
        <div class="flex flex-col space-y-4">
          <div class="flex flex-col">
            <label for="edit-vehicle-model" class="text-left text-gray-700 font-medium">Modelo</label>
            <input id="edit-vehicle-model" class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value="${vehiculo.model}">
          </div>
          <div class="flex flex-col">
            <label for="edit-vehicle-brand" class="text-left text-gray-700 font-medium">Marca</label>
            <input id="edit-vehicle-brand" class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value="${vehiculo.brand}">
          </div>
          <div class="flex flex-col">
            <label for="edit-vehicle-year" class="text-left text-gray-700 font-medium">Año</label>
            <input id="edit-vehicle-year" type="number" min="1900" max="${new Date().getFullYear()}" class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value="${vehiculo.year}">
          </div>
          <div class="flex flex-col">
            <label for="edit-vehicle-activo" class="text-left text-gray-700 font-medium">Activo</label>
            <input id="edit-vehicle-activo" type="checkbox" ${vehiculo.activo ? 'checked' : ''}>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const model = (document.getElementById("edit-vehicle-model") as HTMLInputElement).value;
        const brand = (document.getElementById("edit-vehicle-brand") as HTMLInputElement).value;
        const year = parseInt((document.getElementById("edit-vehicle-year") as HTMLInputElement).value);
        const activo = (document.getElementById("edit-vehicle-activo") as HTMLInputElement).checked;

        if (!model || !brand || year < 1900 || year > new Date().getFullYear()) {
          Swal.showValidationMessage("Por favor, complete todos los campos correctamente.");
          return false;
        }

        return { model, brand, year, activo };
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        const { model, brand, year, activo } = result.value;
        const updatedVehiculo = { ...vehiculo, model, brand, year, activo };

        modifyVehiculo(updatedVehiculo);

        Swal.fire({
          title: "Actualizado!",
          text: "El vehículo ha sido actualizado.",
          icon: "success",
        });
      }
    });
  };

  return (
    <div
      className={`p-6 rounded-lg shadow-lg text-white transition duration-300 ease-in-out ${vehiculo.activo
        ? "bg-gray-800 hover:bg-gray-900"
        : "bg-gray-800 opacity-50"
        }`}
    >
      <h2 className="text-2xl font-bold mb-3">
        {vehiculo.brand} {vehiculo.model} - {vehiculo.year}
      </h2>
      <p className="text-lg text-gray-300">ID: {vehiculo.id}</p>
      <div className="mt-4">
        <h3 className="text-xl font-semibold text-gray-400">Coordenadas</h3>
        <p className="text-lg text-gray-300">
          Latitud: {vehiculo.coordinates.latitude}
        </p>
        <p className="text-lg text-gray-300">
          Longitud: {vehiculo.coordinates.longitude}
        </p>
      </div>
      <div className="mt-4 text-gray-400">
        <p className="text-sm">
          Creado el: {new Date(vehiculo.date_created).toLocaleString()}
        </p>
        <p className="text-sm">
          Actualizado el: {new Date(vehiculo.date_updated).toLocaleString()}
        </p>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => handleViewVehiculo(vehiculo.id)}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Ver Detalles
        </button>

        <button
          onClick={handleEdit}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Editar
        </button>

        <button
          onClick={() => handleDisableVehicle(vehiculo)}
          className={`font-bold py-2 px-4 rounded ${vehiculo.activo
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
            }`}
        >
          {vehiculo.activo ? "Deshabilitar" : "Habilitar"}
        </button>
      </div>
    </div>
  );
};

export default VehiculoCard;
