"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import axios from "axios";
import * as XLSX from 'xlsx';

const apiProductosBackend = `https://fleet-manager-gzui.onrender.com/api/products`;
const apiProveedoresBackend = `https://fleet-manager-gzui.onrender.com/api/providers`;

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
  fetchProductos: () => void;
  fetchProducto: (id: string) => void;
  fetchProveedores: () => void;
  createProducto: (producto: ProductoRequest) => Promise<void>;
  exportProductoToExcel: () => void;
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

  const fetchProductos = useCallback(async () => {
    try {
      const response = await axios.get(apiProductosBackend);
      const fetchedProductos = response.data;

      if (Array.isArray(fetchedProductos)) {
        setProductos(fetchedProductos);
      } else {
        console.error('Error: La respuesta de la API no es un array válido', fetchedProductos);
      }
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  }, []);

  const fetchProducto = useCallback(async (id : string) => {
    try {
      const response = await axios.get(`${apiProductosBackend}/${id}`);
      setProducto(response.data);
    } catch (error) {
      setProducto(null);
      console.error('Error al obtener productos:', error);
    }
  }, []);

  const createProducto = async (producto: ProductoRequest) => {
    try {
      console.log("Producto a enviar:", producto);
      await axios.post(apiProductosBackend, producto);
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
      const response = await axios.get(apiProveedoresBackend);
      setProveedores(response.data);
    } catch (error) {
      console.error("Error al obtener los proveedores:", error);
    }
  }, []);

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
      value={{ productos, producto, proveedores, fetchProductos, fetchProducto, fetchProveedores, createProducto, exportProductoToExcel }}
    >
      {children}
    </ProductoContext.Provider>
  );
};


