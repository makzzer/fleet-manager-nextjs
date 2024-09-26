import React from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useVehiculo, VehiculoProvider } from "@/app/context/VehiculoContext";

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
}

interface VehiculoCardProps {
  vehiculo: Vehiculo;
}

const VehiculoCard = ({ vehiculo }: VehiculoCardProps) => {
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

  const handleEdit = () => {
    // Aquí va la lógica para editar el vehículo
    Swal.fire({
      title: "Editar vehículo",
      html: `
      <div class="flex flex-col space-y-4">
        <div class="flex flex-col">
          <label for="edit-vehicle-model" class="text-left text-gray-700 font-medium">Modelo</label>
          <input id="edit-vehicle-model" class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value="${
            vehiculo.model
          }">
        </div>
        <div class="flex flex-col">
          <label for="edit-vehicle-brand" class="text-left text-gray-700 font-medium">Marca</label>
          <input id="edit-vehicle-brand" class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value="${
            vehiculo.brand
          }">
        </div>
        <div class="flex flex-col">
          <label for="edit-vehicle-year" class="text-left text-gray-700 font-medium">Año</label>
          <input id="edit-vehicle-year" type="number" min="1900" max="${new Date().getFullYear()}" class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value="${
        vehiculo.year
      }">
        </div>
      </div>
    `,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      showLoaderOnConfirm: true,

      //Resetear el mensaje de error al reescribir en cualquier input
      didOpen: () => {
        const modelInput = document.getElementById(
          "edit-vehicle-model"
        ) as HTMLInputElement;
        modelInput?.addEventListener("input", () => {
          Swal.resetValidationMessage();
        });

        const brandInput = document.getElementById(
          "edit-vehicle-brand"
        ) as HTMLInputElement;
        brandInput?.addEventListener("input", () => {
          Swal.resetValidationMessage();
        });

        const yearInput = document.getElementById(
          "edit-vehicle-year"
        ) as HTMLInputElement;
        yearInput?.addEventListener("input", () => {
          Swal.resetValidationMessage();
        });
      },

      preConfirm: () => {
        const model = (
          document.getElementById("edit-vehicle-model") as HTMLInputElement
        ).value;
        const brand = (
          document.getElementById("edit-vehicle-brand") as HTMLInputElement
        ).value;
        const year = parseInt(
          (document.getElementById("edit-vehicle-year") as HTMLInputElement)
            .value
        );

        //Validar que haya modificado algún campo
        if (
          vehiculo.model === model &&
          vehiculo.brand === brand &&
          vehiculo.year === year
        ) {
          Swal.showValidationMessage("No ha hecho ninguna modificación");
          return false;
        }

        //Validar de que el campo del modelo y la marca no estén vacios
        if (!model || !brand) {
          Swal.showValidationMessage("Complete todos los campos");
          return false;
        }

        //Validar de que el año ingresado esté entre 1900 y el año actual.
        if (year < 1900 || year > new Date().getFullYear()) {
          Swal.showValidationMessage(
            `El año debe estar entre 1900 y ${new Date().getFullYear()}`
          );
          return false;
        }

        //Retorna los datos modificados del vehiculo si todo está bien
        return {
          ...vehiculo,
          model,
          brand,
          year,
        };
      },

      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        const { id, model, brand, year } = result.value;
        const vehiculoEdit = {
          id,
          model,
          brand,
          year,
        };

        modifyVehiculo(vehiculoEdit);

        Swal.fire({
          title: "Actualizado!",
          text: "El vehículo ha sido actualizado.",
          icon: "success",
        });
      }
    });
  };

  return (
    <div className="bg-gray-800 border border-gray-600 p-6 rounded-lg shadow-lg text-white hover:bg-gray-900 transition duration-300 ease-in-out">
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
        {/*
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
          Eliminar
        </button>
        */}
      </div>
    </div>
  );
};

export default VehiculoCard;
