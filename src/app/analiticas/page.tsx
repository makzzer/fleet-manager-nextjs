"use client";

import { useEffect } from "react";
import ProtectedRoute from "../components/Routes/ProtectedRoutes";
import { useAnalytics } from "../context/AnalyticsContext";

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
import { processChartData } from "../components/Charts/chartDataProcesor";
import BarChart from "../components/Charts/BarChart";
import StatCard from "../components/StatCard";
import { FaCalendarAlt, FaFileAlt, FaTools } from "react-icons/fa";
import DoughnutChartPagoCombustible from "../components/Charts/DoughnutChart";

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
  const { analytics, fetchAnalytics } = useAnalytics();

  //Registro los componentes del chart y hago el fetch para traer los datos
  useEffect(() => {
    registerChartComponentes();
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (!analytics) {
    return <div>Loading...</div>;
  }

  const modulesIcons = (module: string) => {
    switch(module) {
      case "CONTROLS":
        return (<FaTools />);
      case "ORDERS":
        return (<FaFileAlt />);
      case "RESERVES":  
        return (<FaCalendarAlt />);
    }
  }

  //Traigo los datos procesados
  const processedChartData = processChartData(analytics);

  //Obtengo solo los graficos de barra
  const barChartData = processedChartData.filter((chart) => chart.type === 'bar');

  const uniqueValueData = processedChartData.filter((chart) => chart.type === 'value');

  const pieChartData = processedChartData.filter((chart) => chart.type === 'pie');

  return (
    <ProtectedRoute requiredModule="ANALYTICS">
      <div className="p-6 bg-gray-900 min-h-screen text-white">
        <h1 className="md:text-4xl text-3xl font-bold mb-8 text-blue-400">
          Reportes
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {barChartData.map((chart, index) => 
          (
          <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">
              {chart.title}
            </h2>
            <BarChart data={chart.data} title={chart.title} />
          </div>
          )
          )}

          {uniqueValueData.map((chart, index) => {
           const valor: number = chart.data.datasets.reduce((acc, dataset) => {
            if (dataset.data && Array.isArray(dataset.data)) {
              return acc + (dataset.data[0] as number);
            } else {
              return acc + (dataset.data as number);
            }
            }, 0);

           return (
            <StatCard key={index} title={chart.title} value={valor} icon={modulesIcons(chart.origin)}/>
          )}
          )}
 
          {pieChartData.map((chart, index) => 
          (
          <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">
              {chart.title}
            </h2>
            <DoughnutChartPagoCombustible data={chart.data} />
          </div>
          )
          )}

          {/*
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">
              Cantidad de reservas
            </h2>
            <BarChartReservas data={data.reservas} label={}/>
          </div>
            */}

          {/*
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
          */}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Analytics;
