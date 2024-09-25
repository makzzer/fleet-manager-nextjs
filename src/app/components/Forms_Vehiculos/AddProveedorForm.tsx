import React, { useState } from "react";
import { useProveedor } from "@/app/context/ProveedorContext";

const AddProveedorForm = () => {
  const { createProveedor } = useProveedor();

  const [formData, setFormData] = useState({
    name: "",
    cuit: "",
    direccion: "",
    telefono: "",
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
        id: "",  // ID automatico de BD.
        name: formData.name,
        cuit: formData.cuit,
        direccion: formData.direccion,
        telefono: formData.telefono,
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
        name="direccion"
        placeholder="Dirección"
        value={formData.direccion}
        onChange={handleInputChange}
        className="w-full p-2 mb-2"
      />
      <input
        type="text"
        name="telefono"
        placeholder="Teléfono"
        value={formData.telefono}
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
