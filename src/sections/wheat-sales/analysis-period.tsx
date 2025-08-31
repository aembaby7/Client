import React from 'react';
import { Paper, Grid, Avatar, Typography, Chip, alpha, useTheme } from '@mui/material';
import { DateRange } from '@mui/icons-material';

interface AnalysisPeriodProps {
  firstMonthIndex: number;
  lastMonthIndex: number;
  monthsCount: number;
  year: number;
}

const monthNames = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

export default function AnalysisPeriod({
  firstMonthIndex,
  lastMonthIndex,
  monthsCount,
  year,
}: AnalysisPeriodProps) {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 3,
        p: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(
          theme.palette.primary.main,
          0.05
        )} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        borderRadius: 2,
      }}
    >
      <Grid container alignItems="center" spacing={2}>
        <Grid item>
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              width: 56,
              height: 56,
            }}
          >
            <DateRange />
          </Avatar>
        </Grid>
        <Grid item xs>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            فترة التحليل
          </Typography>
          <Typography variant="body1">
            {monthNames[firstMonthIndex]} - {monthNames[lastMonthIndex]} {year}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            مقارنة مع نفس الفترة من {year - 1}
          </Typography>
        </Grid>
        <Grid item>
          <Chip
            label={`${monthsCount} أشهر`}
            color="primary"
            sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

// Helper function to get data period from mainInfo
export function getDataPeriod(data: any) {
  let firstMonth = 11; // Start with December
  let lastMonth = 0;

  // Handle both data structures: data.monthlySales.companies and data.companies
  const companies = data.monthlySales?.companies || data.companies || [];

  // Check all branches across all companies to find the data period
  companies.forEach((company: any) => {
    company.branches.forEach((branch: any) => {
      for (let i = 0; i < branch.monthlySalesCYear.length; i++) {
        if (branch.monthlySalesCYear[i] > 0) {
          firstMonth = Math.min(firstMonth, i);
          lastMonth = Math.max(lastMonth, i);
        }
      }
    });
  });

  const monthsCount = lastMonth - firstMonth + 1;

  return { firstMonth, lastMonth, monthsCount };
}
