"use client";
import React, { useEffect, useState } from "react";
import { useReserva } from "@/app/context/ReservesContext";
import { Reserva } from "@/app/context/ReservesContext";
import { useAuth } from "@/app/context/AuthContext";
import { useVehiculo } from "@/app/context/VehiculoContext"; // Importamos el contexto de Vehiculos
import { useRouter } from "next/navigation";

interface ListadoReservasProps {
  startDate: Date | null;
  endDate: Date | null;
  filtroEstado: string;
}

const ListadoReservas: React.FC<ListadoReservasProps> = ({
  startDate,
  endDate,
  filtroEstado,
}) => {
  const { reservas, fetchReservas } = useReserva();
  const { vehiculos, fetchVehiculos } = useVehiculo(); // Accedemos a los vehículos
  const { authenticatedUser } = useAuth();
  const [reservasFiltradas, setReservasFiltradas] = useState<Reserva[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchReservas();
    fetchVehiculos();
  }, [fetchReservas, fetchVehiculos]);

  useEffect(() => {
    // Filtrar las reservas según el usuario autenticado
    const reservasUsuario = reservas.filter(
      (reserva) => reserva.user_id === authenticatedUser?.id
    );

    let reservasFiltradasPorFecha = reservasUsuario;

    // Filtrar por rango de fechas
    if (startDate && endDate) {
      reservasFiltradasPorFecha = reservasFiltradasPorFecha.filter((reserva) => {
        const fechaReserva = new Date(reserva.date_created);
        const inicio = new Date(startDate);
        inicio.setHours(0, 0, 0, 0);
        const fin = new Date(endDate);
        fin.setHours(23, 59, 59, 999);
        return fechaReserva >= inicio && fechaReserva <= fin;
      });
    }

    // Filtrar por estado
    let reservasFiltradasPorEstado = reservasFiltradasPorFecha;
    if (filtroEstado !== "Todos") {
      reservasFiltradasPorEstado = reservasFiltradasPorFecha.filter(
        (reserva) => reserva.status === filtroEstado
      );
    }

    setReservasFiltradas(reservasFiltradasPorEstado);
  }, [reservas, authenticatedUser, startDate, endDate, filtroEstado]);

  return (
    <div>
      {reservasFiltradas.length > 0 ? (
        <ul className="space-y-4">
          {reservasFiltradas.map((reserva) => {
            // Buscar el vehículo relacionado en el contexto de vehículos
            const vehiculoReserva = vehiculos.find(
              (vehiculo) => vehiculo.id === reserva.vehicle_id
            );

            return (
              <li
                key={reserva.id}
                className="bg-gray-800 p-6 rounded-lg shadow-md cursor-pointer hover:bg-gray-700 transition"
                onClick={() => router.push(`/detalleReserva/${reserva.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      Reserva ID: {reserva.id}
                    </h2>
                    <p className="text-gray-400 mb-1">
                      Fecha de creación:{" "}
                      {new Date(reserva.date_created).toLocaleDateString()}
                    </p>
                    <p className="text-gray-400 mb-1">
                      Fecha de inicio:{" "}
                      {new Date(reserva.date_reserve).toLocaleDateString()}
                    </p>
                    <p className="text-gray-400 mb-1">
                      Fecha de fin:{" "}
                      {new Date(reserva.date_finish_reserve).toLocaleDateString()}
                    </p>

                    {/* Mostrar información del vehículo si está disponible */}
                    {vehiculoReserva ? (
                      <>
                        <p className="text-gray-300 mt-3">
                          <strong>Vehículo:</strong> {vehiculoReserva.brand} {vehiculoReserva.model}
                        </p>
                        <p className="text-gray-300">
                          <strong>Patente:</strong> {vehiculoReserva.id}
                        </p>
                      </>
                    ) : (
                      <p className="text-red-400 mt-3">
                        Información del vehículo no disponible
                      </p>
                    )}
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      reserva.status === "COMPLETED"
                        ? "text-green-400"
                        : reserva.status === "CANCELED"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {reserva.status}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-400">
          {startDate || endDate || filtroEstado !== "Todos"
            ? "No tienes reservas que coincidan con los filtros aplicados."
            : "No tienes reservas registradas."}
        </p>
      )}
    </div>
  );
};

export default ListadoReservas;

// clase vehiculocard antes de sobreponerse con listadoreservas.

// import React from "react";
// import { useRouter } from "next/navigation";
// import Swal from "sweetalert2";
// import {
//   tiposCombustible,
//   tiposVehiculo,
//   unidadesCombustible,
//   useVehiculo,
//   Vehiculo,
// } from "@/app/context/VehiculoContext";
// import { FiEdit, FiEye, FiTrash, FiCheckCircle } from "react-icons/fi";
// import { FaCar, FaTruck, FaShip } from "react-icons/fa";
// import QRCode from "react-qr-code"; // Importamos QRCode

// interface VehiculoCardProps {
//   vehiculo: Vehiculo;
// }

// const VehiculoCard = ({ vehiculo }: VehiculoCardProps) => {
//   const router = useRouter();
//   const { modifyVehiculo, deleteVehiculo, enableVehiculo } = useVehiculo();

//   const camiones = {
//     marcas: [
//       {
//         marca: "Toyota",
//         modelos: ["Hino 300", "Dyna", "Toyotace"],
//       },
//       {
//         marca: "Ford",
//         modelos: ["F-750", "Cargo 1723", "Transit Chasis"],
//       },
//       {
//         marca: "Chevrolet",
//         modelos: ["N-Series", "T-Series", "C4500 Kodiak"],
//       },
//       {
//         marca: "Volkswagen",
//         modelos: ["Constellation 24.280", "Delivery 9.170", "Worker 17.220"],
//       },
//       {
//         marca: "Mercedes-Benz",
//         modelos: ["Atego 1726", "Accelo 1016", "Actros 2545"],
//       },
//     ],
//   };

//   const typeIcons = (vehiculo: Vehiculo) => {
//     return vehiculo.type === "Auto" ? (
//       <FaCar
//         className={`text-2xl font-bold max-w-full mt-1 ${
//           vehiculo.fuel_type === "Gasoil"
//             ? "text-amber-400"
//             : "text-cyan-400"
//         }`}
//       />
//     ) : vehiculo.type === "Camión" ? (
//       <FaTruck
//         className={`text-2xl font-bold max-w-full mt-1 ${
//           vehiculo.fuel_type === "Gasoil"
//             ? "text-amber-400"
//             : "text-cyan-400"
//         }`}
//       />
//     ) : (
//       <FaShip
//         className={`text-2xl font-bold max-w-full mt-1 ${
//           vehiculo.fuel_type === "Gasoil"
//             ? "text-amber-400"
//             : "text-cyan-400"
//         }`}
//       />
//     );
//   };

//   const handleViewVehiculo = (id: string) => {
//     if (vehiculo.status === "AVAILABLE") {
//       router.push(`/vehiculos/${id}`);
//     }
//   };

//   const handleDisableVehicle = async () => {
//     const newStatus =
//       vehiculo.status === "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE";
//     const updatedVehiculo = { ...vehiculo, status: newStatus };
//     try {
//       if (vehiculo.status === "AVAILABLE") {
//         await deleteVehiculo(updatedVehiculo); // Deshabilita el vehículo
//         Swal.fire({
//           title: "Vehículo deshabilitado",
//           text: "El vehículo ha sido deshabilitado correctamente.",
//           icon: "success",
//           confirmButtonColor: "#3085d6",
//         });
//       } else {
//         await enableVehiculo(updatedVehiculo.id); // Habilita el vehículo
//         Swal.fire({
//           title: "Vehículo habilitado",
//           text: "El vehículo ha sido habilitado correctamente.",
//           icon: "success",
//           confirmButtonColor: "#3085d6",
//         });
//       }
//     } catch (error) {
//       console.error(error);
//       Swal.fire({
//         title: "Error",
//         text: "Hubo un problema al cambiar el estado del vehículo. Por favor, intenta de nuevo.",
//         icon: "error",
//         confirmButtonColor: "#d33",
//       });
//     }
//   };

//   const handleEdit = () => {
//     // Aquí va tu código existente para editar el vehículo
//   };

//   // Generar el valor del código QR
//   const qrValue = `${window.location.origin}/vehiculos/${vehiculo.id}`;

//   return (
//     <div className="p-6 rounded-lg shadow-lg text-white transition duration-300 ease-in-out bg-gray-800 hover:bg-gray-900 h-full flex flex-col justify-between">
//       <div className="min-h-[120px]">
//         <div className="flex flex-row justify-between">
//           <h2
//             className="text-2xl font-bold mb-3 truncate max-w-full"
//             title={`${vehiculo.brand}`}
//           >
//             {vehiculo.brand} {vehiculo.model}
//           </h2>
//           {typeIcons(vehiculo)}
//         </div>
//         <p className="text-lg text-gray-300 mb-3 ">ID: {vehiculo.id}</p>
//         <h3
//           className="text-2xl font-bold truncate max-w-full"
//           title={`${vehiculo.brand} ${vehiculo.model}`}
//         >
//           {vehiculo.year}
//         </h3>
//       </div>

//       {/* Código QR */}
//       <div className="mt-4 flex justify-center">
//         <QRCode value={qrValue} size={64} bgColor="#1a202c" fgColor="#ffffff" />
//       </div>

//       <div className="mt-4 text-gray-400">
//         <p className="text-sm">
//           Creado el: {new Date(vehiculo.date_created).toLocaleString()}
//         </p>
//         <p className="text-sm">
//           Actualizado el: {new Date(vehiculo.date_updated).toLocaleString()}
//         </p>
//       </div>

//       <div className="flex justify-between text-center mt-6 space-x-2">
//         <button
//           title="Detalle"
//           onClick={() => handleViewVehiculo(vehiculo.id)}
//           disabled={vehiculo.status !== "AVAILABLE"}
//           className="bg-blue-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 flex items-center justify-center w-full"
//         >
//           <FiEye className="w-5 h-5" />
//         </button>

//         <button
//           title="Editar"
//           onClick={handleEdit}
//           disabled={vehiculo.status !== "AVAILABLE"}
//           className="bg-yellow-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 flex items-center justify-center w-full"
//         >
//           <FiEdit className="w-5 h-5" />
//         </button>

//         {vehiculo.status === "AVAILABLE" ? (
//           <button
//             title="Deshabilitar"
//             onClick={handleDisableVehicle}
//             className="font-bold py-2 px-4 rounded bg-red-500 hover:bg-red-600 flex items-center justify-center w-full"
//           >
//             <FiTrash className="w-5 h-5" />
//           </button>
//         ) : (
//           <button
//             title="Habilitar"
//             onClick={handleDisableVehicle}
//             className="font-bold py-2 px-4 rounded bg-green-500 hover:bg-blue-600 flex items-center justify-center w-full"
//           >
//             <FiCheckCircle className="w-5 h-5" />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VehiculoCard;