import React, { useState } from "react";
import { useProveedor } from "@/app/context/ProveedorContext";

const AddProveedorForm = () => {
  const { createProveedor } = useProveedor();

  const [formData, setFormData] = useState({
    name: "",
    cuit: "",
    address: "",
    phone_number: "",
    email: "", // Agregar campo email
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Crear proveedor con los datos del formulario
    try {
      await createProveedor({
        id: "",  // ID automático desde la BD.
        name: formData.name,
        cuit: formData.cuit,
        address: formData.address,
        phone_number: formData.phone_number,
        email: formData.email, // Agregar email al envío
      });
      alert("Proveedor agregado con éxito");
    } catch (error) {
      console.error("Error al agregar proveedor:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Agregar Proveedor</h2>
      <input
        type="text"
        name="name"
        placeholder="Nombre"
        value={formData.name}
        onChange={handleInputChange}
        className="w-full p-2 mb-2"
      />
      <input
        type="text"
        name="cuit"
        placeholder="CUIT"
        value={formData.cuit}
        onChange={handleInputChange}
        className="w-full p-2 mb-2"
      />
      <input
        type="text"
        name="address" // Cambiado de direccion a address
        placeholder="Dirección"
        value={formData.address} // Actualizado
        onChange={handleInputChange}
        className="w-full p-2 mb-2"
      />
      <input
        type="text"
        name="phone_number" // Cambiado a phone_number para que coincida con la interfaz
        placeholder="Teléfono"
        value={formData.phone_number} // Actualizado
        onChange={handleInputChange}
        className="w-full p-2 mb-4"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleInputChange}
        className="w-full p-2 mb-4"
      />
      <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded">
        Agregar Proveedor
      </button>
    </form>
  );
};

export default AddProveedorForm;
