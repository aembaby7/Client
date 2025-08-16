import { ApexOptions } from 'apexcharts';

import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import { styled, useTheme } from '@mui/material/styles';

import { fNumber, fShortenNumberR } from 'src/utils/format-number';

import Chart, { useChart } from 'src/components/chart';
import { VisibilityOutlined, VisibilityOffOutlined } from '@mui/icons-material';
import { useState } from 'react';
import { Box, CardContent, IconButton, Tooltip, Typography } from '@mui/material';

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

export default function AnalyticsCurrentVisits({ title, subheader, chart, ...other }: Props) {
  const theme = useTheme();

  const { colors, series, options } = chart;

  const chartSeries = series.map((i) => i.value);
  const [showGraph, setShowGraph] = useState(true);

  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    colors,
    labels: series.map((i) => i.label),
    stroke: {
      colors: [theme.palette.background.paper],
    },
    legend: {
      floating: true,
      horizontalAlign: 'center',
    },
    dataLabels: {
      enabled: true,
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value: number) => fShortenNumberR(value),
        title: {
          formatter: (seriesName: string) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{title}</Typography>
          <Box display="flex" alignItems="center" ml={2}>
            {showGraph && (
              <Tooltip title="اخفاء">
                <IconButton onClick={() => setShowGraph((s) => !s)}>
                  <VisibilityOutlined />
                </IconButton>
              </Tooltip>
            )}
            {!showGraph && (
              <Tooltip title="عرض">
                <IconButton onClick={() => setShowGraph((s) => !s)}>
                  <VisibilityOffOutlined />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
        {showGraph && (
          <Box sx={{ mx: 3 }}>
            <StyledChart
              dir="ltr"
              type="pie"
              series={chartSeries}
              options={chartOptions}
              width="100%"
              height={280}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
