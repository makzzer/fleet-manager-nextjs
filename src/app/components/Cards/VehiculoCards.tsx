import React from "react";
import { useRouter } from "next/navigation";

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

  const handleViewVehiculo = (id: string) => {
    router.push(`/vehiculo/${id}`);
};


  {/*
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

  
  const handleEdit = () => {
    // Aquí va la lógica para editar el vehículo
    Swal.fire({
      title: 'Editar vehículo',
      input: 'text',
      inputLabel: 'Modelo',
      inputValue: vehiculo.model,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      showLoaderOnConfirm: true,
      preConfirm: (newModel) => {
        // Lógica para actualizar el vehículo
        vehiculo.model = newModel;
        Swal.fire({
          title: 'Actualizado!',
          text: 'El vehículo ha sido actualizado.',
          icon: 'success'
        });
      },
      allowOutsideClick: () => !Swal.isLoading()
    });
  };
  */}

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
        <p className="text-sm">Creado el: {new Date(vehiculo.date_created).toLocaleString()}</p>
        <p className="text-sm">Actualizado el: {new Date(vehiculo.date_updated).toLocaleString()}</p>
      </div>

      <div className="flex justify-center mt-6">

      <button
          onClick={()=>handleViewVehiculo(vehiculo.id)}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Ver Detalles
        </button>

      {/*  <button
          onClick={handleEdit}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Editar
        </button>

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
