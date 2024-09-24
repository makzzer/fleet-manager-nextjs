"use client";
import React, { useState, useEffect } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Función para cerrar el menú al hacer clic fuera de él
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!event.target || !(event.target as HTMLElement).closest(".navbar")) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <nav className="bg-gray-900 text-white p-4 fixed top-0 left-0 w-full z-50 navbar">
      <div className="container mx-auto flex justify-between items-center">
        {/*Logo*/}
        <a href="/">
          <div className="text-2xl font-bold">Fleet Manager</div>
        </a>

        {/*Hamburguesa para pantallas pequeñas*/}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              ></path>
            </svg>
          </button>
        </div>

        {/*Links en dispositivos grandes*/}
        <ul className="hidden md:flex space-x-4">
          <li>
            <a href="/dashboard" className="hover:text-gray-400">
              Dashboard
            </a>
          </li>
          <li>
            <a href="/vehiculos" className="hover:text-gray-400">
              Vehículos
            </a>
          </li>
          <li>
            <a href="/stock" className="hover:text-gray-400">
              Stock
            </a>
          </li>
          <li>
            <a href="/proveedores" className="hover:text-gray-400">
              Proveedores
            </a>
          </li>
          <li>
            <a href="/ordenesdecompra" className="hover:text-gray-400">
              OC
            </a>
          </li>
          <li>
            <a href="/login" className="hover:text-gray-400">
              Ingresar
            </a>
          </li>
        </ul>

        {/*Menú desplegable en dispositivos pequeños*/}
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } fixed top-0 left-0 w-full h-full bg-gray-900 text-white transition-all duration-300 ease-in-out z-40`}
        >
          <div className="p-4 flex justify-between items-center">
            <div className="text-2xl font-bold">Fleet Manager</div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <ul className="flex flex-col items-center space-y-4 mt-8">
            <li>
              <a
                href="/dashboard"
                className="hover:text-gray-400"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/vehiculos"
                className="hover:text-gray-400"
                onClick={() => setIsOpen(false)}
              >
                Vehículos
              </a>
            </li>
            <li>
              <a
                href="/stock"
                className="hover:text-gray-400"
                onClick={() => setIsOpen(false)}
              >
                Stock
              </a>
            </li>
            <li>
              <a
                href="/proveedores"
                className="hover:text-gray-400"
                onClick={() => setIsOpen(false)}
              >
                Proveedores
              </a>
            </li>
            <li>
              <a
                href="/ordenesdecompra"
                className="hover:text-gray-400"
                onClick={() => setIsOpen(false)}
              >
                OC
              </a>
            </li>
            <li>
              <a
                href="/login"
                className="hover:text-gray-400"
                onClick={() => setIsOpen(false)}
              >
                Ingresar
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
