"use client";

import React, { useState } from "react";

interface formData {
  proveedor: string;
  fecha_de_creacion: string;
  total_compra: string;
  estado: string;
}

interface OrdenCompraFormProps {
  onSubmit: (data: formData) => void; // Define correctamente el tipo de datos que enviarás en el formulario
}

const OrdenCompraForm: React.FC<OrdenCompraFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    proveedor: "",
    fecha_de_creacion: "",
    estado: "pendiente",
    total_compra: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h2 className="text-3xl font-bold mb-6 text-blue-400">
        Crear Orden de Compra
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="proveedor"
            className="bg-gray-800 text-gray-200 text-left text-sm font-semibold border-b border-gray-700"
          >
            Proveedor
          </label>
          <input
            type="text"
            name="proveedor"
            id="proveedor"
            value={formData.proveedor}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-gray-500 bg-white border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md placeholder-gray-500"
            placeholder="Nombre del proveedor"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="fecha_de_creacion"
            className="bg-gray-800 text-gray-200 text-left text-sm font-semibold border-b border-gray-700"
          >
            Fecha de Creación
          </label>
          <input
            type="date"
            name="fecha_de_creacion"
            id="fecha_de_creacion"
            value={formData.fecha_de_creacion}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-gray-500 bg-white border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md placeholder-gray-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="estado"
            className="bg-gray-800 text-gray-200 text-left text-sm font-semibold border-b border-gray-700"
          >
            Estado
          </label>
          <select
            name="estado"
            id="estado"
            value={formData.estado}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-gray-500 bg-white border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="pendiente">Pendiente</option>
            <option value="completado">Completado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="total_compra"
            className="bg-gray-800 text-gray-200 text-left text-sm font-semibold border-b border-gray-700"
          >
            Total de la Compra
          </label>
          <input
            type="number"
            name="total_compra"
            id="total_compra"
            value={formData.total_compra}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-gray-500 bg-white border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md placeholder-gray-500"
            placeholder="Total de la compra"
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
