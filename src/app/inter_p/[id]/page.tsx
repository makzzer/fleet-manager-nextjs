// /app/inter_p/[id]/page.tsx

"use client";

import Link from "next/link";
import React from "react";
import { useParams } from "next/navigation";
import { useProducto } from "@/app/context/ProductoContext";
import { FaToolbox, FaInfoCircle, FaShoppingCart, FaArrowLeft } from "react-icons/fa"; // Importar iconos de react-icons

const ProductoInterPage = () => {
  const { id } = useParams();
  const { productos } = useProducto();

  const productoData = productos.find((producto) => producto.id === id);

  if (!productoData) {
    // Puedes agregar un indicador de carga o mensaje mientras se obtiene el ID
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800">
        <p className="text-white">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 p-4">
      <h1 className="text-2xl font-bold text-white mb-6">Acciones con Producto</h1>

      {/* Vista Previa del Producto */}
      <div className="bg-gray-700 rounded-lg p-4 mb-6 w-full flex flex-col justify-center items-center max-w-md">
        <div className="flex items-center mb-2">
          <FaToolbox className="text-white text-2xl mr-2" />
          <h2 className="text-xl font-semibold text-white">{productoData.name}</h2>
        </div>
        <p className="text-gray-300">Marca: {productoData.brand}</p>
        <p className="text-gray-300">Precio: ${productoData.price}</p>
        {/* Agrega más detalles del producto si lo deseas */}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Ver Detalles del Producto */}
        <Link
          href={`/productos/${productoData.id}`}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105"
        >
          <FaInfoCircle className="text-2xl mr-2" />
          Ver Detalles
        </Link>

        {/* Agregar Producto a Orden de Compra */}
        <Link
          href={`/productos/FormAddProductoOC/${productoData.id}`}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105"
        >
          <FaShoppingCart className="text-2xl mr-2" />
          Agregar Producto a OC
        </Link>
      </div>

      {/* Botón de Volver */}
      <div className="flex justify-center mt-10">
        <Link
          href={`/productos`}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
        >
          <FaArrowLeft className="text-xl mr-2" />
          Volver a Productos
        </Link>
      </div>
    </div>
  );
};

export default ProductoInterPage;
