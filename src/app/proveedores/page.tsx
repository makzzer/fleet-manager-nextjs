"use client";

import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import ProtectedRoute from "../components/Routes/ProtectedRoutes";


// import Link from "next/link";
// import { FaUserTie, FaEnvelope, FaPhone, FaEnvelopeSquare } from 'react-icons/fa';
import Swal from "sweetalert2";
import ProveedorCard from "../components/Cards/ProveedorCards";
import { useProveedor } from "../context/ProveedorContext";

interface Proveedor {
  id: string;
  name: string;
  cuit: string;
  direccion: string;
  telefono: string;
}

const Proveedores = () => {
  const { proveedores, fetchProveedores, createProveedor } = useProveedor();
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProveedores, setFilteredProveedores] = useState(proveedores);

  const [proveedoresLocales, setLocalProveedores] = useState(proveedores);

  const [searchTerm, setSearchTerm] = useState(''); // Estado para el filtro de búsqueda

  useEffect(() => {
    const loadProveedores = async () => {
      setIsLoading(true);
      await fetchProveedores();
      setIsLoading(false);
    };
    loadProveedores();
  }, [fetchProveedores]);

  useEffect(() => {
    setFilteredProveedores(proveedores);
  }, [proveedores]);

  // Filtra los productos según el término de búsqueda
  useEffect(() => {
    if (searchTerm === '') {
      setLocalProveedores(proveedores);
    } else {
      setLocalProveedores(
        proveedores.filter((proveedor) =>
          proveedor.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, proveedores]);

  //el query va a ser lo que voy escribiendo en el input de la bar
  // const handleSearch = (query: string) => {
  //   const filtered = proveedores.filter(
  //     proveedor =>
  //       proveedor.name.toLowerCase().includes(query.toLowerCase()) ||
  //       proveedor.cuit.toLowerCase().includes(query.toLowerCase()) ||
  //       proveedor.direccion.toLowerCase().includes(query.toLowerCase()) ||
  //       proveedor.telefono.toLowerCase().includes(query.toLowerCase())
  //   );
  //   setFilteredProveedores(filtered);
  // };

  // futuro buscador local
  // const handleFilter = (filters: { searchTerm: string; selectedProveedor: string }) => {
  //   const { searchTerm } = filters;
  //   if (searchTerm === '') {
  //     setLocalProveedores(proveedores); // Muestra todos los productos si no hay búsqueda
  //   } else {
  //     setLocalProveedores(
  //       proveedores.filter((proveedor) =>
  //         // solo filtro por nombre.
  //         proveedor.name.toLowerCase().includes(searchTerm.toLowerCase())
  //       )
  //     );
  //   }
  // };

  const handleAgregarProveedor = () => {
    Swal.fire({
      title: "Agregar Proveedor",
      html: `
      <input type="text" id="id" class="swal2-input" placeholder="ID">
      <input type="text" id="nombre" class="swal2-input" placeholder="Nombre">
      <input type="text" id="cuit" class="swal2-input" placeholder="CUIT">
      <input type="text" id="direccion" class="swal2-input" placeholder="Dirección">
      <input type="text" id="telefono" class="swal2-input" placeholder="Teléfono">
    `,
      confirmButtonText: "Agregar",
      showCancelButton: true,
      preConfirm: () => {
        const idElement = document.getElementById('ID') as HTMLInputElement;
        const nombreElement = document.getElementById('nombre') as HTMLInputElement;
        const cuitElement = document.getElementById('cuit') as HTMLInputElement;
        const direccionElement = document.getElementById('direccion') as HTMLInputElement;
        const telefonoElement = document.getElementById('telefono') as HTMLInputElement;

        const id = idElement?.value;
        const nombre = nombreElement?.value;
        const cuit = cuitElement?.value;
        const direccion = direccionElement?.value;
        const telefono = telefonoElement?.value;

        if (!nombre || !cuit || !direccion || !telefono) {
          Swal.showValidationMessage("Completa todos los campos");
          return null;
        }

        return { id, nombre, cuit, direccion, telefono };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const proveedor: Proveedor = {
          id: result.value.id,
          name: result.value.name,
          cuit: result.value.cuit,
          direccion: result.value.direccion,
          telefono: result.value.telefono,
        };

        createProveedor(proveedor);

        Swal.fire({
          title: "Proveedor agregado con éxito",
          icon: "success",
        });
      }
    });
  };


  return (
    <ProtectedRoute>
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

      {/* Renderizado de los skeleton loaders o las cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {isLoading ? (
                    Array(6).fill(0).map((_, index) => (
                        <div key={index} className="p-4 bg-gray-800 rounded-lg">
                            <Skeleton height={200} baseColor="#2d3748"
                                highlightColor="#4a5568" />

                            <Skeleton width={`80%`} height={20} style={{ marginTop: 10 }} baseColor="#2d3748"
                                highlightColor="#4a5568" />
                            <Skeleton width={`60%`} height={20} style={{ marginTop: 10 }} baseColor="#2d3748"
                                highlightColor="#4a5568" />
                            <Skeleton width={`50%`} height={20} style={{ marginTop: 10 }} baseColor="#2d3748"
                                highlightColor="#4a5568" />
                        </div>
                    ))
                ) : (
                    filteredProveedores.length > 0 ? (
                        filteredProveedores.map((proveedor, index) => (
                            <ProveedorCard key={index} proveedor={proveedor} />
                        ))
                    ) : (
                        <p className="text-center col-span-3 text-blue-300">No se encontraron proveedores</p>
                    )
                )}
            </div> */}

      {/* Renderizado de los skeleton loaders o las cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {isLoading ? (
          Array(6).fill(0).map((_, index) => (
            <div key={index} className="p-4 bg-gray-800 rounded-lg">
              <Skeleton height={200} baseColor="#2d3748" highlightColor="#4a5568" />
              <Skeleton width={`80%`} height={20} style={{ marginTop: 10 }} baseColor="#2d3748" highlightColor="#4a5568" />
              <Skeleton width={`60%`} height={20} style={{ marginTop: 10 }} baseColor="#2d3748" highlightColor="#4a5568" />
              <Skeleton width={`50%`} height={20} style={{ marginTop: 10 }} baseColor="#2d3748" highlightColor="#4a5568" />
            </div>
          ))
        ) : proveedoresLocales.length > 0 ? (
          proveedoresLocales.map((proveedor, index) => (
            <ProveedorCard key={index} proveedor={proveedor} />
          ))
        ) : (
          <p className="text-center col-span-3 text-blue-300">No se encontraron proveedores</p>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default Proveedores;

// reemplazo de proveedores locales.
// : filteredProveedores.length > 0 ? (
//   filteredProveedores.map((proveedor, index) => (
//     <ProveedorCard key={index} proveedor={proveedor} />
//   ))
// )