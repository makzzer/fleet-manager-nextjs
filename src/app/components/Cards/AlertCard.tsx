// components/AlertCard.tsx

"use client";
import React, { useState } from "react";

interface AlertCardProps {
  id: string;
  title: string;
  description: string;
  dateCreated: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  acknowledge: boolean;
  onAcknowledge: () => void;
}

const AlertCard: React.FC<AlertCardProps> = ({
  id,
  title,
  description,
  dateCreated,
  priority,
  acknowledge,
  onAcknowledge,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const getPriorityColor = () => {
    switch (priority) {
      case "HIGH":
        return "border-red-500";
      case "MEDIUM":
        return "border-yellow-500";
      case "LOW":
        return "border-green-500";
      default:
        return "border-gray-500";
    }
  };

  const handleAcknowledgeClick = () => {
    // Iniciar la animación de desvanecimiento y desplazamiento
    setIsVisible(false);
    // Esperar a que termine la animación antes de llamar a onAcknowledge
    setTimeout(() => {
      onAcknowledge();
    }, 500); // Duración de la transición en milisegundos (ajustada a 500ms)
  };

  return (
    <div
      className={`bg-gray-800 p-4 border-l-4 ${getPriorityColor()} shadow rounded-lg
      transition-all duration-500 ease-in-out
      ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-5 scale-95"}
      `}
    >
      <h4 className="font-bold text-lg text-white">{title}</h4>
      <p className="text-sm text-gray-300 mt-1">{description}</p>
      <p className="text-xs text-gray-400 mt-2">
        {new Date(dateCreated).toLocaleDateString()}
      </p>
      {!acknowledge && (
        <button
          className="mt-3 bg-cyan-600 hover:bg-cyan-700 text-white text-sm py-1 px-3 rounded"
          onClick={handleAcknowledgeClick}
        >
          Marcar como leída
        </button>
      )}
    </div>
  );
};

export default AlertCard;
