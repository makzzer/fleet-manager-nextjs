import React from "react";
import VehiculoCard from "../components/Cards/VehiculoCards";


// Lista de vehículos
const vehiculosEjemplo = [
  {
    marca: "Toyota",
    modelo: "Corolla",
    año: 2021,
    color: "Rojo"
  },
  {
    marca: "Honda",
    modelo: "Civic",
    año: 2020,
    color: "Azul"
  },
  {
    marca: "Ford",
    modelo: "Fiesta",
    año: 2019,
    color: "Negro"
  },
  {
    marca: "Toyota",
    modelo: "Corolla",
    año: 2021,
    color: "Rojo"
  },
  {
    marca: "Honda",
    modelo: "Civic",
    año: 2020,
    color: "Azul"
  },
  {
    marca: "Ford",
    modelo: "Fiesta",
    año: 2019,
    color: "Negro"
  }
];

const Vehiculos = () => {
  return (
    <div className="p-6 bg-gray-700 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Vehículos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Usamos map para iterar sobre la lista de vehículos */}
        {vehiculosEjemplo.map((vehiculo, index) => (
          <VehiculoCard key={index} vehiculo={vehiculo} />
        ))}
      </div>
    </div>
  );
};

export default Vehiculos;
