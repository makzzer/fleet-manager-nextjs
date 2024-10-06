"use client";

import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import ProtectedRoute from "../components/Routes/ProtectedRoutes";
import Swal from "sweetalert2";
import ProveedorCard from "../components/Cards/ProveedorCards";
import { useProveedor } from "../context/ProveedorContext";

const Proveedores = () => {
  const { proveedores, fetchProveedores, createProveedor } = useProveedor();
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
      <div className="p-6 min-h-screen bg-gray-900 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="md:text-4xl text-3xl font-bold text-blue-400 mb-4 sm:mb-0">
            Gestión de Proveedores
          </h1>
          <button
            onClick={handleAgregarProveedor}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Agregar Proveedor
          </button>
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