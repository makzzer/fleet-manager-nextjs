// src/app/providers.tsx
import React from 'react';
import { VehiculoProvider } from './context/VehiculoContext';
import { ProveedorProvider } from './context/ProveedorContext';

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <ProveedorProvider>
            <VehiculoProvider>
                {children}
            </VehiculoProvider>
        </ProveedorProvider>
    );
};