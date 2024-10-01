"use client";
import React, { useEffect } from "react";
import StatCard from "../components/StatCard";
import ProductTable from "../components/Stock/ProductTable";
import {
  FaMoneyBill,
  FaBox,
  FaUsers,
  FaPlusCircle,
  FaQrcode,
} from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";
import FiltrosProducto from "../components/Stock/FiltrosProducto";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useProducto } from "../context/ProductoContext";
// import SearchBar from "../components/SearchBar/SearchBar";

// import { TextField, InputAdornment } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';

import ProtectedRoute from "../components/Routes/ProtectedRoutes";

const Stock = () => {
  const router = useRouter();
  const { productos, fetchProductos, createProducto } = useProducto();
  const [productosStockBajo] = useState(5);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga para el uso del placholder
  const [filteredProductos, setFilteredProductos] = useState(productos); // Estado para filtrar productos por la barra

  // const [localProducts, setLocalProducts] = useState(productos);

  const [searchTerm, setSearchTerm] = useState(""); // Estado para el filtro de búsqueda

  useEffect(() => {
    const loadProductos = async () => {
      setIsLoading(true); // esta es la carga para el Skeleton placeholder
      await fetchProductos();
      setIsLoading(false); // Esta es la carga para el skeleton placeholder
    };
    loadProductos();
  }, [fetchProductos]);

  useEffect(() => {
    setFilteredProductos(productos);
  }, [productos]);

  // Filtra los productos según el término de búsqueda
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredProductos(productos);
    } else {
      setFilteredProductos(
        productos.filter((producto) =>
          producto.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, productos]);

  // // el query va a ser lo que voy escribiendo en el input de la bar
  // const handleSearch = (query: string) => {
  //   const filtered = productos.filter(
  //     (producto) =>
  //       producto.name.toLowerCase().includes(query.toLowerCase()) ||
  //       producto.brand.toLowerCase().includes(query.toLowerCase()) ||
  //       producto.category.toLowerCase().includes(query.toLowerCase()) ||
  //       producto.id.toLowerCase().includes(query.toLowerCase())
  //   );
  //   setFilteredProductos(filtered);
  // };

  const handleFilter = (filters: {
    searchTerm: string;
    selectedProveedor: string;
  }) => {
    const { searchTerm } = filters;
    setSearchTerm(searchTerm);
    if (searchTerm === "") {
      setFilteredProductos(productos); // Muestra todos los productos si no hay búsqueda
    } else {
      setFilteredProductos(
        productos.filter((producto) =>
          // solo filtro por nombre.
          producto.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  };

  const handleScanQRClick = () => {
    Swal.fire({
      title: "Permitir uso de la cámara",
      text: "Para utilizar esta funcionalidad se le solicitarán permisos para utilizar la cámara del dispositivo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3B82F6",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Rechazar",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/scannearQR");
      }
    });
  };

  const handleAgregarProducto = () => {
    Swal.fire({
      title: "Agregar Producto",
      html: `
            <input type="text" id="id" class="swal2-input" placeholder="Id">
            <input type="text" id="name" class="swal2-input" placeholder="Nombre">
            <input type="text" id="brand" class="swal2-input" placeholder="Marca">
            <input type="text" id="description" class="swal2-input" placeholder="Descripción">
            <input type="text" id="category" class="swal2-input" placeholder="Categoria">
            <input type="text" id="quantity" class="swal2-input" placeholder="Cantidad">
          `,
      confirmButtonText: "Agregar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const idElement = document.getElementById("id") as HTMLInputElement;
        const nameElement = document.getElementById(
          "name"
        ) as HTMLInputElement;
        const brandElement = document.getElementById(
          "brand"
        ) as HTMLInputElement;
        const descriptionElement = document.getElementById(
          "description"
        ) as HTMLInputElement;
        const categoryElement = document.getElementById(
          "category"
        ) as HTMLInputElement;
        const quantityElement = document.getElementById(
          "quantity"
        ) as HTMLInputElement;
        
        const id = idElement?.value;
        const name = nameElement?.value;
        const brand = brandElement?.value;
        const description = descriptionElement?.value;
        const category = categoryElement?.value;
        const quantity = quantityElement?.value;

        if (!id || !name || !brand || !description || !category) {
          Swal.showValidationMessage("Completa todos los campos");
          return null;
        }

        return { id, name, brand, description, category, quantity };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const producto = {
          id: result.value.id,
          name: result.value.name,
          brand: result.value.brand,
          description: result.value.description,
          category: result.value.category,
          quantity: result.value.quantity,
        };

        createProducto(producto);

        Swal.fire({
          title: "Producto agregado con éxito",
          text: "El nuevo producto ha sido creado y registrado correctamente.",
          icon: "success",
        });
      }
    });
  };

  // Dashboard Component
  return (
    <ProtectedRoute>
      <div className="p-6 bg-gray-900 min-h-screen rounded-lg text-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="md:text-4xl text-3xl font-bold text-blue-400">
            Gestión de Stock
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard title="Usuarios activos" value="2" icon={<FaUsers />} />

          <div className="relative flex-grow">
            <StatCard
              title="Productos con bajo stock"
              value={productosStockBajo}
              icon={<FaBox />}
            />
            {productosStockBajo !== 0 && (
              <span className="absolute top-2 right-2 md:right-3 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </div>

          <StatCard title="Ingresos" value="$200.000" icon={<FaMoneyBill />} />

          <div className="flex flex-col gap-4 md:mb-6 mb-2 text-center">
            <button
              onClick={handleAgregarProducto}
              className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-md transition-all duration-300 ease-in-out"
            >
              <FaPlusCircle className="mr-2" /> Agregar Producto
            </button>
            <Link
              href="#"
              onClick={handleScanQRClick}
              className="flex items-center justify-center bg-red-800 hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow-md transition-all duration-300 ease-in-out"
            >
              <FaQrcode className="mr-2" /> Scanear QR
            </Link>
          </div>
        </div>

        {/* Barras de busqueda */}
        <FiltrosProducto onFilter={handleFilter} />

        {filteredProductos && filteredProductos.length > 0 ? (
          // <ProductTable products={localProducts} onProductDeleted={handleProductDeleted} />
          <ProductTable products={filteredProductos} />
        ) : (
          <div className="flex flex-col items-center justify-center mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-lg font-semibold text-gray-800">
              No hay productos disponibles
            </p>
            <p className="text-sm font-semibold text-gray-600 mt-2">
              Por favor, añade algunos productos para empezar.
            </p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Stock;
