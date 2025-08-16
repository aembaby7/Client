import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import LinearProgress from '@mui/material/LinearProgress';

import { fShortenNumber, fShortenNumber_ } from 'src/utils/format-number';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  total?: number;
  data: {
    status: string;
    quantity: number;
    value: number;
  }[];
}

export default function BookingBooked({ title, subheader, total, data, ...other }: Props) {
  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={total && <b>({fShortenNumber_(total!)})</b>}
      />

      <Stack spacing={3} sx={{ p: 3 }}>
        {data.map((progress) => (
          <Stack key={progress.status}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              <Box sx={{ typography: 'overline' }}>{progress.status}</Box>
              <Box sx={{ typography: 'subtitle1' }}>{fShortenNumber_(progress.quantity)}</Box>
            </Stack>

            <LinearProgress
              variant="determinate"
              value={progress.value}
              color={
                ((progress.status === 'Pending' ||
                  progress.status === 'منتهية' ||
                  progress.status === 'في إنتظار الحجز') &&
                  'warning') ||
                ((progress.status === 'Pending' ||
                  progress.status === 'منتهية' ||
                  progress.status === 'محجوزة (في انتظار التوريد)' ||
                  progress.status === 'قيد التوريد حالياً (داخل الفروع)') &&
                  'info') ||
                ((progress.status === 'Canceled' ||
                  progress.status === 'ملغية' ||
                  progress.status === 'شاحنات مرفوضة') &&
                  'error') ||
                'success'
              }
              sx={{
                height: 8,
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.16),
              }}
            />
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
