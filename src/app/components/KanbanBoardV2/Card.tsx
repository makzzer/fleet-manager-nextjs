"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { DropIndicator } from "./DropIndicator";
import { Control, useControl } from "@/app/context/ControlContext";
import { FaCar, FaMotorcycle, FaRegCalendarAlt, FaTruck, FaUserCircle } from "react-icons/fa";
import { FiAlertCircle, FiTool, FiX } from "react-icons/fi";
import { IoIosArrowDown, IoIosArrowUp, IoIosRemove } from "react-icons/io";
import { IoPulse } from "react-icons/io5";
import { FaVanShuttle } from "react-icons/fa6";
import { useUser } from "@/app/context/UserContext";
import dynamic from "next/dynamic";

interface CardProps {
  control: Control;
  handleDragStart: (e: any, control: any) => void;
}

const MapVehiculo = dynamic(
  () => import("@/app/components/Maps/MapVehiculo"),
  {
    ssr: false,
  }
);

export const Card: React.FC<CardProps> = ({ control, handleDragStart }) => {
  const [showModal, setShowModal] = useState(false);
  const { controls, assignOperator } = useControl();
  const { users } = useUser();

  
  const getControlCount = (operatorId: string) => {
    return controls
      .filter(control => control.operator && control.operator.id == operatorId)
      .length;
  }

  const operadores = users
    .filter((usuario) => usuario.roles.includes("OPERATOR"))
    .map(usuario => {
      const controCount = getControlCount(usuario.id);
      return {
        id: usuario.id,
        full_name: `${usuario.full_name} (${controCount} controles)`,
        control_count: controCount
      };})
    .filter(operator => operator.control_count <= 5)
    .sort((a, b) => a.control_count - b.control_count);

  const closeModal = () => {
    setShowModal(false);
  };

  const handleViewDetails = () => {
    setShowModal(true);
  };


  const vehicleTypeLogo = (type: string) => {
    switch (type) {
      case "CAR":
        return <FaCar />;
      case "TRUCK":
        return <FaTruck />;
      case "MOTORCYCLE":
        return <FaMotorcycle />;
      default:
        return <FaVanShuttle />;
    }
  };

  const priorityLogo = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return <IoIosArrowUp className="w-6 h-6 text-red-500" />;
      case "MEDIUM":
        return <IoIosRemove className="w-6 h-6 text-yellow-500" />;
      default:
        return <IoIosArrowDown className="w-6 h-6 text-blue-500" />;
    }
  };

  const typeLogo = (type: string) => {
    const typeStyles =
      "flex inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full mb-2 ";
    switch (type) {
      case "CORRECTIVE":
        return (
          <div className={`${typeStyles} bg-red-500 text-white`}>
            <FiTool />
            <span>Correctivo</span>
          </div>
        );
      case "PREVENTIVE":
        return (
          <div className={`${typeStyles} bg-green-500 text-white`}>
            <FiAlertCircle />
            <span>Preventivo</span>
          </div>
        );
      default:
        return (
          <div className={`${typeStyles} bg-blue-500 text-white`}>
            <IoPulse />
            <span>Predictivo</span>
          </div>
        );
    }
  };
  

  return (
    <>
      <DropIndicator beforeId={control.id} column={control.status} />
        <motion.div
          layout
          layoutId={control.id}
          draggable="true"
          onDragStart={(e) => handleDragStart(e, control)}
          onClick={() => handleViewDetails()}
          className="cursor-grab rounded-lg border border-gray-700 hover:border-blue-500 bg-gray-900 p-3 active:cursor-grabbing"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-white truncate">
              {control.subject}
            </h3>
            {priorityLogo(control.priority)}
          </div>
          {typeLogo(control.type)}
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            {vehicleTypeLogo(control.vehicle.type)}
            <span>{control.vehicle.id}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500 pt-2 border-t border-gray-700">
            <div className="flex items-center gap-2">
              <FaRegCalendarAlt />
              <span>{new Date(control.date_created).toLocaleDateString()}</span>
            </div>
            {control.operator && <FaUserCircle className="w-5 h-5" aria-label={`${control.operator.full_name}`}/>}
          </div>
        </motion.div>
        {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 text-white p-6 rounded-lg max-w-3xl w-full relative max-h-screen overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-300 hover:text-gray-100"
              onClick={closeModal}
            >
              <FiX className="w-6 h-6" />
            </button>
            <div className="flex flex-col gap-6 w-full">
              <div className="flex gap-2 md:gap-5 text-xs justify-start align-start">
                {typeLogo(control.type)}
                /
                <p>
                  ({control.vehicle.id}) - {control.vehicle.brand}{" "}
                  {control.vehicle.model} {control.vehicle.year}
                </p>
              </div>

              <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                <div className="flex flex-col gap-2 items-start">
                  <h3 className="text-3xl mb-6 font-bold text-left">
                    {control.subject}
                  </h3>
                  <h4 className="text-xl font-semibold text-left">
                    Descripción
                  </h4>
                  <p className="text-base text-left">
                    {control.description}
                  </p>
                </div>

                <div className="flex flex-col gap-2 items-start md:px-4 md:border-l-2 border-gray-700">
                  <h4 className="text-xl font-semibold">Detalles</h4>
                  {control.operator ? (
                    <p className="text-left">
                      Persona asignada:{" "}
                      {control.operator.full_name}
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="operator-select"
                        className="text-left"
                      >
                        Asignar operador:
                      </label>
                      <select
                        id="operator-select"
                        className="bg-gray-800 text-white rounded-md p-2"
                        onChange={async (e) => {
                          const selectedOperatorId = e.target.value;
                           if (
                             selectedOperatorId &&
                             assignOperator
                           ) {
                             try {
                               await assignOperator(
                                 control.id,
                                 selectedOperatorId
                               );
                               closeModal();
                             } catch (error) {
                               console.error(error);
                               // Mostrar mensaje de error
                             }
                           }
                        }}
                      >
                        <option value="">
                          Seleccionar operador
                        </option>
                        {operadores.map((operador) => (
                          <option
                            key={operador.id}
                            value={operador.id}
                          >
                            {operador.full_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="flex gap-2 justify-start">
                    <p className="text-left">Estado:</p>
                    <p className="text-left">
                      {control.status === "TODO"
                        ? "Pendiente"
                        : control.status === "DOING"
                          ? "En proceso"
                          : "Hecho"}
                    </p>
                  </div>
                  <p className="text-left">
                    Prioridad:{" "}
                    {control.priority === "HIGH"
                      ? "Alta"
                      : control.priority === "MEDIUM"
                        ? "Media"
                        : "Baja"}
                  </p>
                </div>
              </div>
              {control.type === "CORRECTIVE" &&
                <div className="mt-4">
                  <h4 className="text-xl font-semibold">Ubicación</h4>
                  <div className="h-64 rounded-lg shadow-lg flex items-center justify-center">
                    <MapVehiculo coordinates={control.vehicle.coordinates} />
                  </div>
                </div>}
              <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={closeModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
