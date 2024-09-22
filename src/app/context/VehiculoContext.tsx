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
  createVehiculo: (vehiculo: Omit<Vehiculo, 'date_created' | 'date_updated'>) => Promise<void>;
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

      // Aquí accedemos directamente al array de vehículos, ya que no existe el campo `data`
      const fetchedVehiculosData = response.data;

      if (Array.isArray(fetchedVehiculosData)) {
        const fetchedVehiculos: Vehiculo[] = fetchedVehiculosData.map((item: Vehiculo) => ({
          id: item.id,
          status: item.status,
          model: item.model,
          brand: item.brand,
          year: item.year,
          coordinates: {
            latitude: item.coordinates.latitude,
            longitude: item.coordinates.longitude,
          },
          date_created: item.date_created,
          date_updated: item.date_updated,
        }));

        setVehiculos(fetchedVehiculos);
      } else {
        console.error('Error: La respuesta de la API no es un array válido', fetchedVehiculosData);
      }
    } catch (error) {
      console.error('Error fetching vehiculos:', error);
    }
  }, []);
  
  const createVehiculo = async (vehiculo: Omit<Vehiculo, 'date_created' | 'date_updated'>) => {
    try {
      const response = await axios.post(apiVehiculosBackend, vehiculo);
      fetchVehiculos();
    } catch (error) {
      console.error('Error creating vehiculo:', error);
    }
  };

  useEffect(() => {
    fetchVehiculos();
  }, [fetchVehiculos]);

  return (
    <VehiculoContext.Provider value={{ vehiculos, fetchVehiculos, createVehiculo }}>
      {children}
    </VehiculoContext.Provider>
  );
};
