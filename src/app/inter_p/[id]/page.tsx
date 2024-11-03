"use client";

import Link from "next/link";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useProducto } from "@/app/context/ProductoContext";

const ProductoInterPage = () => {
  const { id } = useParams();
  const { productos } = useProducto();
  const router = useRouter();
  const productoData = productos.find((producto) => producto.id === id);

  const handleViewDetail = () => {
    if (productoData) {
      router.push(`/productos/${productoData.id}`); // Redirige a la página de detalle del producto
    }
  };

  const handleAddToOC = () => {
    if (productoData) {
      router.push(`/productos/FormAddProductoOC?id=${productoData.id}`); // Redirige a la página para agregar a OC
    }
  };

  if (!productoData) {
    // Puedes agregar un indicador de carga o mensaje mientras se obtiene el ID
    return <p>Cargando...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-between h-screen bg-gray-800 p-4">
      <h1 className="text-2xl font-bold text-white mb-6">Acciones con producto</h1>

      {/* Botones en la parte inferior */}
      <div className="flex justify-between w-full px-4 pb-4">
        <Link
          href={`/productos/${productoData.id}`}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounder-lg flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105"
        >
          Ver Detalles
        </Link>
        
        <Link
          href={`FormAddProductoOC/${productoData.id}`}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounder-lg flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105"
        >
          Agregar Producto a OC
        </Link>

        {/* Botón de Volver */}
        <div className="flex justify-center mt-10">
          <Link
            href={`/productos`}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
          >
            Volver a productos
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductoInterPage;

