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
  const [isLoading, setIsLoading] = useState(true);
  const [filteredVehiculos, setFilteredVehiculos] = useState(vehiculos);
  const [showUnavailable, setShowUnavailable] = useState(false); // Filtro para ocultar/mostrar vehículos deshabilitados
  const [typeFilter, setTypeFilter] = useState(""); // Filtro por tipo de vehículo
  const [fuelFilter, setFuelFilter] = useState(""); // Filtro por tipo de combustible
  const [loadMoreCount, setLoadMoreCount] = useState(6); // Cantidad de vehículos a cargar inicialmente

  useEffect(() => {
    const loadVehiculos = async () => {
      setIsLoading(true);
      await fetchVehiculos();
      setIsLoading(false);
    };
    loadVehiculos();
  }, [fetchVehiculos]);

  useEffect(() => {
    filterVehiculos();
  }, [vehiculos, showUnavailable, typeFilter, fuelFilter]);

  const handleSearch = (query: string) => {
    const filtered = vehiculos.filter(
      vehiculo =>
        vehiculo.brand.toLowerCase().includes(query.toLowerCase()) ||
        vehiculo.model.toLowerCase().includes(query.toLowerCase()) ||
        vehiculo.id.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredVehiculos(filtered);
  };

  // Función para aplicar los filtros
  const filterVehiculos = () => {
    let filtered = vehiculos;

    // Filtro por disponibilidad
    if (!showUnavailable) {
      filtered = filtered.filter((vehiculo) => vehiculo.status === "AVAILABLE");
    }

    // Filtro por tipo de vehículo
    if (typeFilter) {
      filtered = filtered.filter((vehiculo) => vehiculo.type === typeFilter);
    }

    // Filtro por tipo de combustible
    if (fuelFilter) {
      filtered = filtered.filter((vehiculo) => vehiculo.fuel === fuelFilter);
    }

    setFilteredVehiculos(filtered.slice(0, loadMoreCount)); // Aplicamos paginación
  };

  // Función para cargar más vehículos
  const handleLoadMore = () => {
    setLoadMoreCount(loadMoreCount + 6);
    filterVehiculos(); // Aplicamos el filtro con el nuevo límite
  };

  const handleAgregarVehiculo = () => {
    // Lista de marcas de vehículos
  const marcas = ['Toyota', 'Ford', 'Chevrolet', 'Honda', 'Nissan', 'Volkswagen', 'Fiat'];

  const camiones = {
    marcas: [
      {
        marca: 'Toyota',
        modelos: ['Hino 300', 'Dyna', 'Toyotace']
      },
      {
        marca: 'Ford',
        modelos: ['F-750', 'Cargo 1723', 'Transit Chasis']
      },
      {
        marca: 'Chevrolet',
        modelos: ['N-Series', 'T-Series', 'C4500 Kodiak']
      },
      {
        marca: 'Volkswagen',
        modelos: ['Constellation 24.280', 'Delivery 9.170', 'Worker 17.220']
      },
      {
        marca: 'Mercedes-Benz',
        modelos: ['Atego 1726', 'Accelo 1016', 'Actros 2545']
      }
    ]
  };


  const obtenerOpcionesAnios = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 30;
    let opciones = '';

    for (let i = currentYear; i >= startYear; i--) {
      opciones += `<option value="${i}">${i}</option>`;
    }

    return opciones;
  };


   // Construir las opciones del select
   const opcionesMarcas = camiones.marcas.map(marca => `<option value="${marca.marca}">${marca.marca}</option>`).join('');

// Función que construye las opciones de modelos para una marca específica
const obtenerOpcionesModelos = (marcaSeleccionada: string) => {
  const marca = camiones.marcas.find(m => m.marca === marcaSeleccionada);
  if (marca) {
    return marca.modelos.map(modelo => `<option value="${modelo}">${modelo}</option>`).join('');
  }
  return '<option value="" disabled>No hay modelos disponibles</option>'; // Si no hay modelos
};

    Swal.fire({
      title: 'Agregar Vehículo',
      html: `
      <style>
        input.swal2-input, select.swal2-select {
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 10px;
          width: 80%;
          height: 54px;
          margin-top: 5px;
          margin-bottom: 10px;
          box-sizing: border-box;
        }
      
      </style>
        <input type="text" id="id" class="swal2-input" placeholder="Patente" oninput="this.value">
        <select id="brand" class="swal2-select">
        <option value="" disabled selected>Seleccione una marca</option>
        ${opcionesMarcas}
        </select>
    <select id="model" class="swal2-select" disabled>
      <option value="" disabled selected>Seleccione una marca primero</option>
    </select>

    <select id="year" class="swal2-select">
    <option value="" disabled selected>Selecciona un año</opcion>
      ${obtenerOpcionesAnios()}
      </select>
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
      },
      didOpen: () => {
        const brandSelect = document.getElementById('brand') as HTMLSelectElement;
        const modelSelect = document.getElementById('model') as HTMLSelectElement;

        brandSelect.addEventListener('change', function () {
          const marcaSeleccionada = brandSelect.value;
          const marca = camiones.marcas.find(m => m.marca === marcaSeleccionada);
          
          if (marca) {
            const opcionesModelos = marca.modelos.map(modelo => `<option value="${modelo}">${modelo}</option>`).join('');
            modelSelect.innerHTML = opcionesModelos;
            modelSelect.disabled = false;
          } else {
            modelSelect.disabled = true;
            modelSelect.innerHTML = '<option value="" disabled selected>Seleccione una marca primero</option>';
          }
        });
      }
            }).then(async (result) => {
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

        const { resultado, mensaje } = await createVehiculo(vehiculo);

        if (resultado) {
          Swal.fire({
            title: "Vehículo agregado con éxito",
            text: "El nuevo vehículo ha sido creado y registrado correctamente.",
            icon: "success",
          });
        } else {
          if (mensaje && mensaje.includes("already exists")) {
            Swal.fire({
              title: "Error al agregar vehículo",
              text: "La patente ya existe. Por favor, usa una diferente.",
              icon: "error",
            });
          } else {
            Swal.fire({
              title: "Error",
              text: "Ha ocurrido un error al crear el vehículo.",
              icon: "error",
            });
          }
        }

      }
    });
  };
  return (
    <ProtectedRoute requiredModule="VEHICLES">
      <div className="p-6 bg-gray-900 min-h-screen text-white">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="md:text-4xl text-3xl font-bold text-blue-400 mb-4 sm:mb-0">
            Gestión de Vehículos
          </h1>
          <button
            onClick={handleAgregarVehiculo}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Agregar Vehículo
          </button>
        </div>

        {/* Barra de búsqueda */}
        <SearchBar onSearch={handleSearch} />

        {/* Filtros */}
        <div className="flex flex-col mt-4 sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showUnavailable"
              className="form-checkbox"
              checked={showUnavailable}
              onChange={() => setShowUnavailable(!showUnavailable)}
            />
            <label htmlFor="showUnavailable">Mostrar vehículos deshabilitados</label>
          </div>

          {/* Filtro por Carga Soportada de vehículo */}
          <select
            className="bg-gray-800 text-white py-2 px-4 rounded"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">Todas las cargas</option>
            <option value="Camión">Menos de 1 Tonelada</option>
            <option value="Auto">De 1 a 2 Toneladas</option>
            <option value="Barco">Mas de 2 toneladas</option>
          </select>

          {/* Filtro por tipo de combustible */}
          <select
            className="bg-gray-800 text-white py-2 px-4 rounded"
            value={fuelFilter}
            onChange={(e) => setFuelFilter(e.target.value)}>
            <option value="">Todos los combustibles</option>
            <option value="Gasoil">Gasoil</option>
            <option value="Eléctrico">Eléctrico</option>
          </select>
        </div>

        {/* Renderizado de vehículos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {isLoading ? (
            Array(6)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="p-4 bg-gray-800 rounded-lg">
                  <Skeleton height={200} baseColor="#2d3748" highlightColor="#4a5568" />
                  <Skeleton width={`80%`} height={20} style={{ marginTop: 10 }} baseColor="#2d3748" highlightColor="#4a5568" />
                  <Skeleton width={`60%`} height={20} style={{ marginTop: 10 }} baseColor="#2d3748" highlightColor="#4a5568" />
                  <Skeleton width={`50%`} height={20} style={{ marginTop: 10 }} baseColor="#2d3748" highlightColor="#4a5568" />
                </div>
              ))
          ) : filteredVehiculos.length > 0 ? (
            filteredVehiculos.map((vehiculo, index) => (
              <VehiculoCard key={index} vehiculo={vehiculo} />
            ))
          ) : (
            <p className="text-center col-span-3 text-blue-300">No se encontraron vehículos</p>
          )}
        </div>

        {/* Botón de ver más */}
        {filteredVehiculos.length > 0 && filteredVehiculos.length < vehiculos.length && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleLoadMore}
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              Ver más
            </button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Vehiculos;