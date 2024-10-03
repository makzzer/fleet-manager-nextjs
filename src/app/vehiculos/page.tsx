'use client';
import React, { useEffect, useState } from "react";
import VehiculoCard from "../components/Cards/VehiculoCards";
import { useVehiculo } from "../context/VehiculoContext";
import Swal from 'sweetalert2';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import SearchBar from "../../app/components/SearchBar/SearchBar";
import ProtectedRoute from "../components/Routes/ProtectedRoutes";

const Vehiculos = () => {
  const { vehiculos, fetchVehiculos, createVehiculo } = useVehiculo();
  const [isLoading, setIsLoading] = useState(true); // Estado de carga para el uso del placholder
  const [filteredVehiculos, setFilteredVehiculos] = useState(vehiculos); // Estado para filtrar vehículos por la barra

  useEffect(() => {
    const loadVehiculos = async () => {
      setIsLoading(true); // esta es la carga para el Skeleton placeholder
      await fetchVehiculos();
      setIsLoading(false); // Esta es la carga para el skeleton placeholder
    };
    loadVehiculos();
  }, [fetchVehiculos]);

  useEffect(() => {
    setFilteredVehiculos(vehiculos);
  }, [vehiculos]);

  //el query va a ser lo que voy escribiendo en el input de la bar
  const handleSearch = (query: string) => {
    const filtered = vehiculos.filter(
      vehiculo =>
        vehiculo.brand.toLowerCase().includes(query.toLowerCase()) ||
        vehiculo.model.toLowerCase().includes(query.toLowerCase()) ||
        vehiculo.id.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredVehiculos(filtered);
  };
 
  const handleAgregarVehiculo = () => {
    Swal.fire({
      title: 'Agregar Vehículo',
      html: `
        <input type="text" id="id" class="swal2-input" placeholder="Patente" oninput="this.value = formatPatente(this.value)">
        <input type="text" id="brand" class="swal2-input" placeholder="Marca">
        <input type="text" id="model" class="swal2-input" placeholder="Modelo">
        <input type="number" id="year" class="swal2-input" placeholder="Año">
      `,
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
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

         // Validación de la patente
        const validarPatente = (patente: string) => {
          const regex = /^(?:[A-Z]{3}-\d{3}|[A-Z]{2}-\d{3}-[A-Z]{2})$/;
        return regex.test(patente);
        }

        if (!id || !brand || !model || !year) {
          Swal.showValidationMessage('Completa todos los campos');
          return null;
        }

        if (!validarPatente(id)) {
          Swal.showValidationMessage('La patente no es válida');
          return null;
        }

        return { id, brand, model, year };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const vehiculo = {
          id: result.value.id,
          status: result.value.status,
          brand: result.value.brand,
          model: result.value.model,
          year: result.value.year,
          coordinates: {
            "latitude": -34.5347879,
            "longitude": -58.7133719
          },
        };

        createVehiculo(vehiculo);

        Swal.fire({
          title: "Vehículo agregado con éxito",
          text: "El nuevo vehículo ha sido creado y registrado correctamente.",
          icon: "success"
        });

      }
    });
  };

  return (
    <ProtectedRoute requiredModule="VEHICLES">

    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="md:text-4xl text-3xl font-bold text-blue-400 mb-4 sm:mb-0">Gestión de Vehículos</h1>
        <button
          onClick={handleAgregarVehiculo}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Agregar Vehículo
        </button>
      </div>

      {/* Aca llamo a mi componente de la barra de busqueda*/}
      <SearchBar onSearch={handleSearch} />

      {/* Renderizado de los skeleton loaders o las cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {isLoading ? (
          Array(6).fill(0).map((_, index) => (
            <div key={index} className="p-4 bg-gray-800 rounded-lg">
              <Skeleton height={200} baseColor="#2d3748"  // Fondo del placeholder (oscuro)
                highlightColor="#4a5568" />

              <Skeleton width={`80%`} height={20} style={{ marginTop: 10 }} baseColor="#2d3748"  // Fondo del placeholder (oscuro)
                highlightColor="#4a5568" />
              <Skeleton width={`60%`} height={20} style={{ marginTop: 10 }} baseColor="#2d3748"  // Fondo del placeholder (oscuro)
                highlightColor="#4a5568" />
              <Skeleton width={`50%`} height={20} style={{ marginTop: 10 }} baseColor="#2d3748"  // Fondo del placeholder (oscuro)
                highlightColor="#4a5568" />
            </div>
          ))
        ) : (
          filteredVehiculos.length > 0 ? (
            filteredVehiculos.map((vehiculo, index) => (
              <VehiculoCard key={index} vehiculo={vehiculo}/>
            ))
          ) : (
            <p className="text-center col-span-3 text-blue-300">No se encontraron vehículos</p>
          )
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default Vehiculos;