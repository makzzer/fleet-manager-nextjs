'use client'
import { useState } from "react";
import { FaHome, FaCar, FaUsers, FaCog, FaBars, FaBox,  FaFileAlt, FaTimes } from "react-icons/fa";
import Link from "next/link";


interface SidebarProps {
  onToggleSidebar: (isOpen: boolean) => void;
}


const Sidebar = ({ onToggleSidebar }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Función para alternar la apertura y cierre de la barra lateral
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    onToggleSidebar(!isOpen);
  };




  return (
    <div className="flex h-screen border-e-2 border-gray-800 ">
      {/* Botón flotante para abrir/cerrar la barra lateral en pantallas pequeñas */}
      <div className="fixed  top-3 left-1 z-40 lg:hidden">
        <button
          onClick={toggleSidebar}
          className="text-gray-300 hover:bg-gray-800 p-2 rounded-full focus:outline-none focus:ring"
        >
          {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* Sidebar */}
      <div  className={` fixed top-0 left-0  border-e-2 border-gray-800 h-screen min-w-[50px] bg-gray-900 transition-all duration-400 z-10 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 lg:w-${isOpen ? "64" : "20"} p-6 lg:p-0 shadow-xl`}
      >

      {/* Botón para pantallas grandes */}
      <div className="hidden lg:block bg-gray-900 fixed top-6 left-0 z-50">
        <button
          onClick={toggleSidebar}
          className="text-white bg-gray-900 hover:bg-gray-800 p-2 rounded-full focus:outline-none focus:ring"
        >
          {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>



        <nav className="space-y-8 ms-1 mt-20   bg-gray-900">
          <Link href="/dashboard">
            <div className="flex items-center  space-x-3 text-white hover:bg-gray-800 p-2 rounded-lg">
              <FaHome />
              <span className={`${
                isOpen ? "block" : "hidden"
              } lg:${isOpen ? "block" : "hidden"} lg:flex`}>
                Dashboard
              </span>
            </div>
          </Link>

          <Link href="/vehiculos">
            <div className="flex items-center space-x-3 text-white hover:bg-gray-800 p-2 rounded-lg">
              <FaCar />
              <span className={`${
                isOpen ? "block" : "hidden"
              } lg:${isOpen ? "block" : "hidden"} lg:flex`}>
                Vehículos
              </span>
            </div>
          </Link>

          <Link href="/productos">
            <div className="flex items-center space-x-3 text-white hover:bg-gray-800 p-2 rounded-lg">
              <FaBox />
              <span className={`${
                isOpen ? "block" : "hidden"
              } lg:${isOpen ? "block" : "hidden"} lg:flex`}>
                Productos
              </span>
            </div>
          </Link>

          
          <Link href="/proveedores">
            <div className="flex items-center space-x-3 text-white hover:bg-gray-800 p-2 rounded-lg">
              <FaUsers />
              <span className={`${
                isOpen ? "block" : "hidden"
              } lg:${isOpen ? "block" : "hidden"} lg:flex`}>
                Proveedores
              </span>
            </div>
          </Link>

          <Link href="/ordenesdecompra">
            <div className="flex items-center space-x-3 text-white hover:bg-gray-800 p-2 rounded-lg">
              <FaFileAlt />
              <span className={`${
                isOpen ? "block" : "hidden"
              } lg:${isOpen ? "block" : "hidden"} lg:flex`}>
                Ordenes de compra
              </span>
            </div>
          </Link>

          <Link href="/usuarios">
            <div className="flex items-center space-x-3 text-white hover:bg-gray-800 p-2 rounded-lg">
              <FaUsers />
              <span className={`${
                isOpen ? "block" : "hidden"
              } lg:${isOpen ? "block" : "hidden"} lg:flex`}>
                Usuarios
              </span>
            </div>
          </Link>

          <Link href="/configuracion">
            <div className="flex items-center space-x-3 text-white hover:bg-gray-800 p-2 rounded-lg">
              <FaCog />
              <span className={`${
                isOpen ? "block" : "hidden"
              } lg:${isOpen ? "block" : "hidden"} lg:flex`}>
                Configuración
              </span>
            </div>
          </Link>



        </nav>
      </div>


    </div>
  );
};

export default Sidebar;
