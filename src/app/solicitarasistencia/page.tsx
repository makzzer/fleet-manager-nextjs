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
    const [description, setDescription] = useState('');

    useEffect(() => {
        fetchReservas();
    }, [fetchReservas]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedReserva || !description) {
            Swal.fire('Error', 'Por favor, selecciona un viaje y escribe una descripción.', 'error');
            return;
        }

        const correctiveControl = {
            type: 'CORRECTIVE',
            subject: 'Solicitud de asistencia',
            description: description,
            vehicle_id: selectedReserva,
            operator_id: authenticatedUser?.id || '',
        };

        try {
            await createCorrectiveControl(correctiveControl);
            Swal.fire('Éxito', 'El control correctivo ha sido solicitado correctamente.', 'success');
            setSelectedReserva(null);
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
