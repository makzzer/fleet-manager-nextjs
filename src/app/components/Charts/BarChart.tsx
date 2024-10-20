'use client'

import { Bar } from "react-chartjs-2";

//Estructura de los datos que va a recibir
interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
    }[];
  };
  title: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
  const isStacked = data.datasets.length > 1;

  //Cambiar algunos atributos innecesarios, a excepción de stacked, que sirve para los graficos apilados
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      x: {
        stacked: isStacked,
      },
      y: {
        stacked: isStacked,
      },
    },
  };

  return (
          <Bar data={data} options={options} />
  );
};

export default BarChart;