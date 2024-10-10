"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Vehículos de ejemplo
const vehicles = [
  { id: "1", name: "Vehículo 1", type: "Camión", plate: "AAA-123" },
  { id: "2", name: "Vehículo 2", type: "Camión", plate: "BBB-456" },
  { id: "3", name: "Vehículo 3", type: "Camión", plate: "CCC-789" },
  { id: "4", name: "Vehículo 4", type: "Camión", plate: "DDD-101" },
];

interface Vehicle {
  id: string;
  name: string;
  type: string;
  plate: string;
}

export default function ConfirmacionReserva({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    // Buscar el vehículo seleccionado por su ID
    const selectedVehicle = vehicles.find((v) => v.id === params.id);
    if (selectedVehicle) {
      setVehicle(selectedVehicle);
    } else {
      alert("Vehículo no encontrado");
      router.push("/reservar");
    }
  }, [params.id, router]);

  const handleConfirm = () => {
    alert("Reserva confirmada");
    // Redirige a la página de reservas o a una pantalla de éxito
    router.push("/mi-reserva");
  };

  const handleCancel = () => {
    router.push("/reservar");
  };

  if (!vehicle) return null;

  return (
    <div className="min-h-screen flex flex-col rounded-xl items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">Confirmación de la Reserva</h1>

      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Resumen de la Reserva</h2>
        <div className="mb-4">
          <p className="text-lg">Vehículo: <span className="font-bold">{vehicle.name}</span></p>
          <p className="text-gray-400">Tipo: {vehicle.type}</p>
          <p className="text-gray-400">Placa: {vehicle.plate}</p>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all mb-4"
        >
          Confirmar Reserva
        </button>

        <button
          onClick={handleCancel}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-md transition-all"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
