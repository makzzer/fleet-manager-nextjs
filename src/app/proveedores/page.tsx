"use client";

import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import ProtectedRoute from "../components/Routes/ProtectedRoutes";
import Swal from "sweetalert2";
import ProveedorCard from "../components/Cards/ProveedorCards";
import { useProveedor } from "../context/ProveedorContext";
import { FaDownload, FaPlusCircle } from "react-icons/fa";

const Proveedores = () => {
  const { proveedores, fetchProveedores, createProveedor, exportProveedorToExcel } = useProveedor();
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProveedores, setFilteredProveedores] = useState([]);
  const [loadMoreCount, setLoadMoreCount] = useState(6); // Para cargar de a 6

  useEffect(() => {
    const loadProveedores = async () => {
      setIsLoading(true);
      await fetchProveedores();
      setIsLoading(false);
    };
    loadProveedores();
  }, [fetchProveedores]);

  useEffect(() => {
    setFilteredProveedores(proveedores.slice(0, loadMoreCount)); // Mostrar los primeros 6 proveedores
  }, [proveedores, loadMoreCount]);

  const handleLoadMore = () => {
    setLoadMoreCount(loadMoreCount + 6); // Cargar 6 proveedores más
  };

  const handleAgregarProveedor = () => {
    Swal.fire({
      title: "Agregar Proveedor",
      html: `
      <input type="text" id="name" class="swal2-input" placeholder="Nombre">
      <input type="text" id="email" class="swal2-input" placeholder="Email">
      <input type="text" id="cuit" class="swal2-input" placeholder="CUIT">
      <input type="text" id="phone_number" class="swal2-input" placeholder="Teléfono">
      <input type="text" id="address" class="swal2-input" placeholder="Dirección">
    `,
      confirmButtonText: "Agregar",
      showCancelButton: true,
      preConfirm: async () => {
        const nameElement = document.getElementById("name") as HTMLInputElement;
        const emailElement = document.getElementById("email") as HTMLInputElement;
        const cuitElement = document.getElementById("cuit") as HTMLInputElement;
        const phone_numberElement = document.getElementById("phone_number") as HTMLInputElement;
        const addressElement = document.getElementById("address") as HTMLInputElement;

        const name = nameElement?.value;
        const email = emailElement?.value;
        const cuit = cuitElement?.value;
        const phone_number = phone_numberElement?.value;
        const address = addressElement?.value;

        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const cuitRegex = /^\d{2}-\d{8}-\d{1}$/;
        const telefonoRegex = /^(?=(?:\D*\d){10})(?:\d+-?){0,2}\d+$/;
        const direccionRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.]+ \d+, [a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; // este regex respeta formato (calle numero, localidad)

        if (!name || !nameRegex.test(name)) {
          Swal.showValidationMessage("Nombre inválido. El nombre no puede estar vacío ni contener caracteres especiales o números.");
          return null;
        }

        if (!email || !emailRegex.test(email)) {
          Swal.showValidationMessage("Email inválido. El email no puede estar vacío, además debe contener un solo '@' y un formato válido.");
          return null;
        }

        if (!cuit || !cuitRegex.test(cuit)) {
          Swal.showValidationMessage("CUIT inválido. Debe seguir el formato 00-00000000-0.");
          return null;
        }

        if (!phone_number || !telefonoRegex.test(phone_number)) {
          Swal.showValidationMessage("Teléfono inválido. Debe contener solo números y opcionalmente guiones.");
          return null;
        }

        if (!address || !direccionRegex.test(address)) {
          Swal.showValidationMessage("Dirección inválida. No debe contener caracteres especiales (excepto '.' y ',').");
          return null;
        }

        return { name, email, cuit, phone_number, address };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        const proveedor = {
          id: result.value.id,
          name: result.value.name,
          email: result.value.email,
          cuit: result.value.cuit,
          phone_number: result.value.phone_number,
          address: result.value.address,
        };

        try {
          await createProveedor(proveedor);
          Swal.fire("Proveedor agregado con éxito", "", "success");
        } catch (error) {
          Swal.fire("Error", "Hubo un problema al agregar el proveedor", "error");
        }
      }
    });
  };

  return (
    <ProtectedRoute requiredModule="PROVIDERS">
      <div className="p-6 min-h-screen bg-gray-900 rounded-xl text-white">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="md:text-4xl text-3xl font-bold text-blue-400 mb-4 sm:mb-0">
            Gestión de Proveedores
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleAgregarProveedor}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-md transition-all duration-300 ease-in-out flex items-center justify-center"
            >
              <FaPlusCircle className="mr-2" /> Agregar Proveedor
            </button>
            <button
              onClick={exportProveedorToExcel}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-md transition-all duration-300 ease-in-out flex items-center justify-center"
            >
              <FaDownload className="mr-2" /> Descargar XML
            </button>
          </div>
        </div>

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
                </div>
              ))
          ) : filteredProveedores.length > 0 ? (
            filteredProveedores.map((proveedor, index) => (
              <ProveedorCard key={index} proveedor={proveedor} />
            ))
          ) : (
            <p className="text-center col-span-3 text-blue-300">
              No se encontraron proveedores
            </p>
          )}
        </div>

        {filteredProveedores.length < proveedores.length && (
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

export default Proveedores;