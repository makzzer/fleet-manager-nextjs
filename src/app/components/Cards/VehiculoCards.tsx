import React from "react";

interface Vehiculo {
    marca: string,
    modelo: string,
    año: number,
    color?: string,
}

interface VehiculoCardProps {
    vehiculo: Vehiculo;
}


const VehiculoCard = ({ vehiculo }: VehiculoCardProps) => {
    return (
      <div className="border p-4 rounded-lg shadow-lg bg-gray-700 text-white">
        <h2 className="text-lg font-bold mb-2">{vehiculo.marca} {vehiculo.modelo}</h2>
        <p>Año: {vehiculo.año}</p>
        {vehiculo.color && <p>Color: {vehiculo.color}</p>}
      </div>
    );
  };

  export default VehiculoCard;