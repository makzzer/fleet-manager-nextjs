// components/AlertList.tsx
"use client";
import React, { useEffect } from "react";
import { useAlert } from "../context/AlertsContext";
import AlertCard from "../components/Cards/AlertCard";
import ProtectedRoute from "../components/Routes/ProtectedRoutes";

const AlertList = () => {
  const { alerts, fetchAlerts, acknowledgeAlert, filterAlertsByPriority } =
    useAlert();

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleAcknowledge = async (id: string) => {
    await acknowledgeAlert(id);
    alert("Alerta reconocida.");
  };

  const highPriorityAlerts = filterAlertsByPriority("HIGH");
  const mediumPriorityAlerts = filterAlertsByPriority("MEDIUM");
  const lowPriorityAlerts = filterAlertsByPriority("LOW");

  return (
    <ProtectedRoute requiredModule="ALERTS">
    <div className="p-6 bg-gray-900 text-gray-100 rounded-lg">
      <h2 className="text-3xl font-bold mb-8 text-blue-400">Alertas</h2>

      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold text-red-400 mb-4">
            Alta Prioridad
          </h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {highPriorityAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                title={alert.title}
                description={alert.description}
                dateCreated={alert.date_created}
                priority={alert.priority}
                acknowledge={alert.acknowledge}
                onAcknowledge={() => handleAcknowledge(alert.id)}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-yellow-400 mb-4">
            Media Prioridad
          </h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {mediumPriorityAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                title={alert.title}
                description={alert.description}
                dateCreated={alert.date_created}
                priority={alert.priority}
                acknowledge={alert.acknowledge}
                onAcknowledge={() => handleAcknowledge(alert.id)}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-green-400 mb-4">
            Baja Prioridad
          </h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {lowPriorityAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                title={alert.title}
                description={alert.description}
                dateCreated={alert.date_created}
                priority={alert.priority}
                acknowledge={alert.acknowledge}
                onAcknowledge={() => handleAcknowledge(alert.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default AlertList;
