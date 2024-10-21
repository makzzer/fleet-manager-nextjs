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
import DoughnutChart from "../components/Charts/DoughnutChart";

interface ProcessedChartData {
  origin: string;
  title: string;
  type: "bar" | "pie" | "value";
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[] | number;
      backgroundColor?: string | string[];
    }[];
  };
}

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
    ArcElement,
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
    switch (module) {
      case "CONTROLS":
        return <FaTools />;
      case "ORDERS":
        return <FaFileAlt />;
      case "RESERVES":
        return <FaCalendarAlt />;
    }
  };

  //Traigo los datos procesados
  const processedChartData = processChartData(analytics);

  const origins = ["CONTROLS", "ORDERS", "RESERVES", "ALERTS", "VEHICLES", "PRODUCTS"];
  const types = ["value", "bar", "pie"] as const;

  const groupChartsByOriginAndType = (
    processedChartData: ProcessedChartData[]
  ) => {
    return origins.reduce((acc, origin) => {
      const chartsForOrigin = processedChartData.filter(
        (chart) => chart.origin === origin
      );

      acc[origin] = types.reduce((typeAcc, type) => {
        typeAcc[type] = chartsForOrigin.filter((chart) => chart.type === type);
        return typeAcc;
      }, {} as Record<(typeof types)[number], ProcessedChartData[]>);

      return acc;
    }, {} as Record<string, Record<(typeof types)[number], ProcessedChartData[]>>);
  };

  const groupedCharts = groupChartsByOriginAndType(processedChartData);

  const renderStatCards = (charts: ProcessedChartData[]) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {charts.map((chart, index) => {
          const valor: number = chart.data.datasets.reduce((acc, dataset) => {
            if (dataset.data && Array.isArray(dataset.data)) {
              return acc + (dataset.data[0] as number);
            } else {
              return acc + (dataset.data as number);
            }
          }, 0);

          return (
            <StatCard
              key={`${chart.origin}-${chart.type}-${index}`}
              title={chart.title}
              value={valor}
              icon={modulesIcons(chart.origin)}
            />
          );
        })}
      </div>
    );
  };

  const renderBarCharts = (charts: ProcessedChartData[]) => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {charts.map((chart, index) => (
          <div key={`${chart.origin}-${chart.type}-${index}`} className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">{chart.title}</h3>
            <BarChart data={chart.data} title={chart.title} />
          </div>
        ))}
      </div>
    );
  };

  const renderDoughnutCharts = (charts: ProcessedChartData[]) => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {charts.map((chart, index) => (
          <div key={`${chart.origin}-${chart.type}-${index}`} className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">{chart.title}</h3>
            <DoughnutChart data={chart.data} />
          </div>
        ))}
      </div>
    );
  };

  console.log(groupedCharts["PRODUCTS"]);

  return (
    <ProtectedRoute requiredModule="ANALYTICS">
      <div className="p-6 bg-gray-900 min-h-screen text-white">
        <h1 className="md:text-4xl text-3xl font-bold mb-8 text-blue-400">Analíticas</h1>
        <div className="space-y-12">
          {origins.map((origin) => (
            <div key={origin} className="bg-gray-800/50 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                {modulesIcons(origin)}
                <span className="ml-2">{origin}</span>
              </h2>
              <div className="space-y-8">
                {groupedCharts[origin].value.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Estadísticas</h3>
                    {renderStatCards(groupedCharts[origin].value)}
                  </div>
                )}
                {groupedCharts[origin].bar.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Gráficos de Barras</h3>
                    {renderBarCharts(groupedCharts[origin].bar)}
                  </div>
                )}
                {groupedCharts[origin].pie.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Gráficos Circulares</h3>
                    {renderDoughnutCharts(groupedCharts[origin].pie)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Analytics;
