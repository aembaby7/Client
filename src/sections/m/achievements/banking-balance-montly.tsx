import { ApexOptions } from 'apexcharts';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';

import Iconify from 'src/components/iconify';
import Chart, { useChart } from 'src/components/chart';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { fNumber, fTon } from 'src/utils/format-number';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  defaultState?: string;
  subheader?: string;
  chart: {
    categories?: string[];
    colors?: string[];
    series: {
      type: string;
      data: {
        name: string;
        data: number[];
      }[];
    }[];
    options?: ApexOptions;
  };
}

export default function BankingBalanceMonthly({
  title,
  defaultState,
  subheader,
  chart,
  ...other
}: Props) {
  const { categories, series, options } = chart;

  const popover = usePopover();

  const [seriesData, setSeriesData] = useState(defaultState);

  const chartOptions = useChart({
    // Enhanced color palette for better visual distinction
    colors: ['#00A76F', '#2E93fA'],

    // Styling for the chart grid to be less intrusive
    grid: {
      strokeDashArray: 3,
      borderColor: 'rgba(145, 158, 171, 0.2)',
    },

    // Styling for the chart bars
    plotOptions: {
      bar: {
        columnWidth: '60%',
        borderRadius: 8,
      },
    },

    // Cleaner and better-positioned data labels
    dataLabels: {
      enabled: true,
      offsetY: -22,
      formatter: (val: string, opt: any) => {
        // Check series name to apply correct formatting (tons or plain number)
        const seriesName = opt.w.globals.seriesNames[opt.seriesIndex];
        if (seriesName === 'الكميات المخصصة') {
          return fTon(val);
        }
        return fNumber(val);
      },
      style: {
        fontSize: '12px',
        fontWeight: 600,
        colors: ['#333'],
      },
    },

    // More informative tooltip on hover
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number, { seriesIndex, w }: any) => {
          const seriesName = w.config.series[seriesIndex].name;
          if (seriesName === 'الكميات المخصصة') {
            return `${fTon(value)}`;
          }
          // Add context to the value (e.g., "344 customers")
          return `${fNumber(value)}`;
        },
      },
    },

    // General chart options
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories,
    },
    ...options,
  });

  const handleChangeSeries = useCallback(
    (newValue: string) => {
      popover.onClose();
      setSeriesData(newValue);
    },
    [popover]
  );

  return (
    <>
      <Card {...other}>
        <CardHeader
          title={title}
          subheader={subheader}
          action={
            <ButtonBase
              onClick={popover.onOpen}
              sx={{
                pl: 1,
                py: 0.5,
                pr: 0.5,
                borderRadius: 1,
                typography: 'subtitle2',
                bgcolor: 'background.neutral',
              }}
            >
              {seriesData}

              <Iconify
                width={16}
                icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                sx={{ ml: 0.5 }}
              />
            </ButtonBase>
          }
        />

        {series.map((item) => (
          <Box key={item.type} sx={{ mt: 3, mx: 3 }}>
            {item.type === seriesData && (
              <Chart
                dir="ltr"
                type="bar"
                series={item.data}
                options={chartOptions}
                width="100%"
                height={364}
              />
            )}
          </Box>
        ))}
      </Card>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
        {series.map((option) => (
          <MenuItem
            key={option.type}
            selected={option.type === seriesData}
            onClick={() => handleChangeSeries(option.type)}
          >
            {option.type}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
