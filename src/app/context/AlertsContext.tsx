// context/AlertContext.tsx

"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import axios from "axios";
import { useApi } from "./ApiContext";

// Interfaz para una alerta
export interface Alert {
  id: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  title: string;
  description: string;
  acknowledge: boolean;
  date_created: string;
  date_updated: string;
}

// Interfaz para los métodos del contexto
interface AlertContextProps {
  alerts: Alert[];
  fetchAlerts: () => Promise<void>;
  acknowledgeAlert: (id: string) => Promise<void>;
  filterAlertsByPriority: (priority: "HIGH" | "MEDIUM" | "LOW") => Alert[];
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert debe ser usado dentro de AlertProvider");
  }
  return context;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const api = useApi();

  // URL para el endpoint de las alertas (ajusta la URL según sea necesario)
  const apiAlertsBackend = `https://fleet-manager-vrxj.onrender.com/api/alerts`;

  // Función para obtener las alertas
  const fetchAlerts = useCallback(async () => {
    try {
      const response = await api.get(apiAlertsBackend);
      setAlerts(response.data);
    } catch (error) {
      console.error("Error al obtener alertas:", error);
    }
  }, []);


  // Función para reconocer una alerta
  const acknowledgeAlert = useCallback(async (id: string) => {
    try {
      // Hacer una solicitud PUT al endpoint /alerts/{id}/ack con { acknowledge: true } en el cuerpo
      await api.put(`/alerts/${id}/ack`, { acknowledge: true });

      // Eliminar la alerta del estado local con una animación
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
    } catch (error) {
      console.error("Error al reconocer la alerta:", error);
    }
  }, [api]);



  
  // Función para filtrar alertas por prioridad
  const filterAlertsByPriority = (priority: "HIGH" | "MEDIUM" | "LOW"): Alert[] => {
    return alerts.filter((alert) => alert.priority === priority);
  };

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return (
    <AlertContext.Provider
      value={{
        alerts,
        fetchAlerts,
        acknowledgeAlert,
        filterAlertsByPriority,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};
