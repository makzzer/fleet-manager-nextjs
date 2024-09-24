'use client';

// import Link from "next/link";
// import { FaUserTie, FaEnvelope, FaPhone, FaEnvelopeSquare } from 'react-icons/fa';
// import Swal from "sweetalert2";

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
    return (
        <div className="p-6 min-h-screen bg-gray-900 text-white">

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h1 className="md:text-4xl text-3xl font-bold text-blue-400 mb-4 sm:mb-0">Gestión de Proveedores</h1>
                <button
                    // onClick={handleAgregarProveedor}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                    Agregar Proveedor
                </button>

            </div>
        </div>
    );
}

export default Proveedores;