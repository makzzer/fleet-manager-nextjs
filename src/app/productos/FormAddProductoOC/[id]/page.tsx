"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProducto } from "@/app/context/ProductoContext";
import { useOrdenesDeCompra } from "@/app/context/OrdenesCompraContext";
import Swal from "sweetalert2";

const FormAddProductoOC = () => {
  const { id } = useParams(); // ID del producto desde la URL
  const router = useRouter();

  const { productos, fetchProductos } = useProducto();
  const {
    ordenesDeCompra,
    fetchOrdenesDeCompra,
    agregarProductosOrdenDeCompra,
    createOrdenDeCompraWithProduct,
  } = useOrdenesDeCompra();

  const [producto, setProducto] = useState<any>(null);
  const [cantidad, setCantidad] = useState<number>(1);
  const [selectedOrdenId, setSelectedOrdenId] = useState<string>("");

  useEffect(() => {
    const cargarProductos = async () => {
      await fetchProductos();
    };
    cargarProductos();
  }, [fetchProductos]);

  useEffect(() => {
    const cargarOrdenes = async () => {
      await fetchOrdenesDeCompra();
    };
    cargarOrdenes();
  }, [fetchOrdenesDeCompra]);

  useEffect(() => {
    const productoEncontrado = productos.find((p: any) => p.id === id);
    setProducto(productoEncontrado);
  }, [productos, id]);

  if (!producto) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800">
        <p className="text-white">Cargando producto...</p>
      </div>
    );
  }

  // Filtrar órdenes de compra por estado y por proveedor asociado al producto
  const ordenesOptions = ordenesDeCompra
    .filter(
      (orden) =>
        (orden.status === "CREATED" || orden.status === "APPROVED") &&
        orden.provider.id === producto.preference_provider_id
    )
    .map((orden) => (
      <option key={orden.id} value={orden.id}>
        {`Orden #${orden.id} - Proveedor: ${orden.provider.name}`}
      </option>
    ));

  // Función para crear una nueva orden de compra
  const handleCreateOrder = async () => {
    try {
      const order_id = await createOrdenDeCompraWithProduct(
        producto.preference_provider_id, 
        producto.id,
        cantidad,
        producto.price * cantidad);
      Swal.fire("Éxito", "Se ha creado una nueva orden de compra.", "success").then(() => {
        router.push(`/ordenesdecompra/${order_id}`);
      });
/*
      // Llamamos a fetchOrdenesDeCompra para obtener la nueva orden
      await fetchOrdenesDeCompra();
      const ordenes = ordenesDeCompra.filter(
        (orden) =>
          (orden.status === "CREATED" || orden.status === "APPROVED") &&
          orden.provider.id === producto.preference_provider_id
      );
      console.log("Ordenes: " + ordenes);
      if(ordenes.length>0) {
        await agregarProductosOrdenDeCompra(ordenes[0].id, producto.id, cantidad, producto.price * cantidad);
        
      } else {
        Swal.fire("Error", "Ocurrió un error al crear la orden de compra.", "error");
      }
        */
    } catch (error) {
      console.error("Error al crear la orden de compra:", error);
      Swal.fire("Error", "Ocurrió un error al crear la orden de compra.", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedOrdenId) {
      Swal.fire("Error", "Por favor, selecciona una orden de compra.", "error");
      return;
    }

    try {
      const amount = producto.price * cantidad;

      // Log para verificar los datos que se enviarán
      console.log("Datos que se enviarán en el PUT:", {
        orden_id: selectedOrdenId,
        product_id: producto.id,
        quantity: cantidad,
        amount: amount,
      });

      await agregarProductosOrdenDeCompra(selectedOrdenId, producto.id, cantidad, amount);

      Swal.fire("Éxito", "Producto agregado a la orden de compra.", "success").then(() => {
        router.push(`/ordenesdecompra/${selectedOrdenId}`);
      });
    } catch (error) {
      console.error("Error al agregar el producto a la orden de compra:", error);
      Swal.fire("Error", "Ocurrió un error al agregar el producto.", "error");
    }
  };

  return (
    <><div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-blue-400">
          Agregar Producto a Orden de Compra
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Producto
            </label>
            <input
              type="text"
              value={`${producto.name} - ${producto.brand}`}
              disabled
              className="bg-gray-700 text-white w-full p-3 rounded-lg focus:outline-none" />
          </div>

          <div>
            <label
              htmlFor="cantidad"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Cantidad
            </label>
            <input
              id="cantidad"
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value) || 0)}
              className="bg-gray-700 text-white w-full p-3 rounded-lg focus:outline-none" />
          </div>

          {(ordenesOptions.length > 0) ? (
            <><div>
              <label
                htmlFor="orden"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Seleccionar Orden de Compra
              </label>
              <select
                id="orden"
                value={selectedOrdenId}
                onChange={(e) => setSelectedOrdenId(e.target.value)}
                className="bg-gray-700 text-white w-full p-3 rounded-lg focus:outline-none"
              >
                <option value="" disabled>
                  Selecciona una orden de compra
                </option>
                {ordenesOptions}
              </select>
              
            </div>
            <div>
              <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-md transition-all"
                >
                Agregar a Orden de Compra
              </button>
            </div></>
          ) : (
            <div>
              <label
                htmlFor="orden"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                No hay órdenes de compra abiertas para este proveedor
              </label>
              <button
                type="button"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all"
                onClick={handleCreateOrder}
              >
                Crear Nueva Orden de Compra
              </button>
            </div>
          )}
        </form><button
          className="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg shadow-md transition-all"
          onClick={() => router.back()}
        >
          Volver
        </button>
      </div >
    </div >
    </>);
};

      export default FormAddProductoOC;