'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVehiculo } from '../context/VehiculoContext'; // Usamos el context de vehículos para traer los vehículos disponibles
import { useAuth } from '../context/AuthContext'; // Usamos el context de autenticación para obtener el usuario autenticado
import Swal from 'sweetalert2';
import axios from 'axios';
import Carousel from '../components/Carousel/Carousel';
import { EmblaOptionsType } from 'embla-carousel'


const OPTIONS: EmblaOptionsType = { 
  loop: true,
  align: 'center',
  skipSnaps: false,
}

const ReservaViaje = () => {
  const router = useRouter();
  const { vehiculos, fetchVehiculos } = useVehiculo(); // Obtener vehículos del context
  const { authenticatedUser } = useAuth(); // Obtener el usuario autenticado
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cargar los vehículos al montar el componente
    const loadVehiculos = async () => {
      setIsLoading(true);
      await fetchVehiculos();
      setIsLoading(false);
    };
    loadVehiculos();
  }, [fetchVehiculos]);

  // Función para manejar la selección del vehículo
  const handleSelectVehicle = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    console.log(vehicleId);
  };

  // Función para crear la reserva usando Axios
  const handleCreateReserva = async () => {
    if (!selectedVehicle) {
      alert('Por favor, selecciona un vehículo.');
      return;
    }

    if (!authenticatedUser) {
      alert('Debes estar autenticado para reservar un vehículo.');
      return;
    }

    const requestData = {
      vehicle_id: selectedVehicle,
      user_id: authenticatedUser.id,
      destination: {
        latitude: -34.532493826811276, // Valores de ejemplo
        longitude: -58.70447301819182,
      },
    };

    // Imprimir la request en la consola
    console.log('Datos de la solicitud:', JSON.stringify(requestData, null, 2));

    try {
      const response = await axios.post(
        'https://fleet-manager-gzui.onrender.com/api/reserves',
        requestData
      );

      // Imprimir la response en la consola
      console.log('Respuesta del servidor:', response);

      if (response.status === 201) {
        Swal.fire('Reserva creada', 'Tu reserva se ha creado exitosamente.', 'success');
        router.push('/reservas');
      } else {
        console.log('ID del usuario:', authenticatedUser.id);
        Swal.fire('Error', 'No se pudo crear la reserva. Inténtalo nuevamente.', 'error');
      }
    } catch (error) {
      console.error('Error al crear la reserva:', error);
      Swal.fire('Error', 'Ocurrió un error al crear la reserva.', 'error');
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen rounded-xl flex flex-col p-4">
      {/* Encabezado */}
      <div className="flex-shrink-0 mb-4">
        <h1 className="text-4xl font-bold text-blue-400">Reservar Viaje</h1>
      </div>

      {/* Seleccionar Vehículo */}
      <div className="flex-shrink-0 mb-4">
        <h2 className="text-2xl font-semibold mb-5">Seleccionar Vehículo</h2>
        {isLoading ? (
          <p className="text-gray-400">Cargando vehículos...</p>
          
        ) : (
          <Carousel 
            vehicles={vehiculos.filter(v => v.status === 'AVAILABLE')} 
            options={OPTIONS}
            onSelectVehicle={handleSelectVehicle}
            selectedVehicleId={selectedVehicle}
          />
        )}
      </div>

      {/* Botón para crear la reserva */}
      <div className="flex-shrink-0 mt-4">
        <button
          className="w-full bg-green-600 mb-4 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-md transition-all"
          onClick={handleCreateReserva}
        >
          Reservar
        </button>

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-300 transform "
          onClick={() => router.push('/reservas')}
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default ReservaViaje;
