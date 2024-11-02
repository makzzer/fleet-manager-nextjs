"use client";

import axios from "axios";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
// import axios from "axios";

export interface Avg {
  type: string;
  value: string;
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  whole_seconds: number;
  micro_seconds: number;
  seconds: number;
  null: boolean;
}

export interface Value {
  id?: string;
  name?: string;
  type?: string;
  status?: string;
  count?: number;
  priority?: string;
  user_id?: string;
  username?: string;
  concat?: string;
  avg?: Avg;
  quantity?: number;
  model?: string;
  brand?: string;
  year?: string;
  fuel_type?: string;
  axles?: number;
  seats?: number;
  has_trailer?: boolean;
  load?: number;
  acknowledge?: boolean;
  title?: string;
  category?: string;
  provider_name?: string;
}

export interface AnalyticsData {
  origin: string;
  type: string;
  description: string;
  values: Value[];
}

interface AnalyticsContextProps {
  analytics: AnalyticsData[] | null;
  fetchAnalytics: () => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextProps | undefined>(
  undefined
);

const apiAnaliticasBackend = `https://fleet-manager-vrxj.onrender.com/api/analytics`

export const AnalyticsProvider = ({ children }: { children: ReactNode }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData[] | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await axios.get(apiAnaliticasBackend);
      const fetchedAnalytics = response.data;

      if (Array.isArray(fetchedAnalytics)) {
        setAnalytics(fetchedAnalytics);
      } else {
        console.error("Error: La respuesta de la API no es un array válido", fetchedAnalytics);
      }
    } catch (error) {
      console.error("Error al obtener las analiticas:", error);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <AnalyticsContext.Provider value={{ analytics, fetchAnalytics }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics debe usarse dentro de un AnalyticsProvider");
  }
  return context;
};
