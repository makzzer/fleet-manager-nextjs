// src/app/providers.tsx
import React from 'react';
import { VehiculoProvider } from './context/VehiculoContext';

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <VehiculoProvider>
            {children}
        </VehiculoProvider>
    );
};