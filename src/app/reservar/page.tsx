"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useVehiculo } from "../context/VehiculoContext"; // Usamos el context de vehículos para traer los vehículos disponibles
import { useAuth } from "../context/AuthContext"; // Usamos el context de autenticación para obtener el usuario autenticado
import Swal from "sweetalert2";

const ReservaViaje = () => {
  const router = useRouter();
  const { vehiculos, fetchVehiculos } = useVehiculo(); // Obtener vehículos del context
  const { authenticatedUser } = useAuth(); // Obtener el usuario autenticado
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cargar los vehículos al montar el componente
    const loadVehiculos = async () => {
      setIsLoading(true);
      await fetchVehiculos();
      setIsLoading(false);
    };
    loadVehiculos();
  }, [fetchVehiculos]);

  // Función para manejar la selección del vehículo
  const handleSelectVehicle = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
  };

  // Función para crear la reserva
  const handleCreateReserva = async () => {
    if (!selectedVehicle) {
      alert("Por favor, selecciona un vehículo.");
      return;
    }

    if (!authenticatedUser) {
      alert("Debes estar autenticado para reservar un vehículo.");
      return;
    }

    try {
      const response = await fetch("https://fleet-manager-gzui.onrender.com/api/reserves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicleId: selectedVehicle,
          userId: authenticatedUser.id,
          destination: {
            latitude: -34.53041058614282, // Valores de ejemplo
            longitude: -58.70297600284797,
          },
        }),
      });

      if (response.ok) {
        Swal.fire("Reserva creada", "Tu reserva se ha creado exitosamente.", "success");
        router.push("/reservas");
      } else {
        Swal.fire("Error", "No se pudo crear la reserva. Inténtalo nuevamente.", "error");
      }
    } catch (error) {
      console.error("Error al crear la reserva:", error);
      Swal.fire("Error", "Ocurrió un error al crear la reserva.", "error");
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen rounded-xl flex flex-col p-4">
      {/* Encabezado */}
      <div className="flex-shrink-0 mb-4">
        <h1 className="text-4xl font-bold text-blue-400">Reservar Viaje</h1>
      </div>

      {/* Seleccionar Vehículo */}
      <div className="flex-shrink-0 mb-4">
        <h2 className="text-2xl font-semibold mb-3">Seleccionar Vehículo</h2>
        {isLoading ? (
          <p className="text-gray-400">Cargando vehículos...</p>
        ) : (
          <select
            className="bg-gray-800 text-white py-2 px-4 rounded w-full"
            value={selectedVehicle || ""}
            onChange={(e) => handleSelectVehicle(e.target.value)}
          >
            <option value="" disabled>
              Selecciona un vehículo disponible
            </option>
            {vehiculos
              .filter((vehiculo) => vehiculo.status === "AVAILABLE")
              .map((vehiculo) => (
                <option key={vehiculo.id} value={vehiculo.id}>
                  {vehiculo.brand} {vehiculo.model} - {vehiculo.id}
                </option>
              ))}
          </select>
        )}
      </div>

      {/* Botón para crear la reserva */}
      <div className="flex-shrink-0 mt-4">
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all"
          onClick={handleCreateReserva}
        >
          Reservar
        </button>
      </div>
    </div>
  );
};

export default ReservaViaje;
