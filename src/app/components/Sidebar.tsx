// Sidebar.tsx

'use client';
import { useState, useEffect, useRef } from "react";
import { FaCar, FaUsers, FaBars, FaBox, FaFileAlt, FaTimes, FaSellsy, FaCalendarAlt, FaTools } from "react-icons/fa";
import { MdMonitor } from "react-icons/md";
import { MdDashboard, MdBusinessCenter } from "react-icons/md"
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import React from "react";
import { IoAnalytics } from "react-icons/io5";
import QrScanner from "./QR/QrScanner";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content"; // Importamos el wrapper de SweetAlert2
import { useRouter, usePathname } from "next/navigation";
import { IoMdQrScanner } from "react-icons/io";


interface SidebarProps {
  onToggleSidebar: (isOpen: boolean) => void;
}

const Sidebar = ({ onToggleSidebar }: SidebarProps) => {

  // Para QR
  const router = useRouter();
  const pathname = usePathname(); // Obtenemos la ruta actual
  const MySwal = withReactContent(Swal); // Creamos una instancia de SweetAlert con ReactContent

  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const { hasModuleAccess, hasRole, authenticatedUser } = useAuth()

  // Función para alternar la apertura y cierre de la barra lateral
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    onToggleSidebar(!isOpen);
  };

  // Función para manejar el clic en los enlaces
  const handleLinkClick = () => {
    // Solo cerrar el sidebar si la pantalla es menor a lg (1024px)
    if (window.innerWidth < 1024) {
      setIsOpen(false);
      onToggleSidebar(false);
    }
  };

  // Función para manejar clic fuera del sidebar en pantallas móviles
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (window.innerWidth < 1024 && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onToggleSidebar(false);
      }
    };

    // Añadir el event listener al montar el componente
    document.addEventListener('mousedown', handleClickOutside);

    // Limpiar el event listener al desmontar el componente
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onToggleSidebar]);

  // Nueva funcionalidad: Colapsar la barra al navegar en móvil
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (window.innerWidth < 1024) {
      setIsOpen(false);
      onToggleSidebar(false);
    }
  }, [pathname]);

  // Función para escanear códigos QR
  const handleScanQR = () => {
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


  return (
    <>
      {authenticatedUser && (
        <div ref={sidebarRef} className="flex h-screen border-e-2 border-gray-800 ">

          {/* Botón flotante para abrir/cerrar la barra lateral en pantallas pequeñas */}

          <div className="fixed top-3 left-1 z-40 lg:hidden">
            <button
              onClick={toggleSidebar}
              className="text-gray-300 hover:bg-gray-800 p-2 rounded-full focus:outline-none"
            >
              {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>

          {/* Sidebar */}
          <div className={`fixed top-0 left-0 border-e-2 border-gray-800 h-screen min-w-[50px] bg-gray-900 transition-all duration-400 z-10 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
            } lg:relative lg:translate-x-0 lg:w-${isOpen ? "64" : "20"} p-6 lg:p-0 shadow-xl`}
          >
            {/* Botón para pantallas grandes */}

            <div className="hidden lg:block  fixed top-6 left-[0.1rem] z-50  ">
              <button
                onClick={toggleSidebar}
                className="text-white bg-gray-900 hover:bg-gray-800 p-2 rounded-full focus:outline-none "
              >
                {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
              </button>
            </div>


            <nav className="space-y-8 ms-1 mt-20 bg-gray-900">
              <Link href="/dashboard" onClick={handleLinkClick}>
                <div className="flex items-center space-x-3 text-white hover:bg-gray-800 p-2 rounded-lg">
                  <MdDashboard />
                  <span className={`${isOpen ? "block" : "hidden"} lg:${isOpen ? "block" : "hidden"} lg:flex`}>
                    Dashboard
                  </span>
                </div>
              </Link>

              {(hasRole("SUPERVISOR") || hasRole("MANAGER")) && (
                <Link href="/centrodemonitoreo" onClick={handleLinkClick}>
                  <div className="flex items-center space-x-3 text-white hover:bg-gray-800 p-2 rounded-lg">
                    <MdMonitor />
                    <span className={`${isOpen ? "block" : "hidden"} lg:${isOpen ? "block" : "hidden"} lg:flex`}>
                      Monitoreo
                    </span>
                  </div>
                </Link>)}

              {hasModuleAccess("RESERVES") && hasRole("CUSTOMER") && (
                <Link href="/reservas" onClick={handleLinkClick}>
                  <div className="flex items-center space-x-3 text-white hover:bg-gray-800 p-2 rounded-lg">
                    <FaCalendarAlt />
                    <span className={`${isOpen ? "block" : "hidden"} lg:${isOpen ? "block" : "hidden"} lg:flex`}>
                      Reservas
                    </span>
                  </div>
                </Link>)}

              {hasModuleAccess("VEHICLES") && (
                <Link href="/vehiculos" onClick={handleLinkClick}>
                  <div className="flex items-center space-x-3 text-white hover:bg-gray-800 p-2 rounded-lg">
                    <FaCar />
                    <span className={`${isOpen ? "block" : "hidden"} lg:${isOpen ? "block" : "hidden"} lg:flex`}>
                      Vehículos
                    </span>
                  </div>
                </Link>)}

              {hasModuleAccess("CONTROLS") && (
                <Link href="/control" onClick={handleLinkClick}>
                  <div className="flex items-center space-x-3 text-white hover:bg-gray-800 p-2 rounded-lg">
                    <FaTools />
                    <span className={`${isOpen ? "block" : "hidden"} lg:${isOpen ? "block" : "hidden"} lg:flex`}>
                      Controles
                    </span>
                  </div>
                </Link>)}

              {hasModuleAccess("PRODUCTS") && (
                <Link href="/productos" onClick={handleLinkClick}>
                  <div className="flex items-center space-x-3 text-white hover:bg-gray-800 p-2 rounded-lg">
                    <FaBox />
                    <span className={`${isOpen ? "block" : "hidden"} lg:${isOpen ? "block" : "hidden"} lg:flex`}>
                      Productos
                    </span>
                  </div>
                </Link>
              )}


              {hasModuleAccess("PROVIDERS") && (
                <Link href="/proveedores" onClick={handleLinkClick}>
                  <div className="flex items-center space-x-3 text-white hover:bg-gray-800 p-2 rounded-lg">
                    <FaSellsy />
                    <span className={`${isOpen ? "block" : "hidden"} lg:${isOpen ? "block" : "hidden"} lg:flex`}>
                      Proveedores
                    </span>
                  </div>
                </Link>)}

              {hasModuleAccess("ORDERS") && (
                <Link href="/ordenesdecompra" onClick={handleLinkClick}>
                  <div className="flex items-center space-x-3 text-white hover:bg-gray-800 p-2 rounded-lg">
                    <FaFileAlt />
                    <span className={`${isOpen ? "block" : "hidden"} lg:${isOpen ? "block" : "hidden"} lg:flex`}>
                      Órdenes
                    </span>
                  </div>
                </Link>
              )}

              {hasModuleAccess("ANALYTICS") && (
                <Link href="/analiticas" onClick={handleLinkClick}>
                  <div className="flex items-center space-x-3 text-white hover:bg-gray-800 p-2 rounded-lg">
                    <IoAnalytics />
                    <span className={`${isOpen ? "block" : "hidden"} lg:${isOpen ? "block" : "hidden"} lg:flex`}>
                      Analíticas
                    </span>
                  </div>
                </Link>
              )}

              {hasRole("ADMIN") && (
                <Link href="/empresas" onClick={handleLinkClick}>
                  <div className="flex items-center space-x-3 text-white hover:bg-gray-800 p-2 rounded-lg">
                    <MdBusinessCenter />
                    <span className={`${isOpen ? "block" : "hidden"} lg:${isOpen ? "block" : "hidden"} lg:flex`}>
                      Empresas
                    </span>
                  </div>
                </Link>)}

              {hasModuleAccess("USERS") && (
                <Link href="/usuarios" onClick={handleLinkClick}>
                  <div className="flex items-center space-x-3 text-white hover:bg-gray-800 p-2 rounded-lg">
                    <FaUsers />
                    <span className={`${isOpen ? "block" : "hidden"} lg:${isOpen ? "block" : "hidden"} lg:flex`}>
                      Usuarios
                    </span>
                  </div>
                </Link>)}


              {/* LECTOR DE QR HABILITADO PARA TODOS LOS USUARIOS */}
              {/* Botón "ScanQR" */}

              {(hasRole("OPERATOR") || hasRole("CUSTOMER") || hasRole("SUPERVISOR")) && (
                  <div
                      onClick={handleScanQR}
                      className="flex items-center space-x-3 text-white hover:bg-gray-800 p-2 rounded-lg cursor-pointer"
                  >
                    <IoMdQrScanner/>
                    <span className={`${isOpen ? "block" : "hidden"} lg:${isOpen ? "block" : "hidden"} lg:flex`}>
                      ScanQR
                    </span>
                  </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
