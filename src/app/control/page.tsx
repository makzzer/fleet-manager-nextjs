'use client'

import { KanbanBoard } from '../components/KanbanBoardV2/KanbanBoard'
import ProtectedRoute from '../components/Routes/ProtectedRoutes'
import { useControl } from '../context/ControlContext'

export default function ControlesPage() {
  const { controls, setControlStatus } = useControl()

return (
  <ProtectedRoute>
    <div className="p-6 bg-gray-900 min-h-screen text-white rounded-lg">
      <div className="mb-6 flex flex-col md:flex-row md:justify-between">
        <h1 className="md:text-4xl text-3xl font-bold text-blue-400 mb-4 sm:mb-4">
          Gestión de controles
        </h1>
      </div>
      <div className="">
        <KanbanBoard controls={controls} setControlStatus={setControlStatus}/>
      </div>
    </div>
  </ProtectedRoute>
  )
}