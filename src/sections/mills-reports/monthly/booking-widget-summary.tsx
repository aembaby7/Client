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
  total: number;
  icon: React.ReactElement;
  isPercent?: boolean;
  isNotRound?: boolean;
  color?: string;
}

export default function BookingWidgetSummary({
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
        position: 'relative',
        p: 3,
        ...sx,
      }}
      {...other}
    >
      <Box
        component="span"
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          fontSize: 28, // Set the font size here for a reliable result
        }}
      >
        {icon}
      </Box>

      <Box sx={{ width: '100%' }}>
        <Box sx={{ mb: 1, typography: 'h3' }}>
          {isPercent != undefined && isPercent
            ? fPercent(total)
            : isNotRound != undefined && isNotRound
              ? fNumber(total)
              : fNumberRound(total)}
        </Box>
        <Box sx={{ color: color, typography: 'subtitle2' }}>{title}</Box>
        <Box sx={{ color: color, fontSize: 'small' }}>{subTitle}</Box>
      </Box>
    </Card>
  );
}