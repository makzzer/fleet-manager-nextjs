"use client";
import React, { useEffect, useState } from "react";
import VehiculoCard from "../components/Cards/VehiculoCards";
import { useVehiculo, Vehiculo } from "../context/VehiculoContext";
import Swal from "sweetalert2";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SearchBar from "../../app/components/SearchBar/SearchBar";
import ProtectedRoute from "../components/Routes/ProtectedRoutes";
import { FiPlus, FiDownload } from "react-icons/fi"; // React Icons
import { useRouter } from "next/navigation";
import {
  generateExcelTemplate,
  processFile,
} from "../util/excelProcessor";

const Vehiculos = () => {
  const router = useRouter();
  const { vehiculos, fetchVehiculos, createVehiculo, exportVehiculosToExcel } =
    useVehiculo();
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
    filterVehiculos(query);
  };

  // Función para aplicar los filtros
  const filterVehiculos = (searchTerm = "") => {
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
      filtered = filtered.filter(
        (vehiculo) => vehiculo.fuel_type === fuelFilter
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (vehiculo) =>
          vehiculo.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehiculo.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehiculo.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredVehiculos(filtered.slice(0, loadMoreCount)); // Aplicamos paginación
  };

  // Función para cargar más vehículos
  const handleLoadMore = () => {
    setLoadMoreCount(loadMoreCount + 6);
    filterVehiculos(); // Aplicamos el filtro con el nuevo límite
  };

  // Despliega una alerta que te da a elegir dos opciones:
  // - Cargar un vehículo individualmente
  // - Cargar multiples vehículos de una sola vez 
  const handleAgregarVehiculo = () => {
    Swal.fire({
      title: "Agregar Vehículo",
      html: `
      <div class="grid grid-cols-2">
        <button id="addIndividual" class="swal2-confirm swal2-styled flex flex-col justify-center items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
          </svg>
          <span>Individual</span>
        </button>
        <button id="addMasivo" class="swal2-confirm swal2-styled flex flex-col justify-center items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
        </svg>
        <span>Carga Masiva</span>
        </button>
      </div>
      `,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      focusConfirm: false,
      customClass: {
        title: "text-white",
        popup: "bg-gray-800",
      },
      didOpen: () => {
        document
          .getElementById("addIndividual")
          ?.addEventListener("click", () => {
            Swal.close();
            router.push("/vehiculos/agregar");
          });
        document.getElementById("addMasivo")?.addEventListener("click", () => {
          Swal.close();
          handleCargaMasiva();
        });
      },
    });
  };

  const handleCargaMasiva = () => {
    Swal.fire({
      title: "Carga Masiva de Vehículos",
      html: `
          <div class="text-left mb-4">
            <p class="mb-2 ">Descargue la plantilla y luego suba el archivo Excel o CSV con los datos de los vehículos.</p>
            <p class="text-sm text-gray-300">Formatos aceptados: .xlsx, .xls, .csv</p>
          </div>
          <div class="flex justify-start space-x-4 mb-4">
            <button id="downloadTemplate" class="bg-blue-500 hover:bg-blue-600 text-white w-full font-bold py-2 px-4 rounded transition duration-200 ease-in-out">
              Descargar Plantilla
            </button>
          </div>
          <input type="file" id="fileUpload" accept=".xlsx, .xls, .csv" class="hidden">
          <div id="dropZone" class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition duration-200 ease-in-out">
            <p class="">Arrastre y suelte su archivo aquí</p>
            <p class="text-sm ">o haga clic para seleccionar</p>
          </div>
      `,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: "Cerrar",
      customClass: {
        popup: "rounded-lg bg-gray-800 text-white",
        title: "font-bold text-blue-500",
      },
      didOpen: () => {
        const dropZone = document.getElementById("dropZone");
        const fileUpload = document.getElementById(
          "fileUpload"
        ) as HTMLInputElement;

        document
          .getElementById("downloadTemplate")
          ?.addEventListener("click", generateExcelTemplate);

        dropZone?.addEventListener("click", () => fileUpload?.click());

        dropZone?.addEventListener("dragover", (e) => {
          e.preventDefault();
          dropZone.classList.add("border-blue-500");
        });

        dropZone?.addEventListener("dragleave", () => {
          dropZone.classList.remove("border-blue-500");
        });

        dropZone?.addEventListener("drop", (e) => {
          e.preventDefault();
          dropZone.classList.remove("border-blue-500");
          if (e.dataTransfer?.files.length) {
            handleFileUpload(e.dataTransfer.files[0]);
          }
        });

        fileUpload?.addEventListener("change", (e) => {
          const fileInput = e.target as HTMLInputElement;
          if (fileInput.files && fileInput.files[0]) {
            handleFileUpload(fileInput.files[0]);
          }
        });
      },
    });
  };

  const handleFileUpload = async (file: File) => {
    try {
      const formatedVehicles = await processFile(file);
      let successCount = 0;
      let failedCount = 0;

      console.log(formatedVehicles)
      for (const formatedVehicle of formatedVehicles) {
        try {
          const vehicle: Vehiculo = {
            ...formatedVehicle,
            coordinates: {
              latitude: formatedVehicle.latitude,
              longitude: formatedVehicle.longitude,
            },
          }
          const result = await createVehiculo(vehicle);
          if (result.resultado) {
            successCount++;
          } else {
            failedCount++;
          }
          // Actualizar la barra de progreso
          Swal.update({
            title: "Procesando vehículos...",
            html: `Procesados: ${successCount + failedCount} de ${
              formatedVehicles.length
            }
                   <div class="progress-bar-container">
                     <div class="progress-bar" style="width: ${
                       ((successCount + failedCount) / formatedVehicles.length) * 100
                     }%"></div>
                   </div>`,
          });
        } catch (error) {
          console.error("Error creando vehículo:", error);
          failedCount++;
        }
      }

      await Swal.fire({
        title: "Carga completada",
        html: `Vehículos agregados exitosamente: ${successCount}<br>Fallidos: ${failedCount}`,
        icon: "success",
      });

      fetchVehiculos(); // Actualizar la lista de vehículos
    } catch (error) {
      console.error("Error processing file:", error);
      Swal.fire("Error", "Hubo un problema al procesar el archivo", "error");
    }
  };

  return (
    <ProtectedRoute requiredModule="VEHICLES">
      <div className="p-6 bg-gray-900 rounded-xl min-h-screen text-white">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="md:text-4xl text-3xl font-bold text-blue-400 mb-4 sm:mb-0">
            Gestión de Vehículos
          </h1>

          {/* Botones mejorados con responsividad */}
          <div className="flex space-x-4">
            <button
              onClick={handleAgregarVehiculo}
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out"
            >
              <FiPlus className="h-5 w-5 mr-2" /> {/* Icono */}
              <span className="hidden sm:inline">Agregar Vehículo</span>{" "}
              {/* Texto se oculta en pantallas pequeñas */}
            </button>

            <button
              onClick={exportVehiculosToExcel}
              className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out"
            >
              <FiDownload className="h-5 w-5 mr-2" /> {/* Icono */}
              <span className="hidden sm:inline">Exportar a Excel</span>{" "}
              {/* Texto se oculta en pantallas pequeñas */}
            </button>
          </div>
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
            <label htmlFor="showUnavailable">
              Mostrar vehículos deshabilitados
            </label>
          </div>

          {/* Filtro por Carga Soportada de vehículo */}
          <select
            className="bg-gray-800 text-white py-2 px-4 rounded"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">Todas las cargas</option>
            <option value="Camión">Menos de 1 Tonelada</option>
            <option value="Auto">De 1 a 2 Toneladas</option>
            <option value="Barco">Mas de 2 toneladas</option>
          </select>

          {/* Filtro por tipo de combustible */}
          <select
            className="bg-gray-800 text-white py-2 px-4 rounded"
            value={fuelFilter}
            onChange={(e) => setFuelFilter(e.target.value)}
          >
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
                  <Skeleton
                    height={200}
                    baseColor="#2d3748"
                    highlightColor="#4a5568"
                  />
                  <Skeleton
                    width={`80%`}
                    height={20}
                    style={{ marginTop: 10 }}
                    baseColor="#2d3748"
                    highlightColor="#4a5568"
                  />
                  <Skeleton
                    width={`60%`}
                    height={20}
                    style={{ marginTop: 10 }}
                    baseColor="#2d3748"
                    highlightColor="#4a5568"
                  />
                  <Skeleton
                    width={`50%`}
                    height={20}
                    style={{ marginTop: 10 }}
                    baseColor="#2d3748"
                    highlightColor="#4a5568"
                  />
                </div>
              ))
          ) : filteredVehiculos.length > 0 ? (
            filteredVehiculos.map((vehiculo, index) => (
              <VehiculoCard key={index} vehiculo={vehiculo} />
            ))
          ) : (
            <p className="text-center col-span-3 text-blue-300">
              No se encontraron vehículos
            </p>
          )}
        </div>

        {/* Botón de ver más */}
        {filteredVehiculos.length > 0 &&
          filteredVehiculos.length < vehiculos.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLoadMore}
                className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Ver más
              </button>
            </div>
          )}
      </div>
    </ProtectedRoute>
  );
};

export default Vehiculos;
