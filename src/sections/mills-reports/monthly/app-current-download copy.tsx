import { ApexOptions } from 'apexcharts';

import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import { styled, useTheme } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 400;

const LEGEND_HEIGHT = 72;

const StyledChart = styled(Chart)(({ theme }) => ({
  height: CHART_HEIGHT,
  '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
    height: `100% !important`,
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    borderTop: `dashed 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  chart: {
    colors?: string[];
    series: {
      label: string;
      value: number;
    }[];
    options?: ApexOptions;
  };
}

export default function AppCurrentDownload({ title, subheader, chart, ...other }: Props) {
  const theme = useTheme();

  const { colors, series, options } = chart;

  const chartSeries = series.map((i) => i.value);

  const chartOptions = useChart({
    chart: {
      width: 380,
      type: 'donut',
      dropShadow: {
        enabled: true,
        color: '#111',
        top: -1,
        left: 3,
        blur: 3,
        opacity: 0.5,
      },
    },

    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              showAlways: true,
              show: true,
            },
          },
        },
      },
    },
    dataLabels: {
      dropShadow: {
        blur: 3,
        opacity: 1,
      },
    },
    fill: {
      type: 'pattern',
      opacity: 1,
      pattern: {
        style: ['verticalLines', 'squares', 'horizontalLines', 'circles', 'slantedLines'],
      },
    },
    states: {},
    theme: {
      palette: 'palette2',
    },
    colors,
    labels: series.map((i) => i.label),
    stroke: { colors: [theme.palette.background.paper] },
    legend: {
      offsetY: 0,
      floating: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value: number) => fNumber(value),
        title: {
          formatter: (seriesName: string) => `${seriesName}`,
        },
      },
    },

    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 5 }} />

      <StyledChart
        dir="ltr"
        type="donut"
        series={chartSeries}
        options={chartOptions}
        width="100%"
        height={280}
      />
    </Card>
  );
}
