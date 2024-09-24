"use client";
import React, { useState } from "react";
import { FaEdit, FaTrashAlt, FaEye, FaCheck } from "react-icons/fa";

//import { useOrdenesDeCompra } from '../context/ordenesCompraContext';

import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";

const apiActualizarOrden = `https://${process.env.NEXT_PUBLIC_HTTPS_HOSTING_DONWEB}/api/orden-compras`;

interface Proveedor {
  id: number;
  name: string;
  mail: string;
  createdAt: string;
  updatedAt: string;
}

interface Producto {
  id: number;
  name: string;
  stock: number;
  stock_minimo: number;
  min_price_compra_stock: number | null;
  precio: number;
  cantidad: number;
}

interface OrdenDeCompra {
  id: number;
  total_compra: number;
  createdAt: string;
  updatedAt: string;
  estado: string;
  fecha_de_creacion: string;
  proveedor: Proveedor;
  productos: Producto[];
}

const OrdenesDeCompra = () => {
  //  const { ordenesDeCompra, fetchOrdenesDeCompra } = useOrdenesDeCompra();
  const ordenesDeCompra: OrdenDeCompra[] = [
    {
      id: 1,
      total_compra: 1500,
      createdAt: "2024-01-01T10:00:00Z",
      updatedAt: "2024-01-02T12:00:00Z",
      estado: "pendiente",
      fecha_de_creacion: "2024-01-01",
      proveedor: {
        id: 1,
        name: "Proveedor A",
        mail: "contacto@proveedora.com",
        createdAt: "2023-06-15T09:30:00Z",
        updatedAt: "2023-11-10T16:00:00Z",
      },
      productos: [
        {
          id: 101,
          name: "Producto 1",
          stock: 50,
          stock_minimo: 10,
          min_price_compra_stock: 300,
          precio: 350,
          cantidad: 3,
        },
        {
          id: 102,
          name: "Producto 2",
          stock: 100,
          stock_minimo: 20,
          min_price_compra_stock: 100,
          precio: 150,
          cantidad: 5,
        },
      ],
    },
    {
      id: 2,
      total_compra: 2300,
      createdAt: "2024-02-05T14:00:00Z",
      updatedAt: "2024-02-06T15:00:00Z",
      estado: "completado",
      fecha_de_creacion: "2024-02-05",
      proveedor: {
        id: 2,
        name: "Proveedor B",
        mail: "info@proveedorb.com",
        createdAt: "2023-08-10T11:45:00Z",
        updatedAt: "2024-01-20T09:00:00Z",
      },
      productos: [
        {
          id: 201,
          name: "Producto 3",
          stock: 80,
          stock_minimo: 15,
          min_price_compra_stock: 500,
          precio: 600,
          cantidad: 2,
        },
        {
          id: 202,
          name: "Producto 4",
          stock: 40,
          stock_minimo: 5,
          min_price_compra_stock: 200,
          precio: 250,
          cantidad: 4,
        },
      ],
    },
    {
      id: 3,
      total_compra: 1800,
      createdAt: "2024-03-10T08:00:00Z",
      updatedAt: "2024-03-11T10:00:00Z",
      estado: "cancelada",
      fecha_de_creacion: "2024-03-10",
      proveedor: {
        id: 3,
        name: "Proveedor C",
        mail: "ventas@proveedorc.com",
        createdAt: "2023-07-20T10:20:00Z",
        updatedAt: "2024-02-15T13:00:00Z",
      },
      productos: [
        {
          id: 301,
          name: "Producto 5",
          stock: 120,
          stock_minimo: 25,
          min_price_compra_stock: 450,
          precio: 500,
          cantidad: 2,
        },
        {
          id: 302,
          name: "Producto 6",
          stock: 60,
          stock_minimo: 10,
          min_price_compra_stock: 150,
          precio: 200,
          cantidad: 3,
        },
      ],
    },
  ];

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = (id: number) => {
    console.log(`Eliminar orden con ID: ${id}`);
  };

  const handleEdit = (id: number) => {
    console.log(`Editar orden con ID: ${id}`);
  };

  const handleView = (id: number) => {
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
      const productosOrden = orden.productos;
      for (const producto of productosOrden) {
        const productoActualizado = {
          stock: producto.stock + producto.cantidad,
        };

        await axios.put(
          `https://${process.env.NEXT_PUBLIC_HTTPS_HOSTING_DONWEB}/api/productos/${producto.id}`,
          {
            data: productoActualizado,
          }
        );
      }

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

  return (
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
                  {orden.proveedor.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {orden.fecha_de_creacion}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full border ${
                      orden.estado === "completado"
                        ? "text-green-300 border-green-500"
                        : orden.estado === "pendiente"
                        ? "text-yellow-300 border-yellow-500"
                        : "text-red-300 border-red-500"
                    }`}
                  >
                    {orden.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${orden.total_compra}
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
                    {orden.estado !== "completado" && (
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
  );
};

export default OrdenesDeCompra;
