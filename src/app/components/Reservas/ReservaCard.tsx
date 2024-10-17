import React from "react";
import { Reserva } from "@/app/context/ReservesContext";
import { useRouter } from "next/navigation";

interface ReservaCardProps {
  reserva: Reserva;
}

const ReservaCard = ({ reserva }: ReservaCardProps) => {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/detalleReserva/${reserva.id}`);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-4 w-full">
      <h2 className="text-xl font-bold text-white">{reserva.vehicle_id}</h2>
      <p className="text-gray-400">{new Date(reserva.date_created).toLocaleDateString()}</p>
      <p className={`text-sm ${reserva.status === "COMPLETED" ? "text-green-400" : "text-yellow-400"}`}>
        {reserva.status}
      </p>
      <button
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 transform hover:scale-105"
        onClick={handleViewDetails}
      >
        Ver Detalles
      </button>
    </div>
  );
};

export default ReservaCard;
