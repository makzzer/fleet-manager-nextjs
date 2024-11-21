// components/AlertList.tsx
//push vercel3
"use client";
import React, { useEffect, useState } from "react";
import { useAlert } from "../context/AlertsContext";
import AlertCard from "../components/Cards/AlertCard";
import ProtectedRoute from "../components/Routes/ProtectedRoutes";
import { useAuth } from '../context/AuthContext';

const AlertList = () => {
  const { getEnterpriseId } = useAuth(); 
  const { alerts, fetchAlerts, acknowledgeAlert } = useAlert();
  const [opsgenieLink, setOpsgenieLink] = useState<string | null>(null);


   // Obtener la URL de Opsgenie
   useEffect(() => {
    const fetchOpsgenieLink = async () => {
      try {
        const enterpriseId = getEnterpriseId();
        const response = await fetch(`https://fleet-manager-vrxj.onrender.com/api/enterprises/${enterpriseId}/configs`);
        const data = await response.json();
        setOpsgenieLink(data.value);
      } catch (error) {
        console.error("Error al obtener la URL de Opsgenie:", error);
      }
    };

    fetchOpsgenieLink();
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleAcknowledge = async (id: string) => {
    await acknowledgeAlert(id);
    alert("Alerta reconocida.");
  };

  return (
    <ProtectedRoute requiredModule="ALERTS">
      <div className="p-6 bg-gray-900 text-gray-100 rounded-lg min-h-screen">
        <h2 className="text-3xl font-bold mb-8 text-blue-400">Alertas</h2>

        {/* Botón para redirigir a Opsgenie si la URL está disponible */}
        <div className="mb-6">
          <a
            href={opsgenieLink || "#"}  // Si no hay enlace, no hace nada
            target={opsgenieLink ? "_blank" : "_self"} // Solo abre en nueva pestaña si hay un enlace
            rel="noopener noreferrer"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Ver más en Opsgenie
          </a>
        </div>

        {alerts.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {alerts.map((alert) => (
              <AlertCard
                key={alert.id}
                title={alert.title}
                description={alert.description}
                dateCreated={alert.date_created}
                acknowledge={alert.acknowledge}
                onAcknowledge={() => handleAcknowledge(alert.id)}
                priority={alert.priority}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg shadow-md">
            <p className="text-gray-400 text-lg font-semibold">
              No hay alertas disponibles para mostrar.
            </p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default AlertList;