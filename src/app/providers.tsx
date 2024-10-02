'use client'
import React from "react";
import { VehiculoProvider } from "./context/VehiculoContext";
import { ProveedorProvider } from "./context/ProveedorContext";
import { ProductoProvider } from "./context/ProductoContext";
import { OrdenDeCompraProvider } from "./context/OrdenesCompraContext";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { AnalyticsProvider } from "./context/AnalyticsContext";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AnalyticsProvider>
      <OrdenDeCompraProvider>
        <ProductoProvider>
          <ProveedorProvider>
            <VehiculoProvider>
              <AuthProvider>
                <UserProvider>{children}</UserProvider>
              </AuthProvider>
            </VehiculoProvider>
          </ProveedorProvider>
        </ProductoProvider>
      </OrdenDeCompraProvider>
    </AnalyticsProvider>
  );
};
