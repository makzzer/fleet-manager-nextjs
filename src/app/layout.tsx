'use client'
import React from "react";
//import type { Metadata } from "next";
//import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Navbar2 from "./components/Navbar2";
import "./globals.css";
import { useState } from "react";

import { Providers } from "../app/providers";

import { usePathname } from "next/navigation";

{/*
export const metadata: Metadata = {
  title: "Fleet Manager",
  description: "Aplicacion gestion de vehiculos",
};
*/}

const Layout = ({ children }: { children: React.ReactNode }) => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = (isOpen: boolean) => {
    setIsSidebarOpen(isOpen);
  };

  const pathname = usePathname();
  const isLandingPage = pathname === '/home'

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-800  text-white flex flex-col">
        <Providers>
          {/* Sidebar fija en pantallas grandes y pequeñas */}


          {/* Contenido principal */}




            {!isLandingPage
            ? (
              <>
              <div className="flex-grow flex flex-col min-h-screen">
              <Navbar2 />
            <div className="fixed z-50 md:mt-20">
              <Sidebar onToggleSidebar={handleSidebarToggle} />
            </div>

            <div
              className={`flex-grow flex flex-col min-h-screen transition-all duration-500 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
                }`}
            >

              <div>
                <main className="flex-grow  transition-all duration-500 mt-10 container mx-auto p-4">
                  {children}
                </main>

              </div>

            </div>
            <Footer />
          </div>
            </>
            )
          : (
            <div className="relative">
                <main className="flex-grow  transition-all duration-500 antialiased">
                  {children}
                </main>

              </div>
          )}

        </Providers>
      </body>
    </html>
  );
};

export default Layout;
