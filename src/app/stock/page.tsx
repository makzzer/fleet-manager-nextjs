"use client";
import React from "react";
import StatCard from "../components/StatCard";
import ProductTable from "../components/Stock/ProductTable";
import {
  FaMoneyBill,
  FaBox,
  FaUsers,
  FaPlusCircle,
  FaQrcode,
} from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";
import FiltrosProducto from "../components/Stock/FiltrosProducto";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const Stock = () => {
  const router = useRouter();
  //const [productosStockBajo, setProductosStockBajo] = useState(5)
  const [productosStockBajo] = useState(5);
  const productosEjemplo = [
    {
      id: 1,
      name: "Producto A",
      price: 100,
      stock: 5,
      qr: null,
      activo: true,
      hot: false,
    },
    {
      id: 2,
      name: "Producto B",
      price: 150,
      stock: 2,
      qr: null,
      activo: true,
      hot: true,
    },
    {
      id: 3,
      name: "Producto C",
      price: 200,
      stock: 0,
      qr: null,
      activo: false,
      hot: false,
    },
  ];

  const handleFilter = (filters: {
    searchTerm: string;
    selectedProveedor: string;
  }) => {
    // Por ahora, simplemente mostramos los productos de ejemplo sin filtrado
    console.log(filters);
  };

  const handleScanQRClick = () => {
    Swal.fire({
      title: "Permitir uso de la cámara",
      text: "Para utilizar esta funcionalidad se le solicitarán permisos para utilizar la cámara del dispositivo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3B82F6",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Rechazar",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/scannearQR");
      }
    });
  };

  const handleAgregarProducto = () => {
    Swal.fire({
      title: "Agregar Producto",
      html: `
            <input type="text" id="id" class="swal2-input" placeholder="Id">
            <input type="text" id="nombre" class="swal2-input" placeholder="Nombre">
            <input type="text" id="cuit" class="swal2-input" placeholder="CUIT">
            <input type="text" id="direccion" class="swal2-input" placeholder="Dirección">
            <input type="text" id="telefono" class="swal2-input" placeholder="Teléfono">
          `,
      confirmButtonText: "Agregar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const idElement = document.getElementById("id") as HTMLInputElement;
        const nombreElement = document.getElementById(
          "nombre"
        ) as HTMLInputElement;
        const cuitElement = document.getElementById("cuit") as HTMLInputElement;
        const direccionElement = document.getElementById(
          "direccion"
        ) as HTMLInputElement;
        const telefonoElement = document.getElementById(
          "telefono"
        ) as HTMLInputElement;

        const id = idElement?.value;
        const nombre = nombreElement?.value;
        const cuit = cuitElement?.value;
        const direccion = direccionElement?.value;
        const telefono = telefonoElement?.value;

        if (!id || !nombre || !cuit || !direccion || !telefono) {
          Swal.showValidationMessage("Completa todos los campos");
          return null;
        }

        return { id, nombre, cuit, direccion, telefono };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        //Fix para deploy
        /*
                const proveedor = {
                    id: result.value.id,
                    nombre: result.value.nombre,
                    cuit: result.value.cuit,
                    direccion: result.value.direccion,
                    telefono: result.value.telefono,
                };
                */

        //   createProducto(producto);

        Swal.fire({
          title: "Vehículo agregado con éxito",
          text: "El nuevo vehículo ha sido creado y registrado correctamente.",
          icon: "success",
        });
      }
    });
  };

  // Dashboard Component
  return (
    <div className="p-6 bg-gray-700 min-h-screen rounded-lg text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="md:text-4xl text-3xl font-bold text-blue-400">
          Gestión de Stock
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard title="Usuarios activos" value="2" icon={<FaUsers />} />

        <div className="relative flex-grow">
          <StatCard
            title="Productos con bajo stock"
            value={productosStockBajo}
            icon={<FaBox />}
          />
          {productosStockBajo !== 0 && (
            <span className="absolute top-2 right-2 md:right-3 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </div>

        <StatCard title="Ingresos" value="$200.000" icon={<FaMoneyBill />} />

        <div className="flex flex-col gap-4 md:mb-6 mb-2 text-center">
          <button
            onClick={handleAgregarProducto}
            className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-md transition-all duration-300 ease-in-out"
          >
            <FaPlusCircle className="mr-2" /> Agregar Producto
          </button>
          <Link
            href="#"
            onClick={handleScanQRClick}
            className="flex items-center justify-center bg-red-800 hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow-md transition-all duration-300 ease-in-out"
          >
            <FaQrcode className="mr-2" /> Scanear QR
          </Link>
        </div>
      </div>

      <FiltrosProducto onFilter={handleFilter} />

      {productosEjemplo.length > 0 ? (
        <ProductTable products={productosEjemplo} />
      ) : (
        <div className="flex flex-col items-center justify-center mt-8 p-6 bg-gray-700 border border-gray-600 rounded-lg">
          <p className="text-lg font-semibold text-white">
            No hay productos disponibles
          </p>
          <p className="text-sm font-semibold text-gray-400 mt-2">
            Por favor, añade algunos productos para empezar.
          </p>
        </div>
      )}
    </div>
  );
};

export default Stock;
