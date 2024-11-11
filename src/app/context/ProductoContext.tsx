"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import axios from "axios";
import * as XLSX from 'xlsx';
import { useApi } from "./ApiContext";

const apiProductosBackend = `https://fleet-manager-vrxj.onrender.com/api/products`;
const apiProveedoresBackend = `https://fleet-manager-vrxj.onrender.com/api/providers`;

export interface Producto {
  id: string;
  name: string;
  brand: string;
  description: string;
  category: string;
  quantity: number;
  measurement: string;
  price: number;
  preference_provider_id: string;
  min_stock: number;
}

export interface ProductoRequest {
  id: string;
  name: string;
  brand: string;
  description: string;
  category: string;
  quantity: number;
  measurement: string;
  price: number;
  provider_id: string;
  min_stock: number;
}

interface Proveedor {
  id: string;
  name: string;
  email: string;
  cuit: string;
  phone_number: string;
  address: string;
}

interface ProductoContextProps {
  productos: Producto[];
  producto: Producto | null;
  proveedores: Proveedor[];
  proveedoresProducto: Proveedor[];
  fetchProductos: () => void;
  fetchProducto: (id: string) => void;
  fetchProveedores: () => void;
  fetchProveedoresProducto: (id: string) => void;
  createProducto: (producto: ProductoRequest) => Promise<void>;
  exportProductoToExcel: () => void;
  associateProvider: (productId: string, providerId: string) => void;
  removeProvider: (productId: string, providerId: string) => void;
}

const ProductoContext = createContext<ProductoContextProps | undefined>(
  undefined
);

export const useProducto = () => {
  const context = useContext(ProductoContext);
  if (!context) {
    throw new Error("useProducto debe ser usado dentro de ProductoProvider");
  }
  return context;
};

export const ProductoProvider = ({ children }: { children: ReactNode }) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [producto, setProducto] = useState<Producto | null>(null);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [proveedoresProducto, setProveedoresProducto] = useState<Proveedor[]>([]);
  const api = useApi();

  const fetchProductos = useCallback(async () => {
    try {
      const response = await api.get(apiProductosBackend);
      const fetchedProductos = response.data;

      if (Array.isArray(fetchedProductos)) {
        setProductos(fetchedProductos);
      } else {
        console.error('Error: La respuesta de la API no es un array válido', fetchedProductos);
      }
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  }, [api]);

  const fetchProducto = useCallback(async (id : string) => {
    try {
      const response = await api.get(`${apiProductosBackend}/${id}`);
      setProducto(response.data);
    } catch (error) {
      setProducto(null);
      console.error('Error al obtener productos:', error);
    }
  }, [api]);

  const createProducto = async (producto: ProductoRequest) => {
    try {
      console.log("Producto a enviar:", producto);
      await api.post(apiProductosBackend, producto);
      fetchProductos();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error al crear producto:", error.response.data);
      } else {
        console.error("Error desconocido al crear producto", error);
      }
    }
  };

  const fetchProveedores = useCallback(async () => {
    try {
      const response = await api.get(apiProveedoresBackend);
      setProveedores(response.data);
    } catch (error) {
      console.error("Error al obtener los proveedores:", error);
    }
  }, [api]);

  const fetchProveedoresProducto = useCallback(async (id : string) => {
    try {
      const response = await api.get(`${apiProductosBackend}/${id}/providers`);
      setProveedoresProducto(response.data);
    } catch (error) {
      setProveedoresProducto([]);
      console.error('Error al obtener proveedores del producto: ', error);
    }
  }, [api]);

  const associateProvider = async (productId: string, providerId: string) => {
    try {
      console.log(`Asociando ${productId} a proveedor ${providerId}`);
      await api.put(`${apiProductosBackend}/${productId}/providers/${providerId}`);
      fetchProveedoresProducto(productId);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error al asociar proveedor: ", error.response.data);
      } else {
        console.error("Error desconocido al asociar proveedor", error);
      }
    }
  };

  const removeProvider = async (productId: string, providerId: string) => {
    try {
      console.log(`Removiendo proveedor ${providerId} del producto ${productId}`);
      await api.delete(`${apiProductosBackend}/${productId}/providers/${providerId}`);
      fetchProveedoresProducto(productId);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error al remover proveedor: ", error.response.data);
      } else {
        console.error("Error desconocido al remover proveedor", error);
      }
    }
  };

  const exportProductoToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(productos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');
    XLSX.writeFile(workbook, 'Productos.xlsx');
  }

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  return (
    <ProductoContext.Provider
      value={{ productos, producto, proveedores, proveedoresProducto, 
        fetchProductos, fetchProducto, fetchProveedores, fetchProveedoresProducto, createProducto, exportProductoToExcel, 
        associateProvider, removeProvider }}
    >
      {children}
    </ProductoContext.Provider>
  );
};


