'use client';
import React, { useEffect } from "react";
import VehiculoCard from "../components/Cards/VehiculoCards";
import { useVehiculo } from "../context/VehiculoContext";
import Swal from 'sweetalert2';

const Vehiculos = () => {
  const { vehiculos, fetchVehiculos, createVehiculo } = useVehiculo();

  useEffect(() => {
    fetchVehiculos();
  }, [fetchVehiculos]);

  const handleAgregarVehiculo = () => {
    // Aquí abres un modal o alert para agregar vehículo
    Swal.fire({
      title: 'Agregar Vehículo',
      html: `
        <input type="text" id="id" class="swal2-input" placeholder="Patente">
        <input type="text" id="brand" class="swal2-input" placeholder="Marca">
        <input type="text" id="model" class="swal2-input" placeholder="Modelo">
        <input type="number" id="year" class="swal2-input" placeholder="Año">
      `,
      confirmButtonText: 'Agregar',
      focusConfirm: false,
      preConfirm: () => {
        const idElement = document.getElementById('id') as HTMLInputElement;
        const brandElement = document.getElementById('brand') as HTMLInputElement;
        const modelElement = document.getElementById('model') as HTMLInputElement;
        const yearElement = document.getElementById('year') as HTMLInputElement;

        const id = idElement?.value;
        const brand = brandElement?.value;
        const model = modelElement?.value;
        const year = yearElement?.value;

        if (!id || !brand || !model || !year) {
          Swal.showValidationMessage('Completa todos los campos');
          return null;
        }

        return { id, brand, model, year };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {

        let vehiculo = {
          id: result.value.id,
          brand: result.value.brand,
          model: result.value.model,
          year: result.value.year,
          coordinates: {
              "latitude": 0,
              "longitude": 0
          },
          status: "AVAILABLE"
        };

        createVehiculo(vehiculo);

        // Lógica para agregar vehículo (usando el context o API)
        console.log('Vehículo agregado:', result.value);
      }
    });
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-400">Gestión de Vehículos</h1>
        <button
          onClick={handleAgregarVehiculo}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Agregar Vehículo
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehiculos.map((vehiculo, index) => (
          <VehiculoCard key={index} vehiculo={vehiculo} />
        ))}
      </div>
    </div>
  );
};

export default Vehiculos;
