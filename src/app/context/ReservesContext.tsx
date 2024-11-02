"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

import axios from "axios";

// URL de la API para reservas
const apiReservasBackend = `https://fleet-manager-vrxj.onrender.com/api/reserves`;

// Interfaz para el formato de la reserva
export interface Reserva {
  id: string;
  vehicle_id: string;
  user_id: string;
  status: string;
  trip: {
    origin: {
      coordinates: {
        latitude: number;
        longitude: number;
      };
      address: string;
    };
    destination: {
      coordinates: {
        latitude: number;
        longitude: number;
      };
      address: string;
    };
    routes: Array<{
      distance: string;
      duration: string;
      steps: Array<{
        latitude: number;
        longitude: number;
      }>;
    }>;
    fuel_consumption: number;
  };
  date_created: string;
  date_updated: string;
  date_reserve: string; // Agregamos este campo
  date_finish_reserve: string; // Agregamos este campo
}

// Interfaz para los métodos del contexto
interface ReservaContextProps {
  reservas: Reserva[];
  reserva: Reserva | null;
  fetchReservas: () => void;
  fetchReserva: (id: string) => void;
  createReserva: (reserva: Reserva) => Promise<void>;
}

const ReservaContext = createContext<ReservaContextProps | undefined>(undefined);

export const useReserva = () => {
  const context = useContext(ReservaContext);
  if (!context) {
    throw new Error("useReserva debe ser usado dentro de ReservaProvider");
  }
  return context;
};

export const ReservaProvider = ({ children }: { children: ReactNode }) => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [reserva, setReserva] = useState<Reserva | null>(null);

  const fetchReservas = useCallback(async () => {
    try {
      const response = await axios.get(apiReservasBackend);
      const fetchedReservas = response.data;

      if (Array.isArray(fetchedReservas)) {
        setReservas(fetchedReservas);
      } else {
        console.error(
          "Error: La respuesta de la API no es un array válido",
          fetchedReservas
        );
      }
    } catch (error) {
      console.error("Error al obtener reservas:", error);
    }
  }, []);

  const fetchReserva = useCallback(async (id: string) => {
    try {
      const response = await axios.get(`${apiReservasBackend}/${id}`);
      setReserva(response.data);
    } catch (error) {
      setReserva(null);
      console.error("Error al obtener la reserva:", error);
    }
  }, []);

  const createReserva = async (reserva: Reserva) => {
    try {
      await axios.post(apiReservasBackend, reserva);
      fetchReservas();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error al crear reserva:", error.response.data);
      } else {
        console.error("Error desconocido al crear reserva", error);
      }
    }
  };

  useEffect(() => {
    fetchReservas();
  }, [fetchReservas]);

  return (
    <ReservaContext.Provider
      value={{ reservas, reserva, fetchReservas, fetchReserva, createReserva }}
    >
      {children}
    </ReservaContext.Provider>
  );
};