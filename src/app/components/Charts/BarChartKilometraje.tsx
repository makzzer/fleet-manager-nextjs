import { Bar } from "react-chartjs-2";

interface BarChartKilometrajeProps {
  kilometraje: number[];
  label?: string[];
}

const BarChartKilometraje = ({
  kilometraje,
  label,
}: BarChartKilometrajeProps) => {
  const defaultLabels: string[] = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
  ];

  const barChartKilometraje = {
    labels: defaultLabels || label,
    datasets: [
      {
        label: "Kilómetros",
        data: kilometraje,
        backgroundColor: "#04e762",
      },
    ],
  };

  return <Bar data={barChartKilometraje} options={{ responsive: true }} />;
};

export default BarChartKilometraje;
