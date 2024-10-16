"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import axios from 'axios';
import * as XLSX from 'xlsx';

const apiProveedoresBackend = `https://fleet-manager-gzui.onrender.com/api/providers`;

interface Proveedor {
  id: string;
  name: string;
  email: string;
  cuit: string;
  phone_number: string;
  address: string;
  date_created?: string;
  date_updated?: string;
}

interface ProveedorContextProps {
  proveedores: Proveedor[];
  fetchProveedores: () => void;
  createProveedor: (proveedor: Omit<Proveedor, 'date_created' | 'date_updated'>) => Promise<void>;
  exportProveedorToExcel: () => void;
}

const ProveedorContext = createContext<ProveedorContextProps | undefined>(
  undefined
);

export const useProveedor = () => {
  const context = useContext(ProveedorContext);
  if (!context) {
    throw new Error("useProveedor debe ser usado dentro de ProveedorProvider");
  }
  return context;
};

export const ProveedorProvider = ({ children }: { children: ReactNode }) => {
  // proveedores de api
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);

  const fetchProveedores = useCallback(async () => {
    try {
      const response = await axios.get(apiProveedoresBackend);
      const fetchedProveedores = response.data;

      if (Array.isArray(fetchedProveedores)) {
        setProveedores(fetchedProveedores);
      } else {
        console.error('Error: La respuesta de la API no es un array válido', fetchedProveedores);
      }
    } catch (error) {
      console.error('Error al obtener proveedor:', error);
    }
  }, []);

  // const createProveedor = async (proveedor: Proveedor) => {
  //   setProveedores((proveedoresLocales) => [
  //     ...proveedoresLocales,
  //     { ...proveedor, id: (proveedoresLocales.length + 1).toString() },
  //   ]);
  // };

  const createProveedor = async (proveedor: Omit<Proveedor, "date_created" | "date_updated">) => {
    try {
      console.log("Proveedor a enviar:", proveedor);
      await axios.post(apiProveedoresBackend, proveedor);
      fetchProveedores();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error al crear proveedor:", error.response.data);
      } else {
        console.error("Error desconocido al crear proveedor", error);
      }
    }
  };
  
  const exportProveedorToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(proveedores);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Proveedores');
    XLSX.writeFile(workbook, 'Proveedores.xlsx');
  }

  useEffect(() => {
    fetchProveedores();
  }, [fetchProveedores]);

  return (
    <ProveedorContext.Provider
      value={{ proveedores, fetchProveedores, createProveedor, exportProveedorToExcel }}
    >
      {children}
    </ProveedorContext.Provider>
  );
};
