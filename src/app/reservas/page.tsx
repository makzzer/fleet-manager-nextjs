'use client'
import { useState } from 'react';

const Reserva = () => {
  const [vehiculo, setVehiculo] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');

  const handleReserva = () => {
    // lógica de reserva
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">Reservar Vehículo</h1>

      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">Seleccionar Vehículo</label>
        <select
          value={vehiculo}
          onChange={(e) => setVehiculo(e.target.value)}
          className="block w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3"
        >
          <option value="" disabled>Selecciona un vehículo</option>
          <option value="vehiculo1">Vehículo 1</option>
          <option value="vehiculo2">Vehículo 2</option>
          {/* Más opciones */}
        </select>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="w-1/2">
          <label className="block text-lg font-medium mb-2">Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="block w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3"
          />
        </div>

        <div className="w-1/2">
          <label className="block text-lg font-medium mb-2">Hora</label>
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="block w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">Mapa</label>
        {/* Aquí podrías insertar el mapa interactivo */}
        <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
          <p className="text-gray-400">[Mapa aquí]</p>
        </div>
      </div>

      <button
        onClick={handleReserva}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full"
      >
        Reservar
      </button>
    </div>
  );
};

export default Reserva;
