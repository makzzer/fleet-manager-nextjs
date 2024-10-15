"use client";
import React, { useEffect } from "react";
import ProductTable from "../components/Stock/ProductTable";
import { FaDownload, FaPlusCircle, FaQrcode } from "react-icons/fa";
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

//Lista de categorias de repuestos en productos
const categorias = ['Aire Acondicionado', 'Amortiguadores', 'Baterías', 'Carrocería', 'Correas',
  'Cristales', 'Dirección', 'Escape', 'Espejos', 'Filtros', 'Frenos', 'Lubricantes', 'Luces',
  'Motores', 'Motor', 'Neumáticos ', 'Paragolpes', 'Radiadores', 'Sistemas eléctricos', 'Sensores',
  'Suspensión', 'Transmisión',
];

const Stock = () => {
  const router = useRouter();
  const { productos, fetchProductos, createProducto, exportProductoToExcel } = useProducto();
  const [isLoading, setIsLoading] = useState(true); // Estado de carga para el uso del placholder
  const [filteredProductos, setFilteredProductos] = useState(productos); // Estado para filtrar productos por la barra
  const [loadMoreCount, setLoadMoreCount] = useState(5); // Para cargar de a 4
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(""); // Estado para el filtro seleccionado
  const [isSearchEnabled, setIsSearchEnabled] = useState(false); // Estado para habilitar o deshabilitar la barra de búsqueda


  useEffect(() => {
    const loadProductos = async () => {
      setIsLoading(true); // esta es la carga para el Skeleton placeholder
      await fetchProductos();
      setIsLoading(false); // Esta es la carga para el skeleton placeholder
    };
    loadProductos();
  }, [fetchProductos]);

  // función para filtrar tildes y caracteres especiales en el buscador.
  const removeAccents = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  useEffect(() => {
    let filtered = productos;

    if (searchTerm) {
      filtered = filtered.filter((producto) =>
        removeAccents(producto.name.toLowerCase()).includes(removeAccents(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((producto) =>
        removeAccents(producto.category.toLowerCase()) === removeAccents(selectedCategory.toLowerCase())
      );
    }

    setFilteredProductos(filtered.slice(0, loadMoreCount));
  }, [productos, searchTerm, selectedCategory, loadMoreCount]);

  useEffect(() => {
    let filtered = productos;

    // filtrar por categoría primero si hay una seleccionada.
    if (selectedCategory) {
      filtered = filtered.filter((producto) =>
        removeAccents(producto.category.toLowerCase()) === removeAccents(selectedCategory.toLowerCase())
      );
    }

    // luego el filtro por nombre o marca.
    if (searchTerm && selectedFilter) {
      const normalizedSearchTerm = removeAccents(searchTerm.toLowerCase());

      filtered = filtered.filter((producto) => {
        if (selectedFilter === "name") {
          return removeAccents(producto.name.toLowerCase()).includes(normalizedSearchTerm);
        } else if (selectedFilter === "brand") {
          return removeAccents(producto.brand.toLowerCase()).includes(normalizedSearchTerm);
        }
        return false;
      });
    }
    setFilteredProductos(filtered.slice(0, loadMoreCount));
  }, [productos, searchTerm, selectedCategory, selectedFilter, loadMoreCount]);

  const handleLoadMore = () => {
    setLoadMoreCount(loadMoreCount + 5); // Cargar 6 proveedores más
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

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

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedFilter(selected);
    setIsSearchEnabled(!!selected); // habilitar las barras de búsqueda si se selecciona un filtro de nombre o marca.

    // actualizar productos filtrados cuando seleccionas la categoría
    if (selected === "category" && selectedCategory) {
      const filtered = productos.filter((producto) =>
        producto.category.toLowerCase() === selectedCategory.toLowerCase()
      );
      setFilteredProductos(filtered);
    }
  };

  const handleFilter = (filters: {
    searchTerm: string;
    selectedCategory: string;
  }) => {
    const { searchTerm, selectedCategory } = filters;
    setSearchTerm(searchTerm);
    setSelectedCategory(selectedCategory);
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
    // Construir las opciones del select
    const opcionesCategorias = categorias.map(categoria => `<option value="${categoria}">${categoria}</option>`).join('');

    Swal.fire({
      title: "Agregar Producto",
      html: `
       <style>
        input.swal2-input, select.swal2-select {
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 10px;
          width: 80%;
          height: 54px;
          margin-top: 5px;
          margin-bottom: 10px;
          box-sizing: border-box;
        }
      
      </style>
            <input type="text" id="name" class="swal2-input" placeholder="Nombre">
            <input type="text" id="brand" class="swal2-input" placeholder="Marca">
            <input type="text" id="description" class="swal2-input" placeholder="Descripción">
            <select id="category" class="swal2-select">
            <option value="" disabled selected>Seleccione una categoria</option>
            ${opcionesCategorias}
            </select>
            <input type="text" id="quantity" class="swal2-input" placeholder="Cantidad">
          `,
      confirmButtonText: "Agregar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const nameElement = document.getElementById("name") as HTMLInputElement;
        const brandElement = document.getElementById("brand") as HTMLInputElement;
        const descriptionElement = document.getElementById("description") as HTMLInputElement;
        const categoryElement = document.getElementById("category") as HTMLInputElement;
        const quantityElement = document.getElementById("quantity") as HTMLInputElement;

        const name = nameElement?.value;
        const brand = brandElement?.value;
        const description = descriptionElement?.value;
        const category = categoryElement?.value;
        const quantity = quantityElement?.value;

        if (!name || !brand || !description || !category) {
          Swal.showValidationMessage("Completa todos los campos");
          return null;
        }

        return { name, brand, description, category, quantity };
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
    <ProtectedRoute requiredModule="PRODUCTS">
      <div className="p-6 bg-gray-900 min-h-screen rounded-lg text-white">
        <div className="mb-6">
          <h1 className="md:text-4xl text-3xl font-bold text-blue-400 mb-8">
            Gestión de Productos
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleAgregarProducto}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-md transition-all duration-300 ease-in-out flex items-center justify-center"
            >
              <FaPlusCircle className="mr-2" /> Agregar Producto
            </button>
            <Link
              href="#"
              onClick={handleScanQRClick}
              className="w-full bg-red-800 hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow-md transition-all duration-300 ease-in-out flex items-center justify-center"
            >
              <FaQrcode className="mr-2" /> Scanear QR
            </Link>
            <button
              onClick={exportProductoToExcel}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-md transition-all duration-300 ease-in-out flex items-center justify-center"
            >
              <FaDownload className="mr-2" /> Exportar a Excel
            </button>
          </div>
        </div>

        {/* Combobox para seleccionar el filtro */}
        <div className="mb-4">
          <select
            value={selectedFilter}
            onChange={handleFilterChange}
            className="bg-gray-800 text-white p-2 rounded"
          >
            <option value="">Selecciona un filtro</option>
            <option value="name">Nombre</option>
            <option value="brand">Marca</option>
          </select>
        </div>

        {/* Barra de búsqueda habilitada cuando se selecciona un filtro */}
        {isSearchEnabled && (
          <FiltrosProducto onFilter={handleFilter} categorias={categorias} />
        )}

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

      {filteredProductos.length < productos.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            Ver más
          </button>
        </div>
      )}
    </ProtectedRoute>
  );
};

export default Stock;
