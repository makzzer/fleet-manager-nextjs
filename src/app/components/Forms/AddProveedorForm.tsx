import React, { useState } from "react";
import { useProveedor } from "@/app/context/ProveedorContext";

const AddProveedorForm = () => {
  const { createProveedor } = useProveedor();

  const [formData, setFormData] = useState({
    name: "",
    cuit: "",
    street: "", // Campo para la calle
    number: "", // Campo para el número
    locality: "", // Campo para la localidad
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
      // Concatenar la dirección
      const fullAddress = `${formData.street} ${formData.number}, ${formData.locality}`;

      await createProveedor({
        id: "",  // ID automático desde la BD.
        name: formData.name,
        cuit: formData.cuit,
        address: fullAddress, // Usar la dirección completa
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
        name="street"
        placeholder="Calle"
        value={formData.street}
        onChange={handleInputChange}
        className="w-full p-2 mb-2"
      />
      <input
        type="text"
        name="number"
        placeholder="Número"
        value={formData.number}
        onChange={handleInputChange}
        className="w-full p-2 mb-2"
      />
      <input
        type="text"
        name="locality"
        placeholder="Localidad"
        value={formData.locality}
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
