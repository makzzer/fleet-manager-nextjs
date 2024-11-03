"use client";

import Link from 'next/link';
import React, { useState, useEffect, useContext } from 'react';
// import { ProductoContext } from '../contexts/ProductoContext';
import { useProducto } from "@/app/context/ProductoContext";
// import { OrdenesCompraContext } from '../contexts/OrdenesCompraContext';

import Swal from 'sweetalert2';
import router from 'next/router';

const FormAddProductoOC = () => {
    // const { productos } = useContext(ProductoContext);
    // const { ordenesCompra, agregarProductoOrden } = useContext(OrdenesCompraContext);
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const [cantidad, setCantidad] = useState(1);
    const { productos } = useProducto();

    const proveedorId = "";
    const productoId = "";
    const productoData = productos.find((producto) => producto.id === productoId);

    const productosFiltrados = productos.filter(
        (producto) => producto.preference_provider_id === proveedorId
    );

    //   const ordenesFiltradas = ordenesCompra.filter(
    //     (orden) => orden.estado === 'CREATED' && orden.proveedorId === proveedorId
    //   );

    //   const handleProductoChange = (e) => {
    //     setProductoSeleccionado(e.target.value);
    //   };

    //   const handleCantidadChange = (e) => {
    //     setCantidad(e.target.value);
    //   };

    const handleAgregarProducto = () => {
        if (!productoSeleccionado || cantidad <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, selecciona un producto y una cantidad válida.',
            });
            return;
        }

        // agregarProductoOrden(productoSeleccionado, cantidad);
        // Swal.fire({
        //   icon: 'success',
        //   title: 'Producto agregado',
        //   text: 'El producto ha sido agregado a la orden de compra.',
        // });

        return (
            <div>
                {/* Selección de Producto y Cantidad */}
                <form onSubmit={handleAgregarProducto}>
                    <label htmlFor="producto">Seleccionar Producto:</label>
                    <select
                        id="producto"
                        value={productoSeleccionado}
                    // onChange={handleProductoChange}
                    >
                        <option value="">Seleccione un producto</option>
                        {/* {productosFiltrados.map((producto) => (
                    <option key={producto.id} value={producto.id}>
                        {producto.nombre}
                    </option>
                ))} */}
                    </select>

                    <label htmlFor="cantidad">Cantidad:</label>
                    {/* <input
                    type="number"
                    id="cantidad"
                    value={cantidad}
                    onChange={handleCantidadChange}
                    min="1"
                /> */}

                    {/* Listado de Órdenes de Compra Filtradas */}
                    {/* <div className="tablero-oc">
                {ordenesFiltradas.map((orden) => (
                    <div key={orden.id} className="orden-item">
                        <p>{orden.nombre}</p>
                    </div>
                ))}
            </div> */}

                    {/* Botón de Volver */}
                    <div className="flex justify-center mt-10">
                        <button
                            onClick={() => router.push("/vehiculos")}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Volver
                        </button>
                    </div>
                </form>
            </div>
        );
    };
};

export default FormAddProductoOC;
