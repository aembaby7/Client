import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = {
  series: number[];
  labels: string[];
};

export default function AppsPieN({ series, labels }: Props) {
  const chartOptions = useChart({
    labels,
    legend: {
      position: 'right',
      offsetX: -20,
      offsetY: 30,
      itemMargin: {
        vertical: 0,
      },
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: true,
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      fillSeriesColor: false,
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: false,
          },
        },
        dataLabels: {
          offset: 10,
          minAngleToShowLabel: 1,
        },
      },
    },
  });

  return (
    <Chart dir="ltr" type="pie" series={series} options={chartOptions} width={490} height="auto" />
  );
}
