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
import { StyledIcon } from 'src/components/snackbar/styles';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
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

export default function YearlySalesInQty({ title, subheader, chart, ...other }: Props) {
  const { categories, colors, series, options } = chart;

  const popover = usePopover();

  const [seriesData, setSeriesData] = useState('Year');
  var labelColor = '#304758';
  const chartOptions = useChart({
    // colors,
    // colors: [
    //   // this array contains different color code for each data
    //   '#439292',
    //   '#d4526e',
    //   '#2b908f',
    //   '#c8cfd3',
    //   '#A5978B',
    //   '#f9a3a4',
    //   '#90ee7e',
    //   '#f48024',
    //   '#69d2e7',
    // ],
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
            preValue = opt.w.config.series[opt.seriesIndex].data[opt.dataPointIndex - 2];
          }
          var currentValue = opt.w.config.series[opt.seriesIndex].data[opt.dataPointIndex];
          var perc = fPercent(((currentValue - preValue) / preValue) * 100);
          // labelColor = '#da5a1f';
          // return `${fTon(currentValue) + ' (' + perc})`;
          return fNumber(val);
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
    legend: {
      show: false,
    },
    tooltip: {
      y: {
        formatter: function (val: number, opts: any) {
          if (opts.dataPointIndex > 0) {
            var iniValue = opts.w.config.series[opts.seriesIndex].data[0];
            var preValue = 0;
            if (opts.w.config.series[opts.seriesIndex].data.length - 1 != opts.dataPointIndex) {
              preValue = opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex - 1];
            } else {
              preValue = opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex - 2];
            }
            var currentValue = opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex];
            var perc = fPercent(((currentValue - iniValue) / iniValue) * 100);
            // labelColor = '#da5a1f';
            // return fNumber(currentValue) + '<br/>' + '(' + perc + ')';
            // return [fNumber(currentValue), perc];
            return fTon(currentValue) + ' ' + '(' + perc + ')';
            // return `${perc}`;
          }
          // return `${val} / ${perc}`;
          // if (goals && goals.length) {
          //   return `${val} / ${goals[0].value}`;
          // }
          else return fTon(val);
        },
      },
    },
    ...options,
  });

  return (
    <>
      <Card {...other}>
        <CardHeader title={title} subheader={subheader} />

        {series.map((item) => (
          <Box key={item.type} sx={{ mt: 3, mx: 3 }}>
            <Chart
              dir="ltr"
              type="bar"
              series={item.data}
              options={chartOptions}
              width="100%"
              height={364}
            />
          </Box>
        ))}
      </Card>
    </>
  );
}
