"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProducto } from "@/app/context/ProductoContext";
import QRCode from "react-qr-code"; // Importamos el componente QRCode
import { FaPlusCircle, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const ProductPage = () => {
  const { id } = useParams();
  const { producto, productos, proveedores, proveedoresProducto, fetchProducto, fetchProveedores, fetchProveedoresProducto, associateProvider, removeProvider } = useProducto();
  const [nombreProveedor, setNombreProveedor] = useState('');
  const router = useRouter();

  const productoData = productos.find((producto) => producto.id === id);

  useEffect(() => {
    const loadProducto = async () => {
      const idProducto = Array.isArray(id) ? id[0] : id;
      await fetchProducto(idProducto);
      await fetchProveedores();
      await fetchProveedoresProducto(idProducto);
    };
    loadProducto();
  }, [fetchProducto, fetchProveedores, id]);

  useEffect(() => {
    if (producto && proveedores.length > 0) {
      const proveedor = proveedores.find(p => p.id === producto.preference_provider_id);
      setNombreProveedor(proveedor ? proveedor.name : 'Proveedor no encontrado');
    }
  }, [producto, proveedores]);

  const handleAddProvider = (productId: string) => {

    const proveedoresOptions = proveedores
    .map(
      (proveedor) =>
        `<option value="${proveedor.id}">${proveedor.name}</option>`
    )
    .join("");

    Swal.fire({
    title: "Asociar Proveedor",
    html: `
      <style>
        input.swal2-input, select.swal2-select {
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 10px;
          width: 80%;
          height: 54px;
          margin-top: 5px;
          margin-bottom: 10px;
          box-sizing: border-box;
        }
      </style>
      <select id="providerId" class="swal2-select">
        <option value="" selected>Seleccione un proveedor</option>
        ${proveedoresOptions}
      </select>`,
    confirmButtonText: "Asociar",
    cancelButtonText: "Cancelar",
    showCancelButton: true,
    focusConfirm: false,
    preConfirm: () => {
      
      const providerIdElement = document.getElementById( "providerId") as HTMLInputElement;
      const providerId = providerIdElement?.value;

      if (!providerId) {
        Swal.showValidationMessage("Selecciona un proveedor");
        return null;
      }

      return { providerId };
    },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        associateProvider(productId, result.value.providerId);

        Swal.fire({
          title: "Proveedor asociado con éxito",
          text: "El proveedor se asoció correctamente al producto",
          icon: "success",
        });
      }
    });
  };

  const handleRemoveProvider = (productId: string, providerId: string) => {
    removeProvider(productId, providerId);
  };

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
  const qrValue = `${window.location.origin}/inter_p/${productoData.id}`;

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
                  <p className="text-gray-400 text-sm">Decripción</p>
                  <p className="text-white font-semibold">
                    {producto.description}
                  </p>
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
                <div className="bg-gray-800 p-3 rounded md:col-span-2">
                  <p className="text-gray-400 text-sm">Todos los Proveedores</p>
                  <div className="text-white font-semibold">
                  {proveedoresProducto ? (
                    <div>
                      <ul>
                        {proveedoresProducto.map((prov) => (
                          <li key={prov.id} className="py-1 flex items-center justify-between">
                            <div>
                              <p>{prov.name}</p>
                            </div>
                            <button
                              onClick={() => handleRemoveProvider(producto.id, prov.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrash className="mr-2" />
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div>
                        <button
                          onClick={() => handleAddProvider(producto.id)}
                          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                          >
                            Asociar Proveedor
                        </button>
                      </div>
                    </div>
                  ) : (
                      <p>Cargando...</p>
                  ) }
                  </div>
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
