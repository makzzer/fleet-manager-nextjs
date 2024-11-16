"use client";

import React, { useState, useEffect } from 'react';
import { Control } from '@/app/context/ControlContext';

interface ControlStatusCardProps {
  control: Control;
}

const ControlStatusCard: React.FC<ControlStatusCardProps> = ({ control }) => {
  const statusSteps = ['TODO', 'DOING', 'DONE'];
  const currentStepIndex = statusSteps.indexOf(control.status);

  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    let initialTime = 0;

    // Determinar el tiempo inicial basado en el tipo y estado del control
    if (control.type === 'PREVENTIVE') {
      if (control.status === 'TODO') {
        initialTime = 3600; // 1 hora en segundos
      } else if (control.status === 'DOING') {
        initialTime = 900; // 15 minutos en segundos
      }
    } else if (control.type === 'CORRECTIVE') {
      if (control.status === 'TODO') {
        initialTime = 1800; // 30 minutos en segundos
      } else if (control.status === 'DOING') {
        initialTime = 600; // 10 minutos en segundos
      }
    }

    setRemainingTime(initialTime);

    if (initialTime > 0) {
      const interval = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [control.type, control.status]);

  // Formatear el tiempo restante en hh:mm:ss
  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours > 0 ? (hours < 10 ? '0' + hours : hours) + ':' : ''}${
      minutes < 10 ? '0' + minutes : minutes
    }:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md transition">
      <h2 className="text-xl font-bold text-blue-400 mb-4">Control #{control.id}</h2>

      {/* Tipo de control */}
      <div className="mb-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-white ${
            control.type === 'PREVENTIVE' ? 'bg-blue-500' : 'bg-red-500'
          }`}
        >
          {control.type}
        </span>
      </div>

      {/* Línea de progreso */}
      <div className="flex items-center justify-between mb-6">
        {statusSteps.map((status, index) => (
          <React.Fragment key={status}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                  index <= currentStepIndex ? 'bg-green-500' : 'bg-gray-500'
                }`}
              >
                {index + 1}
              </div>
              <span className="mt-2 text-sm">{status}</span>
            </div>
            {index !== statusSteps.length - 1 && (
              <div
                className={`flex-auto border-t-4 transition duration-500 ease-in-out ${
                  index < currentStepIndex ? 'border-green-500' : 'border-gray-500'
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Detalles del control */}
      <p className="text-gray-300">
        <strong>Asunto:</strong> {control.subject}
      </p>
      <p className="text-gray-300 mb-4">
        <strong>Descripción:</strong> {control.description}
      </p>

      {/* Mostrar tiempo restante si el control no está en 'DONE' */}
      {control.status !== 'DONE' && remainingTime > 0 && (
        <div className="mt-4">
          <p className="text-lg font-semibold text-indigo-400">
            Tiempo restante estimado:
            <span className="text-white ml-2">{formatTime(remainingTime)}</span>
          </p>
        </div>
      )}

      {/* Mostrar tiempo esperado total en 'DONE' */}
      {control.status === 'DONE' && (
        <div className="mt-4">
          <p className="text-lg font-semibold text-indigo-400">
            Tiempo de resolución:
            <span className="text-white ml-2">
              {control.type === 'PREVENTIVE' ? '1 hora' : '30 minutos'}
            </span>
          </p>
        </div>
      )}

      {/* Efecto cuando está DONE */}
      {control.status === 'DONE' && (
        <div className="mt-6 flex items-center justify-center">
          <div className="bg-green-500 text-white p-4 rounded-full animate-pulse">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="ml-4 text-green-500 text-xl font-semibold">
            ¡Control Completado!
          </span>
        </div>
      )}
    </div>
  );
};

export default ControlStatusCard;
