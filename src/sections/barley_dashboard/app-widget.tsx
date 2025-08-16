import { ApexOptions } from 'apexcharts';
import { useTheme } from '@mui/material/styles';
import ListItemText from '@mui/material/ListItemText';
import Stack, { StackProps } from '@mui/material/Stack';
import { fNumber } from 'src/utils/format-number';
import { ColorSchema } from 'src/theme/palette';
import Iconify from 'src/components/iconify';
import Chart, { useChart } from 'src/components/chart';
import { Box, Grid, Typography } from '@mui/material';

// ----------------------------------------------------------------------

interface Props extends StackProps {
  icon: string;
  // title: string;
  stockTitle: string;
  stockQty: number;
  stockInitialTitle: string;
  stockInitialQty: number;
  inQtyTitle: string;
  inQtyTotal: number;
  salesAverageTitle: string;
  salesAverageValue: number;
  salesTitle: string;
  salesTotal: number;
  salesDaysTitle: string;
  salesDaysTotal: number;
  sufficiencyInDaysTitle: string;
  sufficiencyInDaysTotal: number;
  lastUpdateTitle?: string;
  lastUpdate?: string;
  status: number;
  statusDesc: string;
  color?: ColorSchema;
  chart: {
    color?: string[];
    series: number;
    options?: ApexOptions;
  };
}

export default function BarleyAppWidget({
  // title,
  stockTitle,
  stockQty,
  stockInitialTitle,
  stockInitialQty,
  inQtyTitle,
  inQtyTotal,
  salesAverageTitle,
  salesAverageValue,
  salesTitle,
  salesTotal,
  salesDaysTitle,
  salesDaysTotal,
  sufficiencyInDaysTitle,
  sufficiencyInDaysTotal,
  lastUpdateTitle,
  lastUpdate,
  status,
  statusDesc,
  icon,
  color = 'primary',
  chart,
  sx,
  ...other
}: Props) {
  const theme = useTheme();

  const { series, options } = chart;

  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    legend: {
      show: false,
    },
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          { offset: 0, color: theme.palette[color].light, opacity: 1 },
          { offset: 100, color: theme.palette[color].main, opacity: 1 },
        ],
      },
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '78%',
        },
        track: {
          margin: 0,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: 6,
            color: theme.palette.common.white,
            fontSize: theme.typography.subtitle2.fontSize as string,
          },
        },
      },
    },
    ...options,
  });

  return (
    <>
      <Grid container spacing={3} direction="row-reverse">
        {/* Center the main numbers */}
        <Grid item xs={6} container justifyContent="left" sx={{ marginBottom: 2 }}>
          <Stack
            spacing={{ xs: 2, sm: 1 }}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'right' }}
          >
            <Typography variant="subtitle2" sx={{ color: 'white' }}>
              {fNumber(stockQty)}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: 'white' }}>
              {fNumber(stockInitialQty)}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: 'white' }}>
              {fNumber(inQtyTotal)}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: 'white' }}>
              {fNumber(salesTotal)}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: 'white' }}>
              {fNumber(salesDaysTotal)}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: 'white' }}>
              {fNumber(salesAverageValue)}
            </Typography>
            {/* Centered sufficiencyInDaysTotal */}
            {status == 0 && (
              <Typography variant="subtitle2" sx={{ color: 'white' }}>
                {statusDesc}
              </Typography>
            )}
            {status == 1 && (
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'white',
                  backgroundColor: '#0e0e0e59',
                  borderRadius: '5px',
                  height: '35px',
                  width: '35px',
                  padding: '5px',
                  fontSize: '18px',
                  margin: '-5px 0px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {fNumber(sufficiencyInDaysTotal)}
              </Typography>
            )}

            <Typography sx={{ color: 'white' }}>{lastUpdate}</Typography>
          </Stack>
        </Grid>

        {/* Align Arabic titles with corresponding numbers */}
        <Grid item xs={6} sx={{ marginBottom: 2 }}>
          <Stack spacing={1}>
            <Typography sx={{ opacity: 0.64, color: 'white' }}>{stockTitle}</Typography>
            <Typography sx={{ opacity: 0.64, color: 'white' }}>{stockInitialTitle}</Typography>
            <Typography sx={{ opacity: 0.64, color: 'white' }}>{inQtyTitle}</Typography>
            <Typography sx={{ opacity: 0.64, color: 'white' }}>{salesTitle}</Typography>
            <Typography sx={{ opacity: 0.64, color: 'white' }}>{salesDaysTitle}</Typography>
            <Typography sx={{ opacity: 0.64, color: 'white' }}>{salesAverageTitle}</Typography>
            <Typography sx={{ opacity: 0.64, color: 'white' }}>{sufficiencyInDaysTitle}</Typography>
            <Typography sx={{ opacity: 0.64, color: 'white' }}>{lastUpdateTitle}</Typography>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
