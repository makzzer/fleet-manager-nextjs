'use client';

import React, { useState, useEffect } from 'react';
import { useControl } from '../context/ControlContext';
import { useAuth } from '../context/AuthContext';
import { useReserva } from '../context/ReservesContext';
import Swal from 'sweetalert2';
import { useRouter } from "next/navigation";

const SolicitarAsistencia = () => {
    const router = useRouter();
    const { authenticatedUser } = useAuth();
    const { createCorrectiveControl } = useControl();
    const { reservas, fetchReservas } = useReserva();

    const [selectedReserva, setSelectedReserva] = useState<string | null>(null);
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        fetchReservas();
    }, [fetchReservas]);

    const createAlert = async (vehicle_id: string) => {
        try {
            const response = await fetch('https://fleet-manager-gzui.onrender.com/api/alerts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    strategy: 'CONTROL',
                    vehicle_id: vehicle_id,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al crear la alerta');
            }
        } catch (error) {
            console.error('Error al crear la alerta:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedReserva || !subject || !description) {
            Swal.fire('Error', 'Por favor, completa todos los campos.', 'error');
            return;
        }

        const correctiveControl = {
            type: 'CORRECTIVE',
            subject: subject,
            description: description,
            vehicle_id: selectedReserva,
            priority: 'HIGH',
            operator_id: 'bb21c935-c3ad-489d-a81d-446465d3e318', // Por ahora el operador fijo
        };

        try {
            await createCorrectiveControl(correctiveControl);
            await createAlert(selectedReserva); // Crear la alerta después de que el control se haya creado correctamente
            Swal.fire('Éxito', 'El control correctivo ha sido solicitado correctamente y se ha creado una alerta.', 'success');
            setSelectedReserva(null);
            setSubject('');
            setDescription('');
        } catch (error) {
            Swal.fire('Error', 'Ocurrió un error al solicitar la asistencia.', 'error');
        }
    };

    return (
        <div className="flex items-center justify-center rounded-lg bg-gray-900 text-white p-6 h-auto min-h-[70vh]">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">Solicitar Asistencia</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="reserva" className="block text-sm font-medium text-gray-300 mb-2">
                            Seleccionar viaje
                        </label>
                        <select
                            id="reserva"
                            value={selectedReserva || ''}
                            onChange={(e) => setSelectedReserva(e.target.value)}
                            className="bg-gray-700 text-white w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="" disabled>
                                Selecciona un viaje
                            </option>
                            {reservas
                                .filter((reserva) => reserva.user_id === authenticatedUser?.id)
                                .map((reserva) => (
                                    <option key={reserva.id} value={reserva.vehicle_id}>
                                        {`Viaje a ${reserva.trip.destination.address}`}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                            Asunto
                        </label>
                        <input
                            id="subject"
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="bg-gray-700 text-white w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Escribe el asunto del control..."
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                            Descripción
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="bg-gray-700 text-white w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Describe el problema o la asistencia requerida..."
                        />
                    </div>

                    <div className=''>
                        <button
                            type="submit"
                            className="w-full mb-4 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-md transition-all"
                        >
                            Solicitar Asistencia
                        </button>
                    </div>
                </form>

                <div>
                    <button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                        onClick={() => router.push("/reservas")}
                    >
                        Volver
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SolicitarAsistencia;
