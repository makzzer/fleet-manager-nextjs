import { Doughnut } from "react-chartjs-2";

interface DoughnutChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[] | number;
      backgroundColor?: string | string[];
    }[];
  };
}

function oscurecerColorHSL(color: string, porcentaje: number): string {
  const [h, s, l] = color.match(/\d+/g)!.map(Number);
  const nuevoL = Math.max(0, l - (l * porcentaje / 100));
  return `hsl(${h}, ${s}%, ${nuevoL}%)`;
}

const DoughnutChart = ({
  data,
}: DoughnutChartProps) => {

  const backgroundColor = data.datasets[0].backgroundColor || [];
  
  // Crear colores de borde mas oscuros
  const borderColor = Array.isArray(backgroundColor) 
  ? backgroundColor.map(color => oscurecerColorHSL(color, 20)) 
  : oscurecerColorHSL(backgroundColor as string, 20);

  const chartData = {
    ...data,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      hoverOffset: 4,
      borderWidth: 2,
      hoverBorderColor: borderColor,
    }))
  };

  return (
    <Doughnut
      data={chartData}
      options={{ responsive: true }}
    />
  );
};

export default DoughnutChart;
