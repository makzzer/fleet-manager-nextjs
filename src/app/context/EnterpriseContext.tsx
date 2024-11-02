"use client";

import axios from "axios";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";


// API para autenticación de usuarios
const apiEmpresas = "https://fleet-manager-vrxj.onrender.com/api/enterprises";

type Module = "ALERTS" |
      "ANALYTICS" |
      "CONTROLS" |
      "ENTERPRISES" |
      "ORDERS" |
      "PRODUCTS" |
      "PROVIDERS" |
      "RESERVES" |
      "USERS" |
      "VEHICLES";

interface Enterprise {
  id: string;
  name: string;
  modules: Module[];
}

interface EnterpriseContextProps {
  enterprises: Enterprise[];
  fetchEnterprises: () => void;
  createEnterprise: (name: string) => Promise<void>
}

const EnterpriseContext = createContext<EnterpriseContextProps | undefined>(
  undefined
);

export const useEnterprise = () => {
  const context = useContext(EnterpriseContext);
  if (!context) {
    throw new Error("useContext debe ser usado dentro de un EnterpriseProvider");
  }
  return context;
};

export const EnterpriseProvider = ({ children }: { children: ReactNode }) => {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);

  const fetchEnterprises = async () => {
    try {
      const response = await axios.get(apiEmpresas);
      const fetchedEnterprises = response.data;
      setEnterprises(fetchedEnterprises);
    } catch (error) {
      console.error("Error al obtener las empresas:", error);
    }
  };

  const createEnterprise = async (name: string) => {
    try {
      await axios.post(apiEmpresas, { name });
      fetchEnterprises();
    } catch (error) {
      console.error("Error creating enterprise:", error);
    }
  }

  return (
    <EnterpriseContext.Provider
      value={{
        enterprises,
        fetchEnterprises,
        createEnterprise,
      }}
    >
      {children}
    </EnterpriseContext.Provider>
  );
};
