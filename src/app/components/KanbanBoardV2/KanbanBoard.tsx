import React from 'react'
import { Control } from '@/app/context/ControlContext'
import { Column } from './Column'

interface KanbanBoardProps {
  controls: Control[]
  setControlStatus: (controlId: string, newStatus: string) => void
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ controls, setControlStatus }) => {

  return (
    <div className="flex w-full gap-3 overflow-y-auto p-12">
      <Column
        title="Por hacer"
        column="TODO"
        headingColor="text-yellow-200"
        controls={controls.filter(c => c.status === 'TODO')}
        setControlStatus={setControlStatus}
      />
      <Column
        title="En progreso"
        column="DOING"
        headingColor="text-blue-200"
        controls={controls.filter(c => c.status === 'DOING')}
        setControlStatus={setControlStatus}
      />
      <Column
        title="Completado"
        column="DONE"
        headingColor="text-emerald-200"
        controls={controls.filter(c => c.status === 'DONE')}
        setControlStatus={setControlStatus}
      />
    </div>
  )
}