import React from "react";
import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import './globals.css';

//importo el vehiculoProvider acá
import { VehiculoProvider } from "./context/VehiculoContext";


export const metadata: Metadata = {
  title: "Fleet Manager",
  description: "Aplicacion gestion de vehiculos",
};


const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <VehiculoProvider>
        <body className="min-h-screen bg-gray-800 text-white flex flex-col">
          <Navbar />
          <main className="mt-20 flex-grow transition-all duration-500 container mx-auto p-4">
            {children}
          </main>
          <Footer />
        </body>
      </VehiculoProvider>
    </html>
  )
}

export default Layout;

