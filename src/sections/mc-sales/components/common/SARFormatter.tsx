import React from 'react';
import { Stack, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { SARIcon } from './SARIcon';
import { formatSAR } from '../../utils/formatters';

interface SARFormatterProps {
  value: number | string | null | undefined;
  showIcon?: boolean;
  iconSize?: number;
  variant?: 'default' | 'highlighted';
}

export const SARFormatter: React.FC<SARFormatterProps> = ({
  value,
  showIcon = true,
  iconSize = 16,
  variant = 'default',
}) => {
  const theme = useTheme();

  const isHighlighted = variant === 'highlighted';

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.8}
      sx={{
        ...(isHighlighted && {
          px: 1.2,
          py: 0.6,
          borderRadius: 1.5,
          bgcolor: '#F0FDF4',
          border: '1px solid #BBF7D0',
        }),
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          color: isHighlighted ? '#15803D' : 'text.primary',
          fontSize: isHighlighted ? '0.9rem' : '0.875rem',
        }}
      >
        {formatSAR(value)}
      </Typography>
      {showIcon && <SARIcon size={iconSize} color={isHighlighted ? '#15803D' : 'currentColor'} />}
    </Stack>
  );
};
