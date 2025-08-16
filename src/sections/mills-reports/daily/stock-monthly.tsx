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
import { fNumber } from 'src/utils/format-number';
import { Tab, Tabs } from '@mui/material';
import { AccountBalance, Houseboat, Place, Store } from '@mui/icons-material';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  chart: {
    categories?: string[];
    colors?: string[];
    generalSeries: {
      data: {
        name: string;
        data: number[];
      }[];
    }[];
    companiesSeries: {
      data: {
        name: string;
        data: number[];
      }[];
    }[];
    portsSeries: {
      data: {
        name: string;
        data: number[];
      }[];
    }[];
    options?: ApexOptions;
  };
}

export default function StockMonthly({ title, subheader, chart, ...other }: Props) {
  const [tabIndex, setTabIndex] = useState(0);
  const { colors, categories, generalSeries, companiesSeries, portsSeries, options } = chart;

  const popover = usePopover();

  const chartOptions = useChart({
    colors,
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
    stroke: {
      // width: 4,
      // curve: 'smooth',
    },
    dataLabels: {
      enabled: true,
      formatter: (value: number) => fNumber(value),
    },
    xaxis: {
      categories,
    },
    ...options,
  });
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        aria-label="tabs 4"
        sx={{ padding: '0 20px', marginTop: '15px' }}
      >
        <Tab label="الكل" icon={<AccountBalance />} />
        <Tab label="الشركات" icon={<Store />} />
        <Tab label="الموانئ" icon={<Houseboat />} />
      </Tabs>
      {tabIndex === 0 &&
        generalSeries.map((item, index) => (
          <Box key={index} sx={{ mt: 3, mx: 3 }}>
            <Chart
              dir="ltr"
              type="area"
              series={item.data}
              options={chartOptions}
              width="100%"
              height={500}
            />
          </Box>
        ))}
      {tabIndex === 1 &&
        companiesSeries.map((item, index) => (
          <Box key={index} sx={{ mt: 3, mx: 3 }}>
            <Chart
              dir="ltr"
              type="area"
              series={item.data}
              options={chartOptions}
              width="100%"
              height={500}
            />
          </Box>
        ))}
      {tabIndex === 2 &&
        portsSeries.map((item, index) => (
          <Box key={index} sx={{ mt: 3, mx: 3 }}>
            <Chart
              dir="ltr"
              type="area"
              series={item.data}
              options={chartOptions}
              width="100%"
              height={500}
            />
          </Box>
        ))}
    </Card>
  );
}
