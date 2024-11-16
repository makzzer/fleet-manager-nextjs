"use client";

import React, { useEffect } from 'react';
import { useControl } from '@/app/context/ControlContext';
import ControlStatusCard from '../components/Cards/ControlStatusCard';
import { useSearchParams } from 'next/navigation';

const ListadoControles: React.FC = () => {
  const { controls, fetchControls } = useControl();
  const searchParams = useSearchParams();
  const vehiculoId = searchParams.get('vehiculoId');

  useEffect(() => {
    fetchControls();
  }, [fetchControls]);

  let controlsFiltrados = vehiculoId
    ? controls.filter((control) => control.vehicle.id === vehiculoId)
    : controls;

  // Ordenar controles para que los 'DONE' estén al final
  controlsFiltrados = controlsFiltrados.sort((a, b) => {
    if (a.status === 'DONE' && b.status !== 'DONE') {
      return 1;
    }
    if (a.status !== 'DONE' && b.status === 'DONE') {
      return -1;
    }
    return 0;
  });

  return (
    <div className="space-y-4">
      {controlsFiltrados.length > 0 ? (
        controlsFiltrados.map((control) => (
          <ControlStatusCard key={control.id} control={control} />
        ))
      ) : (
        <p className="text-gray-400">No hay controles para este vehículo.</p>
      )}
    </div>
  );
};

export default ListadoControles;
