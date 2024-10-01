"use client";

import { useEffect } from "react";
import ProtectedRoute from "../components/Routes/ProtectedRoutes";
import { useAnalytics } from "../context/AnalyticsContext";
import BarChartReservas from "../components/Charts/BarChartReservas";
import LineChartCombustible from "../components/Charts/LineChartCombustible";
import BarChartKilometraje from "../components/Charts/BarChartKilometraje";
import LineChartTiempoUsoPromedio from "../components/Charts/LineChartTiempoUsoPromedio";
import DoughnutChartPagoCombustible from "../components/Charts/DoughnutChartPagoCombustible";

import {
  Chart,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  RadarController,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

const registerChartComponentes = () => {
  Chart.register(
    CategoryScale,
    LinearScale,
    RadialLinearScale,
    PointElement,
    LineElement,
    RadarController,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
  );
};

const Analytics = () => {
  const { data, fetchAnalyticsData } = useAnalytics();

  //Registro los componentes del chart y hago el fetch para traer los datos
  useEffect(() => {
    registerChartComponentes();
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  if (!data) {
    return <div>No hay datos disponibles</div>;
  }

  return (
    <ProtectedRoute>
      <div className="p-6 bg-gray-900 min-h-screen text-white">
        <h1 className="md:text-4xl text-3xl font-bold mb-8 text-blue-400">
          Reportes
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">
              Cantidad de reservas
            </h2>
            <BarChartReservas reservas={data.reservas} />
          </div>

          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">
              Consumo de combustible
            </h2>
            <LineChartCombustible combustible={data.combustible} />
          </div>

          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">
              Kilómetros Recorridos
            </h2>
            <BarChartKilometraje kilometraje={data.kilometraje} />
          </div>

          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">
              Tiempo de Uso Promedio
            </h2>
            <LineChartTiempoUsoPromedio
              tiempoUsoPromedio={data.tiempoUsoPromedio}
            />
          </div>

          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">
              Monto Pagado por Combustible
            </h2>
            <DoughnutChartPagoCombustible
              montoCombustible={data.montoCombustible}
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Analytics;
