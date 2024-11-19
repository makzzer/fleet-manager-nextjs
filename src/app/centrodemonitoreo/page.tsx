// CentroDeMonitoreoConTabs.tsx

"use client";
import { useState, useEffect } from "react";
import { useReserva } from "@/app/context/ReservesContext";
import { useVehiculo } from "@/app/context/VehiculoContext";
import dynamic from "next/dynamic";
import { MapContainer, TileLayer } from "react-leaflet";
import ProtectedRoute from "../components/Routes/ProtectedRoutes";

// Cargar los componentes del mapa dinámicamente sin SSR
const MapCentroMonitoreo = dynamic(
  () => import("../components/Maps/MapCentroMonitoreo"),
  {
    ssr: false,
  }
);
const MapTrazadoRuta2 = dynamic(
  () => import("../components/Maps/MapTrazadoRuta2"),
  {
    ssr: false,
  }
);
const MapSimuladorVehiculo = dynamic(
  () => import("../components/Maps/MapSimuladorVehiculo"),
  {
    ssr: false,
    loading: () => <p>Cargando mapa...</p>,
  }
);

// Definición de tipos
interface Vehiculo {
  id: string;
  model: string;
  brand: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  status?: string;
}

interface Reserva {
  id: string;
  vehicle_id: string;
  status: string;
  trip: Trip;
}

interface Trip {
  routes: Route[];
  origin: Location;
  destination: Location;
}

interface Route {
  steps: Step[];
}

interface Step {
  latitude: number;
  longitude: number;
}

interface Location {
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface CoordenadasSimulador {
  start: [number, number] | null;
  end: [number, number] | null;
  reservaId: string | null;
  vehicleId: string | null;
}

const CentroDeMonitoreoConTabs = () => {
  const { reservas, fetchReservas } = useReserva();
  const { vehiculos, fetchVehiculos } = useVehiculo();
  const [vehiculosEnViaje, setVehiculosEnViaje] = useState<Vehiculo[]>([]);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<string | null>(null);
  const [vehiculoConRuta, setVehiculoConRuta] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("reservas");

  const [coordenadasSimulador, setCoordenadasSimulador] = useState<CoordenadasSimulador>({
    start: null,
    end: null,
    reservaId: null,
    vehicleId: null,
  });

  // Estados para los filtros
  const [filtroEstadoVehiculos, setFiltroEstadoVehiculos] = useState<string>("Todos");
  const [filtroEstadoReservas, setFiltroEstadoReservas] = useState<string>("Todos");
  const [filtroEstadoSimulador, setFiltroEstadoSimulador] = useState<string>("Todos");

  // Opciones de estado para los filtros
  const opcionesEstado = ["Todos", "CREATED", "ACTIVATED", "COMPLETED", "CANCELED"];

  // Método para actualizar las coordenadas de un vehículo
  const actualizarCoordenadasVehiculo = (
    vehiculoId: string,
    nuevasCoordenadas: { latitude: number; longitude: number }
  ) => {
    setVehiculosEnViaje((prevVehiculos) =>
      prevVehiculos.map((vehiculo) =>
        vehiculo.id === vehiculoId
          ? { ...vehiculo, coordinates: nuevasCoordenadas }
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
  }, [activeTab,fetchReservas, fetchVehiculos]);

  // Procesar reservas y obtener coordenadas de los vehículos
  useEffect(() => {
    if (reservas.length > 0 && vehiculos.length > 0) {
      const vehiculosFiltrados = reservas.map((reserva: Reserva) => {
        const vehiculo = vehiculos.find((v: Vehiculo) => v.id === reserva.vehicle_id);
        return {
          id: reserva.vehicle_id,
          model: vehiculo?.model || "Modelo desconocido",
          brand: vehiculo?.brand || "Marca desconocida",
          status: reserva.status,
          coordinates: vehiculo?.coordinates || {
            latitude: -34.603722,
            longitude: -58.381592,
          },
        };
      });

      setVehiculosEnViaje(vehiculosFiltrados);
    }
  }, [reservas, vehiculos]);

  // Manejar selección de un vehículo para el mapa de monitoreo
  const handleSeleccionarVehiculo = (vehiculoId: string) => {
    setVehiculoSeleccionado(vehiculoId);
  };

  // Manejar selección de un vehículo para el trazado de rutas
  const handleSeleccionarVehiculoConRuta = (reservaId: string) => {
    const reservaSeleccionada = reservas.find(
      (reserva: Reserva) => reserva.id === reservaId
    );

    if (reservaSeleccionada) {
      const steps = reservaSeleccionada.trip.routes.flatMap((route: Route) =>
        route.steps.map((step: Step) => ({
          latitude: step.latitude,
          longitude: step.longitude,
        }))
      );

      const vehiculo = vehiculos.find(
        (v: Vehiculo) => v.id === reservaSeleccionada.vehicle_id
      );

      setVehiculoConRuta({
        id: reservaSeleccionada.vehicle_id,
        model: vehiculo?.model || "Modelo desconocido",
        brand: vehiculo?.brand || "Marca desconocida",
        steps: steps,
      });
    }
  };

  // Manejar selección de un vehículo para el simulador
  const handleSeleccionarVehiculoSimulador = (reservaId: string) => {
    const reservaSeleccionada = reservas.find(
      (reserva: Reserva) => reserva.id === reservaId
    );

    if (reservaSeleccionada) {
      const vehiculoSeleccionado = vehiculos.find(
        (vehiculo: Vehiculo) => vehiculo.id === reservaSeleccionada.vehicle_id
      );

      if (vehiculoSeleccionado && vehiculoSeleccionado.coordinates) {
        setCoordenadasSimulador({
          start: [
            vehiculoSeleccionado.coordinates.latitude,
            vehiculoSeleccionado.coordinates.longitude,
          ],
          end: [
            reservaSeleccionada.trip.destination.coordinates.latitude,
            reservaSeleccionada.trip.destination.coordinates.longitude,
          ],
          reservaId: reservaSeleccionada.id,
          vehicleId: reservaSeleccionada.vehicle_id,
        });
      } else {
        console.error("No se encontró el vehículo o no tiene coordenadas.");
      }
    }
  };

  // Resetear estados al cambiar de pestaña
  useEffect(() => {
    if (activeTab !== 'simulador') {
      setCoordenadasSimulador({
        start: null,
        end: null,
        reservaId: null,
        vehicleId: null,
      });
    }
    if (activeTab !== 'vehiculo') {
      setVehiculoConRuta(null);
    }
    if (activeTab !== 'reservas') {
      setVehiculoSeleccionado(null);
    }
  }, [activeTab]);

  return (
    <ProtectedRoute requiredModule="ANALYTICS">
      <div className="p-6 bg-gray-900 rounded-xl min-h-screen text-white">
        <h1 className="md:text-4xl text-3xl font-bold mb-8 text-blue-400">
          Centro de monitoreo
        </h1>
        {/* Tabs para cambiar entre Reservas, Vehículo y Simulador */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "reservas" ? "bg-blue-500" : "bg-gray-700"
            }`}
            onClick={() => setActiveTab("reservas")}
          >
            Vehículos
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "vehiculo" ? "bg-blue-500" : "bg-gray-700"
            }`}
            onClick={() => setActiveTab("vehiculo")}
          >
            Reservas
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "simulador" ? "bg-blue-500" : "bg-gray-700"
            }`}
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
              <h2 className="text-2xl font-semibold mb-4">
                Vehículos en viaje
              </h2>
              {/* Filtro de estado */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Filtrar por estado:
                </label>
                <select
                  className="w-full bg-gray-700 text-white rounded-md p-2"
                  value={filtroEstadoVehiculos}
                  onChange={(e) => setFiltroEstadoVehiculos(e.target.value)}
                >
                  {opcionesEstado.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado === "Todos" ? "Todos los estados" : estado}
                    </option>
                  ))}
                </select>
              </div>
              <ul className="space-y-4">
                {vehiculosEnViaje.length > 0 ? (
                  vehiculosEnViaje
                    .filter((vehiculo) =>
                      filtroEstadoVehiculos === "Todos"
                        ? true
                        : vehiculo.status === filtroEstadoVehiculos
                    )
                    .map((vehiculo) => (
                      <li
                        key={vehiculo.id}
                        className={`bg-gray-700 hover:bg-gray-600 transition p-4 rounded-lg shadow-md cursor-pointer ${
                          vehiculo.id === vehiculoSeleccionado ? "bg-blue-500" : ""
                        }`}
                        onClick={() => handleSeleccionarVehiculo(vehiculo.id)}
                      >
                        <div className="flex flex-col items-center justify-between">
                          <div className="text-lg font-bold">
                            {vehiculo.brand} {vehiculo.model}
                          </div>
                          <div className="text-sm text-gray-400">
                            ID: {vehiculo.id}
                          </div>
                          {/* Mostrar el estado del vehiculo */}
                          <div
                            className={`text-sm font-semibold ${
                              vehiculo.status === "CREATED"
                                ? "text-blue-400"
                                : vehiculo.status === "COMPLETED"
                                ? "text-green-400"
                                : vehiculo.status === "ACTIVATED"
                                ? "text-yellow-400"
                                : vehiculo.status === "CANCELED"
                                ? "text-red-400"
                                : "text-gray-400"
                            }`}
                          >
                            {vehiculo.status}
                          </div>
                        </div>
                      </li>
                    ))
                ) : (
                  <li className="text-gray-500">
                    No hay vehículos en viaje
                  </li>
                )}
              </ul>
            </div>

            {/* Mapa de monitoreo */}
            <div className="w-full lg:w-3/4 h-full relative z-0">
              {typeof window !== "undefined" && (
                <MapCentroMonitoreo
                //key={`map-centro-monitoreo-${activeTab}-${vehiculoSeleccionado}`}
                  vehiculos={vehiculosEnViaje.filter((vehiculo) =>
                    filtroEstadoVehiculos === "Todos"
                      ? true
                      : vehiculo.status === filtroEstadoVehiculos
                  )}
                  vehiculoSeleccionado={vehiculoSeleccionado}
                />
              )}
            </div>
          </div>
        )}

        {/* TAB VEHICULO */}
        {activeTab === "vehiculo" && (
          <div className="flex flex-col lg:flex-row h-screen relative overflow-hidden bg-gray-900 text-white">
            {/* Sidebar de vehículos con rutas */}
            <div className="w-full lg:w-1/4 bg-gray-800 p-6 space-y-6 border-r border-gray-700 shadow-lg z-10 overflow-y-auto max-h-screen">
              <h2 className="text-2xl font-semibold mb-4">
                Trazado de rutas
              </h2>
              {/* Filtro de estado */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Filtrar por estado:
                </label>
                <select
                  className="w-full bg-gray-700 text-white rounded-md p-2"
                  value={filtroEstadoReservas}
                  onChange={(e) => setFiltroEstadoReservas(e.target.value)}
                >
                  {opcionesEstado.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado === "Todos" ? "Todos los estados" : estado}
                    </option>
                  ))}
                </select>
              </div>
              <ul className="space-y-4">
                {reservas.length > 0 ? (
                  reservas
                    .filter((reserva) =>
                      filtroEstadoReservas === "Todos"
                        ? true
                        : reserva.status === filtroEstadoReservas
                    )
                    .map((reserva) => (
                      <li
                        key={reserva.id}
                        className="bg-gray-700 hover:bg-gray-600 transition p-4 rounded-lg shadow-md cursor-pointer"
                        onClick={() =>
                          handleSeleccionarVehiculoConRuta(reserva.id)
                        }
                      >
                        <div className="flex flex-col items-center justify-between">
                          <div className="text-lg font-bold">
                            Reserva: {reserva.id.slice(0,8)}
                          </div>
                          <div className="text-sm text-gray-400">
                            Vehículo ID: {reserva.vehicle_id}
                          </div>
                          <div className="text-sm text-gray-400">
                           {}
                          </div>
                          <div
                            className={`text-sm font-semibold ${
                              reserva.status === "CREATED"
                                ? "text-blue-400"
                                : reserva.status === "COMPLETED"
                                ? "text-green-400"
                                : reserva.status === "ACTIVATED"
                                ? "text-yellow-400"
                                : reserva.status === "CANCELED"
                                ? "text-red-400"
                                : "text-gray-400"
                            }`}
                          >
                            {reserva.status}
                          </div>
                        </div>
                      </li>
                    ))
                ) : (
                  <li className="text-gray-500">
                    No hay reservas disponibles
                  </li>
                )}
              </ul>
            </div>

            {/* Mapa con el trazado de rutas */}
            <div className="w-full lg:w-3/4 h-full relative z-0">
              {typeof window !== "undefined" && (
                <MapContainer
                key={`map-trazado-ruta-${activeTab}-${vehiculoConRuta ? vehiculoConRuta.id : ''}`}                  center={[-34.493027, -58.639397]}
                  zoom={14}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {vehiculoConRuta && (
                    <MapTrazadoRuta2
                      vehiculoSeleccionado={vehiculoConRuta}
                    />
                  )}
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
              <h2 className="text-2xl font-semibold mb-4">
                Simulador de Viaje
              </h2>
              {/* Filtro de estado */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Filtrar por estado:
                </label>
                <select
                  className="w-full bg-gray-700 text-white rounded-md p-2"
                  value={filtroEstadoSimulador}
                  onChange={(e) =>
                    setFiltroEstadoSimulador(e.target.value)
                  }
                >
                  {opcionesEstado.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado === "Todos" ? "Todos los estados" : estado}
                    </option>
                  ))}
                </select>
              </div>
              <ul className="space-y-4">
                {reservas.length > 0 ? (
                  reservas
                    .filter((reserva) =>
                      filtroEstadoSimulador === "Todos"
                        ? true
                        : reserva.status === filtroEstadoSimulador
                    )
                    .map((reserva) => (
                      <li
                        key={reserva.id}
                        className="bg-gray-700 hover:bg-gray-600 transition p-4 rounded-lg shadow-md cursor-pointer"
                        onClick={() =>
                          handleSeleccionarVehiculoSimulador(reserva.id)
                        }
                      >
                        <div className="flex flex-col items-center justify-between">
                          <div className="text-lg font-bold">
                            
                            Reserva: {reserva.id.slice(0,8)}
                          </div>
                          
                          <div className="text-sm text-gray-400">
                            Vehículo ID: {reserva.vehicle_id}
                          </div>
                          <div
                            className={`text-sm font-semibold ${
                              reserva.status === "CREATED"
                                ? "text-blue-400"
                                : reserva.status === "COMPLETED"
                                ? "text-green-400"
                                : reserva.status === "ACTIVATED"
                                ? "text-yellow-400"
                                : reserva.status === "CANCELED"
                                ? "text-red-400"
                                : "text-gray-400"
                            }`}
                          >
                            {reserva.status}
                          </div>
                        </div>
                      </li>
                    ))
                ) : (
                  <li className="text-gray-500">
                    No hay reservas disponibles
                  </li>
                )}
              </ul>
            </div>

            {/* Simulador del viaje */}
            <div className="w-full lg:w-3/4 h-full relative z-0">
              {typeof window !== "undefined" &&
                coordenadasSimulador.start &&
                coordenadasSimulador.end &&
                coordenadasSimulador.reservaId &&
                coordenadasSimulador.vehicleId && (
                  <div style={{ height: "100%", width: "100%" }}>
                    <MapSimuladorVehiculo
                    key={`map-simulador-${activeTab}-${coordenadasSimulador.vehicleId}`}
                      startPosition={coordenadasSimulador.start}
                      endPosition={coordenadasSimulador.end}
                      vehicleId={coordenadasSimulador.vehicleId}
                      onActualizarCoordenadas={(nuevasCoordenadas: { latitude: number; longitude: number }) =>
                        actualizarCoordenadasVehiculo(
                          coordenadasSimulador.vehicleId!,
                          nuevasCoordenadas
                        )
                      }
                    />
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default CentroDeMonitoreoConTabs;