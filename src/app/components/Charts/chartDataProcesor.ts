import { AnalyticsData, Avg } from "../../context/AnalyticsContext";

//Como se van a estructurar los datos para usarlos en nuestros graficos
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
      time?: string;
    }[];
  };
}

//Función para obtener un color random - (Idea: Implementar array con paletas de colores)
function getRandomColor() {
  return `hsl(${Math.random() * 360}, 70%, 50%)`;
}

//Procesar dias, horas y minutos a segundos. - (Implementar la conversión de año y mes)
function processInterval(avg: Avg): number {
  return (
    avg.years * 365 * 24 * 60 * 60 +
    avg.months * 30 * 24 * 60 * 60 +
    avg.days * 24 * 60 * 60 +
    avg.hours * 60 * 60 +
    avg.minutes * 60 +
    avg.seconds
  );
}

//Función que se encarga de procesar cada grafico de tipo barra
function processBarChartData(chart: AnalyticsData): ProcessedChartData | null {
  if (chart.values.length === 0) return null;

  //Determina si el grafico de barras es uno común o uno apilado (stacked)
  // Si hay mas de un valor con el mismo 'type' o 'status', se considera un grafico apilado.
  const isStacked = chart.values.some(
    (value) =>
      chart.values.filter(
        (v) => (v.type === value.type) || 
        (v.status === value.status) || 
        (v.priority === value.priority) || 
        (v.title === value.title) ||
        (v.brand === value.brand) ||
        (v.category === value.category)
      ).length > 1
  );

  //Si el grafico de barras es de tipo stacked, agrupa los datos por 'type' y subcategorias como 'status' o 'priority'
  if (isStacked) {
    const groupedData: Record<string, Record<string, number>> = {}; // Almacena los datos agrupados
    const subLabels: Set<string> = new Set(); // Almacena las etiquetas unicas de subgrupos (como 'status' o 'priority')

    // Itera sobre cada valor para agruparlos por 'type' y subgrupos ('status' o 'priority')
    chart.values.forEach((value) => {
      const mainKey = value.type || value.status || value.title || value.brand || value.model || value.year || value.axles || value.seats || value.load || value.provider_name || value.name || ''; // 'type' principal (o 'status' si no tiene 'type')
      const subKey = value.status || value.priority || value.category || ''; // Subgrupo (primero 'status', despues 'priority' si aplica)
      const count = value.count || value.quantity || (value.avg ? processInterval(value.avg) : 0);// Calcula la cantidad (usa avg si no hay 'count')

      // Si no existe el 'mainKey' en el objeto 'groupedData', lo inicializa
      if (!groupedData[mainKey]) {
        groupedData[mainKey] = {}; // Cada 'mainKey' tendrá un subgrupo con su propio conteo
      }

      // Asigna el conteo al subgrupo correspondiente
      groupedData[mainKey][subKey] = count;
      subLabels.add(subKey); // Agrega el subgrupo al conjunto de subetiquetas unicas
    });

    // 'labels' contiene todos los tipos principales ('type' o 'status')
    const labels = Object.keys(groupedData);

    // 'datasets' es un array que contiene cada subgrupo (subetiqueta) con sus datos asociados
    const datasets = Array.from(subLabels).map((subLabel) => ({
      label: subLabel, // Subgrupo como 'TODO', 'DONE', etc.
      data: labels.map((label) => groupedData[label][subLabel] || 0), // Datos para cada etiqueta principal (si no existe, se pone 0)
      backgroundColor: getRandomColor(), // Color aleatorio para cada subgrupo - (CAMBIAR)
    }));

    // Retorna los datos estructurados para un grafico de barras apiladas
    return {
      origin: chart.origin,
      title: chart.description,
      type: "bar",
      data: { labels, datasets },
    };
  }
  // Si el gráfico no es apilado
  // Procesa los datos de forma mas simple, sin subcategorias
  else {
    return {
      origin: chart.origin,
      title: chart.description,
      type: "bar",
      data: {
        labels: chart.values.map(value => value.type || value.status || value.name || value.title || value.brand || value.category || value.year?.toString() || ''),
        datasets: [
          {
            label: "Cantidad",
            data: chart.values.map(value => value.count || value.quantity || (value.avg ? processInterval(value.avg) : 0)),
            backgroundColor: chart.values.map(() => getRandomColor()),
          },
        ],
      },
    };
  }
}

//Función que estructura los graficos de tipo pie
function processPieChartData(chart: AnalyticsData): ProcessedChartData | null {
  if (chart.values.length === 0) return null;

  return {
    origin: chart.origin,
    title: chart.description,
    type: "pie",
    data: {
      labels: chart.values.map(value => value.status || value.concat || value.username || value.fuel_type || (value.has_trailer !== undefined ? (value.has_trailer ? 'Con trailer' : 'Sin trailer') : '')),
      datasets: [
        {
          label: "Cantidad",
          data: chart.values.map((value) => value.count || 0),
          backgroundColor: chart.values.map(() => getRandomColor()),
        },
      ],
    },
  };
}

// Función que estructura los gráficos de tipo valor unico
// (valor unico - Se puede implementar una statCard como en el dashboard)
function processValueData(chart: AnalyticsData): ProcessedChartData | null {
  if (chart.values.length === 0) return null;

  const avgValue = chart.values[0].avg;
  let value: number;
  let timeUnit: string = "";

  if (avgValue && avgValue.type === "interval") {
    if (avgValue.years > 0) {
      value = avgValue.years;
      timeUnit = "Años";
    } else if (avgValue.months > 0) {
      value = avgValue.months;
      timeUnit = "Meses";
    } else if (avgValue.days > 0) {
      value = avgValue.days;
      timeUnit = "Días";
    } else if (avgValue.hours > 0) {
      value = avgValue.hours;
      timeUnit = "Horas";
    } else if (avgValue.minutes > 0) {
      value = avgValue.minutes;
      timeUnit = "Minutos";
    } else {
      value = Math.round(avgValue.seconds);
      timeUnit = "Segundos";
    }
  } else {
    value = chart.values[0].quantity || chart.values[0].count || 0;
  }

  return {
    origin: chart.origin,
    title: chart.description,
    type: "value",
    data: {
      labels: [chart.description],
      datasets: [
        {
          label: "Valor",
          data: value,
          time: timeUnit
        },
      ],
    },
  };
}

// Función principal que va a ser llamada desde afuera
// procesa los datos dependiendo del tipo de gráfico
export function processChartData(
  analyticsData: AnalyticsData[]
): ProcessedChartData[] {
  return analyticsData
    .map((chart) => {

      if (chart.values.length === 0) {
        return null;
      }

      switch (chart.type) {
        case "BARS":
          return processBarChartData(chart);
        case "PIE":
          return processPieChartData(chart);
        case "VALUE":
          return processValueData(chart);
        default:
          console.warn(`Unsupported chart type: ${chart.type}`);
          return null;
      }
    })
    .filter((chart): chart is ProcessedChartData => chart !== null);
}
