"use client";

import React from "react";
import { useParams } from "next/navigation";

//import { useOrdenesDeCompra } from '@/app/context/ordenesCompraContext';

import OCDetails from "@/app/components/OrdenesDeCompra/OCDetails";

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

const OCPage = () => {
  const { id } = useParams();
  //  const { ordenesDeCompra, fetchOrdenesDeCompra } = useOrdenesDeCompra();

  /*
React.useEffect(() => {
    if (ordenesDeCompra.length === 0) {
      fetchOrdenesDeCompra();
    }
  }, [ordenesDeCompra, fetchOrdenesDeCompra]);
*/

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

  const orden = ordenesDeCompra.find((o) => o.id === Number(id));

  if (!orden) {
    return (
      <div className="min-h-screen bg-gray-800 p-8 text-center">
        <h1 className="text-3xl font-bold mb-6 text-blue-400">
          Orden de compra no encontrada
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-700 p-8 text-center">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">
        Detalles de la Orden de Compra
      </h1>
      <OCDetails orden={orden} />
    </div>
  );
};

export default OCPage;
