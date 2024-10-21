'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVehiculo } from '../context/VehiculoContext';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import axios from 'axios';
import Carousel from '../components/Carousel/Carousel';
import { EmblaOptionsType } from 'embla-carousel';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale';
import MapPickCoordinates from '../components/Maps/MapPickCoordinates'; // Asegúrate de que este es el import correcto

const OPTIONS: EmblaOptionsType = {
  loop: true,
  align: 'center',
  skipSnaps: false,
};

const ReservaViaje = () => {
  const router = useRouter();
  const { vehiculos, fetchVehiculos } = useVehiculo();
  const { authenticatedUser } = useAuth();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [pickedCoordinates, setPickedCoordinates] = useState<{ lat: number; lng: number } | null>(null); // Estado para las coordenadas seleccionadas

  useEffect(() => {
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

    if (!pickedCoordinates) {
      alert('Por favor, selecciona un destino en el mapa.');
      return;
    }

    const requestData = {
      vehicle_id: selectedVehicle,
      user_id: authenticatedUser.id,
      destination: {
        latitude: pickedCoordinates.lat,  // Usar las coordenadas seleccionadas
        longitude: pickedCoordinates.lng, // Usar las coordenadas seleccionadas
      },
      // No usamos selectedDate todavía, será para futuras características
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

      {/* Selector de Fecha */}
      <div className="flex-shrink-0 mb-6">
        <h2 className="text-2xl font-semibold mb-2">Seleccionar Fecha del Viaje</h2>
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Selecciona una fecha"
          className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          locale={es}
        />
      </div>

      {/* Mapa para seleccionar coordenadas */}
      <MapPickCoordinates setPickedCoordinates={setPickedCoordinates} /> {/* Pasa la función para actualizar las coordenadas */}

      {/* Botón para crear la reserva */}
      <div className="flex-shrink-0 mt-4">
        <button
          className="w-full bg-green-600 mb-4 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-md transition-all"
          onClick={handleCreateReserva}
        >
          Reservar
        </button>

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-300 transform"
          onClick={() => router.push('/reservas')}
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default ReservaViaje;
