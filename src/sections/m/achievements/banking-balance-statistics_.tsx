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
import { fNumber, fPercent, fTon } from 'src/utils/format-number';

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

export default function BankingBalanceStatistics_({
  title,
  defaultState,
  subheader,
  chart,
  ...other
}: Props) {
  const { categories, colors, series, options } = chart;

  const popover = usePopover();

  const [seriesData, setSeriesData] = useState(defaultState);

  const chartOptions = useChart({
    colors,
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories,
    },
    plotOptions: {
      bar: {
        // distributed: true,
        borderRadius: 10,
        dataLabels: {
          position: 'top', // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: string, opt: any) {
        if (opt.dataPointIndex > 0) {
          var preValue = 0;
          if (opt.w.config.series[opt.seriesIndex].data.length - 1 != opt.dataPointIndex) {
            preValue = opt.w.config.series[opt.seriesIndex].data[opt.dataPointIndex - 1];
          } else {
            preValue = opt.w.config.series[opt.seriesIndex].data[opt.dataPointIndex - 1];
          }
          var currentValue = opt.w.config.series[opt.seriesIndex].data[opt.dataPointIndex];
          var perc = fPercent(((currentValue - preValue) / preValue) * 100);
          // labelColor = '#da5a1f';
          return `${fNumber(currentValue)}`;
          // return fNumber(val);
        }
        // return `${val} / ${perc}`;
        // if (goals && goals.length) {
        //   return `${val} / ${goals[0].value}`;
        // }
        else return fTon(val);
      },
      style: {
        fontSize: '12px',
        colors: ['#304758'],
      },
      offsetY: -30,
    },
    // plotOptions: {
    //   bar: {
    //     borderRadius: 10,
    //     dataLabels: {
    //       position: 'top', // top, center, bottom
    //     },
    //   },
    // },
    // dataLabels: {
    //   enabled: true,
    //   formatter: function (val: string, opt: any) {
    //     return fNumber(val);
    //   },
    //   style: {
    //     fontSize: '12px',
    //     colors: ['#304758'],
    //   },
    //   offsetY: -30,
    // },
    tooltip: {
      y: {
        formatter: (value: number) => fNumber(value),
      },
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
