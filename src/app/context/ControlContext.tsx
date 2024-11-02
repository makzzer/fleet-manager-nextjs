"use client";

import axios from "axios";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import * as XLSX from 'xlsx';


// API para autenticación de usuarios
const apiControles = "https://fleet-manager-vrxj.onrender.com/api/controls";

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

interface POSTPredictiveControl {
  subject: string;
  description: string;
  brand: string;
  model: string;
  year: number;
  priority: string;
  operator_id: string;
}

interface ControlContextProps {
  controls: Control[];
  fetchControls: () => void;
  createCorrectiveControl: (controlCorrectivo: POSTCorrectiveControl) => void;
  createPredictiveControl: (controlPredictivo: POSTPredictiveControl) => void;
  setControlStatus: (control_id: string, new_status: string) => void;
  assignOperator: (control_id: string, operator_id: string) => Promise<void>;
  exportControlesToExcel: () => void;
}

const ControlContext = createContext<ControlContextProps | undefined>(
  undefined
);

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

  const createCorrectiveControl = async (
    controlCorrectivo: POSTCorrectiveControl
  ) => {
    try {
      await axios.post(apiControles, controlCorrectivo);
      fetchControls();
    } catch (error) {
      console.error("Error creating corrective control:", error);
    }
  };

  const createPredictiveControl = async (
    controlPredictivo: POSTPredictiveControl
  ) => {
    try {
      await axios.post(`${apiControles}/predictive`, controlPredictivo);
      fetchControls();
    } catch (error) {
      console.error("Error creating corrective control:", error);
    }
  };

  const setControlStatus = async (control_id: string, new_status: string) => {
    console.log("Entró acá con:", control_id, " - ", new_status);
    try {
      await axios.put(`${apiControles}/${control_id}/status/${new_status}`);
      fetchControls();
    } catch (error) {
      console.error("Error changing control status:", error);
    }
  };

  const assignOperator = async (control_id: string, operator_id: string) => {
    try {
      await axios.put(`${apiControles}/${control_id}/operator/${operator_id}`);
      fetchControls();
    } catch (error) {
      console.error("Error changing control status:", error);
    }
  }

  const exportControlesToExcel = () => {
    const controlesAplanados = controls.map(control => ({
      id: control.id,
      subject: control.subject,
      description: control.description,
      type: control.type,
      priority: control.priority,
      status: control.status,
      date_created: control.date_created,
      date_updated: control.date_updated,
      vehicle_id: control.vehicle?.id,
      vehicle_model: control.vehicle?.model,
      vehicle_brand: control.vehicle?.brand,
      vehicle_year: control.vehicle?.year,
      operator_id: control.operator?.id,
      operator_name: control.operator?.full_name,
      operator_username: control.operator?.username,
      operator_roles: control.operator?.roles.join(', '),
    }));

    const worksheet = XLSX.utils.json_to_sheet(controlesAplanados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Controles');
    XLSX.writeFile(workbook, `controles-(${new Date().toLocaleDateString()}).xlsx`);
  };

  useEffect(() => {
    fetchControls();
  }, []);

  return (
    <ControlContext.Provider
      value={{
        controls,
        fetchControls,
        createCorrectiveControl,
        createPredictiveControl,
        setControlStatus,
        assignOperator,
        exportControlesToExcel
      }}
    >
      {children}
    </ControlContext.Provider>
  );
};
