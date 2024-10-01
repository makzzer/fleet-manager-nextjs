import { Doughnut } from "react-chartjs-2";

interface DoughnutChartPagoCombustibleProps {
  montoCombustible: number[];
  label?: string[];
}

const DoughnutChartPagoCombustible = ({
  montoCombustible,
  label,
}: DoughnutChartPagoCombustibleProps) => {
  const defaultLabels = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"];

  const doughnutChartPagoCombustible = {
    labels: defaultLabels || label,
    datasets: [
      {
        label: "Monto en $",
        data: montoCombustible,
        backgroundColor: [
          "#0ad2ff",
          "#2962ff",
          "#9500ff",
          "#ff0059",
          "#ff8c00",
          "#b4e600",
        ],
        hoverOffset: 4,
        borderColor: [
          "#2bd8ff",
          "#4274ff",
          "#a321ff",
          "#ff1e6d",
          "#ffa02d",
          "#b9e811",
        ],
      },
    ],
  };

  return (
    <Doughnut
      data={doughnutChartPagoCombustible}
      options={{ responsive: true }}
    />
  );
};

export default DoughnutChartPagoCombustible;
