"use client";

import React from "react";
import { useParams } from "next/navigation";
// import OCDetails from "@/app/components/OrdenesDeCompra/OCDetails";
import OCDetailsV2 from "@/app/components/OrdenesDeCompra/OCDetailsV2";
import { useOrdenesDeCompra } from "@/app/context/OrdenesCompraContext";

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

const OCPage = () => {
  const { id } = useParams();
  const { ordenesDeCompra, fetchOrdenesDeCompra } = useOrdenesDeCompra();

  React.useEffect(() => {
    if (ordenesDeCompra.length === 0) {
      fetchOrdenesDeCompra();
    }
  }, [ordenesDeCompra, fetchOrdenesDeCompra]);

  const orden: OrdenDeCompra | undefined = ordenesDeCompra.find(
    (o) => parseInt(o.id) === Number(id)
  );

  if (!orden) {
    return (
      <div className="min-h-screen bg-gray-900 p-8 text-center">
        <h1 className="text-3xl font-bold mb-6 text-blue-400">
          Orden de compra no encontrada
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-center">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">
        Detalles de la Orden de Compra
      </h1>
      <OCDetailsV2 orden={orden} />
    </div>
  );
};

export default OCPage;
