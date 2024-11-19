"use client";
import React, { useEffect } from "react";
import ProductTable from "../components/Stock/ProductTable";
import { FaDownload, FaPlusCircle, FaQrcode, FaCamera } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";
import FiltrosProducto from "../components/Stock/FiltrosProducto";
import { useRouter } from "next/navigation";
import { useProducto } from "../context/ProductoContext";
// import SearchBar from "../components/SearchBar/SearchBar";

// import { TextField, InputAdornment } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';

import ProtectedRoute from "../components/Routes/ProtectedRoutes";
import QrScanner from "../components/QR/QrScanner"; // Importamos el componente del escáner
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import {
  generateExcelProductTemplate,
  processProductFile,
} from "../util/excelProcessor";

const MySwal = withReactContent(Swal); // Creamos una instancia de SweetAlert con ReactContent

//Lista de categorias de repuestos en productos
const categorias = [
  "Aceite",
  "Aire Acondicionado",
  "Amortiguadores",
  "Baterías",
  "Carrocería",
  "Correas",
  "Cristales",
  "Dirección",
  "Escape",
  "Espejos",
  "Filtros",
  "Frenos",
  "Líquido de frenos",
  "Lubricantes",
  "Luces",
  "Motores",
  "Motor",
  "Neumáticos ",
  "Paragolpes",
  "Radiadores",
  "Sistemas eléctricos",
  "Sensores",
  "Suspensión",
  "Transmisión",
];

const unidadesDeMedida: { [key: string]: string } = {
  LITER: "Litros",
  UNIT: "Unidades",
  KILOGRAM: "kg",
};

const Stock = () => {
  const router = useRouter();
  const {
    productos,
    proveedores,
    empresas,
    fetchProductos,
    fetchProveedores,
    fetchEmpresas,
    createProducto,
    exportProductoToExcel,
  } = useProducto();
  const [isLoading, setIsLoading] = useState(true); // Estado de carga para el uso del placholder
  const [filteredProductos, setFilteredProductos] = useState(productos); // Estado para filtrar productos por la barra
  const [loadMoreCount, setLoadMoreCount] = useState(5); // Para cargar de a 4
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(""); // Estado para el filtro seleccionado
  const [isSearchEnabled, setIsSearchEnabled] = useState(true); // (true): para que las barras sean siempre visibles

  useEffect(() => {
    const loadProductos = async () => {
      setIsLoading(true); // esta es la carga para el Skeleton placeholder
      await fetchProductos();
      setIsLoading(false); // Esta es la carga para el skeleton placeholder
    };
    loadProductos();
  }, [fetchProductos]);

  useEffect(() => {
    const loadProveedores = async () => {
      setIsLoading(true);
      await fetchProveedores();
      setIsLoading(false);
    };
    loadProveedores();
  }, [fetchProveedores]);

  useEffect(() => {
    const loadEmpresas = async () => {
      setIsLoading(true);
      await fetchEmpresas();
      setIsLoading(false);
    };
    loadEmpresas();
  }, [fetchEmpresas]);

  // función para filtrar tildes y caracteres especiales en el buscador.
  const removeAccents = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  useEffect(() => {
    let filtered = productos;

    if (searchTerm) {
      filtered = filtered.filter((producto) =>
        removeAccents(producto.name.toLowerCase()).includes(
          removeAccents(searchTerm.toLowerCase())
        )
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (producto) =>
          removeAccents(producto.category.toLowerCase()) ===
          removeAccents(selectedCategory.toLowerCase())
      );
    }

    setFilteredProductos(filtered.slice(0, loadMoreCount));
  }, [productos, searchTerm, selectedCategory, loadMoreCount]);

  useEffect(() => {
    let filtered = productos;

    // filtrar por categoría primero si hay una seleccionada.
    if (selectedCategory) {
      filtered = filtered.filter(
        (producto) =>
          removeAccents(producto.category.toLowerCase()) ===
          removeAccents(selectedCategory.toLowerCase())
      );
    }

    // luego el filtro por nombre o marca.
    if (searchTerm) {
      const normalizedSearchTerm = removeAccents(searchTerm.toLowerCase());

      filtered = filtered.filter((producto) => {
        if (selectedFilter === "name") {
          return removeAccents(producto.name.toLowerCase()).includes(
            normalizedSearchTerm
          );
        } else if (selectedFilter === "brand") {
          return removeAccents(producto.brand.toLowerCase()).includes(
            normalizedSearchTerm
          );
        }
        return (
          removeAccents(producto.name.toLowerCase()).includes(
            normalizedSearchTerm
          ) ||
          removeAccents(producto.brand.toLowerCase()).includes(
            normalizedSearchTerm
          )
        );
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

  const handleCargaMasiva = () => {
    Swal.fire({
      title: "Carga Masiva de Productos",
      html: `
          <div class="text-left mb-4">
            <p class="mb-2 ">Descargue la plantilla y luego suba el archivo Excel o CSV con los datos de los productos.</p>
            <p class="text-sm text-gray-300">Formatos aceptados: .xlsx, .xls, .csv</p>
          </div>
          <div class="flex justify-start space-x-4 mb-4">
            <button id="downloadTemplate" class="bg-blue-500 hover:bg-blue-600 text-white w-full font-bold py-2 px-4 rounded transition duration-200 ease-in-out">
              Descargar Plantilla
            </button>
          </div>
          <input type="file" id="fileUpload" accept=".xlsx, .xls, .csv" class="hidden">
          <div id="dropZone" class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition duration-200 ease-in-out">
            <p class="">Arrastre y suelte su archivo aquí</p>
            <p class="text-sm ">o haga clic para seleccionar</p>
          </div>
      `,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: "Cerrar",
      customClass: {
        popup: "rounded-lg bg-gray-800 text-white",
        title: "font-bold text-blue-500",
      },
      didOpen: () => {
        const dropZone = document.getElementById("dropZone");
        const fileUpload = document.getElementById(
          "fileUpload"
        ) as HTMLInputElement;

        document
          .getElementById("downloadTemplate")
          ?.addEventListener("click", generateExcelProductTemplate);

        dropZone?.addEventListener("click", () => fileUpload?.click());

        dropZone?.addEventListener("dragover", (e) => {
          e.preventDefault();
          dropZone.classList.add("border-blue-500");
        });

        dropZone?.addEventListener("dragleave", () => {
          dropZone.classList.remove("border-blue-500");
        });

        dropZone?.addEventListener("drop", (e) => {
          e.preventDefault();
          dropZone.classList.remove("border-blue-500");
          if (e.dataTransfer?.files.length) {
            handleFileUpload(e.dataTransfer.files[0]);
          }
        });

        fileUpload?.addEventListener("change", (e) => {
          const fileInput = e.target as HTMLInputElement;
          if (fileInput.files && fileInput.files[0]) {
            handleFileUpload(fileInput.files[0]);
          }
        });
      },
    });
  };

  const handleFileUpload = async (file: File) => {
    try {
      const formatedProducts = await processProductFile(file);
      let successCount = 0;
      let failedCount = 0;

      console.log(formatedProducts);
      for (const formatedProduct of formatedProducts) {
        try {
          const product = {
            ...formatedProduct,
          };
          const result = await createProducto(product);
          if (result) {
            successCount++;
          } else {
            failedCount++;
          }
          // Actualizar la barra de progreso
          Swal.update({
            title: "Procesando vehículos...",
            html: `Procesados: ${successCount + failedCount} de ${
              formatedProducts.length
            }
                   <div class="progress-bar-container">
                     <div class="progress-bar" style="width: ${
                       ((successCount + failedCount) /
                         formatedProducts.length) *
                       100
                     }%"></div>
                   </div>`,
          });
        } catch (error) {
          console.error("Error creando proveedor:", error);
          failedCount++;
        }
      }

      await Swal.fire({
        title: "Carga completada",
        html: `Proveedores agregados exitosamente: ${successCount}<br>Fallidos: ${failedCount}`,
        icon: "success",
      });

      fetchProveedores(); // Actualizar la lista de vehículos
    } catch (error) {
      console.error("Error processing file:", error);
      Swal.fire("Error", "Hubo un problema al procesar el archivo", "error");
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedFilter(selected);
    setIsSearchEnabled(true); // habilitar las barras de búsqueda si se selecciona un filtro de nombre o marca.

    // actualizar productos filtrados cuando seleccionas la categoría
    if (selected === "category" && selectedCategory) {
      const filtered = productos.filter(
        (producto) =>
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

  // Función para escanear códigos QR
  const handleScanQRClick = () => {
    MySwal.fire({
      title: "Escanear Código QR",
      html: (
        <div style={{ width: "100%", height: "400px" }}>
          <QrScanner
            onScan={(resultText: string) => {
              if (resultText) {
                MySwal.close();
                router.push(resultText);
              }
            }}
            onError={(error: unknown) => {
              console.error(`Error al escanear: ${error}`);
            }}
          />
        </div>
      ),
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "bg-gray-900 text-white",
        title: "text-white",
        cancelButton: "bg-red-500 text-white",
      },
    });
  };

  const handleDesplegarOpciones = () => {
    Swal.fire({
      //libreria s. alert
      title: "Agregar Producto",
      html: `
      <div class="grid grid-cols-2">
        <button id="addIndividual" class="swal2-confirm swal2-styled flex flex-col justify-center items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
          </svg>
          <span>Individual</span>
        </button>
        <button id="addMasivo" class="swal2-confirm swal2-styled flex flex-col justify-center items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
        </svg>
        <span>Carga Masiva</span>
        </button>
      </div> 
      `,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      focusConfirm: false,
      customClass: {
        title: "text-white",
        popup: "bg-gray-800",
      },
      didOpen: () => {
        document
          .getElementById("addIndividual")
          ?.addEventListener("click", () => {
            Swal.close();
            handleAgregarProducto();
          });
        document.getElementById("addMasivo")?.addEventListener("click", () => {
          Swal.close();
          handleCargaMasiva();
        });
      },
    });
  };

  const handleAgregarProducto = () => {
    // Construir las opciones del select
    const opcionesCategorias = categorias
      .map((categoria) => `<option value="${categoria}">${categoria}</option>`)
      .join("");

    const opcionesUnidadMedida = Object.entries(unidadesDeMedida)
      .map(
        ([key, value]) =>
          `<option key="${key}" value="${key}">${value}</option>`
      )
      .join("");

    const proveedoresOptions = proveedores
      .map(
        (proveedor) =>
          `<option value="${proveedor.id}">${proveedor.name}</option>`
      )
      .join("");

    const enterprisesOptions = empresas
      .map((enterprise) => 
        `<option value="${enterprise.id}">${enterprise.name}</option>`
      )
      .join("");

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
            <select id="measurement" class="swal2-select">
              <option value="" selected>Seleccione unidad de medida</option>
               ${opcionesUnidadMedida}
            </select>
            <input type="text" id="price" class="swal2-input" placeholder="Precio">
            <select id="preferenceProviderId" class="swal2-select">
              <option value="" selected>Seleccione un proveedor</option>
               ${proveedoresOptions}
            </select>
            <input type="text" id="minStock" class="swal2-input" placeholder="Stock mínimo">
            <select id="autoPurchase" class="swal2-select">
              <option value="" diasbled selected>Seleccione una opción</option>
               <option value="ENABLED" selected>Activado</option>
               <option value="DISABLED" selected>Desactivado</option> 
            </select>
            <select id="enterpriseId" class="swal2-select">
              <option value="" selected>Seleccione la empresa</option>
               ${enterprisesOptions}
            </select>
          `,
      confirmButtonText: "Agregar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const nameElement = document.getElementById("name") as HTMLInputElement;
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
        const measurementElement = document.getElementById(
          "measurement"
        ) as HTMLInputElement;
        const priceElement = document.getElementById(
          "price"
        ) as HTMLInputElement;
        const preferenceProviderIdElement = document.getElementById(
          "preferenceProviderId"
        ) as HTMLInputElement;
        const minStockElement = document.getElementById(
          "minStock"
        ) as HTMLInputElement;
        const autoPurchaseElement = document.getElementById(
          "autoPurchase"
        ) as HTMLInputElement;
        const enterpriseIdElement = document.getElementById(
          "enterpriseId"
        ) as HTMLInputElement;

        const name = nameElement?.value;
        const brand = brandElement?.value;
        const description = descriptionElement?.value;
        const category = categoryElement?.value;
        const quantity = quantityElement?.value;
        const measurement = measurementElement?.value;
        const price = priceElement?.value;
        const preferenceProviderId = preferenceProviderIdElement?.value;
        const minStock = minStockElement?.value;
        const autoPurchase = autoPurchaseElement?.value;
        const enterpriseId = enterpriseIdElement?.value;

        if (
          !name ||
          !brand ||
          !description ||
          !category ||
          !quantity ||
          !measurement ||
          !price ||
          !preferenceProviderId ||
          !minStock ||
          // !autoPurchase ||
          !enterpriseId
        ) {
          Swal.showValidationMessage("Completa todos los campos");
          return null;
        }

        return {
          name,
          brand,
          description,
          category,
          quantity,
          measurement,
          price,
          preferenceProviderId,
          minStock,
          autoPurchase,
          enterpriseId,
        };
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
          measurement: result.value.measurement,
          price: result.value.price,
          providerId: result.value.preferenceProviderId,
          minStock: result.value.minStock,
          autoPurchase: result.value.autoPurchase,
          enterpriseId: result.value.enterpriseId,
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleDesplegarOpciones}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-md transition-all duration-300 ease-in-out flex items-center justify-center"
            >
              <FaPlusCircle className="mr-2" /> Agregar Producto
            </button>

            <button
              onClick={exportProductoToExcel}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-md transition-all duration-300 ease-in-out flex items-center justify-center"
            >
              <FaDownload className="mr-2" /> Descargar XML
            </button>
          </div>
        </div>

        {/* Barra de búsqueda habilitada cuando se selecciona un filtro */}
        {isSearchEnabled && (
          <FiltrosProducto onFilter={handleFilter} categorias={categorias} />
        )}

        {filteredProductos && filteredProductos.length > 0 ? (
          // <ProductTable products={localProducts} onProductDeleted={handleProductDeleted} />
          <ProductTable
            products={filteredProductos}
            measurementUnits={unidadesDeMedida}
          />
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
