'use client'
import React, { useState, useEffect } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Función para cerrar el menú al hacer clic fuera de él
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (!event.target || !(event.target as HTMLElement).closest('.navbar')) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('click', handleOutsideClick);
        } else {
            document.removeEventListener('click', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [isOpen]);

    return (
        <nav className="bg-gray-900 text-white p-4 navbar relative">
            <div className="container mx-auto flex justify-between items-center">
                {/*Logo*/}
                <div className="text-2xl font-bold">Fleet Manager</div>

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
                        <a href="/" className="hover:text-gray-400">Inicio</a>
                    </li>
                    <li>
                        <a href="/dashboard" className="hover:text-gray-400">Dashboard</a>
                    </li>
                    <li>
                        <a href="/vehiculos" className="hover:text-gray-400">Vehiculos</a>
                    </li>
                    <li>
                        <a href="/stock" className="hover:text-gray-400">Stock</a>
                    </li>
                </ul>

                {/*Menú desplegable en dispositivos pequeños*/}
                <div
                    className={`${
                        isOpen ? 'block' : 'hidden'
                    } absolute top-16 left-0 w-full bg-gray-800 text-white md:hidden transition-all duration-300 ease-in-out`}
                >
                    <ul className="flex flex-col items-center space-y-4 py-4">
                        <li>
                            <a
                                href="/"
                                className="hover:text-gray-400"
                                onClick={() => setIsOpen(false)}
                            >
                                Inicio
                            </a>
                        </li>
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
                                Vehiculos
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
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
