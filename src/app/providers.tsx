// src/app/providers.tsx
import React from "react";
import { VehiculoProvider } from "./context/VehiculoContext";
import { ProveedorProvider } from "./context/ProveedorContext";
import { ProductoProvider } from "./context/ProductoContext";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProductoProvider>
      <ProveedorProvider>
        <VehiculoProvider>
          {children}
        </VehiculoProvider>
      </ProveedorProvider>
    </ProductoProvider>
  );
};
