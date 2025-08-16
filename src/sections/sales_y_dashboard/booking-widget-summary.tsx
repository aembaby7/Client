import Box from '@mui/material/Box';
import Card, { CardProps } from '@mui/material/Card';

import { fNumber, fPercent, fShortenNumber, fShortenNumberR } from 'src/utils/format-number';
import TextField from '@mui/material/TextField';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  total: number;
  icon: React.ReactElement;
  isPercent?: boolean;
}

export default function BookingWidgetSummary({
  title,
  total,
  icon,
  isPercent,
  sx,
  ...other
}: Props) {
  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        pl: 3,
        ...sx,
      }}
      {...other}
    >
      <Box>
        <Box sx={{ mb: 1, typography: 'h3' }}>
          {isPercent != undefined && isPercent ? fPercent(total) : fShortenNumberR(total)}
        </Box>
        <Box sx={{ color: 'text.secondary', typography: 'subtitle2' }}>{title}</Box>
      </Box>

      <Box
        sx={{
          width: 120,
          height: 120,
          lineHeight: 0,
          borderRadius: '50%',
          bgcolor: 'background.neutral',
        }}
      >
        {icon}
      </Box>
    </Card>
  );
}
