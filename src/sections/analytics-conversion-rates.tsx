import { ApexOptions } from 'apexcharts';

import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';

import { fNumber, fShortenNumber2, fShortenNumberR } from 'src/utils/format-number';

import Chart, { useChart } from 'src/components/chart';
import { useState } from 'react';
import {
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from '@mui/material';
import { VisibilityOutlined, VisibilityOffOutlined } from '@mui/icons-material';
import {
  CardContent,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TableContainer,
  Tooltip,
  Typography,
} from '@mui/material';
import { TableChart as TableChartIcon } from '@mui/icons-material';

// ----------------------------------------------------------------------
type topRecord = {
  label: string;
  value: number;
  totalAmount: number;
  count?: number;
  subLabel?: string;
};
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
function getDataListValueTotal(series: { label: string; value: number }[]) {
  let total = 0;
  series.map((r: any) => (total += r.value));
  return fShortenNumber2(total);
}
export default function AnalyticsConversionRates({ title, subheader, chart, ...other }: Props) {
  const { colors, series, options } = chart;

  const chartSeries = series.map((i) => i.value);
  const [showGraph, setShowGraph] = useState(true);
  const [showTable, setShowTable] = useState(false);

  const chartOptions = useChart({
    colors,
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (value: number) => fShortenNumberR(value),
        title: {
          formatter: () => '',
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '28%',
        borderRadius: 2,
      },
    },
    xaxis: {
      categories: series.map((i) => i.label),
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
            <Tooltip title="عرض البيانات">
              <IconButton onClick={() => setShowTable((s) => !s)}>
                <TableChartIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        {showGraph && (
          <Box sx={{ mx: 3 }}>
            <Chart
              dir="ltr"
              type="bar"
              series={[{ data: chartSeries }]}
              options={chartOptions}
              width="100%"
              height={364}
            />
          </Box>
        )}
        {showTable && (
          <Box mt={2} width="100%">
            <Collapse in={true} timeout="auto" unmountOnExit>
              <CardContent>
                <TableContainer component={Paper}>
                  <Table size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ textAlign: 'center' }}>البيان</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>القيمة</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {series.map((option, index) => {
                        return (
                          <TableRow
                            key={index + 1}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell>{series[index].label}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
                              <b>{fShortenNumber2(series[index].value)}</b>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                    <TableFooter>
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell>الإجمالي</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>
                          <b>{getDataListValueTotal(series)}</b>
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
              </CardContent>
            </Collapse>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
