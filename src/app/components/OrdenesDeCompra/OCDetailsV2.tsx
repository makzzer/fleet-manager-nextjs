import React, { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TimerIcon from "@mui/icons-material/Timer";
import CancelIcon from "@mui/icons-material/Cancel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Link from "next/link";

interface Proveedor {
  id: string;
  name: string;
  email: string;
  cuit: string;
  phone_number: string;
  address: string;
}

interface Producto {
  id: string;
  name: string;
  brand: string;
  description: string;
  category: string;
  quantity: number;
}

interface OrdenDeCompra {
  id: string;
  provider: Proveedor;
  product: Producto;
  quantity: number;
  amount: number;
  date_created: string;
  date_updated: string;
  status: string;
}

interface OCDetailsProps {
  orden: OrdenDeCompra;
}

export default function OCDetails({ orden }: OCDetailsProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Guarda un booleano en true si el mail del proveedor es muy largo
  const [isLongMail, setIsLongMail] = useState(false);

  // Si el mail del proveedor pasa los 23 caracteres, se setea el booleano en true
  useEffect(() => {
    const emailLimit = 23;
    if (orden.provider.email.length > emailLimit) {
      setIsLongMail(true);
    }
  }, [orden.provider.email]);

  if (!orden) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-lg font-bold text-white">
          Orden de compra no encontrada.
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden w-full max-w-lg">
        <div className="p-6">
          <div className="flex flex-col items-center text-center">
            {orden.status === "COMPLETED" ? (
              <>
                <CheckCircleIcon className="w-12 h-12 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  Orden completada!
                </h2>
                <p className="text-gray-400 mb-6">
                  Tu orden ha sido completada
                </p>
              </>
            ) : orden.status === "ACTIVE" ? (
              <>
                <TimerIcon className="w-12 h-12 text-yellow-500 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  Orden pendiente
                </h2>
                <p className="text-gray-400 mb-6">Tu orden está pendiente</p>
              </>
            ) : (
              <>
                <CancelIcon className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  Orden cancelada
                </h2>
                <p className="text-gray-400 mb-6">Tu orden ha sido cancelada</p>
              </>
            )}

            <h3 className="text-3xl font-bold text-white mb-6">
              ${orden.amount.toLocaleString()}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="bg-gray-800 p-3 rounded md:col-span-2">
                <p className="text-gray-400 text-sm">Fecha de creación</p>
                <p className="text-white font-semibold">
                  {orden.date_created.slice(0, 10)}
                </p>
              </div>
              <div className="bg-gray-800 p-3 rounded">
                <p className="text-gray-400 text-sm">Nombre del proveedor</p>
                <p className="text-white font-semibold">
                  {orden.provider.name || "N/A"}
                </p>
              </div>
              <div className="bg-gray-800 p-3 rounded">
                <p className="text-gray-400 text-sm">CUIT del proveedor</p>
                <p className="text-white font-semibold">
                  {orden.provider.cuit}
                </p>
              </div>
              {/* Si el mail es largo, el campo de telefono pasa a ocupar 2 columnas */}
              <div
                className={`bg-gray-800 p-3 rounded ${
                  isLongMail ? "md:col-span-2" : ""
                }`}
              >
                <p className="text-gray-400 text-sm">Telefono del proveedor</p>
                <p className="text-white font-semibold">
                  {orden.provider.phone_number}
                </p>
              </div>
              {/* Si el mail es largo, el campo de mail pasa a ocupar 2 columnas */}
              <div
                className={`bg-gray-800 p-3 rounded ${
                  isLongMail ? "md:col-span-2" : ""
                }`}
              >
                <p className="text-gray-400 text-sm">Mail del proveedor</p>
                <p className="text-white font-semibold">
                  {orden.provider.email}
                </p>
              </div>
              {/* El tercer elemento ocupa 2 columnas en pantallas medianas o grandes */}
              <div className="bg-gray-800 p-3 rounded md:col-span-2">
                <p className="text-gray-400 text-sm">Dirección del proveedor</p>
                <p className="text-white font-semibold">
                  {orden.provider.address}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-900 flex justify-center space-x-4">
          <button
            className="px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-700 text-white hover:bg-gray-600"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Ocultar detalles" : "Ver más detalles"}
            {showDetails ? (
              <ExpandLessIcon className="inline ml-2" />
            ) : (
              <ExpandMoreIcon className="inline ml-2" />
            )}
          </button>
          <Link
            href="/ordenesdecompra"
            className="bg-blue-600 px-4 py-2 rounded shadow-md hover:bg-blue-700 text-white"
          >
            Volver
          </Link>
        </div>
        {showDetails && (
          <div className="px-6 py-4 bg-gray-900">
            <h3 className="text-xl font-bold text-white mb-4">Productos</h3>
            <ul className="space-y-2">
              {/*
              orden.products.map((producto) => (
                <li key={producto.id} className="text-gray-300">
                  <strong>{producto.name}</strong> - Cantidad:{" "}
                  {producto.cantidad} - Precio: ${producto.precio}
                </li>
              ))*/}
              {
                <li key={orden.product.id} className="text-gray-300">
                  <strong>{orden.product.name}</strong> - Cantidad:{" "}
                  {orden.quantity} - Precio: ${orden.amount / orden.quantity}
                </li>
              }
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
