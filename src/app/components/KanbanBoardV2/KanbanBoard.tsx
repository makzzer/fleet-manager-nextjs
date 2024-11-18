"use client"

import React, { useMemo, useState } from 'react'
import { Control } from '@/app/context/ControlContext'
import { Column } from './Column'
import { KanbanFilters } from './KanbanFilters'
import { ControlCreation } from './ControlCreation'

interface KanbanBoardProps {
  controls: Control[]
  setControlStatus: (controlId: string, newStatus: string) => void
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ controls, setControlStatus }) => {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [controlType, setControlType] = useState('')
  const [operator, setOperator] = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const [vehiclePlate, setVehiclePlate] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filteredControls = useMemo(() => {
    return controls.filter(control => {
      const dateCreated = new Date(control.date_created)

      const fromDate = dateFrom ? new Date(dateFrom) : null
      let toDate = dateTo ? new Date(dateTo) : null
      
      if (toDate) {
        toDate = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate() + 1)
      }

      const isWithinDateRange = 
        (!fromDate || dateCreated >= fromDate) &&
        (!toDate || dateCreated <= toDate)

      return (
        isWithinDateRange &&
        (!controlType || control.type === controlType) &&
        (!operator || (control.operator && control.operator.id === operator)) &&
        (!vehicleType || control.vehicle.type === vehicleType) &&
        (!vehiclePlate || control.vehicle.id.toLowerCase().includes(vehiclePlate.toLowerCase()))
      )
    })
  }, [controls, dateFrom, dateTo, controlType, operator, vehicleType, vehiclePlate])

  return (
    <div className="flex flex-col w-full gap-3">
      <div className="flex justify-between items-center mb-4">
        <ControlCreation />  
      </div>
      <KanbanFilters
        controls={controls}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        controlType={controlType}
        setControlType={setControlType}
        operator={operator}
        setOperator={setOperator}
        vehicleType={vehicleType}
        setVehicleType={setVehicleType}
        vehiclePlate={vehiclePlate}
        setVehiclePlate={setVehiclePlate}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

      <div className="flex w-full gap-3 min-h-screen overflow-y-hidden overflow-x-auto">
        <Column
          title="Por hacer"
          column="TODO"
          headingColor="text-yellow-200"
          allControls={filteredControls}
          controls={filteredControls.filter(c => c.status === 'TODO')}
          setControlStatus={setControlStatus}
        />
        <Column
          title="En progreso"
          column="DOING"
          headingColor="text-blue-200"
          allControls={filteredControls}
          controls={filteredControls.filter(c => c.status === 'DOING')}
          setControlStatus={setControlStatus}
        />
        <Column
          title="Completado"
          column="DONE"
          headingColor="text-emerald-200"
          allControls={filteredControls}
          controls={filteredControls.filter(c => c.status === 'DONE')}
          setControlStatus={setControlStatus}
        />
      </div>
    </div>
  )
}