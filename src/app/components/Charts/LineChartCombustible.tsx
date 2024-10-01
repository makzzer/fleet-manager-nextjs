import { Line } from "react-chartjs-2";

interface LineChartCombustibleProps {
  combustible: number[];
  label?: string[];
}

const LineChartCombustible = ({
  combustible,
  label,
}: LineChartCombustibleProps) => {
  const defaultLabels: string[] = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
  ];

  const lineChartCombustible = {
    labels: defaultLabels || label,
    datasets: [
      {
        label: "Litros de Combustible",
        data: combustible,
        backgroundColor: "#dc0073",
        borderColor: "#dc0085",
      },
    ],
  };

  return <Line data={lineChartCombustible} options={{ responsive: true }} />;
};

export default LineChartCombustible;
