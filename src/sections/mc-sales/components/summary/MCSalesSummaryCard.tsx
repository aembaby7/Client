import React from 'react';
import { Card, CardContent, Stack, Box, Typography } from '@mui/material';

interface MCSalesSummaryCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  bottomText?: string;
  bottomIcon?: React.ReactNode;
  topBorder?: boolean;
  topBorderColor?: string;
  onHover?: boolean;
}

export const MCSalesSummaryCard: React.FC<MCSalesSummaryCardProps> = ({
  title,
  value,
  unit,
  icon,
  iconBgColor = '#F3F4F6',
  bottomText,
  bottomIcon,
  topBorder = false,
  topBorderColor,
  onHover = true,
}) => {
  return (
    <Card
      sx={{
        bgcolor: 'white',
        borderRadius: 3,
        boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.04)',
        border: 'none',
        transition: 'all 0.2s ease',
        cursor: onHover ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        ...(onHover && {
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 12px 24px rgba(0,0,0,0.08)',
          },
        }),
      }}
    >
      {topBorder && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: topBorderColor || 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
          }}
        />
      )}
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: '#6B7280',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                {title}
              </Typography>
              <Stack direction="row" alignItems="baseline" spacing={1}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: '#111827',
                    fontSize: '2.5rem',
                    lineHeight: 1,
                  }}
                >
                  {typeof value === 'number' ? new Intl.NumberFormat('en-US').format(value) : value}
                </Typography>
                {unit && (
                  <Typography
                    sx={{
                      color: '#9CA3AF',
                      fontSize: '1.125rem',
                      fontWeight: 500,
                    }}
                  >
                    {unit}
                  </Typography>
                )}
              </Stack>
            </Box>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: iconBgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </Box>
          </Stack>
          {(bottomText || bottomIcon) && (
            <Box sx={{ pt: 2, borderTop: '1px solid #F3F4F6' }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                {bottomIcon}
                {bottomText && (
                  <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.875rem' }}>
                    {bottomText}
                  </Typography>
                )}
              </Stack>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
