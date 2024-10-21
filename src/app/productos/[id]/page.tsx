"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useProducto } from "@/app/context/ProductoContext";
import Link from "next/link";

const ProductPage = () => {
  const { id } = useParams();
  const { producto, proveedores, fetchProducto, fetchProveedores } = useProducto();
  const [nombreProveedor, setNombreProveedor] = useState('');

  useEffect(() => {
    const loadProducto = async () => {
      console.log(id);
      await fetchProducto(Array.isArray(id) ? id[0] : id);
      await fetchProveedores();
    };
    loadProducto();
  }, [fetchProducto, fetchProveedores, id]);

  useEffect(() => {
    if (producto && proveedores.length > 0) {
      const proveedor = proveedores.find(p => p.id === producto.preference_provider_id);
      setNombreProveedor(proveedor ? proveedor.name : 'Proveedor no encontrado');
    }
  }, [producto, proveedores]);

  if (!producto) {
    return (
      <div className="min-h-screen bg-gray-900 p-8 text-center">
        <h1 className="text-3xl font-bold mb-6 text-blue-400">
          Producto no encontrado
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-center">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">
        Detalles del Producto
      </h1>
      <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden w-full max-w-lg">
          <div className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="bg-gray-800 p-3 rounded md:col-span-2">
                  <p className="text-gray-400 text-sm md:col-span-2">Nombre</p>
                  <p className="text-white font-semibold">{producto.name}</p>
                </div>
                <div className="bg-gray-800 p-3 rounded md:col-span-2">
                  <p className="text-gray-400 text-sm">Marca</p>
                  <p className="text-white font-semibold">{producto.brand}</p>
                </div>
                <div className="bg-gray-800 p-3 rounded md:col-span-2">
                  <p className="text-gray-400 text-sm">Categoría</p>
                  <p className="text-white font-semibold">{producto.category}</p>
                </div>
                <div className="bg-gray-800 p-3 rounded md:col-span-2">
                  <p className="text-gray-400 text-sm">Cantidad</p>
                  <p className="text-white font-semibold">{producto.quantity}</p>
                </div>
                <div className="bg-gray-800 p-3 rounded md:col-span-2">
                  <p className="text-gray-400 text-sm">Unidad de medida</p>
                  <p className="text-white font-semibold">{producto.measurement}</p>
                </div>
                <div className="bg-gray-800 p-3 rounded md:col-span-2">
                  <p className="text-gray-400 text-sm">Precio</p>
                  <p className="text-white font-semibold">{producto.price}</p>
                </div>
                <div className="bg-gray-800 p-3 rounded md:col-span-2">
                  <p className="text-gray-400 text-sm">Stock mínimo</p>
                  <p className="text-white font-semibold">{producto.min_stock}</p>
                </div>
                <div className="bg-gray-800 p-3 rounded md:col-span-2">
                  <p className="text-gray-400 text-sm">Proveedor de preferencia</p>
                  <p className="text-white font-semibold">{nombreProveedor || 'Cargando...'}</p>
                </div>
                {/* El elemento ocupa 2 columnas en pantallas medianas o grandes */}
                <div className="bg-gray-800 p-3 rounded md:col-span-2">
                  <p className="text-gray-400 text-sm">Decripción</p>
                  <p className="text-white font-semibold">
                    {producto.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-900 flex justify-center space-x-4">
            <Link
              href="/productos"
              className="bg-blue-600 px-4 py-2 rounded shadow-md hover:bg-blue-700 text-white"
            >
              Volver
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
