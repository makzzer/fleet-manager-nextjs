import * as XLSX from "xlsx";
import Papa from "papaparse";

export interface FormatedVehiculo {
  id: string;
  status: string;
  model: string;
  brand: string;
  year: number;
  date_created: string;
  date_updated: string;
  fuel_type: string;
  fuel_consumption: number;
  type: string;
  load: number;
  has_trailer: boolean;
  color: string;
  fuel_measurement: string;
  cant_axles: number;
  cant_seats: number;
  latitude: number;
  longitude: number;
}

export interface FormatedProveedor {
  name: string;
  email: string;
  cuit: string;
  phone_number: string;
  address: string;
}

export interface FormatedProducto {
  // name: string;
  // brand: string;
  // description: string;
  // category: string;
  // quantity: number;
  // measurement: string;
  // price: number;
  // provider_id: string;
  // min_stock: number;

  id: string;
  name: string;
  brand: string;
  description: string;
  category: string;
  quantity: number;
  measurement: string;
  price: number;
  providerId: string;
  minStock: number;
  autoPurchase: string;
  enterpriseId: string;
}

export const processVehicleFile = (file: File): Promise<FormatedVehiculo[]> => {
  return new Promise((resolve, reject) => {
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    //Arreglar lectura de csv
    if (fileExtension === "csv") {
      Papa.parse(file, {
        complete: (results) => {
          const jsonData = results.data as FormatedVehiculo[];
          resolve(jsonData);
        },
        header: true,
        dynamicTyping: true,
        error: (error) => {
          reject(error);
        },
      });
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(
            worksheet
          ) as FormatedVehiculo[];
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error("Formato de archivo no soportado"));
    }
  });
};

export const processProviderFile = (
  file: File
): Promise<FormatedProveedor[]> => {
  return new Promise((resolve, reject) => {
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    //Arreglar lectura de csv
    if (fileExtension === "csv") {
      Papa.parse(file, {
        complete: (results) => {
          const jsonData = results.data as FormatedProveedor[];
          resolve(jsonData);
        },
        header: true,
        dynamicTyping: true,
        error: (error) => {
          reject(error);
        },
      });
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(
            worksheet
          ) as FormatedProveedor[];
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error("Formato de archivo no soportado"));
    }
  });
};

export const processProductFile = (file: File): Promise<FormatedProducto[]> => {
  return new Promise((resolve, reject) => {
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    //Arreglar lectura de csv
    if (fileExtension === "csv") {
      Papa.parse(file, {
        complete: (results) => {
          const jsonData = results.data as FormatedProducto[];
          resolve(jsonData);
        },
        header: true,
        dynamicTyping: true,
        error: (error) => {
          reject(error);
        },
      });
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(
            worksheet
          ) as FormatedProducto[];
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error("Formato de archivo no soportado"));
    }
  });
};

export const generateExcelVehicleTemplate = () => {
  const template = [
    {
      id: "AAA000",
      status: "AVAILABLE",
      brand: "Marca Ejemplo",
      model: "Modelo Ejemplo",
      year: 2023,
      fuel_type: "NAPHTHA",
      fuel_consumption: 10,
      type: "CAR",
      load: 500,
      has_trailer: false,
      color: "Rojo",
      fuel_measurement: "LITER",
      cant_axles: 2,
      cant_seats: 5,
      latitude: 0,
      longitude: 0,
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(template);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Plantilla Vehículos");
  XLSX.writeFile(workbook, "plantilla_vehiculos.xlsx");
};

export const generateExcelProviderTemplate = () => {
  const template = [
    {
      name: "Proveedor",
      email: "Provedor@gmail.com",
      cuit: "27-44444333-7",
      phone_number: "118945623",
      address: "Av. Presidente Peron 1122",
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(template);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Plantilla Proveedores");
  XLSX.writeFile(workbook, "plantilla_proveedores.xlsx");
};

export const generateExcelProductTemplate = () => {
  const template = [
    {
      name: "Producto",
      brand: "marca",
      description: "Descripcion del producto",
      category: "categoria",
      quantity: "0",
      measurement: "medida",
      price: "0",
      provider_id: "ID_proveedor",
      min_stock: "0",
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(template);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Plantilla Productos");
  XLSX.writeFile(workbook, "plantilla_productos.xlsx");
};
