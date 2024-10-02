/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useRef, useEffect } from "react";
import {  FaEye, FaCheck } from "react-icons/fa";
import { useOrdenesDeCompra, OrdenDeCompra } from "../context/OrdenesCompraContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import ProtectedRoute from "../components/Routes/ProtectedRoutes";

const apiActualizarOrden = `https://${process.env.NEXT_PUBLIC_HTTPS_HOSTING_DONWEB}/api/orden-compras`;

const OrdenesDeCompra = () => {
  const { ordenesDeCompra, fetchOrdenesDeCompra, fetchProductos, fetchProveedores, createOrdenDeCompra } =
    useOrdenesDeCompra();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showScrollIcon, setShowScrollIcon] = useState(true);
  const tableRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (tableRef.current) {
      const { scrollLeft } = tableRef.current;
      setShowScrollIcon(scrollLeft === 0);
    }
  };

  useEffect(() => {
    const loadOrdenesDeCompra = async () => {
      setLoading(true);
      await fetchOrdenesDeCompra();
      setLoading(false);
    };
    loadOrdenesDeCompra();
  }, [fetchOrdenesDeCompra]);

  useEffect(() => {
    const table = tableRef.current;
    if (table) {
      table.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (table) {
        table.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleView = (id: string) => {
    router.push(`/ordenesdecompra/${id}`);
  };

  const handleComplete = async (orden: OrdenDeCompra) => {
    setLoading(true);
    try {
      const updatedOrden = { estado: "completado" };
      await axios.put(`${apiActualizarOrden}/${orden.id}?populate=*`, { data: updatedOrden });
      Swal.fire({
        title: "Orden completada",
        text: "La orden de compra ha sido cerrada y el stock actualizado.",
        icon: "success",
        confirmButtonText: "Cerrar",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al cerrar la orden de compra. Inténtalo de nuevo.",
        icon: "error",
        confirmButtonText: "Cerrar",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
          <h1 className="text-3xl font-bold mb-6 text-blue-400">
            Órdenes de compra
          </h1>
        </div>
        <div className="relative overflow-x-auto bg-gray-800 shadow-md rounded-lg p-6" ref={tableRef}>
          <table className="min-w-full divide-y divide-gray-600 table-auto">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                  Proveedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-200 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-600 text-gray-200">
              {ordenesDeCompra.map((orden) => (
                <tr key={orden.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{orden.provider.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{orden.date_created.slice(0, 10)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full border ${
                        orden.status === "COMPLETED"
                          ? "text-green-300 border-green-500"
                          : orden.status === "ACTIVE"
                          ? "text-yellow-300 border-yellow-500"
                          : "text-red-300 border-red-500"
                      }`}
                    >
                      {orden.status === "COMPLETED"
                        ? "Completada"
                        : orden.status === "ACTIVE"
                        ? "Pendiente"
                        : "Cancelada"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">${orden.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex justify-end space-x-4">
                    <button onClick={() => handleView(orden.id)} className="text-green-600 hover:text-green-800">
                      <FaEye className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleComplete(orden)} className="text-green-600 hover:text-green-800">
                      <FaCheck className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Flecha de scroll en pantallas pequeñas */}
          {showScrollIcon && (
            <div className="absolute bottom-0 right-0 p-2 text-gray-500 md:hidden">
              <svg
                className="w-6 h-6 animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                ></path>
              </svg>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default OrdenesDeCompra;
