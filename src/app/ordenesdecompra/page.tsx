"use client";
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaEye, FaCheck } from "react-icons/fa";

import { useOrdenesDeCompra, OrdenDeCompra, CreacionOrdenDeCompra } from "../context/OrdenesCompraContext";

import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import OrdenCompraForm, { OrdenDeCompraFormData } from "./OrdenCompraForm";

//ruta protegida
import ProtectedRoute from "../components/Routes/ProtectedRoutes";

const apiActualizarOrden = `https://${process.env.NEXT_PUBLIC_HTTPS_HOSTING_DONWEB}/api/orden-compras`;

const OrdenesDeCompra = () => {
  const { ordenesDeCompra, productos, proveedores, fetchOrdenesDeCompra, fetchProductos, fetchProveedores, createOrdenDeCompra } =
    useOrdenesDeCompra();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadOrdenesDeCompra = async () => {
      setLoading(true); // esta es la carga para el Skeleton placeholder
      await fetchOrdenesDeCompra();
      setLoading(false); // Esta es la carga para el skeleton placeholder
    };
    loadOrdenesDeCompra();
  }, [fetchOrdenesDeCompra]);

  useEffect(() => {
    const loadProveedores = async () => {
      setLoading(true); // esta es la carga para el Skeleton placeholder
      await fetchProveedores();
      setLoading(false); // Esta es la carga para el skeleton placeholder
    };
    loadProveedores();
  }, [fetchProveedores]);

  useEffect(() => {
    const loadProductos = async () => {
      setLoading(true); // esta es la carga para el Skeleton placeholder
      await fetchProductos();
      setLoading(false); // Esta es la carga para el skeleton placeholder
    };
    loadProductos();
  }, [fetchProductos]);

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
      // Cambiar solo el estado de la orden a "completado"
      const updatedOrden = {
        estado: "completado",
      };

      await axios.put(`${apiActualizarOrden}/${orden.id}?populate=*`, {
        data: updatedOrden,
      });

      // Actualizar el stock de los productos en la orden, pero sin eliminarlos de la orden de compra

      // const productosOrden = orden.productos;
      // for (const producto of productosOrden) {
      //   const productoActualizado = {
      //     stock: producto.stock + producto.cantidad,
      //   };

      //   await axios.put(
      //     `https://${process.env.NEXT_PUBLIC_HTTPS_HOSTING_DONWEB}/api/productos/${producto.id}`,
      //     {
      //       data: productoActualizado,
      //     }
      //   );
      // }

      // Refrescar la lista de órdenes de compra
      //      fetchOrdenesDeCompra();

      Swal.fire({
        title: "Orden completada",
        text: "La orden de compra ha sido cerrada y el stock actualizado.",
        icon: "success",
        confirmButtonText: "Cerrar",
      });
    } catch (error) {
      console.error("Error al cerrar la orden de compra:", error);
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

  const onCreateSubmit = async (formData: OrdenDeCompraFormData) => {
    const ordenDeCompra : CreacionOrdenDeCompra = {
      providerId: formData.providerId,
      productId: formData.productId,
      quantity: formData.quantity,
      amount: formData.amount
    }
    createOrdenDeCompra(ordenDeCompra);
    Swal.fire({
      title: "Orden Creada",
      text: "La orden de compra se creó con éxito.",
      icon: "success",
      confirmButtonText: "Cerrar",
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 p-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-400">
          Órdenes de compra
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-700 shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-gray-200 text-left text-sm uppercase font-semibold border-b border-gray-700">
                <th className="px-6 py-3">ID</th>
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
                  <td className="px-6 py-4 whitespace-nowrap">{orden.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {orden.provider.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {orden.date_created.slice(0, 10)}
                  </td>
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${orden.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex justify-end items-center space-x-4">
                      <button
                        onClick={() => handleView(orden.id)}
                        className="text-green-600 hover:text-green-800 p-1"
                      >
                        <FaEye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(orden.id)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <FaEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(orden.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
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
        <OrdenCompraForm
          onSubmit={onCreateSubmit}
          proveedores={proveedores}
          productos={productos}
        />
      </div>
    </ProtectedRoute>
  );
};

export default OrdenesDeCompra;
