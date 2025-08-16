import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = {
  series: {
    name: string;
    data: number[];
  }[];
};

export default function ChartColumnMultipleO({ series }: Props) {
  const chartOptions = useChart({
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: [
        'غير محدد',
        'الرياض',
        'القصيم',
        'الخرج',
        'الجوف',
        'تبوك',
        'حائل',
        'وادي الدواسر',
        'الأحساء',
      ],
    },
    tooltip: {
      y: {
        formatter: (value: number) => ` ${value} `,
      },
    },
    plotOptions: { bar: { columnWidth: '36%' } },
  });

  return (
    <Chart dir="ltr" type="bar" series={series} options={chartOptions} width="100%" height={320} />
  );
}
