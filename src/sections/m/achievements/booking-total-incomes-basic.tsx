import { ApexOptions } from 'apexcharts';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { CardProps } from '@mui/material/Card';
import { alpha, useTheme } from '@mui/material/styles';

import { fPercent, fCurrency, fTon, fNumber } from 'src/utils/format-number';

import { bgGradient } from 'src/theme/css';
import { ColorSchema } from 'src/theme/palette';

import Iconify from 'src/components/iconify';
import Chart, { useChart } from 'src/components/chart';
import { isNumber } from 'lodash';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  serial?: number;
  total: number;
  totalPercent?: number;
  title: string;
  subTitle?: string;
  percent?: number;
  color?: ColorSchema;
  chart: {
    colors?: string[];
    series: {
      x: number;
      y: number;
    }[];

    options?: ApexOptions;
  };
  chart2: {
    series2: {
      x: string;
      y: number;
    }[];

    options?: ApexOptions;
  };
}

export default function BookingTotalIncomesBasic({
  serial,
  title,
  total,
  totalPercent,
  subTitle,
  percent,
  color = 'primary',
  chart,
  chart2,
  sx,
  ...other
}: Props) {
  const theme = useTheme();

  const {
    colors = [theme.palette[color].main, theme.palette[color].dark],
    series,
    options,
  } = chart;
  const { series2 } = chart2;

  const chartOptions = useChart({
    colors: [colors[1]],
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          { offset: 0, color: colors[0], opacity: 1 },
          { offset: 100, color: colors[1], opacity: 1 },
        ],
      },
    },
    chart: {
      sparkline: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2,
      },
    },
    xaxis: {
      labels: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    stroke: {
      width: 4,
    },
    dataLabels: {
      enabled: true,
      formatter: (value: number) => fNumber(value),
      textAnchor: 'start',
      distributed: true,
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
    },
    tooltip: {
      marker: {
        show: false,
      },
      y: {
        formatter: (value: number) => fTon(value),
        title: {
          formatter: () => '',
        },
      },
    },
    ...options,
  });

  return (
    <Stack
      sx={{
        ...bgGradient({
          direction: '135deg',
          startColor: alpha(theme.palette[color].light, 0.2),
          endColor: alpha(theme.palette[color].main, 0.2),
        }),
        p: 3,
        borderRadius: 2,
        color: `${color}.darker`,
        backgroundColor: 'common.white',
        ...sx,
      }}
      {...other}
    >
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
        <div>
          <Box sx={{ mb: 1, typography: 'h4' }}>{serial + ' - ' + title}</Box>
          <Box sx={{ mb: 3, typography: 'h6', fontWeight: 'normal' }}>{subTitle}</Box>
          <Box sx={{ mb: 1, typography: 'h4' }}>{fNumber(total)} طن</Box>
          <Stack direction="row" sx={{ mb: 3 }}>
            <Box sx={{ mb: 1, typography: 'subtitle2' }}> {fPercent(totalPercent!)} </Box>
            <Box sx={{ width: 5 }}> </Box>
            <Box>من اجمالي مبيعات الفترة </Box>
          </Stack>
        </div>
        {isNumber(percent) && (
          <div>
            <Stack spacing={0.5} direction="row" alignItems="center" justifyContent="flex-end">
              <Iconify icon={percent! >= 0 ? 'eva:trending-up-fill' : 'eva:trending-down-fill'} />

              <Box sx={{ typography: 'h4' }}>
                {percent! > 0 && '+'}
                {fPercent(percent!)}
              </Box>
            </Stack>

            <Box sx={{ mt: 0.5, opacity: 0.8, typography: 'body2' }}>
              للفترة المماثلة من العام السابق
            </Box>
          </div>
        )}
      </Stack>
      {series2.length > 1 && (
        <Box sx={{ mt: 0.5, opacity: 0.8, typography: 'body2' }}>
          <Box sx={{ mb: 3, typography: 'h6', fontWeight: 'normal' }}>
            {' '}
            المبيعات الشهرية خلال الفترة
          </Box>
          <Chart
            dir="ltr"
            type="line"
            series={[{ data: series2 }]}
            options={chartOptions}
            width="100%"
            height={118}
          />
        </Box>
      )}
      <br />
      <br />
      {series.length > 1 && (
        <Box sx={{ mt: 0.5, opacity: 0.8, typography: 'body2' }}>
          <Box sx={{ mb: 3, typography: 'h6', fontWeight: 'normal' }}>
            {' '}
            المبيعات السنوية وفق الفترة
          </Box>
          <Chart
            dir="ltr"
            type="line"
            series={[{ data: series }]}
            options={chartOptions}
            width="100%"
            height={118}
          />
        </Box>
      )}
    </Stack>
  );
}
