'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

const apiVehiculosBackend = `https://${process.env.NEXT_PUBLIC_HTTPS_HOSTING_DONWEB}/api/proveedores?populate=*`;

interface Vehiculo {
    marca: string,
    modelo: string,
    año: number,
    color?: string,
}

interface VehiculoContextProps {
    vehiculos: Vehiculo[];
    fetchVehiculo: () => void;
}

const VehiculoContext = createContext<VehiculoContextProps | undefined>(undefined);

export const useVehiculo = () => {
    const context = useContext(VehiculoContext);
    if (!context) {
        throw new Error('useVehiculo debe ser usado dentro de VehiculoProvider');
    }
    return context;
};

export const VehiculoProvider = ({ children }: { children: ReactNode }) => {
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);


    const fetchVehiculos = async () => {
        try {
            const response = await axios.get(apiVehiculosBackend);
            const fetchedVehiculos = response.data.data.map((item: any) => ({
                marca: item.marca,
                modelo: item.modelo,
                año: item.anio,
                color: item.color,
            }));

            setVehiculos(fetchedVehiculos);

        } catch (error) {
            console.error('Error fetching vehiculos:', error);
        }
    };

    useEffect(() => {
        fetchVehiculos();
    }, []);

    return (
        <VehiculoContext.Provider value={{
            vehiculos, fetchVehiculo() {

            },
        }}>
            {children}
        </VehiculoContext.Provider >
    );
};
