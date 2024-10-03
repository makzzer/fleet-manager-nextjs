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
  email: string;
  cuit: string;
  phone_number: string;
  address: string;
  date_created?: string;
  date_updated?: string;
}

const Proveedores = () => {
  const { proveedores, fetchProveedores, createProveedor } = useProveedor();
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProveedores, setFilteredProveedores] = useState(proveedores);

  // const [proveedoresLocales, setLocalProveedores] = useState(proveedores);
  /*
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el filtro de búsqueda
*/
  useEffect(() => {
    const loadProveedores = async () => {
      setIsLoading(true);
      await fetchProveedores();
      setIsLoading(false);
    };
    loadProveedores();
  }, [fetchProveedores]);

  // useEffect(() => {
  //   setLocalProveedores(proveedores);
  // }, [proveedores]);

  useEffect(() => {
    setFilteredProveedores(proveedores);
  }, [proveedores]);

  // Filtra los productos según el término de búsqueda
  /*
  useEffect(() => {
    if (searchTerm === "") {
      setLocalProveedores(proveedores);
    } else {
      setLocalProveedores(
        proveedores.filter((proveedor) =>
          proveedor.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, proveedores]);
  */

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
      <input type="text" id="name" class="swal2-input" placeholder="Name">
      <input type="text" id="email" class="swal2-input" placeholder="Email">
      <input type="text" id="cuit" class="swal2-input" placeholder="CUIT">
      <input type="text" id="phone_number" class="swal2-input" placeholder="Teléfono">
      <input type="text" id="address" class="swal2-input" placeholder="Dirección">
    `,
      confirmButtonText: "Agregar",
      showCancelButton: true,
      preConfirm: () => {
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

        // if ( !name ) {
        //   Swal.showValidationMessage("Completa todos los campos");
        //   return null;
        // }

        return { name, email, cuit, phone_number, address };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const proveedor: Proveedor = {
          id: result.value.id,
          name: result.value.name,
          email: result.value.email,
          cuit: result.value.cuit,
          phone_number: result.value.phone_number,
          address: result.value.address,
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
    <ProtectedRoute requiredModule="PROVIDERS">
      <div className="p-6 min-h-screen bg-gray-900 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-center  mb-6">
          <h1 className="md:text-4xl text-3xl font-bold text-blue-400 mb-4 sm:mb-0 ">
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
