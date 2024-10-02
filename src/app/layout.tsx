import React from "react";
import type { Metadata } from "next";
//import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Navbar2 from "./components/Navbar2";
import "./globals.css";

import { Providers } from "../app/providers";

export const metadata: Metadata = {
  title: "Fleet Manager",
  description: "Aplicacion gestion de vehiculos",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-800 text-white flex">
        <Providers>
          {/* Sidebar fija en pantallas grandes y pequeñas */}


          {/* Contenido principal */}
          <div className="flex-grow flex flex-col min-h-screen">
            <Navbar2 />



            <div className="fixed z-50 md:mt-20">
              <Sidebar />
            </div>



            <div>
              <main className="flex-grow transition-all duration-500 container mx-auto p-4">
                {children}
              </main>
            </div>
            <Footer />
          </div>

        </Providers>
      </body>
    </html>
  );
};

export default Layout;
