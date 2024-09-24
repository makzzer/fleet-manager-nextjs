'use client';

import Link from "next/link";
import { FaUserTie } from 'react-icons/fa';

const Proveedores = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-6 text-black">
            <h1 className="text-3xl font-bold mb-6">Proveedores</h1>
            <Link href="/agregarproveedor"
                className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-md transition-all duration-300 ease-in-out mb-6">
                <FaUserTie className="mr-2" /> Agregar Proveedor
            </Link>
        </div>
    );
}

export default Proveedores;