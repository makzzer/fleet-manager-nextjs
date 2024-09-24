'use client';

import Link from "next/link";
import { FaUserTie, FaEnvelope, FaPhone, FaEnvelopeSquare } from 'react-icons/fa';

const Proveedores = () => {
    return (
        <div className="p-6 min-h-screen bg-gray-900 text-white">
            <h1 className="text-3xl font-bold mb-6">Proveedores</h1>

            <Link href="/agregarproveedor"
                className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-md transition-all duration-300 ease-in-out mb-6">
                <FaUserTie className="mr-2" /> Agregar Proveedor
            </Link>

        </div>
    );
}

export default Proveedores;