// /app/productos/FormAddProductoOC/[id]/page.tsx

"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProducto } from "@/app/context/ProductoContext";
import { useOrdenesDeCompra } from "@/app/context/OrdenesCompraContext";
import Swal from "sweetalert2";

const FormAddProductoOCQR = () => {
  const { id } = useParams(); // ID del producto desde la URL
  const router = useRouter();
  const { productos } = useProducto();
  const { ordenesDeCompra, agregarProductosOrdenDeCompra } = useOrdenesDeCompra();

  const producto = productos.find((p) => p.id === id);

  const [cantidad, setCantidad] = useState<number>(1);
  const [selectedOrdenId, setSelectedOrdenId] = useState<string>("");

  if (!producto) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800">
        <p className="text-white">Cargando producto...</p>
      </div>
    );
  }

  const ordenesOptions = ordenesDeCompra
    .filter((orden) => orden.status === "CREATED" || orden.status === "APPROVED")
    .map((orden) => (
      <option key={orden.id} value={orden.id}>
        {`Orden #${orden.id} - Proveedor: ${orden.provider.name}`}
      </option>
    ));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedOrdenId) {
      Swal.fire("Error", "Por favor, selecciona una orden de compra.", "error");
      return;
    }

    try {
      // Aquí puedes agregar el monto si lo deseas
      const amount = producto.price * cantidad;

      await agregarProductosOrdenDeCompra(selectedOrdenId, producto.id, cantidad, amount);

      Swal.fire("Éxito", "Producto agregado a la orden de compra.", "success").then(() => {
        router.push(`/ordenesdecompra/${selectedOrdenId}`);
      });
    } catch (error) {
      Swal.fire("Error", "Ocurrió un error al agregar el producto.", "error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-blue-400">Agregar Producto a Orden de Compra</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Producto
            </label>
            <input
              type="text"
              value={`${producto.name} - ${producto.brand}`}
              disabled
              className="bg-gray-700 text-white w-full p-3 rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="cantidad" className="block text-sm font-medium text-gray-300 mb-2">
              Cantidad
            </label>
            <input
              id="cantidad"
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value))}
              className="bg-gray-700 text-white w-full p-3 rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="orden" className="block text-sm font-medium text-gray-300 mb-2">
              Seleccionar Orden de Compra
            </label>
            <select
              id="orden"
              value={selectedOrdenId}
              onChange={(e) => setSelectedOrdenId(e.target.value)}
              className="bg-gray-700 text-white w-full p-3 rounded-lg focus:outline-none"
            >
              <option value="" disabled>
                Selecciona una orden de compra
              </option>
              {ordenesOptions}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-md transition-all"
          >
            Agregar a Orden de Compra
          </button>
        </form>

        <button
          className="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg shadow-md transition-all"
          onClick={() => router.back()}
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default FormAddProductoOCQR;
