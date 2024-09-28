"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
//import axios from 'axios';

//const apiOrdenesDeCompraNgrok = "https://frtcjlcx-1337.brs.devtunnels.ms/api/orden-compras?populate=*";

//const apiOrdenesDeCompraDonweb = `https://${process.env.NEXT_PUBLIC_HTTPS_HOSTING_DONWEB}/api/orden-compras?populate=*`;

//-------DEFINO LAS INTERFACES------
// interface Proveedor {
//   id: number;
//   name: string;
//   mail: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface Producto {
//   id: number;
//   name: string;
//   stock: number;
//   stock_minimo: number;
//   min_price_compra_stock: number | null;
//   precio: number;
//   cantidad: number;
// }

// interface OrdenDeCompra {
//   id: number;
//   total_compra: number;
//   createdAt: string;
//   updatedAt: string;
//   estado: string;
//   fecha_de_creacion: string;
//   proveedor: Proveedor;
//   productos: Producto[];
// }

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
  category: string;
  purchase_date: string;
}

interface OrdenDeCompra {
  id: string;
  provider: Proveedor;
  product: Producto;
  quantity: number;
  amount: number;
  date_created: string;
  date_updated: string;
  status: string;
}

interface OrdenDeCompraContextProps {
  ordenesDeCompra: OrdenDeCompra[];
  fetchOrdenesDeCompra: () => void;
  createOrdenDeCompra: (ordenDeCompra: OrdenDeCompra) => Promise<void>;
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

const ordenesDeCompraPrueba: OrdenDeCompra[] = [
  {
    id: "1",
    provider: {
      id: "1",
      name: "Proveedor A",
      email: "contacto@proveedora.com",
      cuit: "30-12345678-9",
      phone_number: "11-1234-5678",
      address: "Calle Falsa 123, Buenos Aires",
    },
    product: {
      id: "101",
      name: "Producto 1",
      brand: "Marca 1",
      category: "Categoría A",
      purchase_date: "2024-01-01",
    },
    quantity: 3,
    amount: 1500,
    date_created: "2024-01-01",
    date_updated: "2024-01-02",
    status: "pendiente",
  },
  {
    id: "2",
    provider: {
      id: "2",
      name: "Proveedor B",
      email: "info@proveedorb.com",
      cuit: "30-87654321-0",
      phone_number: "11-8765-4321",
      address: "Calle Verdadera 456, Córdoba",
    },
    product: {
      id: "201",
      name: "Producto 3",
      brand: "Marca 3",
      category: "Categoría B",
      purchase_date: "2024-02-05",
    },
    quantity: 2,
    amount: 2300,
    date_created: "2024-02-05",
    date_updated: "2024-02-06",
    status: "completado",
  },
  {
    id: "3",
    provider: {
      id: "3",
      name: "Proveedor C",
      email: "ventas@proveedorc.com",
      cuit: "30-11223344-5",
      phone_number: "11-1122-3344",
      address: "Calle Central 789, Mendoza",
    },
    product: {
      id: "301",
      name: "Producto 5",
      brand: "Marca 5",
      category: "Categoría C",
      purchase_date: "2024-03-10",
    },
    quantity: 2,
    amount: 1800,
    date_created: "2024-03-10",
    date_updated: "2024-03-11",
    status: "cancelada",
  },
];

export const OrdenDeCompraProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [ordenesDeCompra, setOrdenesDeCompra] = useState<OrdenDeCompra[]>([]);

  const fetchOrdenesDeCompra = useCallback(async () => {
    setOrdenesDeCompra(ordenesDeCompraPrueba);
  }, []);

  const createOrdenDeCompra = async (ordenDeCompra: OrdenDeCompra) => {
    setOrdenesDeCompra((prevOrdenesDeCompra) => [
      ...prevOrdenesDeCompra,
      { ...ordenDeCompra, id: (prevOrdenesDeCompra.length + 1).toString() },
    ]);
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
      value={{ ordenesDeCompra, fetchOrdenesDeCompra, createOrdenDeCompra }}
    >
      {children}
    </OrdenDeCompraContext.Provider>
  );
};
