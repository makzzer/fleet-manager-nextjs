"use client"

import React, { useMemo, useState } from 'react'
import { Control } from '@/app/context/ControlContext'
import { Column } from './Column'
import { KanbanFilters } from './KanbanFilters'
import Swal from 'sweetalert2'
import { FaPlus } from 'react-icons/fa'

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

  const handleAgregarControl = () => {
    Swal.fire({
      title: "Agregar Control",
      html: `
      <div class="grid grid-cols-3 gap-4">
        <button id="addIndividual" class="swal2-confirm swal2-styled flex flex-col justify-center items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
          </svg>
          <span>Individual</span>
        </button>
        <button id="addMasivo" class="swal2-confirm swal2-styled flex flex-col justify-center items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
          </svg>
          <span>Carga Masiva</span>
        </button>
        <button id="addIA" class="swal2-confirm swal2-styled flex flex-col justify-center items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
          </svg>
          <span>IA</span>
        </button>
      </div>
      `,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      focusConfirm: false,
      customClass: {
        title: "text-white",
        popup: "bg-gray-800",
      },
      didOpen: () => {
        document.getElementById("addIndividual")?.addEventListener("click", () => {
          Swal.close();
          console.log("Agregar control individual");
        });
        document.getElementById("addMasivo")?.addEventListener("click", () => {
          Swal.close();
          console.log("Agregar control masivo");
        });
        document.getElementById("addIA")?.addEventListener("click", () => {
          Swal.close();
          console.log("Agregar control con IA");
        });
      },
    });
  };


  return (
    <div className="flex flex-col w-full gap-3">
       <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleAgregarControl}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center gap-2"
        >
          <FaPlus />
          Agregar Control
        </button>
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