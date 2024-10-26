"use client";

import { useVehiculo } from "@/app/context/VehiculoContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaTruck, FaCar, FaMotorcycle } from "react-icons/fa";
import { FaVanShuttle } from "react-icons/fa6";
import Swal from "sweetalert2";

type VehicleType = "TRUCK" | "MOTORCYCLE" | "CAR" | "VAN";
type FuelType = "NAPHTHA" | "DIESEL" | "GAS" | "ELECTRIC";
type FuelMeasurement = "LITER" | "GALON" | "KWH ";
type Coordinates = {
  latitude: number;
  longitude: number;
};

interface VehicleRegisterData {
  id: string;
  status: boolean;
  model: string;
  brand: string;
  year: number;
  type: keyof typeof vehicleOptions;
  color: string;
  fuel_type: FuelType;
  fuel_measurement: FuelMeasurement;
  fuel_consumption: number;
  cant_axles: number;
  cant_seats: number;
  load: number;
  has_trailer: boolean;
  coordinates: Coordinates;
}

const initialVehicleData: VehicleRegisterData = {
  id: "",
  status: true,
  model: "",
  brand: "",
  year: 0,
  type: "TRUCK",
  color: "",
  fuel_type: "NAPHTHA",
  fuel_measurement: "LITER",
  fuel_consumption: 0,
  cant_axles: 0,
  cant_seats: 0,
  load: 0,
  has_trailer: false,
  coordinates: {
    latitude: 0,
    longitude: 0,
  },
};

// Modificar despues por un stepper
const steps = [
  "Información básica",
  "Detalles del vehículo",
  "Características adicionales",
];

// Datos estaticos, hay que cambiarlos si en un futuro se usa alguna api, etc.
const vehicleOptions: Record<VehicleType, {
  brands: string[];
  models: Record<string, string[]>;
  years: number[];
}> = {
  CAR: {
    brands: ['Toyota', 'Ford', 'Chevrolet', 'Honda', 'Volkswagen'],
    models: {
      Toyota: ['Corolla', 'Camry', 'RAV4'],
      Ford: ['Fiesta', 'Focus', 'Mustang'],
      Chevrolet: ['Cruze', 'Malibu', 'Equinox'],
      Honda: ['Civic', 'Accord', 'CR-V'],
      Volkswagen: ['Golf', 'Jetta', 'Passat']
    },
    years: Array.from({length: 30}, (_, i) => new Date().getFullYear() - i)
  },
  MOTORCYCLE: {
    brands: ['Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'Harley-Davidson'],
    models: {
      Honda: ['CBR600RR', 'CB500F', 'Africa Twin'],
      Yamaha: ['YZF-R6', 'MT-07', 'Ténéré 700'],
      Suzuki: ['GSX-R750', 'V-Strom 650', 'SV650'],
      Kawasaki: ['Ninja 650', 'Z900', 'Versys 650'],
      'Harley-Davidson': ['Sportster', 'Street Glide', 'Fat Boy']
    },
    years: Array.from({length: 30}, (_, i) => new Date().getFullYear() - i)
  },
  TRUCK: {
    brands: ['Volvo', 'Scania', 'Mercedes-Benz', 'MAN', 'DAF'],
    models: {
      Volvo: ['FH', 'FM', 'FMX'],
      Scania: ['R Series', 'S Series', 'G Series'],
      'Mercedes-Benz': ['Actros', 'Arocs', 'Atego'],
      MAN: ['TGX', 'TGS', 'TGM'],
      DAF: ['XF', 'CF', 'LF']
    },
    years: Array.from({length: 30}, (_, i) => new Date().getFullYear() - i)
  },
  VAN: {
    brands: ['Mercedes-Benz', 'Ford', 'Volkswagen', 'Renault', 'Fiat'],
    models: {
      'Mercedes-Benz': ['Sprinter', 'Vito', 'Citan'],
      Ford: ['Transit', 'Transit Custom', 'Transit Connect'],
      Volkswagen: ['Crafter', 'Transporter', 'Caddy'],
      Renault: ['Master', 'Trafic', 'Kangoo'],
      Fiat: ['Ducato', 'Talento', 'Doblò']
    },
    years: Array.from({length: 30}, (_, i) => new Date().getFullYear() - i)
  }
}

const fuelConsumptionOptions = {
  CAR: [5, 6, 7, 8, 9, 10],
  MOTORCYCLE: [3, 4, 5, 6],
  VAN: [8, 9, 10, 11, 12],
  TRUCK: [12, 14, 16, 18, 20],
};

const loadCapacityOptions = {
  CAR: [100, 200, 300, 400, 500],
  MOTORCYCLE: [50, 100, 150, 200],
  VAN: [500, 1000, 1500, 2000],
  TRUCK: [5000, 10000, 15000, 20000, 25000],
};

const AddVehicle = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [vehicleData, setVehicleData] =
    useState<VehicleRegisterData>(initialVehicleData);
  const [errors, setErrors] = useState({
    id: "",
    model: "",
    brand: "",
    year: "",
    type: "",
    color: "",
    fuel_type: "",
    fuel_measurement: "",
    fuel_consumption: "",
    cant_axles: "",
    cant_seats: "",
    load: "",
    has_trailer: "",
  });

  const { createVehiculo } = useVehiculo();

  const validateStep = (step: number): boolean => {
    const newErrors = {
      id: "",
      model: "",
      brand: "",
      year: "",
      type: "",
      color: "",
      fuel_type: "",
      fuel_measurement: "",
      fuel_consumption: "",
      cant_axles: "",
      cant_seats: "",
      load: "",
      has_trailer: "",
    };

    switch (step) {
      case 0:
        if (!vehicleData.id) newErrors.id = "La patente es requerida";
        if (!vehicleData.type)
          newErrors.type = "El tipo de vehículo es requerido";
        if (!vehicleData.brand) newErrors.brand = "La marca es requerida";
        if (!vehicleData.model) newErrors.model = "El modelo es requerido";
        if (!vehicleData.year) newErrors.year = "El año es requerido";
        if (!vehicleData.color) newErrors.color = "El color es requerido";
        break;
      case 1:
        if (!vehicleData.fuel_type)
          newErrors.fuel_type = "El tipo de combustible es requerido";
        if (
          vehicleData.fuel_type !== "ELECTRIC" &&
          !vehicleData.fuel_measurement
        ) {
          newErrors.fuel_measurement =
            "La medición de combustible es requerida";
        }
        if (
          vehicleData.fuel_consumption <= 0 ||
          !vehicleData.fuel_consumption
        ) {
          newErrors.fuel_consumption = "El consumo debe ser mayor que 0";
        }
        break;
      case 2:
        if (vehicleData.cant_seats <= 0)
          newErrors.cant_seats = "La cantidad de asientos debe ser mayor que 0";
        if (
          vehicleData.type !== "CAR" &&
          vehicleData.type !== "MOTORCYCLE" &&
          vehicleData.cant_axles <= 0
        ) {
          newErrors.cant_axles = "La cantidad de ejes debe ser mayor que 0";
        }
        if (vehicleData.load < 0)
          newErrors.load = "La capacidad de carga no puede ser negativa";
        break;
    }
    setErrors(newErrors);
    return !Object.values(newErrors).some((val) => val.length > 0);
  };

  // Función para pasar al siguiente paso del formulario
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep((step) => step + 1);
      }
    }
  };

  // Función para volver un paso atras en el formulario
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

  // Cada vez que se cambie un input, se ejecuta esta función para setear la data del vehiculo
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setVehicleData((prev) => ({ ...prev, [name]: value }));
  };

  // Cada vez que se cambia el tipo del vehículo, se reinician ciertos datos y se setean por default algunos otros
  const handleVehicleTypeChange = (type: VehicleType) => {
    setVehicleData((prev) => ({
      ...prev,
      type,
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      cant_axles: type === "CAR" || type === "MOTORCYCLE" ? 2 : 0,
      has_trailer: type === "TRUCK",
    }));
  };

  const resetForm = () => {
    setVehicleData(initialVehicleData);
    setCurrentStep(0);
  };

  // Función que se ejecuta para mandar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    if (validateStep(currentStep)) {
      e.preventDefault();
      try {
        const formatedNewVehicle = {
          id: vehicleData.id,
          type: vehicleData.type,
          brand: vehicleData.brand,
          model: vehicleData.model,
          year: vehicleData.year as number,
          color: vehicleData.color,
          fuel_type: vehicleData.fuel_type,
          fuel_measurement: vehicleData.fuel_measurement,
          fuel_consumption: vehicleData.fuel_consumption as number,
          cant_seats: vehicleData.cant_seats as number,
          cant_axles: vehicleData.cant_axles as number,
          load: vehicleData.load as number,
          has_trailer: vehicleData.has_trailer,
          status: vehicleData.status ? "AVAILABLE" : "UNAVAILABLE",
          coordinates: {
            latitude: 0,
            longitude: 0,
          },
        };

        const { resultado, mensaje } = await createVehiculo(formatedNewVehicle);

        if (resultado) {
          Swal.fire({
            title: "Vehículo agregado con éxito",
            text: "¿Desea agregar otro vehículo?",
            icon: "success",
            showCancelButton: true,
            confirmButtonText: "Sí, agregar otro",
            cancelButtonText: "No, volver a la lista",
          }).then((result) => {
            if (result.isConfirmed) {
              resetForm();
            } else {
              router.push("/vehiculos");
            }
          });
        } else {
          throw new Error(mensaje || "Error desconocido al crear el vehículo");
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text:
            error instanceof Error
              ? error.message
              : "Ha ocurrido un error al crear el vehículo.",
          icon: "error",
          confirmButtonText: "Volver a la lista de vehículos",
        }).then(() => {
          router.push("/vehiculos");
        });
      }
    }
  };

  // Función para formatear "en tiempo real" las patentes
  const formatPatente = (input: string) => {
    input = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (input.length <= 6) {
      // Formato AAA-123
      return input.replace(/^([A-Z]{3})(\d{0,3}).*/, (_, letters, numbers) => {
        return numbers ? `${letters}-${numbers}` : letters;
      });
    } else {
      // Formato AA-123-BB
      return input.replace(
        /^([A-Z]{2})(\d{0,3})([A-Z]{0,2}).*/,
        (_, letters, numbers, endLetters) => {
          return numbers
            ? `${letters}-${numbers}-${endLetters}`
            : `${letters}${numbers}${endLetters}`;
        }
      );
    }
  };

  // Función para mandar la patente formateada a la data del vehiculo que se está registrando
  const handlePatenteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPatente(e.target.value);
    setVehicleData((prev) => ({ ...prev, id: formatted }));
  };

  // UseEffect para que cada vez que se cambie la marca del auto, se reinicien los campos de modelo y año
  useEffect(() => {
    setVehicleData((prev) => ({ ...prev, model: "", year: 0 }));
  }, [vehicleData.brand]);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen rounded-lg text-white flex justify-center items-center">
      <form className="max-w-lg w-full flex flex-col justify-between bg-gray-800 p-8 rounded-2xl shadow-2xl transition-all duration-500 ease-in-out transform hover:scale-[1.01]">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-500">
            {steps[currentStep]}
          </h2>
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="id" className="block mb-2 text-sm font-medium">
                  Patente
                </label>
                <input
                  id="id"
                  name="id"
                  type="text"
                  value={vehicleData.id}
                  onChange={handlePatenteChange}
                  className="bg-gray-700 text-white w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
                  placeholder="Ingrese la patente"
                  maxLength={7}
                />
                {errors.id && (
                  <p className="text-red-500 text-sm mt-1">{errors.id}</p>
                )}
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Tipo de vehículo
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      type: "TRUCK",
                      name: "Camión",
                      icon: <FaTruck className="w-6 h-6" />,
                    },
                    {
                      type: "CAR",
                      name: "Auto",
                      icon: <FaCar className="w-6 h-6" />,
                    },
                    {
                      type: "MOTORCYCLE",
                      name: "Moto",
                      icon: <FaMotorcycle className="w-6 h-6" />,
                    },
                    {
                      type: "VAN",
                      name: "Van",
                      icon: <FaVanShuttle className="w-6 h-6" />,
                    },
                  ].map(({ type, name, icon }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        handleVehicleTypeChange(type as VehicleType)
                      }
                      className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 ${
                        vehicleData.type === type
                          ? "bg-blue-600 shadow-lg"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      {icon}
                      <span className="mt-2 text-sm">{name}</span>
                    </button>
                  ))}
                  {errors.type && (
                    <p className="text-red-500 text-sm mt-1">{errors.type}</p>
                  )}
                </div>
              </div>
              <div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label
                      htmlFor="brand"
                      className="block mb-2 text-sm font-medium"
                    >
                      Marca
                    </label>
                    <select
                      id="brand"
                      name="brand"
                      value={vehicleData.brand}
                      onChange={handleInputChange}
                      className="bg-gray-700 text-white w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
                    >
                      <option value="">Seleccionar marca</option>
                      {vehicleOptions[vehicleData.type].brands.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="model"
                      className="block mb-2 text-sm font-medium"
                    >
                      Modelo
                    </label>
                    <select
                      id="model"
                      name="model"
                      value={vehicleData.model}
                      onChange={handleInputChange}
                      className="bg-gray-700 text-white w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
                      disabled={!vehicleData.brand}
                    >
                      <option value="">Seleccionar modelo</option>
                      {vehicleData.brand &&
                        vehicleOptions[vehicleData.type].models[
                          vehicleData.brand as keyof (typeof vehicleOptions)[typeof vehicleData.type]["models"]
                        ].map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="year"
                      className="block mb-2 text-sm font-medium"
                    >
                      Año
                    </label>
                    <select
                      id="year"
                      name="year"
                      value={vehicleData.year}
                      onChange={handleInputChange}
                      className="bg-gray-700 text-white w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
                      disabled={!vehicleData.model}
                    >
                      <option value="">Seleccionar año</option>
                      {vehicleOptions[vehicleData.type].years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {(errors.brand || errors.model || errors.year) && (
                  <p className="text-red-500 text-sm mt-1">
                    Seleccione un modelo valido
                  </p>
                )}
              </div>
              <div></div>
              <div>
                <label
                  htmlFor="color"
                  className="block mb-2 text-sm font-medium"
                >
                  Color
                </label>
                <select
                  id="color"
                  name="color"
                  value={vehicleData.color}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
                >
                  <option value="">Seleccionar color</option>
                  <option value="rojo">Rojo</option>
                  <option value="verde">Verde</option>
                  <option value="amarillo">Amarillo</option>
                  <option value="azul">Azul</option>
                </select>
                {errors.color && (
                  <p className="text-red-500 text-sm mt-1">{errors.color}</p>
                )}
              </div>
            </div>
          )}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium">
                  ¿Es eléctrico?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="fuel_type"
                      value="ELECTRIC"
                      checked={vehicleData.fuel_type === "ELECTRIC"}
                      onChange={() =>
                        setVehicleData((prev) => ({
                          ...prev,
                          fuel_type: "ELECTRIC",
                        }))
                      }
                      className="mr-2"
                    />
                    Sí
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="fuel_type"
                      value="NAPHTHA"
                      checked={vehicleData.fuel_type !== "ELECTRIC"}
                      onChange={() =>
                        setVehicleData((prev) => ({
                          ...prev,
                          fuel_type: "NAPHTHA",
                        }))
                      }
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>
              {vehicleData.fuel_type !== "ELECTRIC" && (
                <>
                  <div>
                    <label
                      htmlFor="fuel_type"
                      className="block mb-2 text-sm font-medium"
                    >
                      Tipo de combustible
                    </label>
                    <select
                      id="fuel_type"
                      name="fuel_type"
                      value={vehicleData.fuel_type}
                      onChange={handleInputChange}
                      className="bg-gray-700 text-white w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value="NAPHTHA">Nafta</option>
                      <option value="DIESEL">Diesel</option>
                      <option value="GAS">Gas</option>
                    </select>
                    {errors.fuel_type && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fuel_type}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="fuel_measurement"
                      className="block mb-2 text-sm font-medium"
                    >
                      Medición
                    </label>
                    <select
                      id="fuel_measurement"
                      name="fuel_measurement"
                      value={vehicleData.fuel_measurement}
                      onChange={handleInputChange}
                      className="bg-gray-700 text-white w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
                    >
                      <option value="">Seleccionar medición</option>
                      <option value="LITER">Litros</option>
                      <option value="GALON">Galones</option>
                    </select>
                    {errors.fuel_measurement && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fuel_measurement}
                      </p>
                    )}
                  </div>
                </>
              )}
              <div>
                <label
                  htmlFor="fuel_consumption"
                  className="block mb-2 text-sm font-medium"
                >
                  Consumo cada 100km
                </label>
                <select
                  id="fuel_consumption"
                  name="fuel_consumption"
                  value={vehicleData.fuel_consumption}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
                >
                  <option value="">Seleccionar consumo</option>
                  {fuelConsumptionOptions[vehicleData.type].map((option) => (
                    <option key={option} value={option}>
                      {option} L/100km
                    </option>
                  ))}
                </select>
                {errors.fuel_consumption && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fuel_consumption}
                  </p>
                )}
              </div>
            </div>
          )}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="cant_seats"
                  className="block mb-2 text-sm font-medium"
                >
                  Cantidad de asientos
                </label>
                <select
                  id="cant_seats"
                  name="cant_seats"
                  value={vehicleData.cant_seats}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
                >
                  <option value="">Seleccionar cantidad de asientos</option>
                  {Array.from(
                    {
                      length:
                        vehicleData.type === "MOTORCYCLE"
                          ? 2
                          : vehicleData.type === "CAR"
                          ? 12
                          : vehicleData.type === "VAN"
                          ? 15
                          : 3, // TRUCK - CAMIONES :)
                    },
                    (_, i) => i + 1
                  ).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                {errors.cant_seats && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.cant_axles}
                  </p>
                )}
              </div>
              {(vehicleData.type === "TRUCK" || vehicleData.type === "VAN") && (
                <div>
                  <label
                    htmlFor="cant_axles"
                    className="block mb-2 text-sm font-medium"
                  >
                    Cantidad de ejes
                  </label>
                  <select
                    id="cant_axles"
                    name="cant_axles"
                    value={vehicleData.cant_axles}
                    onChange={handleInputChange}
                    className="bg-gray-700 text-white w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
                  >
                    <option value="">Seleccionar cantidad de ejes</option>
                    {Array.from(
                      { length: vehicleData.type === "TRUCK" ? 5 : 3 },
                      (_, i) => (i + 1) * 2
                    ).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                  {errors.cant_axles && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.cant_axles}
                    </p>
                  )}
                </div>
              )}
              <div>
                <label
                  htmlFor="load"
                  className="block mb-2 text-sm font-medium"
                >
                  Capacidad de carga
                </label>
                <select
                  id="load"
                  name="load"
                  value={vehicleData.load}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
                >
                  <option value="">Seleccionar capacidad de carga</option>
                  {loadCapacityOptions[vehicleData.type].map((option) => (
                    <option key={option} value={option}>
                      {option} kg
                    </option>
                  ))}
                </select>
                {errors.load && (
                  <p className="text-red-500 text-sm mt-1">{errors.load}</p>
                )}
              </div>
              {vehicleData.type === "TRUCK" && (
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    ¿Acoplado?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="has_trailer"
                        value="true"
                        checked={vehicleData.has_trailer}
                        onChange={() =>
                          setVehicleData((prev) => ({
                            ...prev,
                            has_trailer: true,
                          }))
                        }
                        className="mr-2"
                      />
                      Sí
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="has_trailer"
                        value="false"
                        checked={!vehicleData.has_trailer}
                        onChange={() =>
                          setVehicleData((prev) => ({
                            ...prev,
                            has_trailer: false,
                          }))
                        }
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              className="px-6 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
            >
              Anterior
            </button>
          )}
          {currentStep < steps.length - 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 ml-auto"
            >
              Siguiente
            </button>
          )}
          {currentStep === steps.length - 1 && (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 rounded-lg hover:bg-green-500 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 ml-auto"
            >
              Enviar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddVehicle;
