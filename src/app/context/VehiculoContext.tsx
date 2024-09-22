'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import axios from 'axios';

const apiVehiculosBackend = `https://fleet-manager-gzui.onrender.com/api/vehicles`;

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Vehiculo {
  id: string;
  status: string;
  model: string;
  brand: string;
  year: number;
  coordinates: Coordinates;
  date_created: string;
  date_updated: string;
}

interface VehiculoContextProps {
  vehiculos: Vehiculo[];
  fetchVehiculos: () => void;
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

  const fetchVehiculos = useCallback(async () => {
    try {
      const response = await axios.get(apiVehiculosBackend);
      const fetchedVehiculosData = response.data.data;

      const fetchedVehiculos: Vehiculo[] = fetchedVehiculosData.map((item: any) => ({
        id: item.id,
        status: item.attributes.status,
        model: item.attributes.model,
        brand: item.attributes.brand,
        year: item.attributes.year,
        coordinates: {
          latitude: item.attributes.coordinates.latitude,
          longitude: item.attributes.coordinates.longitude,
        },
        date_created: item.attributes.date_created,
        date_updated: item.attributes.date_updated,
      }));

      setVehiculos(fetchedVehiculos);
    } catch (error) {
      console.error('Error fetching vehiculos:', error);
    }
  }, []); // El hook useCallback asegura que la referencia a fetchVehiculos no cambie en cada render.

  useEffect(() => {
    fetchVehiculos();
  }, [fetchVehiculos]);

  return (
    <VehiculoContext.Provider value={{ vehiculos, fetchVehiculos }}>
      {children}
    </VehiculoContext.Provider>
  );
};
