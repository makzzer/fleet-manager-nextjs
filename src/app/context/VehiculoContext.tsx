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
import * as XLSX from 'xlsx';

const apiVehiculosBackend = `https://fleet-manager-gzui.onrender.com/api/vehicles`;

interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Vehiculo {
  id: string;
  status: string;
  model: string;
  brand: string;
  year: number;
  coordinates: Coordinates;
  date_created: string;
  date_updated: string;
  fuel_type : string,
  fuel_comsumption : number,
  type : string,
  max_load : number,
  has_trailer : boolean,
}

interface VehiculoContextProps {
  vehiculos: Vehiculo[];
  fetchVehiculos: () => void;
  createVehiculo: (
    vehiculo: Omit<Vehiculo, "date_created" | "date_updated" >
  ) => Promise<{ resultado: boolean, mensaje?: string }>;
  modifyVehiculo: (
    vehiculoEditado: Omit<Vehiculo, "date_created" | "date_updated">
  ) => Promise<void>;
  deleteVehiculo: (vehiculoEliminado: Vehiculo) => Promise<void>;
  enableVehiculo: (id: string) => Promise<void>;
  exportVehiculosToExcel: () => void;
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

const typeOptions = ['Camión', 'Auto', 'Barco'];
const fuelOptions = ['Gasoil', 'Eléctrico'];


const getRandomType = () => {
  const valorRandom = Math.floor(Math.random() * typeOptions.length);
  return typeOptions[valorRandom];
}

const getRandomFuel = () => {
  const valorRandom = Math.floor(Math.random() * fuelOptions.length);
  return fuelOptions[valorRandom];
}

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
            type: item.type,
            fuel_type : item.fuel_type,
            fuel_comsumption : item.fuel_comsumption,
            max_load : item.max_load,
            has_trailer : item.has_trailer,
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
  ): Promise<{ resultado: boolean, mensaje?: string}> => {
    try {
      await axios.post(apiVehiculosBackend, vehiculo);
      fetchVehiculos();
      return { resultado: true };
    } catch (error) {
      if(axios.isAxiosError(error)){
        return { resultado: false, mensaje: error.response?.data.message};
      }
      console.error("Error creating vehiculo:", error);
      return { resultado: false, mensaje: "Ha ocurrido un error al crear el vehiculo."}
    }
  };

  const modifyVehiculo = async (
    vehiculoEditado: Omit<Vehiculo, "date_created" | "date_updated">
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

  const deleteVehiculo = async (vehiculoEliminado: Vehiculo) => {
    try {
      // Realiza DELETE para deshabilitar el vehículo en el backend
      await axios.delete(`${apiVehiculosBackend}/${vehiculoEliminado.id}`);
      
      // Actualiza el estado localmente
      setVehiculos((prevVehiculos) =>
        prevVehiculos.map((vehiculo) =>
          vehiculo.id === vehiculoEliminado.id ? { ...vehiculo, status: "UNAVAILABLE" } : vehiculo
        )
      );
      
      console.log(`Vehículo con ID ${vehiculoEliminado.id} ha sido deshabilitado.`);
    } catch (error) {
      console.error("Error deshabilitando vehículo en el backend:", error);
    }
  };

  const enableVehiculo = async (id: string) => {
    try {
      await axios.put(`${apiVehiculosBackend}/${id}`, { status: "AVAILABLE" });
      
      // Actualiza el estado localmente
      setVehiculos((prevVehiculos) =>
        prevVehiculos.map((vehiculo) =>
          vehiculo.id === id ? { ...vehiculo, status: "AVAILABLE" } : vehiculo
        )
      );
      
      console.log(`Vehículo con ID ${id} ha sido habilitado.`);
    } catch (error) {
      console.error("Error habilitando vehículo en el backend:", error);
    }
  };

  const exportVehiculosToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(vehiculos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vehículos');
    XLSX.writeFile(workbook, 'vehiculos.xlsx');
  };
  
  
  useEffect(() => {
    fetchVehiculos();
  }, [fetchVehiculos]);

  return (
    <VehiculoContext.Provider
      value={{ vehiculos, fetchVehiculos, createVehiculo, modifyVehiculo, deleteVehiculo, enableVehiculo, exportVehiculosToExcel, }}
    >
      {children}
    </VehiculoContext.Provider>
  );
};
