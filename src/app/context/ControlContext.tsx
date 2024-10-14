"use client";

import axios from "axios";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// API para autenticación de usuarios
const apiControles = "https://fleet-manager-gzui.onrender.com/api/controls";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Vehiculo {
  id: string;
  status: string;
  model: string;
  brand: string;
  year: number;
  coordinates: Coordinates;
  date_created: string;
  date_updated: string;
}

interface Operador {
  id: string;
  username: string;
  full_name: string;
  roles: string[];
  permissions: Permissions[];
  date_created: string;
  date_updated: string;
}

interface Control {
  id: string;
  type: string;
  subject: string;
  description: string;
  vehicle: Vehiculo;
  priority: string;
  date_created: string;
  date_updated: string;
  status: string;
  operator: Operador;
}

interface POSTCorrectiveControl {
  type: string;
  subject: string;
  description: string;
  vehicle_id: string;
  operator_id: string;
}

interface ControlContextProps {
  controls: Control[];
  fetchControls: () => void;
  createCorrectiveControl: (controlCorrectivo: POSTCorrectiveControl) => void;
}

const ControlContext = createContext<ControlContextProps | undefined>(undefined);

export const useControl = () => {
  const context = useContext(ControlContext);
  if (!context) {
    throw new Error("useContext debe ser usado dentro de un ControlProvider");
  }
  return context;
};

export const ControlProvider = ({ children }: { children: ReactNode }) => {
  const [controls, setControls] = useState<Control[]>([]);

  const fetchControls = async () => {
    try {
      const response = await axios.get(apiControles);
      const fetchedControls = response.data;
      setControls(fetchedControls);
    } catch (error) {
      console.error("Error al obtener los controles:", error);
    }
  };

  const createCorrectiveControl = async (controlCorrectivo: POSTCorrectiveControl) => {
    try {
      await axios.post(apiControles, controlCorrectivo);
      fetchControls();
    } catch (error) {
      console.error("Error creating corrective control:", error);
    }
  };


  useEffect(() => {
    fetchControls();
  }, []);

  return (
    <ControlContext.Provider value={{ controls, fetchControls, createCorrectiveControl }}>
      {children}
    </ControlContext.Provider>
  );
};
