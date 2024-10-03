'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { authenticatedUser, logoutUser } = useAuth(); // Usamos el contexto para saber si el usuario está autenticado





  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const closeProfileMenu = () => {
    setProfileMenuOpen(false);
  };

  // Manejar clic fuera del menú o perfil
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        closeProfileMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    logoutUser(); // Cerrar sesión
    router.push("/login"); // Redirigir al login
  };

  return (
    <nav className="bg-gray-900 text-white border-b-2 min-h-[80px] border-gray-800 p-4 sticky z-30 top-0 left-0 w-full shadow-md ">
      <div className="container  flex justify-between items-center">
        <div className="hidden md:block">
          <div className="flex space-x-4 mt-2 items-center">
            <Link href="/" className="text-3xl ms-20 font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Fleet Manager
            </Link>

          </div>
        </div>
        <div className="ms-auto md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
            style={{ padding: '0', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} // Aumentar el área de clic y centrar el contenido
          >

          </button>
        </div>
        <div className="flex items-center">
          {authenticatedUser && (
            <div ref={profileMenuRef} className="relative">
              <button onClick={toggleProfileMenu} className="focus:outline-none">
                <Image
                  src="/ironman.jpg"
                  width={20}
                  height={20}
                  alt="User Profile"
                  className="w-8 h-8 rounded-full md:w-10 md:h-10"
                />
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 mt-0 w-48 bg-gray-600 rounded-md shadow-lg py-1">
                  {/*} <Link href="/perfil" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-500">
                    Perfil
                  </Link>*/}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-500"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </nav>
  );
};

export default Navbar;