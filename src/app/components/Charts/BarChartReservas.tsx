import { Bar } from "react-chartjs-2";

interface BarChartReservasProps {
  reservas: number[];
  label?: string[];
}

const BarChartReservas = ({ reservas, label }: BarChartReservasProps) => {
  const defaultLabels: string[] = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
  ];

  const barChartReservas = {
    labels: defaultLabels || label,
    datasets: [
      {
        label: "Reservas",
        data: reservas,
        backgroundColor: "#008bf8",
      },
    ],
  };

  return <Bar data={barChartReservas} options={{ responsive: true }} />;
};

export default BarChartReservas;
