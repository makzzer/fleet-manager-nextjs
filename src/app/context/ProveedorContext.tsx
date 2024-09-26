'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import axios from 'axios';

const apiProveedoresBackend = `https://fleet-manager-gzui.onrender.com/api/providers`;

interface Proveedor {
  id: string;
  name: string;
  cuit: string;
  direccion: string;
  telefono: string;
  date_created?: string;
  date_updated?: string;
}

interface ProveedorContextProps {
  proveedores: Proveedor[];
  fetchProveedores: () => void;
  createProveedor: (proveedor: Omit<Proveedor, 'date_created' | 'date_updated'>) => Promise<void>;
}

const ProveedorContext = createContext<ProveedorContextProps | undefined>(undefined);

export const useProveedor = () => {
  const context = useContext(ProveedorContext);
  if (!context) {
    throw new Error('useProveedor debe ser usado dentro de ProveedorProvider');
  }
  return context;
};

const proveedoresLocales: Proveedor[] = [
  {
    id: "1",
    name: "Proveedor 1",
    cuit: "2022",
    direccion: 'calle 1',
    telefono: '100',
  },
  {
    id: "2",
    name: "Proveedor 2",
    cuit: "2023",
    direccion: "calle 2",
    telefono: "200",
  },
  {
    id: "3",
    name: "Proveedor 3",
    cuit: "2024",
    direccion: "calle 3",
    telefono: "300",
  }
]

export const ProveedorProvider = ({ children }: { children: ReactNode }) => {
  // proveedores de api
  // const [proveedores, setProveedores] = useState<Proveedor[]>([]);

  // const fetchProveedores = useCallback(async () => {
  //   try {
  //     const response = await axios.get(apiProveedoresBackend);
  //     const fetchedProveedores = response.data;

  //     if (Array.isArray(fetchedProveedores)) {
  //       setProveedores(fetchedProveedores);
  //     } else {
  //       console.error('Error: La respuesta de la API no es un array válido', fetchedProveedores);
  //     }
  //   } catch (error) {
  //     console.error('Error al obtener proveedores:', error);
  //   }
  // }, []);

  const [proveedores, setProveedores] = useState<Proveedor[]>([]);

  const fetchProveedores = useCallback(() => {
    setProveedores(proveedoresLocales);
  }, []);

  const createProveedor = async (proveedor: Omit<Proveedor, 'date_created' | 'date_updated'>) => {
    try {
      await axios.post(apiProveedoresBackend, proveedor);
      fetchProveedores();
    } catch (error) {
      console.error('Error al crear proveedor:', error);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, [fetchProveedores]);

  return (
    <ProveedorContext.Provider value={{ proveedores, fetchProveedores, createProveedor }}>
      {children}
    </ProveedorContext.Provider>
  );
};
