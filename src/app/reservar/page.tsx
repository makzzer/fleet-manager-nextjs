"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVehiculo, Vehiculo } from "../context/VehiculoContext";
import { useAuth } from "../context/AuthContext";
import { useReserva } from "../context/ReservesContext";
import Swal from "sweetalert2";
import axios from "axios";
import Carousel from "../components/Carousel/Carousel";
import { EmblaOptionsType } from "embla-carousel";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";
import dynamic from "next/dynamic";
import ProtectedRoute from "../components/Routes/ProtectedRoutes";
import { isSameDay, setHours, setMinutes } from "date-fns";
import "tailwindcss/tailwind.css";
import { Suspense } from "react";

const MapPickCoordinates = dynamic(
  () => import("../components/Maps/MapPickCoordinates"),
  { ssr: false }
);

const OPTIONS: EmblaOptionsType = {
  loop: true,
  align: "center",
  skipSnaps: false,
};

const ReservaViaje = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleIdFromQuery = searchParams.get("vehiculoId");

  const { vehiculos, fetchVehiculos } = useVehiculo();
  const { reservas, fetchReservas } = useReserva();
  const { authenticatedUser } = useAuth();

  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(vehicleIdFromQuery);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [pickedCoordinates, setPickedCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState<Vehiculo[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchVehiculos();
      await fetchReservas();
      setIsLoading(false);
    };
    loadData();
  }, [fetchVehiculos, fetchReservas]);

  const isVehicleAvailable = (vehicleId: string) => {
    const reservasVehiculo = reservas.filter(
      (reserva) => reserva.vehicle_id === vehicleId
    );

    if (reservasVehiculo.length === 0) return true;

    return !reservasVehiculo.some((reserva) => {
      const reservaStart = new Date(reserva.date_reserve);
      const reservaEnd = new Date(reserva.date_finish_reserve);

      return (
        startDate &&
        endDate &&
        ((startDate >= reservaStart && startDate < reservaEnd) ||
          (endDate > reservaStart && endDate <= reservaEnd) ||
          (startDate <= reservaStart && endDate >= reservaEnd))
      );
    });
  };

  useEffect(() => {
    if (vehiculos.length > 0 && reservas.length >= 0 && startDate && endDate) {
      if (vehicleIdFromQuery) {
        const vehiculo = vehiculos.find((v) => v.id === vehicleIdFromQuery);

        if (vehiculo) {
          if (isVehicleAvailable(vehiculo.id)) {
            setVehiculosDisponibles([vehiculo]);
            setSelectedVehicle(vehiculo.id);
          } else {
            Swal.fire(
              "Vehículo no disponible",
              `El vehículo ${vehiculo.brand} ${vehiculo.model} no está disponible para las fechas seleccionadas. Por favor, selecciona otro vehículo o cambia las fechas.`,
              "warning"
            );
            const disponibles = vehiculos.filter(
              (v) => v.id !== vehiculo.id && isVehicleAvailable(v.id)
            );
            setVehiculosDisponibles(disponibles);
            setSelectedVehicle(null);
          }
        } else {
          Swal.fire(
            "Vehículo no encontrado",
            "El vehículo especificado no existe.",
            "error"
          );
          setVehiculosDisponibles([]);
          setSelectedVehicle(null);
        }
      } else {
        const disponibles = vehiculos.filter((vehiculo) =>
          isVehicleAvailable(vehiculo.id)
        );

        const filtrados = disponibles.filter((vehiculo) => {
          const search = searchTerm.toLowerCase();
          return (
            vehiculo.id.toLowerCase().includes(search) ||
            vehiculo.brand.toLowerCase().includes(search) ||
            vehiculo.model.toLowerCase().includes(search)
          );
        });

        setVehiculosDisponibles(filtrados);
      }
    } else {
      setVehiculosDisponibles([]);
      setSelectedVehicle(null);
    }
  }, [
    vehiculos,
    reservas,
    startDate,
    endDate,
    searchTerm,
    vehicleIdFromQuery,
  ]);

  const handleSelectVehicle = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
  };

  const handleCreateReserva = async () => {
    if (!selectedVehicle) {
      alert("Por favor, selecciona un vehículo.");
      return;
    }

    if (!authenticatedUser) {
      alert("Debes estar autenticado para reservar un vehículo.");
      return;
    }

    if (!pickedCoordinates) {
      alert("Por favor, selecciona un destino en el mapa.");
      return;
    }

    if (!startDate || !endDate) {
      alert("Por favor, selecciona las fechas de inicio y fin del viaje.");
      return;
    }

    if (startDate >= endDate) {
      alert("La fecha de inicio debe ser anterior a la fecha de fin.");
      return;
    }

    const requestData = {
      vehicle_id: selectedVehicle,
      user_id: authenticatedUser.id,
      destination: {
        latitude: pickedCoordinates.lat,
        longitude: pickedCoordinates.lng,
      },
      date_reserve: startDate.toISOString(),
      date_finish_reserve: endDate.toISOString(),
    };

    try {
      const response = await axios.post(
        "https://fleet-manager-vrxj.onrender.com/api/reserves",
        requestData
      );

      if (response.status === 201) {
        Swal.fire("Reserva creada", "Tu reserva se ha creado exitosamente.", "success");
        router.push("/reservas");
      } else {
        Swal.fire("Error", "No se pudo crear la reserva. Inténtalo nuevamente.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Ocurrió un error al crear la reserva.", "error");
    }
  };

  return (
    <ProtectedRoute requiredModule="RESERVES">
      <Suspense fallback={<div>Cargando...</div>}>
        <div className="bg-gray-900 text-white min-h-screen rounded-xl flex flex-col p-4">
          <div className="flex-shrink-0 mb-4">
            <h1 className="text-4xl font-bold text-blue-400">Reservar Viaje</h1>
          </div>

          <div className="flex-shrink-0 mb-6 relative z-30">
            <h2 className="text-2xl font-semibold mb-2">Seleccionar Fechas del Viaje</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Fecha y hora de inicio</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => {
                    setStartDate(date);
                    setSelectedVehicle(null);
                  }}
                  dateFormat="dd/MM/yyyy HH:mm"
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  placeholderText="Selecciona fecha y hora de inicio"
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  locale={es}
                  minDate={new Date()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Fecha y hora de fin</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date: Date | null) => {
                    setEndDate(date);
                    setSelectedVehicle(null);
                  }}
                  dateFormat="dd/MM/yyyy HH:mm"
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  placeholderText="Selecciona fecha y hora de fin"
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  locale={es}
                  minDate={startDate || new Date()}
                />
              </div>
            </div>
          </div>

          {!vehicleIdFromQuery && (
            <div className="flex-shrink-0 mb-4">
              <label className="block text-sm font-medium mb-2">Buscar vehículo por patente, marca o modelo</label>
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="flex-shrink-0 mb-4">
            <h2 className="text-2xl font-semibold mb-5">Seleccionar Vehículo</h2>
            {isLoading ? (
              <p className="text-gray-400">Cargando vehículos...</p>
            ) : (
              <>
                {startDate && endDate ? (
                  vehiculosDisponibles.length > 0 ? (
                    <Carousel
                      vehicles={vehiculosDisponibles}
                      options={OPTIONS}
                      onSelectVehicle={handleSelectVehicle}
                      selectedVehicleId={selectedVehicle}
                    />
                  ) : (
                    <p className="text-gray-400">No hay vehículos disponibles en el rango de fechas seleccionado.</p>
                  )
                ) : (
                  <p className="text-gray-400">Por favor, selecciona las fechas de inicio y fin para ver los vehículos disponibles.</p>
                )}
              </>
            )}
          </div>

          <div className="flex-grow z-20 mb-4">
            <h2 className="text-2xl font-semibold mb-2">Seleccionar Destino en el Mapa</h2>
            <MapPickCoordinates setPickedCoordinates={setPickedCoordinates} />
          </div>

          <div className="flex-shrink-0 mt-4">
            <button
              className="w-full bg-green-600 mb-4 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-md transition-all"
              onClick={handleCreateReserva}
            >
              Reservar
            </button>

            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-300 transform"
              onClick={() => router.push("/reservas")}
            >
              Volver
            </button>
          </div>
        </div>
      </Suspense>
    </ProtectedRoute>
  );
};

export default ReservaViaje;
