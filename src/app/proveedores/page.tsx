'use client';

import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";

// import Link from "next/link";
// import { FaUserTie, FaEnvelope, FaPhone, FaEnvelopeSquare } from 'react-icons/fa';
import Swal from "sweetalert2";

// arriba del return:
// const handleAgregarProveedor = () => {
//     Swal.fire({
//       title: 'Agregar Vehículo',
//       html: `
//         <input type="text" id="id" class="swal2-input" placeholder="Patente">
//         <input type="text" id="brand" class="swal2-input" placeholder="Marca">
//         <input type="text" id="model" class="swal2-input" placeholder="Modelo">
//         <input type="number" id="year" class="swal2-input" placeholder="Año">
//       `,
//       confirmButtonText: 'Agregar',
//       focusConfirm: false,
//       preConfirm: () => {
//         const idElement = document.getElementById('id') as HTMLInputElement;
//         const brandElement = document.getElementById('brand') as HTMLInputElement;
//         const modelElement = document.getElementById('model') as HTMLInputElement;
//         const yearElement = document.getElementById('year') as HTMLInputElement;

//         const id = idElement?.value;
//         const brand = brandElement?.value;
//         const model = modelElement?.value;
//         const year = yearElement?.value;

//         if (!id || !brand || !model || !year) {
//           Swal.showValidationMessage('Completa todos los campos');
//           return null;
//         }

//         return { id, brand, model, year };
//       }
//     }).then((result) => {
//       if (result.isConfirmed && result.value) {
//         const vehiculo = {
//           id: result.value.id,
//           brand: result.value.brand,
//           model: result.value.model,
//           year: result.value.year,
//           coordinates: {
//             "latitude": -34.5347879,
//             "longitude": -58.7133719
//           },
//         };

//         createProveedor(proveedor);

//         Swal.fire({
//           title: "Vehículo agregado con éxito",
//           text: "El nuevo vehículo ha sido creado y registrado correctamente.",
//           icon: "success"
//         });

//       }
//     });
//   };

const Proveedores = () => {

    //abajo de proveedor:
    //const { proveedores, fetchProveedores, createProveedores } = useProveedores();
    const [isLoading, setIsLoading] = useState(true); // Estado de carga para el uso del placholder
    // const [filteredVehiculos, setFilteredVehiculos] = useState(proveedores); // Estado para filtrar proveedores por la barra

    // useEffect(() => {
    //     const loadVehiculos = async () => {
    //         setIsLoading(true); // esta es la carga para el Skeleton placeholder
    //         await fetchProveedores();
    //         setIsLoading(false); // Esta es la carga para el skeleton placeholder
    //     };
    //     loadVehiculos();
    // }, [fetchProveedores]);

    // useEffect(() => {
    //     setFilteredVehiculos(proveedores);
    // }, [proveedores]);

    const handleAgregarProveedor = () => {
        Swal.fire({
            title: 'Agregar Proveedor',
            html: `
            <input type="text" id="id" class="swal2-input" placeholder="Id">
            <input type="text" id="nombre" class="swal2-input" placeholder="Nombre">
            <input type="text" id="cuit" class="swal2-input" placeholder="CUIT">
            <input type="text" id="direccion" class="swal2-input" placeholder="Dirección">
            <input type="text" id="telefono" class="swal2-input" placeholder="Teléfono">
          `,
            confirmButtonText: 'Agregar',
            focusConfirm: false,
            preConfirm: () => {
                const idElement = document.getElementById('id') as HTMLInputElement;
                const nombreElement = document.getElementById('nombre') as HTMLInputElement;
                const cuitElement = document.getElementById('cuit') as HTMLInputElement;
                const direccionElement = document.getElementById('direccion') as HTMLInputElement;
                const telefonoElement = document.getElementById('telefono') as HTMLInputElement;

                const id = idElement?.value;
                const nombre = nombreElement?.value;
                const cuit = cuitElement?.value;
                const direccion = direccionElement?.value;
                const telefono = telefonoElement?.value;

                if (!id || !nombre || !cuit || !direccion || !telefono) {
                    Swal.showValidationMessage('Completa todos los campos');
                    return null;
                }

                return { id, nombre, cuit, direccion, telefono };
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                const proveedor = {
                    id: result.value.id,
                    nombre: result.value.nombre,
                    cuit: result.value.cuit,
                    direccion: result.value.direccion,
                    telefono: result.value.telefono,
                };

                //   createProveedor(proveedor);

                Swal.fire({
                    title: "Vehículo agregado con éxito",
                    text: "El nuevo vehículo ha sido creado y registrado correctamente.",
                    icon: "success"
                });
            }
        });
    };


    return (
        <div className="p-6 min-h-screen bg-gray-900 text-white">

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h1 className="md:text-4xl text-3xl font-bold text-blue-400 mb-4 sm:mb-0">Gestión de Proveedores</h1>
                <button
                    onClick={handleAgregarProveedor}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
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
        </div>
    );
}


export default Proveedores;