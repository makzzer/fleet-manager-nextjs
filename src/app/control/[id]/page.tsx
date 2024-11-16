'use client'

import { useControl } from '@/app/context/ControlContext'
import { FiTruck, FiTool, FiAlertCircle } from 'react-icons/fi'
import { FaRegCalendarAlt, FaUserCircle } from 'react-icons/fa'
import { IoPulse } from 'react-icons/io5'

export default function ControlPage({ params }: { params: { id: string } }) {
  const { controls } = useControl();
  const control = controls.find(c => c.id === params.id)

  if (!control) return <div>Control no encontrado</div>

  const typeLogo = (type: string) => {
    const typeStyles = "flex inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full mb-2 "
    switch (type) {
      case "CORRECTIVE":
        return (
          <div className={`${typeStyles} bg-red-500 text-white`}>
            <FiTool aria-hidden="true" />
            <span>Correctivo</span>
          </div>
        )
      case "PREVENTIVE":
        return (
          <div className={`${typeStyles} bg-green-500 text-white`}>
            <FiAlertCircle aria-hidden="true" />
            <span>Preventivo</span>
          </div>
        )
      default:
        return (
          <div className={`${typeStyles} bg-blue-500 text-white`}>
            <IoPulse aria-hidden="true" />
            <span>Predictivo</span>
          </div>
        )
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-gray-800 p-6 rounded-lg text-white">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">{control.subject}</h2>
          {typeLogo(control.type)}
        </div>
        <p className="text-gray-300 mb-4">{control.description}</p>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <FiTruck aria-hidden="true" />
            <span>{control.vehicle.brand} {control.vehicle.model} ({control.vehicle.id})</span>
          </div>
          <div>
            <strong>Estado:</strong> {control.status}
          </div>
          <div>
            <strong>Prioridad:</strong> {control.priority}
          </div>
          <div className="flex items-center gap-2">
            <FaRegCalendarAlt aria-hidden="true" />
            <span>{new Date(control.date_created).toLocaleDateString()}</span>
          </div>
          {control.operator && (
            <div className="flex items-center gap-2">
              <FaUserCircle aria-hidden="true" />
              <span>{control.operator.full_name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}