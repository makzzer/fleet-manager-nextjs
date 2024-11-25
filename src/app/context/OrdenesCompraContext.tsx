"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import * as XLSX from 'xlsx';
import { useApi } from "./ApiContext";

const apiOrdenesDeCompraBackend = `https://fleet-manager-vrxj.onrender.com/api/orders`;
const apiProveedoresBackend = `https://fleet-manager-vrxj.onrender.com/api/providers`;

export interface Proveedor {
  id: string;
  name: string;
  email: string;
  cuit: string;
  phone_number: string;
  address: string;
}

interface Producto {
  id: string;
  name: string;
  brand: string;
  description: string;
  category: string;
  quantity: number;
  measurement: string;
  price: number;
  preference_provider_id: string;
}

interface Item {
  product: Producto;
  quantity: number;
}

export interface OrdenDeCompra {
  id: string;
  provider: Proveedor;
  items: Item[];
  amount: number;
  date_created: string;
  date_updated: string;
  status: string;
}

export interface CreacionOrdenDeCompra {
  provider_id: string;
  product_id: string;
  quantity: number;
  amount: number;
}

interface OrdenDeCompraContextProps {
  ordenesDeCompra: OrdenDeCompra[];
  proveedores: Proveedor[];
  fetchOrdenesDeCompra: () => void;
  fetchProductos: (providerId: string) => Promise<Producto[]>;
  fetchProveedores: () => void;
  createOrdenDeCompra: (provider_id: string) => Promise<void>;
  createOrdenDeCompraWithProduct: (provider_id: string, product_id: string, quantity: number, amount: number) => Promise<string>;
  actualizarEstadoOrdenDeCompra: (id: string, estado: string) => Promise<void>;
  agregarProductosOrdenDeCompra: (orden_id: string, product_id: string, quantity: number, amount: number) => void,
  exportOrdenesDeCompraToExcel: () => void;
}

// Creo el context
const OrdenDeCompraContext = createContext<
  OrdenDeCompraContextProps | undefined
>(undefined);

export const useOrdenesDeCompra = () => {
  const context = useContext(OrdenDeCompraContext);
  if (!context) {
    throw new Error(
      "useOrdenesDeCompra debe ser usado dentro de OrdenesDeCompraProvider"
    );
  }
  return context;
};

export const OrdenDeCompraProvider = ({ children }: { children: ReactNode }) => {
  const [ordenesDeCompra, setOrdenesDeCompra] = useState<OrdenDeCompra[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const api = useApi();

  const fetchOrdenesDeCompra = useCallback(async () => {
    try {
      const response = await api.get(apiOrdenesDeCompraBackend);
      const fetchedOrdenesDeCompra = response.data;

      if (Array.isArray(fetchedOrdenesDeCompra)) {
        setOrdenesDeCompra(fetchedOrdenesDeCompra);
      } else {
        console.error(
          "Error: La respuesta de la API no es un array válido",
          fetchedOrdenesDeCompra
        );
      }
    } catch (error) {
      console.error("Error al obtener las ordenes de compra:", error);
    }
  }, [api]);

  const fetchProductos = useCallback(async (providerId: string) => {
    try {
      const response = await api.get(`${apiProveedoresBackend}/${providerId}/products`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  }, [api]);

  const fetchProveedores = useCallback(async () => {
    try {
      const response = await api.get(apiProveedoresBackend);
      setProveedores(response.data);
    } catch (error) {
      console.error("Error al obtener los proveedores:", error);
    }
  }, [api]);

  const createOrdenDeCompra = async (provider_id: string) => {
    try {
      await api.post(apiOrdenesDeCompraBackend, { provider_id });
      fetchOrdenesDeCompra(); //despues de crear la orde de compra nuevo vuelvo a llamarlas asi actualizo las tablas
    } catch (error) {
      console.error("Error al crear la orden de compra:", error);
    }
  };

  const createOrdenDeCompraWithProduct = async (provider_id: string, product_id: string, quantity: number, amount: number) => {
    try {
      await api.post(apiOrdenesDeCompraBackend, { provider_id });
      const response = await api.get(apiOrdenesDeCompraBackend);
      const fetchedOrdenesDeCompra = response.data
      const orden = fetchedOrdenesDeCompra.find(
        (orden: OrdenDeCompra) =>
          (orden.status === "CREATED" || orden.status === "APPROVED") &&
          orden.provider.id === provider_id);

      if(orden) {
        agregarProductosOrdenDeCompra(orden.id, product_id, quantity, amount);
        return orden.id;
      } else {
        console.log("No se creó la orden de compra para agregar el producto");
        throw new Error("No se creó la orden de compra para agregar el producto");
      }
    } catch (error) {
      console.error("Error al crear la orden de compra:", error);
    }
  };

  const actualizarEstadoOrdenDeCompra = async (id: string, estado: string) => {
    await api.put(`${apiOrdenesDeCompraBackend}/${id}/status/${estado}`);
    fetchOrdenesDeCompra(); //despues de crear la orde de compra nuevo vuelvo a llamarlas asi actualizo las tablas
  };

  const agregarProductosOrdenDeCompra = async (
    orden_id: string,
    product_id: string,
    quantity: number,
    amount: number
  ) => {
    try {
      await api.put(`${apiOrdenesDeCompraBackend}/${orden_id}/products`, {
        product_id,
        quantity,
        amount,
      });
      fetchOrdenesDeCompra();
    } catch (error) {
      console.error("Error al agregar productos a la orden de compra:", error);
    }
  };

  const exportOrdenesDeCompraToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(ordenesDeCompra);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ordenesDeCompra");
    XLSX.writeFile(workbook, "ordenesDeCompra.xlsx");
  };

  useEffect(() => {
    fetchOrdenesDeCompra();
  }, [fetchOrdenesDeCompra]);

  return (
    <OrdenDeCompraContext.Provider
      value={{
        ordenesDeCompra,
        proveedores,
        fetchOrdenesDeCompra,
        fetchProductos,
        fetchProveedores,
        createOrdenDeCompra,
        createOrdenDeCompraWithProduct,
        actualizarEstadoOrdenDeCompra,
        agregarProductosOrdenDeCompra,
        exportOrdenesDeCompraToExcel,
      }}
    >
      {children}
    </OrdenDeCompraContext.Provider>
  );
};
