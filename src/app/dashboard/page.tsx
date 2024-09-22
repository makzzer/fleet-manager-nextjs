'use client';
import React, { useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useVehiculo } from '../context/VehiculoContext';
import Link from 'next/link';

// Registrar las escalas y los elementos que vas a utilizar
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const { vehiculos, fetchVehiculos } = useVehiculo();

    useEffect(() => {
        fetchVehiculos();
    }, [fetchVehiculos]);

    const lineChartData = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
        datasets: [
            {
                label: 'Vehículos Disponibles',
                data: vehiculos.map(() => Math.floor(Math.random() * 100)),
                fill: false,
                backgroundColor: '#4F46E5',
                borderColor: '#4F46E5',
            },
        ],
    };

    const barChartData = {
        labels: ['Chevrolet', 'Toyota', 'Ford', 'Peugeot', 'Fiat'],
        datasets: [
            {
                label: 'Vehículos por Marca',
                data: [12, 19, 3, 5, 2],
                backgroundColor: ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'],
            },
        ],
    };

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-white">
            <h1 className="text-4xl font-bold mb-8 text-blue-400">Dashboard General</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Estado de la Flota</h2>
                    <Line data={lineChartData} />
                </div>

                <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Vehículos por Marca</h2>
                    <Bar data={barChartData} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-blue-400 mb-4">Gestión de Vehículos</h2>
                    <p className="text-gray-400 mb-6">Administra los vehículos de la flota.</p>
                    <Link href="/vehiculos" className="text-lg text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
                        Ir a Vehículos
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
