"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProducto } from "@/app/context/ProductoContext";
import Link from "next/link";
import QRCode from "react-qr-code"; // Importamos el componente QRCode

const ProductPage = () => {
  const { id } = useParams();
  const { producto, productos, proveedores, fetchProducto, fetchProveedores } = useProducto();
  const [nombreProveedor, setNombreProveedor] = useState('');
  const router = useRouter();

  const productoData = productos.find((producto) => producto.id === id);

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

  if (!producto || !productoData) {
    return (
      <div className="min-h-screen bg-gray-900 p-8 text-center">
        <h1 className="text-3xl font-bold mb-6 text-blue-400">
          Producto no encontrado
        </h1>
      </div>
    );
  }

  // Usamos una ruta relativa en el QR para evitar problemas con diferentes dominios
  const qrValue = `/productos/${productoData.id}`;

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
                {/* Código QR */}
                <div className="mt-6 flex flex-col items-center rounded md:col-span-2">
                  <h3 className="text-lg font-medium mb-4 text-blue-200">
                    Código QR
                  </h3>
                  <QRCode
                    value={qrValue}
                    size={128}
                    bgColor="#1a202c"
                    fgColor="#ffffff"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-900 flex justify-center space-x-4">
            <button
              onClick={() => router.push("/productos")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
