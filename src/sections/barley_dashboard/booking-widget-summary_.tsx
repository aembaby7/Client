import Box from '@mui/material/Box';
import Card, { CardProps } from '@mui/material/Card';

import {
  fNumber,
  fNumberP,
  fNumberRound,
  fPercent,
  fShortenNumber,
  fShortenNumberR,
} from 'src/utils/format-number';
import TextField from '@mui/material/TextField';
import { Subtitles } from '@mui/icons-material';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  subTitle?: string;
  total: string;
  icon: React.ReactElement;
  isPercent?: boolean;
  isNotRound?: boolean;
  color?: string;
}

export default function BookingWidgetSummary_({
  title,
  subTitle,
  total,
  icon,
  isPercent,
  isNotRound,
  color,
  sx,
  ...other
}: Props) {
  color = color ?? 'text.secondary';
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
        <Box sx={{ mb: 1, typography: 'h3' }}>{total}</Box>
        <Box sx={{ color: color, typography: 'subtitle2' }}>{title}</Box>
        <Box sx={{ color: color, fontSize: 'small' }}>{subTitle}</Box>
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
