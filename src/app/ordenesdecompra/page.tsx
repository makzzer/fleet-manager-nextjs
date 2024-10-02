/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaEye, FaCheck } from "react-icons/fa";

import { useOrdenesDeCompra, OrdenDeCompra, CreacionOrdenDeCompra } from "../context/OrdenesCompraContext";

import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import ProtectedRoute from "../components/Routes/ProtectedRoutes"; //ruta protegida

const apiActualizarOrden = `https://${process.env.NEXT_PUBLIC_HTTPS_HOSTING_DONWEB}/api/orden-compras`;

const OrdenesDeCompra = () => {
  const { ordenesDeCompra, fetchOrdenesDeCompra, fetchProductos, fetchProveedores, createOrdenDeCompra } =
    useOrdenesDeCompra();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Carga de ordenes de compra
  useEffect(() => {
    const loadOrdenesDeCompra = async () => {
      setLoading(true);
      await fetchOrdenesDeCompra();
      setLoading(false);
    };
    loadOrdenesDeCompra();
  }, [fetchOrdenesDeCompra]);

  // Carga de proveedores
  useEffect(() => {
    const loadProveedores = async () => {
      setLoading(true);
      await fetchProveedores();
      setLoading(false);
    };
    loadProveedores();
  }, [fetchProveedores]);

  // Carga de productos
  useEffect(() => {
    const loadProductos = async () => {
      setLoading(true);
      await fetchProductos();
      setLoading(false);
    };
    loadProductos();
  }, [fetchProductos]);

  // Funciones para eliminar, editar, ver y completar ordenes de compra
  const handleDelete = (id: string) => {
    console.log(`Eliminar orden con ID: ${id}`);
  };

  const handleEdit = (id: string) => {
    console.log(`Editar orden con ID: ${id}`);
  };

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

  const handleAgregarOrdenCompra = () => {
    Swal.fire({
      title: "Agregar Orden de Compra",
      html: `
      <input type="text" id="providerid" class="swal2-input" placeholder="ProviderID">
      <input type="text" id="productid" class="swal2-input" placeholder="ProductID">
      <input type="text" id="quantity" class="swal2-input" placeholder="Quantity">
      <input type="text" id="amount" class="swal2-input" placeholder="Amount">
    `,
      confirmButtonText: "Agregar",
      showCancelButton: true,
      preConfirm: () => {
        const providerIdElement = document.getElementById("providerid") as HTMLInputElement;
        const productIdElement = document.getElementById("productid") as HTMLInputElement;
        const quantityElement = document.getElementById("quantity") as HTMLInputElement;
        const amountElement = document.getElementById("amount") as HTMLInputElement;

        const providerId = providerIdElement?.value;
        const productId = productIdElement?.value;
        const quantity = quantityElement?.value;
        const amount = amountElement?.value;

        if (!providerId || !productId || !quantity || !amount) {
          Swal.showValidationMessage('Por favor completa todos los campos');
          return null;
        }

        return { providerId, productId, quantity, amount };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const order: CreacionOrdenDeCompra = {
          provider_id: result.value.providerId,
          product_id: result.value.productId,
          quantity: result.value.quantity,
          amount: result.value.amount,
        };

        createOrdenDeCompra(order);

        Swal.fire({
          title: "Orden agregada con éxito",
          icon: "success",
        });
      }
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold mb-6 text-blue-400">
            Órdenes de compra
          </h1>
          <button
            onClick={handleAgregarOrdenCompra}
            className="m-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Agregar Orden de Compra
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-700 shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-gray-200 text-left text-sm uppercase font-semibold border-b border-gray-700">
                <th className="px-6 py-3">Proveedor</th>
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 text-gray-200">
              {ordenesDeCompra.map((orden) => (
                <tr key={orden.id} className="border-b border-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">{orden.provider.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{orden.date_created.slice(0, 10)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full border ${orden.status === "COMPLETED"
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex justify-end items-center space-x-4">
                      <button onClick={() => handleView(orden.id)} className="text-green-600 hover:text-green-800 p-1">
                        <FaEye className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleEdit(orden.id)} className="text-blue-600 hover:text-blue-800 p-1">
                        <FaEdit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(orden.id)} className="text-red-600 hover:text-red-800 p-1">
                        <FaTrashAlt className="w-5 h-5" />
                      </button>
                      {orden.status !== "completado" && (
                        <button
                          onClick={() => handleComplete(orden)}
                          className="text-green-600 hover:text-green-800 p-1"
                          disabled={loading}
                        >
                          <FaCheck className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default OrdenesDeCompra;
