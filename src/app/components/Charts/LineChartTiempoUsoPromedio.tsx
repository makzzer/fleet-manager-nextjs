import { Line } from "react-chartjs-2";

interface LineChartTiempoUsoPromedioProps {
  tiempoUsoPromedio: number[];
  label?: string[];
}

const LineChartUsoPromedio = ({
  tiempoUsoPromedio,
  label,
}: LineChartTiempoUsoPromedioProps) => {
  const defaultLabels: string[] = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
  ];

  const lineChartTiempoUsoPromedio = {
    labels: defaultLabels || label,
    datasets: [
      {
        label: "Horas",
        data: tiempoUsoPromedio,
        backgroundColor: "#c200fb",
        borderColor: "#c200ff",
      },
    ],
  };

  return (
    <Line data={lineChartTiempoUsoPromedio} options={{ responsive: true }} />
  );
};

export default LineChartUsoPromedio;
