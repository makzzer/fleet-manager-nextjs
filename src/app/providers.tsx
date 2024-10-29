"use client";
import React from "react";
import { VehiculoProvider } from "./context/VehiculoContext";
import { ProveedorProvider } from "./context/ProveedorContext";
import { ProductoProvider } from "./context/ProductoContext";
import { OrdenDeCompraProvider } from "./context/OrdenesCompraContext";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { AnalyticsProvider } from "./context/AnalyticsContext";
import { ControlProvider } from "./context/ControlContext";
import { ReservaProvider } from "./context/ReservesContext";
import { AlertProvider } from "./context/AlertsContext";
import { EnterpriseProvider } from "./context/EnterpriseContext";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AnalyticsProvider>
      <EnterpriseProvider>
        <ControlProvider>
          <OrdenDeCompraProvider>
            <ProductoProvider>
              <ProveedorProvider>
                <VehiculoProvider>
                  <AuthProvider>
                    <ReservaProvider>
                      <UserProvider>
                        <AlertProvider>{children}</AlertProvider>
                      </UserProvider>
                    </ReservaProvider>
                  </AuthProvider>
                </VehiculoProvider>
              </ProveedorProvider>
            </ProductoProvider>
          </OrdenDeCompraProvider>
        </ControlProvider>
      </EnterpriseProvider>
    </AnalyticsProvider>
  );
};
