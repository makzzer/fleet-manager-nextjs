'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0); // Número de notificaciones no leídas
  const menuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { authenticatedUser, logoutUser } = useAuth();

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

  // Simulación de carga de notificaciones
  useEffect(() => {
    // Aquí podrías hacer un fetch para obtener el número de notificaciones no leídas
    setUnreadNotifications(1); // Por ahora, estableceremos un valor fijo para simular
  }, []);

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  return (
    <nav className="bg-gray-900 text-white border-b-2 min-h-[80px] border-gray-800 p-4 sticky z-40 top-0 left-0 w-full shadow-md">
      <div className="container flex justify-between items-center">
        <div className="hidden md:block">
          <div className="flex space-x-4 mt-2 items-center">
            <Link href="/" className="text-3xl ms-20 font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Fleet Manager
            </Link>
          </div>
        </div>
        <div className="ml-auto md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
            style={{ padding: '0', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
          </button>
        </div>
        <div className="flex items-center md:absolute md:pt-4 md:right-10 space-x-4">
          {authenticatedUser && (
            <>
              {/* Icono de la campanita con el indicador de notificación */}
              <Link href="/alertas">
                <div className="relative">
                  <button className="relative focus:outline-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-200 hover:text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </button>
                  {unreadNotifications > 0 && (
                    <span className="absolute top-0 right-0 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  )}
                </div>
              </Link>

              {/* Menú de perfil */}
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
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-500"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
