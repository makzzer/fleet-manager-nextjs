/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, useRef} from "react";
import { FaEye, FaMinusCircle } from "react-icons/fa";
import {
  useOrdenesDeCompra,
  OrdenDeCompra,
  Proveedor
} from "../context/OrdenesCompraContext";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import ProtectedRoute from "../components/Routes/ProtectedRoutes"; //ruta protegida
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { MdPlaylistAddCheckCircle } from "react-icons/md";
import FiltrosOrdenes from "../components/SearchBar/FiltrosOrdenes";
import { MdOutlineAddShoppingCart } from "react-icons/md";

const OrdenesDeCompra = () => {
  const {
    ordenesDeCompra,
    proveedores,
    fetchOrdenesDeCompra,
    fetchProductos,
    fetchProveedores,
    createOrdenDeCompra,
    actualizarEstadoOrdenDeCompra,
    agregarProductosOrdenDeCompra,
    exportOrdenesDeCompraToExcel,
  } = useOrdenesDeCompra();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [filteredOrdenes, setFilteredOrdenes] = useState(ordenesDeCompra); // Estado para filtrar ordenes por la barra
  const [providers, setProviders] = useState<Proveedor[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [visibleOrdenes, setVisibleOrdenes] = useState(10); // Estado para controlar cuántas órdenes mostramos
  const [showScrollIcon, setShowScrollIcon] = useState(true);
  const tableRef = useRef<HTMLDivElement>(null);
  

  // Control de scroll
  const handleScroll = () => {
    if (tableRef.current) {
      const { scrollLeft } = tableRef.current;
      setShowScrollIcon(scrollLeft === 0);
    }
  };

  // Carga de ordenes de compra
  useEffect(() => {
    const loadOrdenesDeCompra = async () => {
      setLoading(true);
      await fetchOrdenesDeCompra();
      setLoading(false);
    };
    loadOrdenesDeCompra();
  }, [fetchOrdenesDeCompra]);

  // Carga de proveedores
  useEffect(() => {
    const loadProveedores = async () => {
      setLoading(true);
      await fetchProveedores();
      setLoading(false);
    };
    loadProveedores();
  }, [fetchProveedores]);

  useEffect(() => {
    const table = tableRef.current;
    if (table) {
      table.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (table) {
        table.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    let orderProviders = ordenesDeCompra.reduce((acc, orden) => {
      const proveedor = orden.provider;
      if (!acc.some(p => p.id === proveedor.id)) {
        acc.push(proveedor);
      }
      return acc;
    }, [] as Proveedor[]);

    let orderDates = ordenesDeCompra.reduce((acc, orden) => {
      const fecha = orden.date_created.slice(0, 10); // Extraer solo la fecha (YYYY-MM-DD)
      if (!acc.includes(fecha)) {
        acc.push(fecha);
      }
      return acc;
    }, [] as string[]);

    setProviders(orderProviders);
    setDates(orderDates);

  }, [ordenesDeCompra]);

  useEffect(() => {
    let filtered = ordenesDeCompra;

    if (selectedProvider) {
      filtered = filtered.filter((orden) => orden.provider.id == selectedProvider);
    }

    if(selectedStatus) {
      filtered = filtered.filter((orden) => orden.status == selectedStatus);
    }

    if(selectedDate) {
      filtered = filtered.filter((orden) => orden.date_created.slice(0, 10) == selectedDate);
    }

    setFilteredOrdenes(filtered);
  }, [ordenesDeCompra, selectedProvider, selectedStatus, selectedDate]);

  const handleView = (id: string) => {
    router.push(`/ordenesdecompra/${id}`);
  };

  const getEstadoColor = (status: string) => {
    switch (status) {
      case "CREATED":
        return "text-blue-300 border-blue-500";
      case "REJECTED":
        return "text-red-300 border-red-500";
      case "APPROVED":
        return "text-purple-300 border-purple-500";
      case "COMPLETED":
        return "text-green-300 border-green-500";
      case "INACTIVE":
        return "text-gray-300 border-gray-500";
      default:
        return "text-gray-300 border-gray-500";
    }
  };

  const handleStatusChange = async (orden: OrdenDeCompra, status: string) => {
    setLoading(true);
    try {
      actualizarEstadoOrdenDeCompra(orden.id, status);
      Swal.fire({
        title: "Orden Actualizada",
        text: "La orden de compra se actualizó con éxito.",
        icon: "success",
        confirmButtonText: "Cerrar",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al actualizar el estado de la orden de compra. Inténtalo de nuevo.",
        icon: "error",
        confirmButtonText: "Cerrar",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtrar las órdenes de compra según el estado seleccionado
  // const filteredOrdenes = ordenesDeCompra.filter((orden) => {
  //   if (estadoFiltro === "") return true;
  //   return orden.status === estadoFiltro;
  // });

  // Controlar cuántas órdenes de compra se muestran
  const visibleOrdenesDeCompra = filteredOrdenes.slice(0, visibleOrdenes);

  const handleVerMas = () => {
    setVisibleOrdenes((prevVisible) => prevVisible + 10); // Mostrar 10 órdenes más
  };

  const handleFilter = (filters: { provider: string; status: string, date: string }) => {
    setSelectedProvider(filters.provider);
    setSelectedStatus(filters.status);
    setSelectedDate(filters.date);
  };

  const handleAgregarOrdenCompra = () => {
    const proveedoresOptions = proveedores
      .map(
        (proveedor) =>
          `<option value="${proveedor.id}">${proveedor.name}</option>`
      )
      .join("");

    // const productosOptions = productos
    //   .map(
    //     (producto) => `<option value="${producto.id}">${producto.name}</option>`
    //   )
    //   .join("");

    Swal.fire({
      title: "Agregar Orden de Compra",
      html: `
      <div class="flex flex-col md:flex-row justify-center gap-6 w-full max-w-4xl mx-auto">
        <select id="providerid" class="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="" disabled selected>Selecciona un proveedor</option>
          ${proveedoresOptions}
        </select>
      </div>
    `,
    customClass: {
      popup: "bg-gray-800 text-white w-full max-w-4xl p-6 rounded-lg",
      title: "text-2xl font-bold mb-4",
    },
      confirmButtonText: "Agregar",
      showCancelButton: true,
      preConfirm: () => {
        const providerIdElement = document.getElementById("providerid") as HTMLSelectElement;
        const providerId = providerIdElement?.value;

        if(!providerId){
          Swal.showValidationMessage(
            "Por favor, completa todos los campos correctamente."
          );
          return null;
        }

        return { providerId }
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        
        createOrdenDeCompra(result.value.providerId);

        Swal.fire({
          title: "Orden agregada con éxito",
          icon: "success",
        });
      }
    });
  };

  const handleAddProduct = async (orden: OrdenDeCompra) => {
    const productos = await fetchProductos(orden.provider.id);

    const productosOptions = productos
      .map(
        (producto) =>
          `<option value="${producto.id}">${producto.name} - ${producto.brand}</option>`
      )
      .join("");

    const existingItems = orden.items
      .map(
        (item) => `
      <li class="py-3 px-4 bg-gray-700 rounded-lg mb-2 flex justify-between items-center">
        <div>
          <span class="font-semibold">${item.product.name} - ${
          item.product.brand
        }</span>
          <span class="text-sm text-gray-400 ml-2">Cantidad: ${
            item.quantity
          }</span>
        </div>
        <span class="text-green-400">$${
          item.product.quantity * item.product.price
        }</span>
      </li>
    `
      )
      .join("");

    Swal.fire({
      title: "Agregar Producto a la Orden",
      html: `
          <button id="addNewProduct" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mb-4 w-full flex items-center justify-center">
            <i class="fas fa-plus mr-2"></i> Agregar Nuevo Producto
          </button>
          
          <div id="newProductForm" class="hidden mb-4">
            <select id="productid" class="bg-gray-800 text-white p-2 rounded w-full mb-2">
              <option value="" disabled selected>Selecciona un producto</option>
              ${productosOptions}
            </select>
            <input type="number" id="quantity" class="bg-gray-800 text-white p-2 rounded w-full mb-2" placeholder="Cantidad">
            <input type="number" id="amount" class="bg-gray-800 text-white p-2 rounded w-full mb-2" placeholder="Monto">
          </div>
          
          <div class="mt-4">
            <h3 class="text-lg font-semibold mb-2">Productos en la orden:</h3>
            <div class="max-h-60 overflow-y-auto">
              <ul class="space-y-2">
                ${existingItems}
              </ul>
            </div>
          </div>
      `,
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: "Agregar Producto",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      customClass: {
        container: "bg-gray-900",
        popup: "bg-gray-800 text-white md:w-1/2",
        confirmButton: "bg-green-600 hover:bg-green-700",
        cancelButton: "bg-red-600 hover:bg-red-700",
      },
      preConfirm: () => {
        const product_id = (
          document.getElementById("productid") as HTMLSelectElement
        ).value;
        const quantity = (
          document.getElementById("quantity") as HTMLInputElement
        ).value;
        const amount = (
          document.getElementById("amount") as HTMLInputElement
        ).value;

        if (!product_id || !quantity || !amount) {
          Swal.showValidationMessage("Por favor, complete todos los campos");
          return false;
        }

        return {
          product_id,
          quantity: Number(quantity),
          amount: Number(amount),
        };
      },
      didOpen: () => {
        const addNewProductBtn = (
          document.getElementById("addNewProduct") as HTMLButtonElement
        );
        const newProductForm = (
          document.getElementById("newProductForm") as HTMLDivElement
        );

        addNewProductBtn.addEventListener("click", () => {
          newProductForm.classList.toggle("hidden");
        });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { product_id, quantity, amount } = result.value;
        agregarProductosOrdenDeCompra(orden.id, product_id, quantity, amount);
        Swal.fire(
          "Producto agregado",
          "El producto ha sido agregado a la orden de compra",
          "success"
        );
      }
    });
  };

  return (
    <ProtectedRoute requiredModule="ORDERS">
      <div className="min-h-screen rounded-xl bg-gray-900 p-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
          <h1 className="text-3xl font-bold mb-6 text-blue-400">
            Órdenes de compra
          </h1>
          <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleAgregarOrdenCompra}
            className="sm:my-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md "
          >
            Agregar Orden de Compra
          </button>
          <button
            onClick={exportOrdenesDeCompraToExcel}
            className="sm:my-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Exportar a Excel
          </button>
          </div>
        </div>

        {/* Barra de búsqueda habilitada cuando se selecciona un filtro */}
        <FiltrosOrdenes onFilter={handleFilter} providers={providers} dates={dates} />

        <div
          className="relative overflow-x-auto bg-gray-800 shadow-md rounded-lg p-6"
          ref={tableRef}
        >
          <table className="min-w-full divide-y divide-gray-600 table-auto">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                  Proveedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-200 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-600 text-gray-200">
              {filteredOrdenes.length > 0 ? (
                visibleOrdenesDeCompra.map((orden) => (
                  <tr key={orden.id}>
                    <td className={`px-6 py-4 whitespace-nowrap rounded-full ${getEstadoColor(orden.status)}`}>{orden.provider.name}</td>
                    <td className={`px-6 py-4 whitespace-nowrap rounded-full ${getEstadoColor(orden.status)}`}>{orden.date_created.slice(0, 10)}</td>
                    <td className={`px-6 py-4 whitespace-nowrap rounded-full ${getEstadoColor(orden.status)}`}>
                      <span
                        className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full border ${getEstadoColor(
                          orden.status
                        )}`}
                      >
                        {orden.status === "CREATED"
                          ? "Creada"
                          : orden.status === "REJECTED"
                          ? "Rechazada"
                          : orden.status === "APPROVED"
                          ? "Aprobada"
                          : orden.status === "COMPLETED"
                          ? "Completada"
                          : "Inactiva"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${orden.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex justify-end space-x-4">
                      <button
                        onClick={() => handleView(orden.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEye className="w-5 h-5" />
                      </button>

                      {orden.status === "CREATED" ? (
                        <>
                          <button
                            title="Aprobar"
                            onClick={() => handleAddProduct(orden)}
                            className="text-emerald-500 hover:text-emerald-800"
                          >
                            <MdOutlineAddShoppingCart className="w-5 h-5" />
                          </button>
                          <button
                            title="Aprobar"
                            onClick={() =>
                              handleStatusChange(orden, "APPROVED")
                            }
                            className="text-purple-500 hover:text-green-800"
                          >
                            <FaCircleCheck className="w-5 h-5" />
                          </button>
                          <button
                            title="Rechazar"
                            onClick={() =>
                              handleStatusChange(orden, "REJECTED")
                            }
                            className="text-red-500 hover:text-green-800"
                          >
                            <FaCircleXmark className="w-5 h-5" />
                          </button>
                        </>
                      ) : orden.status === "APPROVED" ? (
                        <>
                          <button
                            title="Completar"
                            onClick={() =>
                              handleStatusChange(orden, "COMPLETED")
                            }
                            className="text-green-500 hover:text-green-800"
                          >
                            <MdPlaylistAddCheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            title="Inactivar"
                            onClick={() =>
                              handleStatusChange(orden, "INACTIVE")
                            }
                            className="text-grey-500 hover:text-green-800"
                          >
                            <FaMinusCircle className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-300">
                    No hay órdenes de compra con este estado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <hr className="border-gray-700 my-4" />
          {/* Botón Ver más */}
          {visibleOrdenes < filteredOrdenes.length && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleVerMas}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              >
                Ver más
              </button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default OrdenesDeCompra;
