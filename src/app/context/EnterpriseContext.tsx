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
const apiEmpresas = "https://fleet-manager-vrxj.onrender.com/api/enterprises";

export type Module = "ALERTS" |
      "ANALYTICS" |
      "CONTROLS" |
      "ENTERPRISES" |
      "ORDERS" |
      "PRODUCTS" |
      "PROVIDERS" |
      "RESERVES" |
      "USERS" |
      "VEHICLES";

export interface Enterprise {
  id: string;
  name: string;
  modules: Module[];
}

interface EnterpriseContextProps {
  enterprises: Enterprise[];
  fetchEnterprises: () => void;
  createEnterprise: (name: string) => Promise<void>
  addEnterpriseModule: (id: string, module: Module) => Promise<void>;
  removeEnterprise: (id: string) => Promise<void>;
  removeEnterpriseModule: (id: string, module: Module) => Promise<void>;
  updateEnterpriseConfig: (id: string, key: string, value: string) => Promise<void>;
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

  const addEnterpriseModule = async (id: string, module: Module) => {
    try {
      await axios.put(`${apiEmpresas}/${id}/modules/${module}`);
      fetchEnterprises();
    } catch (error) {
      console.error("Error adding a enterprise module", error);
    }
  }

  const removeEnterprise = async (id: string) => {
    try {
      await axios.delete(`${apiEmpresas}/${id}`);
      fetchEnterprises();
    } catch (error) {
      console.error("Error removing enterpise:", error);
    }
  }

  const removeEnterpriseModule = async (id: string, module: Module) => {
    try {
      await axios.delete(`${apiEmpresas}/${id}/modules/${module}`)
      fetchEnterprises();
    } catch (error) {
      console.error("Error removing enterprise module:", error);
    }
  }

  const updateEnterpriseConfig = async (id: string, key: string, value: string) => {
    try {
      await axios.put(`${apiEmpresas}/${id}/configs`, {
        key,
        value,
        secret: key !== "OPSGENIE_LINK", // valor secreto o no
      });
      fetchEnterprises();
    } catch (error) {
      console.error("Error updating enterprise configuration", error);
      throw new Error("Error al actualizar la configuración de la empresa");
    }
  };  

  useEffect(() => {
    fetchEnterprises();
  }, []);

  return (
    <EnterpriseContext.Provider
      value={{
        enterprises,
        fetchEnterprises,
        createEnterprise,
        addEnterpriseModule,
        removeEnterprise,
        removeEnterpriseModule,
        updateEnterpriseConfig,
      }}
    >
      {children}
    </EnterpriseContext.Provider>
  );
};
