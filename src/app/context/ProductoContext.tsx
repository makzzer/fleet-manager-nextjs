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

const apiProductosBackend = `https://fleet-manager-gzui.onrender.com/api/products`;

interface Producto {
  id: string;
  name: string;
  brand: string;
  category: string;
  purchaseDate: string;
}

interface ProductoContextProps {
  productos: Producto[];
  fetchProductos: () => void;
  createProducto: (producto: Producto) => Promise<void>;
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

// const productosPrueba: Producto[] = [
//   {
//     id: "1",
//     name: "Producto A",
//     brand: "Marca X",
//     category: "Categoría 1",
//     purchaseDate: "2023-08-01",
//   },
//   {
//     id: "2",
//     name: "Producto B",
//     brand: "Marca Y",
//     category: "Categoría 2",
//     purchaseDate: "2023-09-15",
//   },
//   {
//     id: "3",
//     name: "Producto C",
//     brand: "Marca Y",
//     category: "Categoría 3",
//     purchaseDate: "2024-9-12",
//   }
// ];

export const ProductoProvider = ({ children }: { children: ReactNode }) => {
  const [productos, setProductos] = useState<Producto[]>([]);

  // const fetchProductos = useCallback(() => {
  //   setProductos(productosPrueba);
  // }, []);

  // const createProducto = async (producto: Producto) => {
  //   setProductos((prevProductos) => [
  //     ...prevProductos,
  //     { ...producto, id: (prevProductos.length + 1).toString() },
  //   ]);
  // };

  // Para cuando esté el back
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
      console.error('Error al obtener proveedores:', error);
    }
  }, []);

  const createProducto = async (producto: Producto) => {
    try {
      await axios.post(apiProductosBackend, producto);
      fetchProductos();
    } catch (error) {
      console.error("Error al crear proveedor:", error);
    }
  };
  

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  return (
    <ProductoContext.Provider
      value={{ productos, fetchProductos, createProducto }}
    >
      {children}
    </ProductoContext.Provider>
  );
};
