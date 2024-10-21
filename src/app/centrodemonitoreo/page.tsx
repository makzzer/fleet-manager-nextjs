"use client";
import { useState, useEffect } from "react";
import { useReserva } from "@/app/context/ReservesContext";
import { useVehiculo } from "@/app/context/VehiculoContext"; // Importar el contexto de Vehículos
import MapCentroMonitoreo from "../components/Maps/MapCentroMonitoreo"; // Mapa de vehículos
import MapTrazadoRuta2 from "../components/Maps/MapTrazadoRuta2"; // Mapa de trazado de rutas
import { MapContainer, TileLayer } from "react-leaflet";

// Página con pestañas para cambiar entre el monitoreo y el trazado de rutas
const CentroDeMonitoreoConTabs = () => {
    const { reservas, fetchReservas } = useReserva(); // Obtener reservas desde el contexto de reservas
    const { vehiculos, fetchVehiculos } = useVehiculo(); // Obtener vehículos desde el contexto de vehículos
    const [vehiculosEnViaje, setVehiculosEnViaje] = useState<
        { id: string; model: string; brand: string; coordinates: { latitude: number; longitude: number } }[]
    >([]);
    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<string | null>(null); // Estado para el vehículo seleccionado
    const [vehiculoConRuta, setVehiculoConRuta] = useState<{
        id: string;
        model: string;
        brand: string;
        steps: { latitude: number; longitude: number }[];
    } | null>(null); // Estado para el trazado de rutas
    const [activeTab, setActiveTab] = useState("reservas"); // Estado para la pestaña activa

    // Cargar reservas y vehículos al montar el componente
    useEffect(() => {
        const cargarDatos = async () => {
            await fetchReservas();
            await fetchVehiculos();
        };

        cargarDatos();
    }, [fetchReservas, fetchVehiculos]);

    // Procesar reservas activas y obtener coordenadas aleatorias
    useEffect(() => {
        const vehiculosFiltrados = reservas
            .filter((reserva) => reserva.status === "ACTIVATED") // Filtrar reservas activas
            .map((reserva) => {
                // Buscar el vehículo en el contexto de Vehiculos
                const vehiculo = vehiculos.find((v) => v.id === reserva.vehicle_id);

                // Obtener las coordenadas aleatorias de los steps del viaje
                if (reserva.trip.routes.length > 0 && reserva.trip.routes[0].steps.length > 0) {
                    const randomRouteIndex = Math.floor(Math.random() * reserva.trip.routes.length);
                    const randomStepIndex = Math.floor(Math.random() * reserva.trip.routes[randomRouteIndex].steps.length);
                    const randomStep = reserva.trip.routes[randomRouteIndex].steps[randomStepIndex];

                    if (randomStep && randomStep.latitude && randomStep.longitude) {
                        return {
                            id: reserva.vehicle_id,
                            model: vehiculo?.model || "Modelo del vehículo", // Tomar el modelo desde el contexto
                            brand: vehiculo?.brand || "Marca del vehículo", // Tomar la marca desde el contexto
                            coordinates: {
                                latitude: randomStep.latitude,
                                longitude: randomStep.longitude,
                            },
                        };
                    }
                }

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

    return (
        <div className="p-6 bg-gray-900 rounded-xl min-h-screen text-white">
            <h1 className="md:text-4xl text-3xl font-bold mb-8 text-blue-400">
                Centro de monitoreo
            </h1>
            {/* Tabs para cambiar entre Reservas y Vehículo */}
            <div className="flex space-x-4 mb-6">
                <button
                    className={`px-4 py-2 rounded-lg ${activeTab === "reservas" ? "bg-blue-500" : "bg-gray-700"}`}
                    onClick={() => setActiveTab("reservas")}
                >
                    Reservas
                </button>
                <button
                    className={`px-4 py-2 rounded-lg ${activeTab === "vehiculo" ? "bg-blue-500" : "bg-gray-700"}`}
                    onClick={() => setActiveTab("vehiculo")}
                >
                    Vehículo
                </button>
            </div>

            {/* Contenido de las tabs */}
            {activeTab === "reservas" && (
                <div className="flex flex-col lg:flex-row h-screen relative overflow-hidden bg-gray-900 text-white">
                    {/* Sidebar de vehículos en viaje */}
                    <div className="w-full lg:w-1/4 bg-gray-800 p-6 space-y-6 border-r border-gray-700 shadow-lg z-10">
                        <h2 className="text-2xl font-semibold mb-4">Vehículos en viaje</h2>
                        <ul className="space-y-4">
                            {vehiculosEnViaje.length > 0 ? (
                                vehiculosEnViaje.map((vehiculo) => (
                                    <li
                                        key={vehiculo.id}
                                        className={`bg-gray-700 hover:bg-gray-600 transition p-4 rounded-lg shadow-md cursor-pointer ${vehiculo.id === vehiculoSeleccionado ? "bg-blue-500" : ""
                                            }`}
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
                        <MapCentroMonitoreo vehiculos={vehiculosEnViaje} vehiculoSeleccionado={vehiculoSeleccionado} />
                    </div>
                </div>
            )}

            {activeTab === "vehiculo" && (
                <div className="flex flex-col lg:flex-row h-screen relative overflow-hidden bg-gray-900 text-white">
                    {/* Sidebar de vehículos con rutas */}
                    <div className="w-full lg:w-1/4 bg-gray-800 p-6 space-y-6 border-r border-gray-700 shadow-lg z-10">
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default CentroDeMonitoreoConTabs;
