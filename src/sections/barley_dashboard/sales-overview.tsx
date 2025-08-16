import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import LinearProgress from '@mui/material/LinearProgress';

import { fPercent, fCurrency, fShortenNumber_ } from 'src/utils/format-number';
import { Box } from '@mui/material';
import { CardContent, IconButton, Tooltip, Typography } from '@mui/material';
import { VisibilityOutlined, VisibilityOffOutlined } from '@mui/icons-material';
import { useState } from 'react';
import BookingTotalIncomes from './booking-total-incomes';
import Chart from 'src/components/chart';
import BookingTotalIncomesBasic from './booking-total-incomes-basic';
// ----------------------------------------------------------------------

type ItemProps = {
  label: string;
  value: number;
  totalAmount: number;
  subLabel?: string;
  yearsTotalSales?: customerYearsTotalSales[];
  monthsTotalSales?: customerMonthTotalSales[];
  growthRate?: number;
  serial?: number;
};
type customerYearsTotalSales = {
  uCustomerId: number;
  year: number;
  totalWeightInTons: number;
};
type customerMonthTotalSales = {
  uCustomerId: number;
  month: string;
  totalWeightInTons: number;
};
interface Props extends CardProps {
  title?: string;
  subheader?: string;
  total?: number;
  data: ItemProps[];
}
type seriesDto = {
  x: number;
  y: number;
};
type seriesDto2 = {
  x: string;
  y: number;
};
export default function YSalesOverview({ title, subheader, data, total, ...other }: Props) {
  const [showGraph, setShowGraph] = useState(true);
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
          <Box width="100%">
            <Stack spacing={4} sx={{ px: 3, pt: 3, pb: 5 }}>
              {data &&
                data.map((progress) => (
                  <ProgressItem
                    key={progress.label}
                    progress={progress}
                    generalTotalAmount={total!}
                  />
                ))}
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ProgressItemProps = {
  progress: ItemProps;
  generalTotalAmount: number;
};

function ProgressItem({ progress, generalTotalAmount }: ProgressItemProps) {
  var seriesDtos: seriesDto[] = [];
  progress.yearsTotalSales!.map((r: customerYearsTotalSales) =>
    seriesDtos.push({
      x: r.year,
      y: r.totalWeightInTons,
    })
  );

  var seriesMonthDtos: seriesDto2[] = [];
  progress.monthsTotalSales!.map((r: customerMonthTotalSales) =>
    seriesMonthDtos.push({
      x: r.month,
      y: r.totalWeightInTons,
    })
  );

  return (
    <Stack spacing={1}>
      <Stack direction="row" alignItems="center">
        {/* <Typography variant="subtitle2">{fShortenNumber_(progress.totalAmount)}</Typography> */}

        {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          &nbsp;({fPercent((progress.totalAmount / generalTotalAmount) * 100)})
        </Typography> */}
      </Stack>
      <Box sx={{ typography: 'body2', color: 'text.disabled', mt: 0.0 }}>
        <BookingTotalIncomesBasic
          serial={progress.serial}
          title={progress.label}
          subTitle={progress.subLabel}
          total={progress.totalAmount}
          totalPercent={(progress.totalAmount / generalTotalAmount) * 100}
          percent={progress.growthRate!}
          chart={{
            series: seriesDtos,
          }}
          chart2={{
            series2: seriesMonthDtos,
          }}
        />
      </Box>

      <LinearProgress
        variant="determinate"
        value={(progress.totalAmount / generalTotalAmount) * 100}
        color={
          ((progress.totalAmount / generalTotalAmount) * 100 > 10 && 'error') ||
          ((progress.totalAmount / generalTotalAmount) * 100 > 5 && 'warning') ||
          'info'
        }
      />
    </Stack>
  );
}
