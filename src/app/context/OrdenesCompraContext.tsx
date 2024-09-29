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

const apiOrdenesDeCompraBackend = `https://fleet-manager-gzui.onrender.com/api/orders`;
const apiProveedoresBackend = `https://fleet-manager-gzui.onrender.com/api/providers`;
const apiProductosBackend = `https://fleet-manager-gzui.onrender.com/api/products`;

interface Proveedor {
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
}

export interface OrdenDeCompra {
  id: string;
  provider: Proveedor;
  product: Producto;
  quantity: number;
  amount: number;
  date_created: string;
  date_updated: string;
  status: string;
}

export interface CreacionOrdenDeCompra {
  providerId: string;
  productId: string;
  quantity: number;
  amount: number;
}

interface OrdenDeCompraContextProps {
  ordenesDeCompra: OrdenDeCompra[];
  proveedores: Proveedor[];
  productos: Producto[];
  fetchOrdenesDeCompra: () => void;
  fetchProductos: () => void;
  fetchProveedores: () => void;
  createOrdenDeCompra: (ordenDeCompra: CreacionOrdenDeCompra) => Promise<void>;
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

export const OrdenDeCompraProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [ordenesDeCompra, setOrdenesDeCompra] = useState<OrdenDeCompra[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);

  const fetchOrdenesDeCompra = useCallback(async () => {
    try {
      const response = await axios.get(apiOrdenesDeCompraBackend);
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
  }, []);

  const fetchProductos = useCallback(async () => {
    try {
      const response = await axios.get(apiProductosBackend);
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  }, []);

  const fetchProveedores = useCallback(async () => {
    try {
      const response = await axios.get(apiProveedoresBackend);
      setProveedores(response.data);
    } catch (error) {
      console.error("Error al obtener los proveedores:", error);
    }
  }, []);

  const createOrdenDeCompra = async (ordenDeCompra: CreacionOrdenDeCompra) => {
    try {
      await axios.post(apiOrdenesDeCompraBackend, ordenDeCompra);
    } catch (error) {
      console.error("Error al crear la orden de compra:", error);
    }
  };

  /*
  const finalizeOrdenDeCompra = async (id: string, amount: number) => {
    setOrdenesDeCompra((prevOrdenesDeCompra) => {
      prevOrdenesDeCompra.map((orden) => {
        orden.id === id
          ? {
              ...orden,
            }
          : orden;
      });
    });
  };
  */

  /* const fetchOrdenesDeCompra = async () => {
       try {
           const response = await axios.get(apiOrdenesDeCompraDonweb);
           const fetchedOrdenesDeCompra = response.data.data.map((item: any) => {
               // Calcular la cantidad necesaria de cada producto
               const productos = item.attributes.productos.data.map((producto: any) => {
                   const cantidad = Math.max(producto.attributes.stock_minimo - producto.attributes.stock, 0);
                   const precioCompra = producto.attributes.min_price_compra_stock || producto.attributes.price;

                   return {
                       id: producto.id,
                       name: producto.attributes.title,
                       stock: producto.attributes.stock,
                       stock_minimo: producto.attributes.stock_minimo,
                       min_price_compra_stock: producto.attributes.min_price_compra_stock,
                       precio: precioCompra,
                       cantidad: cantidad,
                   };
               });

               return {
                   id: item.id,
                   total_compra: productos.reduce((total: number, prod: Producto) => total + (prod.precio * prod.cantidad), 0),
                   createdAt: item.attributes.createdAt,
                   updatedAt: item.attributes.updatedAt,
                   estado: item.attributes.estado,
                   fecha_de_creacion: item.attributes.fecha_de_creacion,
                   proveedor: item.attributes.proveedor.data 
                       ? {
                           id: item.attributes.proveedor.data.id,
                           name: item.attributes.proveedor.data.attributes.name,
                           mail: item.attributes.proveedor.data.attributes.mail,
                           createdAt: item.attributes.proveedor.data.attributes.createdAt,
                           updatedAt: item.attributes.proveedor.data.attributes.updatedAt,
                       } 
                       : { id: 0, name: "Proveedor Desconocido", mail: "" },
                   productos: productos,
               };
           }); 


           setOrdenesDeCompra(fetchedOrdenesDeCompra);
       } catch (error) {
           console.error('Error al obtener órdenes de compra:', error);
       }
   };
   */

  useEffect(() => {
    fetchOrdenesDeCompra();
  }, [fetchOrdenesDeCompra]);

  return (
    <OrdenDeCompraContext.Provider
      value={{ ordenesDeCompra, proveedores, productos, fetchOrdenesDeCompra, fetchProductos, fetchProveedores, createOrdenDeCompra }}
    >
      {children}
    </OrdenDeCompraContext.Provider>
  );
};
