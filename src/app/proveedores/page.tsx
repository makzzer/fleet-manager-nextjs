"use client";

import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import ProtectedRoute from "../components/Routes/ProtectedRoutes";
import Swal from "sweetalert2";
import ProveedorCard from "../components/Cards/ProveedorCards";
import { useProveedor } from "../context/ProveedorContext";
import { FaDownload, FaPlusCircle } from "react-icons/fa";
import { TextField, InputAdornment } from "@mui/material";
import { FaSearch } from "react-icons/fa";

interface Proveedor {
  id: string;
  name: string;
  email: string;
  cuit: string;
  phone_number: string;
  address: string;
}

const Proveedores = () => {
  const {
    proveedores,
    fetchProveedores,
    createProveedor,
    exportProveedorToExcel,
  } = useProveedor();
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProveedores, setFilteredProveedores] = useState<Proveedor[]>(
    []
  );
  const [loadMoreCount, setLoadMoreCount] = useState(6); // Para cargar de a 6
  const [nameSearchTerm, setNameSearchTerm] = useState("");
  const [emailSearchTerm, setEmailSearchTerm] = useState("");
  const [addressSearchTerm, setAddressSearchTerm] = useState("");

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

  useEffect(() => {
    let filtered = proveedores;

    // Filtrado por nombre
    if (nameSearchTerm) {
      filtered = filtered.filter((proveedor) =>
        proveedor.name.toLowerCase().includes(nameSearchTerm.toLowerCase())
      );
    }

    // Filtrado por email
    if (emailSearchTerm) {
      filtered = filtered.filter((proveedor) =>
        proveedor.email.toLowerCase().includes(emailSearchTerm.toLowerCase())
      );
    }

    // Filtrado por dirección
    if (addressSearchTerm) {
      filtered = filtered.filter((proveedor) =>
        proveedor.address
          .toLowerCase()
          .includes(addressSearchTerm.toLowerCase())
      );
    }

    setFilteredProveedores(filtered);
  }, [proveedores, nameSearchTerm, emailSearchTerm, addressSearchTerm]);

  const handleLoadMore = () => {
    setLoadMoreCount(loadMoreCount + 6); // Cargar 6 proveedores más
  };

  const handleDesplegarOpciones = () => {
    Swal.fire({
      //libreria s. alert
      title: "Agregar Proveedor",
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
            handleAgregarProveedor();
          });
        document.getElementById("addMasivo")?.addEventListener("click", () => {
          Swal.close();
          // handleCargaMasiva();
        });
      },
    });
  };

  const handleAgregarProveedor = () => {
    Swal.fire({
      title: "Agregar Proveedor",
      html: `
      <input type="text" id="name" class="swal2-input" placeholder="Nombre">
      <input type="text" id="email" class="swal2-input" placeholder="Email">
      <input type="text" id="cuit" class="swal2-input" placeholder="CUIT">
      <input type="text" id="phone_number" class="swal2-input" placeholder="Teléfono">
      <input type="text" id="street" class="swal2-input" placeholder="Calle">
      <input type="text" id="number" class="swal2-input" placeholder="Número">
      <input type="text" id="locality" class="swal2-input" placeholder="Localidad">
    `,
      confirmButtonText: "Agregar",
      showCancelButton: true,
      preConfirm: async () => {
        const nameElement = document.getElementById("name") as HTMLInputElement;
        const emailElement = document.getElementById(
          "email"
        ) as HTMLInputElement;
        const cuitElement = document.getElementById("cuit") as HTMLInputElement;
        const phone_numberElement = document.getElementById(
          "phone_number"
        ) as HTMLInputElement;
        const streetElement = document.getElementById(
          "street"
        ) as HTMLInputElement;
        const numberElement = document.getElementById(
          "number"
        ) as HTMLInputElement;
        const localityElement = document.getElementById(
          "locality"
        ) as HTMLInputElement;

        const name = nameElement?.value;
        const email = emailElement?.value;
        const cuit = cuitElement?.value;
        const phone_number = phone_numberElement?.value;
        const street = streetElement?.value;
        const number = numberElement?.value;
        const locality = localityElement?.value;

        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const cuitRegex = /^\d{2}-\d{8}-\d{1}$/;
        const telefonoRegex = /^(?=(?:\D*\d){10})(?:\d+-?){0,2}\d+$/;
        const streetRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.]+$/; // Regex para la calle
        const numberRegex = /^\d+$/; // Regex para el número
        const localityRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; // Regex para la localidad

        if (!name || !nameRegex.test(name)) {
          Swal.showValidationMessage(
            "Nombre inválido. El nombre no puede estar vacío ni contener caracteres especiales o números."
          );
          return null;
        }

        if (!email || !emailRegex.test(email)) {
          Swal.showValidationMessage(
            "Email inválido. El email no puede estar vacío, además debe contener un solo '@' y un formato válido."
          );
          return null;
        }

        if (!cuit || !cuitRegex.test(cuit)) {
          Swal.showValidationMessage(
            "CUIT inválido. Debe seguir el formato 00-00000000-0."
          );
          return null;
        }

        if (!phone_number || !telefonoRegex.test(phone_number)) {
          Swal.showValidationMessage(
            "Teléfono inválido. Debe contener solo números y opcionalmente guiones."
          );
          return null;
        }

        if (!street || !streetRegex.test(street)) {
          Swal.showValidationMessage("Calle inválida.");
          return null;
        }

        if (!number || !numberRegex.test(number)) {
          Swal.showValidationMessage("Número inválido.");
          return null;
        }

        if (!locality || !localityRegex.test(locality)) {
          Swal.showValidationMessage("Localidad inválida.");
          return null;
        }

        return {
          name,
          email,
          cuit,
          phone_number,
          address: `${street} ${number}, ${locality}`,
        };
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
          console.error(error)
          Swal.fire(
            "Error",
            "Hubo un problema al agregar el proveedor",
            "error"
          );
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
              onClick={handleDesplegarOpciones}
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

        {/* Filtros independientes */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <TextField
            label="Filtrar por nombre"
            variant="outlined"
            value={nameSearchTerm}
            onChange={(e) => setNameSearchTerm(e.target.value)}
            fullWidth
            className="bg-gray-800 text-white rounded-lg shadow-md border border-gray-600 transition-all duration-300 ease-in-out hover:shadow-lg focus:shadow-lg"
            InputProps={{
              style: { color: "#fff" },
              startAdornment: (
                <InputAdornment position="start">
                  <FaSearch className="text-gray-300" />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              style: { color: "#b0b0b0" },
            }}
          />
          <TextField
            label="Filtrar por Email"
            variant="outlined"
            value={emailSearchTerm}
            onChange={(e) => setEmailSearchTerm(e.target.value)}
            fullWidth
            className="bg-gray-800 text-white rounded-lg shadow-md border border-gray-600 transition-all duration-300 ease-in-out hover:shadow-lg focus:shadow-lg"
            InputProps={{
              style: { color: "#fff" },
              startAdornment: (
                <InputAdornment position="start">
                  <FaSearch className="text-gray-300" />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              style: { color: "#b0b0b0" },
            }}
          />
          <TextField
            label="Filtrar por Dirección"
            variant="outlined"
            value={addressSearchTerm}
            onChange={(e) => setAddressSearchTerm(e.target.value)}
            fullWidth
            className="bg-gray-800 text-white rounded-lg shadow-md border border-gray-600 transition-all duration-300 ease-in-out hover:shadow-lg focus:shadow-lg"
            InputProps={{
              style: { color: "#fff" },
              startAdornment: (
                <InputAdornment position="start">
                  <FaSearch className="text-gray-300" />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              style: { color: "#b0b0b0" },
            }}
          />
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
