import React, { useState } from "react";

const AddVehiculoForm = () => {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    latitude: "",
    longitude: "",
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
    // Llamada a la API para agregar un vehículo
    try {
      const response = await fetch(`https://fleet-manager-vrxj.onrender.com/api/vehicles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brand: formData.brand,
          model: formData.model,
          year: parseInt(formData.year),
          coordinates: {
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
          },
        }),
      });
      if (response.ok) {
        alert("Vehículo agregado con éxito");
      }
    } catch (error) {
      console.error("Error al agregar vehículo:", error);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Agregar Vehículo</h2>
      <input
        type="text"
        name="brand"
        placeholder="Marca"
        value={formData.brand}
        onChange={handleInputChange}
        className="w-full p-2 mb-2"
      />
      <input
        type="text"
        name="model"
        placeholder="Modelo"
        value={formData.model}
        onChange={handleInputChange}
        className="w-full p-2 mb-2"
      />
      <input
        type="number"
        name="year"
        placeholder="Año"
        value={formData.year}
        onChange={handleInputChange}
        className="w-full p-2 mb-2"
      />
      <input
        type="text"
        name="latitude"
        placeholder="Latitud"
        value={formData.latitude}
        onChange={handleInputChange}
        className="w-full p-2 mb-2"
      />
      <input
        type="text"
        name="longitude"
        placeholder="Longitud"
        value={formData.longitude}
        onChange={handleInputChange}
        className="w-full p-2 mb-4"
      />
      <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded">
        Agregar Vehículo
      </button>
    </form>
  );
};

export default AddVehiculoForm;
