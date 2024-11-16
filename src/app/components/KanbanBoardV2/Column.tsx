"use client"

import React, { useState } from 'react'
import { Card } from './Card'
import { DropIndicator } from './DropIndicator'
import { Control } from '@/app/context/ControlContext'
import Swal from 'sweetalert2'

interface ColumnProps {
  title: string
  headingColor: string
  column: string
  allControls: Control[];
  controls: Control[]
  setControlStatus: (controlId: string, newStatus: string) => void
}

export const Column: React.FC<ColumnProps> = ({ title, headingColor, column, allControls, controls, setControlStatus }) => {
  const [active, setActive] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragStart = (e: any , control: Control) => {
    e.dataTransfer.setData('controlId', control.id)
  }

  const handleDragEnd = (e: React.DragEvent) => {
    const controlId = e.dataTransfer.getData('controlId')
    const controlReference = allControls.find((control) => control.id.includes(controlId));
    setActive(false)
    clearHighlights()

    const indicators = getIndicators()
    const { element } = getNearestIndicator(e, indicators)

    const before = (element as HTMLElement).dataset.before || '-1'

    
    if(!controlReference?.operator){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe asignarse un operador',
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#1F2937',
        color: '#F3F4F6',
        iconColor: '#EF4444',
        customClass: {
          popup: 'swal2-modern',
          title: 'swal2-modern-title',
          htmlContainer: 'swal2-modern-content'
        },
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      });
      return;
    }

    

    if (before !== controlId) {
      console.log(column);
      setControlStatus(controlId, column)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    highlightIndicator(e)
    setActive(true)
  }

  const handleDragLeave = () => {
    clearHighlights()
    setActive(false)
  }

  const clearHighlights = (els?: Element[]) => {
    const indicators = els || getIndicators()
    indicators.forEach((i) => {
      (i as HTMLElement).style.opacity = '0'
    })
  }

  const highlightIndicator = (e: React.DragEvent) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const { element } = getNearestIndicator(e, indicators);
    (element as HTMLElement).style.opacity = '1';
    };
  
  const getNearestIndicator = (e: React.DragEvent, indicators: Element[]): { offset: number; element: Element } => {
    const DISTANCE_OFFSET = 50;
    return indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );
  };

  const getIndicators = (): Element[] => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`))
  }

  return (
    <div className="w-full min-w-56 bg-gray-800 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          {controls.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${
          active ? "bg-gray-900/50" : "bg-neutral-800/0"
        }`}
      >
        {controls.map((control) => (
          <Card key={control.id} control={control} handleDragStart={handleDragStart} />
        ))}
        <DropIndicator beforeId={null} column={column} />
      </div>
    </div>
  )
}