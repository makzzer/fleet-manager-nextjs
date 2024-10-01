"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
// import axios from "axios";

interface AnalyticsData {
  reservas: number[];
  combustible: number[];
  kilometraje: number[];
  tiempoUsoPromedio: number[];
  montoCombustible: number[];
  vehiculoMasFrecuente: string[];
}

interface AnalyticsContextProps {
  data: AnalyticsData | null;
  fetchAnalyticsData: () => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextProps | undefined>(
  undefined
);

//TODOS LOS DATOS, DE MOMENTO, SON POR MES

const staticData: AnalyticsData = {
  reservas: [12, 19, 15, 8, 6, 9], // Reservas por mes
  combustible: [65, 59, 80, 81, 56, 55], // Litros de combustible por mes
  kilometraje: [200, 300, 150, 400, 600, 250], // Kilometros recorridos
  tiempoUsoPromedio: [2, 3, 4, 5, 6, 7], // Horas de uso promedio
  montoCombustible: [200, 150, 300, 400, 350, 280], // Monto en combustible
  vehiculoMasFrecuente: ["Camión A", "Auto B", "Moto C"], // Vehiculos mas utilizados
};

export const AnalyticsProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<AnalyticsData | null>(null);

  const fetchAnalyticsData = async () => {
    try {
      setData(staticData);
      // const response = await axios.get("/api/analytics");
      // setData(response.data);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  return (
    <AnalyticsContext.Provider value={{ data, fetchAnalyticsData }}>
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
