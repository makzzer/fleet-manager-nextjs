// components/AlertList.tsx
//push vercel3
"use client";
import React, { useEffect } from "react";
import { useAlert } from "../context/AlertsContext";
import AlertCard from "../components/Cards/AlertCard";
import ProtectedRoute from "../components/Routes/ProtectedRoutes";

const AlertList = () => {
  const { alerts, fetchAlerts, acknowledgeAlert } = useAlert();

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