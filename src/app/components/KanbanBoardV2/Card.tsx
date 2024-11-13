/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { motion } from 'framer-motion'
import { DropIndicator } from './DropIndicator'
import { Control } from '@/app/context/ControlContext'

interface CardProps {
  control: Control
  handleDragStart: (e: any, control: any) => void
}

export const Card: React.FC<CardProps> = ({ control, handleDragStart }) => {
  return (
    <>
      <DropIndicator beforeId={control.id} column={control.status} />
      <motion.div
        layout
        layoutId={control.id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, control)}
        className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
      >
        <p className="text-sm text-neutral-100">{control.subject}</p>
        <p className="text-xs text-neutral-400">{control.vehicle.brand} {control.vehicle.model}</p>
        <p className="text-xs text-neutral-400">{control.type}</p>
      </motion.div>
    </>
  )
}