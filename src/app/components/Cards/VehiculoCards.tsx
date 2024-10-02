import React from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useVehiculo } from "@/app/context/VehiculoContext";
import { FaCarAlt, FaEye } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { MdCarCrash } from "react-icons/md";

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
  const { modifyVehiculo } = useVehiculo();
  // const { updateVehiculo } = useVehiculo();
  const { deleteVehiculo } = useVehiculo();
  const { enableVehiculo } = useVehiculo();

  const handleViewVehiculo = (id: string) => {
    if (vehiculo.status === "AVAILABLE") {
      router.push(`/vehiculos/${id}`);
    }
  };

  // const handleDisableVehicle = async () => {
  //   // const newStatus = vehiculo.status ? "AVAILABLE" : "UNAVAILABLE";
  //   const newStatus = vehiculo.status === "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE";
  //   const updatedVehiculo = { ...vehiculo, status: newStatus };

  //   try {
  //     await modifyVehiculo(updatedVehiculo);

  //     Swal.fire({
  //       // title: `Vehículo ${newStatus ? "habilitado" : "deshabilitado"}`,
  //       title: `Vehículo ${newStatus === "AVAILABLE" ? "habilitado" : "deshabilitado"}`,
  //       // text: `El vehículo ha sido ${newStatus ? "habilitado" : "deshabilitado"} correctamente.`,
  //       text: `El vehículo ha sido ${newStatus === "AVAILABLE" ? "habilitado" : "deshabilitado"} correctamente.`,
  //       icon: "success",
  //       confirmButtonColor: "#3085d6",
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     Swal.fire({
  //       title: "Error",
  //       text: "Hubo un problema al cambiar el estado del vehículo. Por favor, intenta de nuevo.",
  //       icon: "error",
  //       confirmButtonColor: "#d33",
  //     });
  //   }
  // };

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
    if (vehiculo.status === "AVAILABLE") {
      Swal.fire({
        title: "Editar vehículo",
        html: `
        <div class="flex flex-col space-y-4">
          <div class="flex flex-col">
            <label for="edit-vehicle-model" class="text-left text-gray-700 font-medium">Modelo</label>
            <input id="edit-vehicle-model" class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value="${vehiculo.model
          }">
          </div>
          <div class="flex flex-col">
            <label for="edit-vehicle-brand" class="text-left text-gray-700 font-medium">Marca</label>
            <input id="edit-vehicle-brand" class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value="${vehiculo.brand
          }">
          </div>
          <div class="flex flex-col">
            <label for="edit-vehicle-year" class="text-left text-gray-700 font-medium">Año</label>
            <input id="edit-vehicle-year" type="number" min="1900" max="${new Date().getFullYear()}" class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value="${vehiculo.year
          }">
           <div class="flex flex-col">
            <label for="edit-vehicle-coordinates-lat" class="text-left text-gray-700 font-medium">Latitud</label>
            <input id="edit-vehicle-coordinates-lat" class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value="${vehiculo.coordinates.latitude
          }">
           <div class="flex flex-col">
            <label for="edit-vehicle-coordinates-lon" class="text-left text-gray-700 font-medium">Longitud</label>
            <input id="edit-vehicle-coordinates-lon" class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value="${vehiculo.coordinates.longitude
          }">
      `,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        showLoaderOnConfirm: true,
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
          const latitude = parseFloat((document.getElementById("edit-vehicle-coordinates-lat") as HTMLInputElement).value);
          const longitude = parseFloat((document.getElementById("edit-vehicle-coordinates-lon") as HTMLInputElement).value);

          const coordinates = {
            latitude: latitude,
            longitude: longitude
          };

          if (
            !model ||
            !brand ||
            year < 1900 ||
            year > new Date().getFullYear()
          ) {
            Swal.showValidationMessage(
              "Por favor, complete todos los campos correctamente."
            );
            return false;
          }

          return { model, brand, year, coordinates };
        },
        allowOutsideClick: () => !Swal.isLoading(),
      }).then((result) => {
        if (result.isConfirmed) {
          const { model, brand, year, coordinates } = result.value;
          const updatedVehiculo = { ...vehiculo, model, brand, year, coordinates };

          modifyVehiculo(updatedVehiculo);

          Swal.fire({
            title: "Actualizado!",
            text: "El vehículo ha sido actualizado.",
            icon: "success",
          });
        }
      });
    };
  };

  return (
    <div
      className={`p-6 rounded-lg shadow-lg text-white transition duration-300 ease-in-out ${vehiculo.status
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
        <button title="Detalle"
          onClick={() => handleViewVehiculo(vehiculo.id)}
          disabled={vehiculo.status !== "AVAILABLE"}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          <FaEye className="w-5 h-5" fontSize="large" />
        </button>

        <button title="Editar"
          onClick={handleEdit}
          disabled={vehiculo.status !== "AVAILABLE"}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          <FaPencilAlt fontSize="large" />
        </button>

        {vehiculo.status === "AVAILABLE"
          ?
          <button title="Deshabilitar"
            onClick={handleDisableVehicle}
            className="font-bold py-2 px-4 rounded bg-red-500 hover:bg-red-600"
          >
            <MdCarCrash fontSize="large" />
          </button>
          :
          <button title="Habilitar"
            onClick={handleDisableVehicle}
            className="font-bold py-2 px-4 rounded bg-blue-500 hover:bg-blue-600"
          >
            <FaCarAlt fontSize="large"/>
          </button>
        }
      </div>
    </div>
  );
};

export default VehiculoCard;
