"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";

const apiVehiculosBackend = `https://fleet-manager-gzui.onrender.com/api/vehicles`;

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Vehiculo {
  id: string;
  status: boolean;
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
  createVehiculo: (
    vehiculo: Omit<Vehiculo, "date_created" | "date_updated">
  ) => Promise<void>;
  modifyVehiculo: (
    vehiculoEditado: Omit<
      Vehiculo,
      "coordinates" | "date_created" | "date_updated"
    >
  ) => Promise<void>;
  updateVehiculo: (
    vehiculoActualizado: Omit<
      Vehiculo,
      "Coordinates" | "date_created" | "date_updated"
    >
  ) => Promise<void>;
}

const VehiculoContext = createContext<VehiculoContextProps | undefined>(
  undefined
);

export const useVehiculo = () => {
  const context = useContext(VehiculoContext);
  if (!context) {
    throw new Error("useVehiculo debe ser usado dentro de VehiculoProvider");
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
        const fetchedVehiculos: Vehiculo[] = fetchedVehiculosData.map(
          (item: Vehiculo) => ({
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
          })
        );

        setVehiculos(fetchedVehiculos);
      } else {
        console.error(
          "Error: La respuesta de la API no es un array válido",
          fetchedVehiculosData
        );
      }
    } catch (error) {
      console.error("Error fetching vehiculos:", error);
    }
  }, []);

  const createVehiculo = async (
    vehiculo: Omit<Vehiculo, "date_created" | "date_updated">
  ) => {
    try {
      await axios.post(apiVehiculosBackend, vehiculo);
      fetchVehiculos();
    } catch (error) {
      console.error("Error creating vehiculo:", error);
    }
  };

  const modifyVehiculo = async (
    vehiculoEditado: Omit<Vehiculo, "coordinates" | "date_created" | "date_updated">
  ) => {
    try {
      // Realiza la solicitud PUT para modificar el vehículo en el backend
      await axios.put(`${apiVehiculosBackend}/${vehiculoEditado.id}`, vehiculoEditado);
  
      // Actualiza localmente los datos si la respuesta es exitosa
      setVehiculos((prevVehiculos) =>
        prevVehiculos.map((vehiculo) =>
          vehiculo.id === vehiculoEditado.id
            ? { ...vehiculo, ...vehiculoEditado }
            : vehiculo
        )
      );
  
      console.log(`El Vehículo con ID ${vehiculoEditado.id} ha sido editado en el backend.`);
    } catch (error) {
      console.error("Error editando vehículo en el backend:", error);
    }
  };  

  const updateVehiculo = async (
    vehiculoActualizado: Omit<
    Vehiculo, 
    "coordinates" | "date_created" | "date_updated"
    >
  ) => {
    try {
      setVehiculos((prevVehiculos) =>
        prevVehiculos.map((vehiculo) =>
          vehiculo.id === vehiculoActualizado.id
            ? { ...vehiculo, ...vehiculoActualizado }
            : vehiculo
        )
      );

      console.log(`El Vehículo con ID ${vehiculoActualizado.id} ha sido actualizado.`);
    } catch (error) {
      console.error("Error actualizando vehículo:", error);
    }
  };

  useEffect(() => {
    fetchVehiculos();
  }, [fetchVehiculos]);

  return (
    <VehiculoContext.Provider
      value={{ vehiculos, fetchVehiculos, createVehiculo, modifyVehiculo, updateVehiculo }}
    >
      {children}
    </VehiculoContext.Provider>
  );
};
