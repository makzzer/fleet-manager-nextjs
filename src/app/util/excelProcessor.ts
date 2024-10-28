import * as XLSX from 'xlsx'
import Papa from 'papaparse';

export interface FormatedVehiculo {
  id: string;
  status: string;
  model: string;
  brand: string;
  year: number;
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
  latitude: number;
  longitude: number;
}


export const processFile = (file: File): Promise<FormatedVehiculo[]> => {
  return new Promise((resolve, reject) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase()

    //Arreglar lectura de csv
    if (fileExtension === 'csv') {
      Papa.parse(file, {
        complete: (results) => {
          const jsonData = results.data as FormatedVehiculo[]
          resolve(jsonData)
        },
        header: true,
        dynamicTyping: true,
        error: (error) => {
          reject(error)
        }
      })
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as FormatedVehiculo[]
          resolve(jsonData)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = (error) => reject(error)
      reader.readAsArrayBuffer(file)
    } else {
      reject(new Error('Formato de archivo no soportado'))
    }
  })
}

export const generateExcelTemplate = () => {
  const template = [
    {
      id: 'AAA000',
      status: 'AVAILABLE',
      brand: 'Marca Ejemplo',
      model: 'Modelo Ejemplo',
      year: 2023,
      fuel_type: 'NAPHTHA',
      fuel_consumption: 10,
      type: 'CAR',
      load: 500,
      has_trailer: false,
      color: 'Rojo',
      fuel_measurement: 'LITER',
      cant_axles: 2,
      cant_seats: 5,
      latitude: 0,
      longitude: 0
    }
  ]

  const worksheet = XLSX.utils.json_to_sheet(template)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Plantilla Vehículos')
  XLSX.writeFile(workbook, 'plantilla_vehiculos.xlsx')
}