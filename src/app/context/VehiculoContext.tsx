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
import { useApi } from "./ApiContext";

const apiVehiculosBackend = `/vehicles`;

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
  fuel_consumption : number,
  type : string,
  load : number,
  has_trailer : boolean,
  color : string,
  fuel_measurement : string,
  cant_axles : number,
  cant_seats : number,
}

export const tiposCombustible: { [key: string]: string } = {
    "NAPHTHA": "Nafta",
    "DIESEL": "Diesel",
    "GAS": "Gas",
    "ELECTRIC": "Electrico"
};

export const unidadesCombustible: { [key: string]: string } = {
  "LITER": "Litros",
  "GALON": "Galones"
};

export const estadosVehiculo: { [key: string]: string } = {
  "AVAILABLE": "Disponible",
  "RESERVED": "Reservado",
  "MAINTENANCE": "Mantenimiento",
  "UNAVAILABLE": "No disponible"
};

export const tiposVehiculo: { [key: string]: string } = {
  "TRUCK": "Camion",
  "CAR": "Auto",
  "MOTORCYCLE": "Moto",
  "VAN": "Utilitario"
};

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
  updateVehicleCoordinates: (vehicleId: string, newCoordinates: Coordinates) => Promise<void>; // Agregamos esta línea
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
  const api = useApi();

  const fetchVehiculos = useCallback(async () => {
    try {
      const response = await api.get(apiVehiculosBackend);
      if (Array.isArray(response.data)) {
        const fetchedVehiculos: Vehiculo[] = response.data;

        setVehiculos(fetchedVehiculos);
      } else {
        console.error(
          "Error: La respuesta de la API no es un array válido",
          response.data
        );
      }
    } catch (error) {
      console.error("Error fetching vehiculos:", error);
    }
  }, [api]);

  const createVehiculo = async (
    vehiculo: Omit<Vehiculo, "date_created" | "date_updated">
  ): Promise<{ resultado: boolean, mensaje?: string}> => {
    try {
      console.log("Vahiculo a crear: ", vehiculo);
      await api.post(apiVehiculosBackend, vehiculo);
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

  const updateVehicleCoordinates = async (vehicleId: string, newCoordinates: Coordinates) => {
    try {
      await api.put(`${apiVehiculosBackend}/${vehicleId}`, { coordinates: newCoordinates });
      
      // Actualiza el estado localmente
      setVehiculos((prevVehiculos) =>
        prevVehiculos.map((vehiculo) =>
          vehiculo.id === vehicleId ? { ...vehiculo, coordinates: newCoordinates } : vehiculo
        )
      );

      console.log(`Vehículo con ID ${vehicleId} ha actualizado sus coordenadas.`);
    } catch (error) {
      console.error("Error al actualizar las coordenadas del vehículo:", error);
    }
  };


  const modifyVehiculo = async (
    vehiculoEditado: Omit<Vehiculo, "date_created" | "date_updated">
  ) => {
    try {
      console.log("Vahiculo a modificar: ", vehiculoEditado);
      // Realiza la solicitud PUT para modificar el vehículo en el backend
      await api.put(`${apiVehiculosBackend}/${vehiculoEditado.id}`, vehiculoEditado);
  
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
      await api.delete(`${apiVehiculosBackend}/${vehiculoEliminado.id}`);
      
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
      await api.put(`${apiVehiculosBackend}/${id}`, { status: "AVAILABLE" });
      
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
      value={{ vehiculos, fetchVehiculos, createVehiculo, updateVehicleCoordinates, modifyVehiculo, deleteVehiculo, enableVehiculo, exportVehiculosToExcel, }}
    >
      {children}
    </VehiculoContext.Provider>
  );
};
