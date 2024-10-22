"use client";
import { useState, useEffect } from "react";
import { useReserva } from "@/app/context/ReservesContext";
import { useVehiculo } from "@/app/context/VehiculoContext"; // Importar el contexto de Vehículos
import dynamic from "next/dynamic";
import { MapContainer } from "react-leaflet";
import { TileLayer } from "react-leaflet";

// Cargar los componentes del mapa dinámicamente sin SSR
const MapCentroMonitoreo = dynamic(() => import("../components/Maps/MapCentroMonitoreo"), {
  ssr: false,
});
const MapTrazadoRuta2 = dynamic(() => import("../components/Maps/MapTrazadoRuta2"), {
  ssr: false,
});
const MapSimuladorVehiculo = dynamic(() => import("../components/Maps/MapSimuladorVehiculo"), {
  ssr: false,
  loading: () => <p>Cargando mapa...</p>, // Mostrar un loading en lugar del error
});

const CentroDeMonitoreoConTabs = () => {
  const { reservas, fetchReservas } = useReserva(); // Obtener reservas desde el contexto de reservas
  const { vehiculos, fetchVehiculos } = useVehiculo(); // Obtener vehículos desde el contexto de vehículos
  const [vehiculosEnViaje, setVehiculosEnViaje] = useState<{
    id: string;
    model: string;
    brand: string;
    coordinates: { latitude: number; longitude: number };
  }[]>([]);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<string | null>(null); // Estado para el vehículo seleccionado
  const [vehiculoConRuta, setVehiculoConRuta] = useState<{
    id: string;
    model: string;
    brand: string;
    steps: { latitude: number; longitude: number }[];
  } | null>(null); // Estado para el trazado de rutas
  const [activeTab, setActiveTab] = useState("reservas"); // Estado para la pestaña activa

  const [coordenadasSimulador, setCoordenadasSimulador] = useState<{
    start: [number, number] | null;
    end: [number, number] | null;
    reservaId: string | null;
  }>({ start: null, end: null, reservaId: null }); // Estado para manejar las coordenadas del simulador

  // Método para actualizar las coordenadas de un vehículo
  const actualizarCoordenadasVehiculo = (vehiculoId: string, nuevasCoordenadas: { latitude: number; longitude: number }) => {
    setVehiculosEnViaje((prevVehiculos) =>
      prevVehiculos.map((vehiculo) =>
        vehiculo.id === vehiculoId
          ? { ...vehiculo, coordinates: nuevasCoordenadas } // Actualiza las coordenadas
          : vehiculo
      )
    );
  };

  // Cargar reservas y vehículos al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        console.log("Fetching reservas...");
        await fetchReservas();
        console.log("Fetching vehiculos...");
        await fetchVehiculos();
      } catch (error) {
        console.error("Error al cargar reservas o vehículos", error);
      }
    };

    cargarDatos();
  }, [fetchReservas, fetchVehiculos]);

  // Validar si las reservas están llegando correctamente
  useEffect(() => {
    console.log("Reservas obtenidas:", reservas);
  }, [reservas]);

  // Procesar reservas activas y obtener coordenadas exactas de los vehículos
  useEffect(() => {
    if (reservas.length > 0 && vehiculos.length > 0) {
      const vehiculosFiltrados = reservas
        .filter((reserva) => reserva.status === "ACTIVATED") // Filtrar reservas activas
        .map((reserva) => {
          // Buscar el vehículo en el contexto de Vehiculos
          const vehiculo = vehiculos.find((v) => v.id === reserva.vehicle_id);

          // Si el vehículo tiene coordenadas, las usamos directamente
          if (vehiculo?.coordinates) {
            return {
              id: reserva.vehicle_id,
              model: vehiculo.model || "Modelo del vehículo", // Tomar el modelo desde el contexto
              brand: vehiculo.brand || "Marca del vehículo", // Tomar la marca desde el contexto
              coordinates: vehiculo.coordinates, // Usar coordenadas exactas del vehículo
            };
          }

          // Si no tiene coordenadas, usar valores predeterminados
          return {
            id: reserva.vehicle_id,
            model: vehiculo?.model || "Modelo desconocido",
            brand: vehiculo?.brand || "Marca desconocida",
            coordinates: {
              latitude: -34.603722, // Coordenadas predeterminadas
              longitude: -58.381592,
            },
          };
        });

      setVehiculosEnViaje(vehiculosFiltrados); // Actualizar el estado con los vehículos en viaje
    }
  }, [reservas, vehiculos]);

  // Manejar selección de un vehículo para el mapa de monitoreo
  const handleSeleccionarVehiculo = (vehiculoId: string) => {
    setVehiculoSeleccionado(vehiculoId);
  };

  // Manejar selección de un vehículo para el trazado de rutas
  const handleSeleccionarVehiculoConRuta = (reservaId: string) => {
    const reservaSeleccionada = reservas.find((reserva) => reserva.vehicle_id === reservaId);

    if (reservaSeleccionada) {
      const steps = reservaSeleccionada.trip.routes.flatMap((route) =>
        route.steps.map((step) => ({
          latitude: step.latitude,
          longitude: step.longitude,
        }))
      );

      // Buscar el vehículo en el contexto de Vehiculos
      const vehiculo = vehiculos.find((v) => v.id === reservaSeleccionada.vehicle_id);

      setVehiculoConRuta({
        id: reservaSeleccionada.vehicle_id,
        model: vehiculo?.model || "Modelo del vehículo", // Tomar el modelo desde el contexto
        brand: vehiculo?.brand || "Marca del vehículo", // Tomar la marca desde el contexto
        steps: steps,
      });
    }
  };

  // Manejar selección de un vehículo para el simulador
  const handleSeleccionarVehiculoSimulador = (reservaId: string) => {
    const reservaSeleccionada = reservas.find((reserva) => reserva.vehicle_id === reservaId);

    if (reservaSeleccionada) {
      setCoordenadasSimulador({
        start: [
          reservaSeleccionada.trip.origin.coordinates.latitude,
          reservaSeleccionada.trip.origin.coordinates.longitude,
        ],
        end: [
          reservaSeleccionada.trip.destination.coordinates.latitude,
          reservaSeleccionada.trip.destination.coordinates.longitude,
        ],
        reservaId, // Agregar el ID de la reserva para cambiar la clave del mapa
      });
    }
  };

  return (
    <div className="p-6 bg-gray-900 rounded-xl min-h-screen text-white">
      <h1 className="md:text-4xl text-3xl font-bold mb-8 text-blue-400">Centro de monitoreo</h1>
      {/* Tabs para cambiar entre Reservas, Vehículo y Simulador */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg ${activeTab === "reservas" ? "bg-blue-500" : "bg-gray-700"}`}
          onClick={() => setActiveTab("reservas")}
        >
          Vehículos
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${activeTab === "vehiculo" ? "bg-blue-500" : "bg-gray-700"}`}
          onClick={() => setActiveTab("vehiculo")}
        >
          Reservas
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${activeTab === "simulador" ? "bg-blue-500" : "bg-gray-700"}`}
          onClick={() => setActiveTab("simulador")}
        >
          Simulador
        </button>
      </div>

      {/* Contenido de las tabs */}
      {activeTab === "reservas" && (
        <div className="flex flex-col lg:flex-row h-screen relative overflow-hidden bg-gray-900 text-white">
          {/* Sidebar de vehículos en viaje */}
          <div className="w-full lg:w-1/4 bg-gray-800 p-6 space-y-6 border-r border-gray-700 shadow-lg z-10 overflow-y-auto max-h-screen">
            <h2 className="text-2xl font-semibold mb-4">Vehículos en viaje</h2>
            <ul className="space-y-4">
              {vehiculosEnViaje.length > 0 ? (
                vehiculosEnViaje.map((vehiculo) => (
                  <li
                    key={vehiculo.id}
                    className={`bg-gray-700 hover:bg-gray-600 transition p-4 rounded-lg shadow-md cursor-pointer ${vehiculo.id === vehiculoSeleccionado ? "bg-blue-500" : ""}`}
                    onClick={() => handleSeleccionarVehiculo(vehiculo.id)}
                  >
                    <div className="flex flex-col items-center justify-between">
                      <div className="text-lg font-bold">
                        {vehiculo.brand} {vehiculo.model}
                      </div>
                      <div className="text-sm text-gray-400">ID: {vehiculo.id}</div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No hay vehículos en viaje</li>
              )}
            </ul>
          </div>

          {/* Mapa de monitoreo */}
          <div className="w-full lg:w-3/4 h-full relative z-0">
            {typeof window !== "undefined" && (
              <MapCentroMonitoreo vehiculos={vehiculosEnViaje} vehiculoSeleccionado={vehiculoSeleccionado} />
            )}
          </div>
        </div>
      )}

      {/* TAB VEHICULO */}
      {activeTab === "vehiculo" && (
        <div className="flex flex-col lg:flex-row h-screen relative overflow-hidden bg-gray-900 text-white">
          {/* Sidebar de vehículos con rutas */}
          <div className="w-full lg:w-1/4 bg-gray-800 p-6 space-y-6 border-r border-gray-700 shadow-lg z-10 overflow-y-auto max-h-screen">
            <h2 className="text-2xl font-semibold mb-4">Trazado de rutas</h2>
            <ul className="space-y-4">
              {reservas.length > 0 ? (
                reservas.map((reserva) => (
                  <li
                    key={reserva.vehicle_id}
                    className="bg-gray-700 hover:bg-gray-600 transition p-4 rounded-lg shadow-md cursor-pointer"
                    onClick={() => handleSeleccionarVehiculoConRuta(reserva.vehicle_id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold">Reserva {reserva.vehicle_id}</div>
                      <div className="text-sm text-gray-400">ID: {reserva.vehicle_id}</div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No hay reservas disponibles</li>
              )}
            </ul>
          </div>

          {/* Mapa con el trazado de rutas */}
          <div className="w-full lg:w-3/4 h-full relative z-0">
            {typeof window !== "undefined" && (
              <MapContainer
                center={[-34.493027, -58.639397]} // Coordenadas predeterminadas
                zoom={14}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {vehiculoConRuta && <MapTrazadoRuta2 vehiculoSeleccionado={vehiculoConRuta} />}
              </MapContainer>
            )}
          </div>
        </div>
      )}

      {/* TAB SIMULADOR */}
      {activeTab === "simulador" && (
        <div className="flex flex-col lg:flex-row h-screen relative overflow-hidden bg-gray-900 text-white">
          {/* Sidebar para seleccionar una reserva */}
          <div className="w-full lg:w-1/4 bg-gray-800 p-6 space-y-6 border-r border-gray-700 shadow-lg z-10 overflow-y-auto max-h-screen">
            <h2 className="text-2xl font-semibold mb-4">Simulador de Viaje</h2>
            <ul className="space-y-4">
              {reservas.length > 0 ? (
                reservas.map((reserva) => (
                  <li
                    key={reserva.vehicle_id}
                    className="bg-gray-700 hover:bg-gray-600 transition p-4 rounded-lg shadow-md cursor-pointer"
                    onClick={() => handleSeleccionarVehiculoSimulador(reserva.vehicle_id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold">Reserva {reserva.vehicle_id}</div>
                      <div className="text-sm text-gray-400">ID: {reserva.vehicle_id}</div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No hay reservas disponibles</li>
              )}
            </ul>
          </div>

          {/* Simulador del viaje */}
          <div className="w-full lg:w-3/4 h-full relative z-0">
            {typeof window !== "undefined" &&
              coordenadasSimulador.start &&
              coordenadasSimulador.end &&
              coordenadasSimulador.reservaId && (
                <div style={{ height: "100%", width: "100%" }}>
                  <MapSimuladorVehiculo
                    key={coordenadasSimulador.reservaId} // Usar el ID de la reserva como clave única
                    startPosition={coordenadasSimulador.start}
                    endPosition={coordenadasSimulador.end}
                    onActualizarCoordenadas={(nuevasCoordenadas) =>
                      actualizarCoordenadasVehiculo(coordenadasSimulador.reservaId!, nuevasCoordenadas)
                    }
                  />
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CentroDeMonitoreoConTabs;
