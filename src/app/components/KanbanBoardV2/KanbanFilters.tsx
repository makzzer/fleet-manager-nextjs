"use client"

import React from 'react'
import { Control } from '@/app/context/ControlContext'
import AutocompleteSearchBox from '../AutocompleteSearchBox'
import { FaFilter } from 'react-icons/fa'

interface KanbanFiltersProps {
  controls: Control[]
  dateFrom: string
  setDateFrom: (date: string) => void
  dateTo: string
  setDateTo: (date: string) => void
  controlType: string
  setControlType: (type: string) => void
  operator: string
  setOperator: (operator: string) => void
  vehicleType: string
  setVehicleType: (type: string) => void
  vehiclePlate: string
  setVehiclePlate: (plate: string) => void
  showFilters: boolean
  setShowFilters: (show: boolean) => void
}

export const KanbanFilters: React.FC<KanbanFiltersProps> = ({
  controls,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  controlType,
  setControlType,
  setOperator,
  vehicleType,
  setVehicleType,
  setVehiclePlate,
  showFilters,
  setShowFilters
}) => {
  const vehiclePlateOptions = Array.from(new Set(controls.map(control => control.vehicle.id)))
    .map(id => ({
      id,
      nombre: id
    }))

  const operatorOptions = Array.from(new Set(controls.map(control => control.operator?.id)))
    .filter(Boolean)
    .map(id => ({
      id: id as string,
      nombre: controls.find(control => control.operator?.id === id)?.operator?.full_name || ''
    }))

  return (
    <div className="mb-6">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="w-full mb-4 flex items-center justify-center p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-200 ease-in-out"
      >
        <FaFilter className="mr-2" />
        {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
      </button>
      
      {showFilters && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-300">Fecha desde</label>
              <input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="dateTo" className="block text-sm font-medium text-gray-300">Fecha hasta</label>
              <input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="controlType" className="block text-sm font-medium text-gray-300">Tipo de control</label>
              <select
                id="controlType"
                value={controlType}
                onChange={(e) => setControlType(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="CORRECTIVE">Correctivo</option>
                <option value="PREVENTIVE">Preventivo</option>
                <option value="PREDICTIVE">Predictivo</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="operator" className="block text-sm font-medium text-gray-300">Operador</label>
              <AutocompleteSearchBox
                options={operatorOptions}
                onSelection={(option) => setOperator(option ? option.id : '')}
                placeholder="Seleccione un operador"
                customInputStyles="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                customItemsStyles="p-2 hover:bg-gray-600 cursor-pointer"
                customItemContainerStyles='absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto'
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-300">Tipo de vehículo</label>
              <select
                id="vehicleType"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="CAR">Automóvil</option>
                <option value="TRUCK">Camión</option>
                <option value="MOTORCYCLE">Motocicleta</option>
                <option value="VAN">Van</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="vehiclePlate" className="block text-sm font-medium text-gray-300">Patente de vehiculo</label>
              <AutocompleteSearchBox
                options={vehiclePlateOptions}
                onSelection={(option) => setVehiclePlate(option ? option.id : '')}
                placeholder="Seleccione una patente"
                customInputStyles="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                customItemsStyles="p-2 hover:bg-gray-600 cursor-pointer"
                customItemContainerStyles='absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto'
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}