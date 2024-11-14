"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { motion } from "framer-motion";
import { DropIndicator } from "./DropIndicator";
import { Control } from "@/app/context/ControlContext";
import { FaCar, FaMotorcycle, FaRegCalendarAlt, FaTruck, FaUserCircle } from "react-icons/fa";
import { FiAlertCircle, FiTool } from "react-icons/fi";
import { IoIosArrowDown, IoIosArrowUp, IoIosRemove } from "react-icons/io";
import { IoPulse } from "react-icons/io5";
import Link from "next/link";
import { FaVanShuttle } from "react-icons/fa6";

interface CardProps {
  control: Control;
  handleDragStart: (e: any, control: any) => void;
}

export const Card: React.FC<CardProps> = ({ control, handleDragStart }) => {
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
      <Link href={`/control/${control.id}`} scroll={false} passHref>
        <motion.div
          layout
          layoutId={control.id}
          draggable="true"
          onDragStart={(e) => handleDragStart(e, control)}
          className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
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
            {control.operator && <FaUserCircle className="w-5 h-5" />}
          </div>
        </motion.div>
      </Link>
    </>
  );
};
