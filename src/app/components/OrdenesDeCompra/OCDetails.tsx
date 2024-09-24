import Link from "next/link";
import React from "react";
import Swal from "sweetalert2";

interface Producto {
  id: number;
  name: string;
  cantidad: number;
  precio: number;
}

interface Proveedor {
  id: number;
  name: string;
  mail: string;
}

interface OrdenDeCompra {
  id: number;
  total_compra: number;
  estado: string;
  fecha_de_creacion: string;
  proveedor: Proveedor;
  productos: Producto[];
}

interface OCDetailsProps {
  orden: OrdenDeCompra;
}

const OCDetails: React.FC<OCDetailsProps> = ({ orden }) => {
  if (!orden) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-lg font-bold">Orden de compra no encontrada.</h2>
      </div>
    );
  }

  // Añadiendo logs para verificar los datos que llegan
  console.log("Detalles de la orden:", orden);
  console.log("Productos en la orden:", orden.productos);

  const handleEditClick = () => {
    Swal.fire({
      title: "¿Editar orden de compra?",
      text: "¿Estás seguro de que deseas editar esta orden de compra?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Editar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = `/editarorden/${orden.id}`;
      }
    });
  };

  return (
    <div className="bg-gray-800 shadow-md rounded-lg p-6 text-white">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold text-blue-400">
          Orden de Compra #{orden.id}
        </h2>
        <h3 className="text-xl font-bold text-blue-300 mt-2">
          Proveedor: {orden.proveedor.name}
        </h3>
        <p className="text-gray-400 mt-2 text-center">
          Email del proveedor: {orden.proveedor.mail}
        </p>
        <p className="text-gray-400 mt-2">
          <strong>Fecha de Creación:</strong> {orden.fecha_de_creacion}
        </p>
        <p className="text-gray-400 mt-2">
          <strong>Estado:</strong> {orden.estado}
        </p>
        <p className="text-xl font-semibold text-blue-300 mt-4">
          Total: ${orden.total_compra}
        </p>

        <h3 className="text-xl font-bold mt-6 text-blue-400">Productos</h3>
        <ul className="mt-4 space-y-2">
          {orden.productos.map((producto) => (
            <li key={producto.id} className="text-gray-300">
              <strong className="text-blue-300">{producto.name}</strong> -
              Cantidad: {producto.cantidad} - Precio: ${producto.precio}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-center mt-8 space-x-4">
        <Link
          href="/ordenesdecompra"
          className="bg-blue-600 px-4 py-2 rounded shadow-md hover:bg-blue-700 text-white"
        >
          Volver
        </Link>
        <button
          onClick={handleEditClick}
          className="bg-yellow-600 px-4 py-2 rounded shadow-md hover:bg-yellow-700 text-white"
        >
          Editar
        </button>
      </div>
    </div>
  );
};

export default OCDetails;
