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
  model: string;
  brand: string;
  year: number;
  coordinates: Coordinates;
  date_created: string;
  date_updated: string;
  activo: boolean;
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
            model: item.model,
            brand: item.brand,
            year: item.year,
            coordinates: {
              latitude: item.coordinates.latitude,
              longitude: item.coordinates.longitude,
            },
            date_created: item.date_created,
            date_updated: item.date_updated,
            activo: item.activo,
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
    vehiculoEditado: Omit<
      Vehiculo,
      "coordinates" | "date_created" | "date_updated"
    >
  ) => {
    //Setea localmente los vehiculos modificados, hasta que esté el back
    try {
      setVehiculos((prevVehiculos) =>
        prevVehiculos.map((vehiculo) =>
          vehiculo.id === vehiculoEditado.id
            ? {
                // Modifica internamente el vehiculo sobreescribiendo SOLO los datos
                // que se modificaron
                ...vehiculo,
                ...vehiculoEditado,
              }
            : vehiculo
        )
      );
      console.log(
        `El Vehiculo con ID ${vehiculoEditado.id} ha sido editado localmente.`
      );
    } catch (error) {
      console.error("Error editando vehiculo:", error);
    }

    /*
    try {
      await axios.put(apiVehiculosBackend, vehiculoEditado);
      fetchVehiculos();
    } catch (error) {
      console.error('Error modifying vehiculo:', error);
    }
    */
  };

  useEffect(() => {
    fetchVehiculos();
  }, [fetchVehiculos]);

  return (
    <VehiculoContext.Provider
      value={{ vehiculos, fetchVehiculos, createVehiculo, modifyVehiculo }}
    >
      {children}
    </VehiculoContext.Provider>
  );
};
