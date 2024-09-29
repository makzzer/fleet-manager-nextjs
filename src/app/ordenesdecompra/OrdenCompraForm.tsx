"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";

export interface OrdenDeCompraFormData {
  providerId: string;
  productId: string;
  quantity: number;
  amount: number;
}

export interface SelectData {
  id: string;
  name: string;
}

interface OrdenCompraFormProps {
  onSubmit: (data: OrdenDeCompraFormData) => void; // Define correctamente el tipo de datos que enviarás en el formulario
  proveedores: SelectData[];
  productos: SelectData[];
}

const OrdenCompraForm: React.FC<OrdenCompraFormProps> = ({ onSubmit, proveedores, productos }) => {
  const [formData, setFormData] = useState({
    providerId: "",
    productId: "",
    quantity: 0,
    amount: 0
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validar que los campos estén completos
    if (!formData.providerId || !formData.productId || formData.quantity <= 0 || formData.amount <= 0) {
      //Swal.showValidationMessage("Por favor, completa todos los campos correctamente.");
      Swal.fire({
        title: "Error al crear Orden de Compra",
        text: "Por favor, completa todos los campos correctamente.",
        icon: "error",
        confirmButtonText: "Cerrar",
      });
      return; // Detiene la ejecución si hay campos vacíos
    }
    onSubmit(formData);
    setFormData({ providerId: "", productId: "", quantity: 0, amount: 0 });
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h2 className="text-3xl font-bold mb-6 text-blue-400">
        Crear Orden de Compra
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="providerId"
            className="bg-gray-800 text-gray-200 text-left text-sm font-semibold border-b border-gray-700"
          >
            Proveedor
          </label>
          <select
            name="providerId"
            id="providerId"
            value={formData.providerId}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-gray-500 bg-white border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="" disabled>
              Selecciona un proveedor
            </option>
            {proveedores.map((proveedor) => (
              <option key={proveedor.id} value={proveedor.id}>
                {proveedor.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="productId"
            className="bg-gray-800 text-gray-200 text-left text-sm font-semibold border-b border-gray-700"
          >
            Producto
          </label>
          <select
            name="productId"
            id="productId"
            value={formData.productId}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-gray-500 bg-white border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="" disabled>
              Selecciona un producto
            </option>
            {productos.map((producto) => (
              <option key={producto.id} value={producto.id}>
                {producto.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="quantity"
            className="bg-gray-800 text-gray-200 text-left text-sm font-semibold border-b border-gray-700"
          >
            Cantidad
          </label>
          <input
            type="number"
            name="quantity"
            id="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-gray-500 bg-white border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md placeholder-gray-500"
            placeholder="Cantidad"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="total_compra"
            className="bg-gray-800 text-gray-200 text-left text-sm font-semibold border-b border-gray-700"
          >
            Monto Total
          </label>
          <input
            type="number"
            name="amount"
            id="amount"
            value={formData.amount}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-gray-500 bg-white border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md placeholder-gray-500"
            placeholder="Monto total de la compra"
          />
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-md transition-all duration-300 ease-in-out"
          >
            Crear Orden de Compra
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrdenCompraForm;
