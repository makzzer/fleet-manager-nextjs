import React from "react";

const Navbar = () => {
    return (

        <nav className="bg-gray-900 text-white p-4">
            <div className="container mx-auto flex justify-between items bg-center">
                {/*Logo*/}
                <div className="text-2xl font-bold">Fleet Manager
                </div>

                {/*Links*/}
                <ul className="flex space-x-4">
                    <li>
                        <a href="/" className="hover:text-gray-400">Inicio</a>
                    </li>
                    <li>
                        <a href="/dashboard" className="hover:text-gray-400">Dashboard</a>
                    </li>
                    <li>
                        <a href="/vehiculos" className="hover:text-gray-400">Vehiculos</a>
                    </li>
                </ul>
            </div>
        </nav>

    )
}


export default Navbar;