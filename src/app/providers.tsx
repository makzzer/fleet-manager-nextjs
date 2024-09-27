// src/app/providers.tsx
import React from "react";
import { VehiculoProvider } from "./context/VehiculoContext";
import { ProveedorProvider } from "./context/ProveedorContext";
import { ProductoProvider } from "./context/ProductoContext";
import { OrdenDeCompraProvider } from "./context/OrdenesCompraContext";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
  <OrdenDeCompraProvider>
    <ProductoProvider>
      <ProveedorProvider>
        <VehiculoProvider>
          {children}
        </VehiculoProvider>
      </ProveedorProvider>
    </ProductoProvider>
  </OrdenDeCompraProvider>
  );
};
