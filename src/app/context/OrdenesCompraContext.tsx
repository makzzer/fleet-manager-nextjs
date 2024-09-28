'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
//import axios from 'axios';

//const apiOrdenesDeCompraNgrok = "https://frtcjlcx-1337.brs.devtunnels.ms/api/orden-compras?populate=*";


//const apiOrdenesDeCompraDonweb = `https://${process.env.NEXT_PUBLIC_HTTPS_HOSTING_DONWEB}/api/orden-compras?populate=*`;


//-------DEFINO LAS INTERFACES------
interface Proveedor {
  id: number;
  name: string;
  mail: string;
  createdAt: string;
  updatedAt: string;
}

interface Producto {
  id: number;
  name: string;
  stock: number;
  stock_minimo: number;
  min_price_compra_stock: number | null;
  precio: number;
  cantidad: number;
}

interface OrdenDeCompra {
  id: number;
  total_compra: number;
  createdAt: string;
  updatedAt: string;
  estado: string;
  fecha_de_creacion: string;
  proveedor: Proveedor;
  productos: Producto[];
}

interface OrdenDeCompraContextProps {
  ordenesDeCompra: OrdenDeCompra[];
  fetchOrdenesDeCompra: () => void;
  createOrdenDeCompra: (ordenDeCompra: OrdenDeCompra) => Promise<void>;
}

// Creo el context
const OrdenDeCompraContext = createContext<OrdenDeCompraContextProps | undefined>(undefined);

export const useOrdenesDeCompra = () => {
  const context = useContext(OrdenDeCompraContext);
  if (!context) {
    throw new Error('useOrdenesDeCompra debe ser usado dentro de OrdenesDeCompraProvider');
  }
  return context;
};

const ordenesDeCompraPrueba: OrdenDeCompra[] = [
  {
    id: 1,
    total_compra: 1500,
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-02T12:00:00Z",
    estado: "pendiente",
    fecha_de_creacion: "2024-01-01",
    proveedor: {
      id: 1,
      name: "Proveedor A",
      mail: "contacto@proveedora.com",
      createdAt: "2023-06-15T09:30:00Z",
      updatedAt: "2023-11-10T16:00:00Z",
    },
    productos: [
      {
        id: 101,
        name: "Producto 1",
        stock: 50,
        stock_minimo: 10,
        min_price_compra_stock: 300,
        precio: 350,
        cantidad: 3,
      },
      {
        id: 102,
        name: "Producto 2",
        stock: 100,
        stock_minimo: 20,
        min_price_compra_stock: 100,
        precio: 150,
        cantidad: 5,
      },
    ],
  },
  {
    id: 2,
    total_compra: 2300,
    createdAt: "2024-02-05T14:00:00Z",
    updatedAt: "2024-02-06T15:00:00Z",
    estado: "completado",
    fecha_de_creacion: "2024-02-05",
    proveedor: {
      id: 2,
      name: "Proveedor B",
      mail: "info@proveedorb.com",
      createdAt: "2023-08-10T11:45:00Z",
      updatedAt: "2024-01-20T09:00:00Z",
    },
    productos: [
      {
        id: 201,
        name: "Producto 3",
        stock: 80,
        stock_minimo: 15,
        min_price_compra_stock: 500,
        precio: 600,
        cantidad: 2,
      },
      {
        id: 202,
        name: "Producto 4",
        stock: 40,
        stock_minimo: 5,
        min_price_compra_stock: 200,
        precio: 250,
        cantidad: 4,
      },
    ],
  },
  {
    id: 3,
    total_compra: 1800,
    createdAt: "2024-03-10T08:00:00Z",
    updatedAt: "2024-03-11T10:00:00Z",
    estado: "cancelada",
    fecha_de_creacion: "2024-03-10",
    proveedor: {
      id: 3,
      name: "Proveedor C",
      mail: "ventas@proveedorc.com",
      createdAt: "2023-07-20T10:20:00Z",
      updatedAt: "2024-02-15T13:00:00Z",
    },
    productos: [
      {
        id: 301,
        name: "Producto 5",
        stock: 120,
        stock_minimo: 25,
        min_price_compra_stock: 450,
        precio: 500,
        cantidad: 2,
      },
      {
        id: 302,
        name: "Producto 6",
        stock: 60,
        stock_minimo: 10,
        min_price_compra_stock: 150,
        precio: 200,
        cantidad: 3,
      },
    ],
  },
];


export const OrdenDeCompraProvider = ({ children }: { children: ReactNode }) => {
  const [ordenesDeCompra, setOrdenesDeCompra] = useState<OrdenDeCompra[]>([]);

  const fetchOrdenesDeCompra = useCallback(async () => {
    setOrdenesDeCompra(ordenesDeCompraPrueba);
  }, []);

  const createOrdenDeCompra = async (ordenDeCompra: OrdenDeCompra) => {
    setOrdenesDeCompra((prevOrdenesDeCompra) => [
      ...prevOrdenesDeCompra,
      ordenDeCompra,
    ]);
  };

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
      value={{ ordenesDeCompra, fetchOrdenesDeCompra, createOrdenDeCompra }}
    >
      {children}
    </OrdenDeCompraContext.Provider>
  );
};


