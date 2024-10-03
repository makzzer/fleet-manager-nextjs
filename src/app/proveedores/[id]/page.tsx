"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useProveedor } from "@/app/context/ProveedorContext";
import { useEffect } from "react";

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

const ProductPage = () => {
  const { id } = useParams();
  const { proveedores, fetchProveedores } = useProveedor();

  useEffect(() => {
    if (proveedores.length === 0) {
      fetchProveedores();
    }
  }, [proveedores, fetchProveedores]);

  const proveedor: Proveedor | undefined = proveedores.find(
    (o) => o.id === id
  );

  if (!proveedor) {
    return (
      <div className="h-auto rounded-lg bg-gray-900 p-4">
        <h1 className="text-3xl font-bold mb-6 text-blue-400 text-center">
          Cargando Proveedor...
        </h1>
      </div>
    );
  }

  return (
    <div className="h-auto rounded-lg bg-gray-900 p-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-400 text-center">
        Detalles del Proveedor
      </h1>
      <div className="p-4 rounded-lg flex flex-col">

      <div className="flex flex-col lg:flex-row justify-center gap-5">
        <div className="mb-6 bg-gray-800 rounded-lg shadow-lg p-4">
          <h2 className="text-lg font-semibold text-blue-300 mb-4">
            Información Personal
          </h2>
          <div className="grid lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400">
                Nombre
              </label>
              <p className="text-white">{proveedor.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">
                CUIT
              </label>
              <p className="text-white">{proveedor.cuit}</p>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-lg bg-gray-800 shadow-lg p-4">
          <h2 className="text-lg font-semibold text-blue-300 mb-4">
            Información de Contacto
          </h2>
          <div className="grid lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400">
                Correo Electrónico
              </label>
              <p className="text-white">{proveedor.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">
                Teléfono
              </label>
              <p className="text-white">{proveedor.phone_number}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">
                Dirección
              </label>
              <p className="text-white">{proveedor.address}</p>
            </div>
          </div>
        </div>
      </div>
        <div className="mt-6 text-center">
          <Link
            href="/proveedores"
            className="bg-blue-600 px-4 py-2 rounded shadow-md hover:bg-blue-700 text-white"
          >
            Volver
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;

