import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Chip,
  Stack,
  Paper,
  Avatar,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import {
  TrendingUp,
  TrendingDown,
  Assessment,
  ShowChart,
  PieChart,
  Speed,
} from '@mui/icons-material';
import { mainInfo } from './sales-data-view';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  position: 'relative',
  overflow: 'visible',
  '&:hover': {
    boxShadow: theme.shadows[8],
    transform: 'translateY(-2px)',
    transition: 'all 0.3s ease-in-out',
  },
}));

const KPIValue = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 700,
  lineHeight: 1,
  marginBottom: theme.spacing(1),
}));

const PercentageChange = ({
  value,
  size = 'medium',
}: {
  value: number;
  size?: 'small' | 'medium' | 'large';
}) => {
  const isPositive = value >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;
  const fontSize = size === 'large' ? '1.5rem' : size === 'medium' ? '1.2rem' : '0.9rem';

  return (
    <Chip
      icon={<Icon />}
      label={`${Math.abs(value).toFixed(1)}%`}
      size="small"
      sx={{
        backgroundColor: isPositive ? 'success.light' : 'error.light',
        color: isPositive ? 'success.dark' : 'error.dark',
        fontWeight: 'bold',
        fontSize,
        '& .MuiChip-icon': {
          color: 'inherit',
        },
      }}
    />
  );
};

interface ExecutiveSummaryKPIsProps {
  data: mainInfo;
  year: number;
}

export default function ExecutiveSummaryKPIs({ data, year }: ExecutiveSummaryKPIsProps) {
  const theme = useTheme();

  // Calculate total sales and growth
  const calculateTotalSales = () => {
    let totalCurrentYear = 0;
    let totalPreviousYear = 0;

    data.monthlySales.companies.forEach((company) => {
      company.branches.forEach((branch) => {
        totalCurrentYear += branch.monthlySalesCYear.reduce((a, b) => a + b, 0);
        totalPreviousYear += branch.monthlySalesPYear.reduce((a, b) => a + b, 0);
      });
    });

    const growth =
      totalPreviousYear > 0
        ? ((totalCurrentYear - totalPreviousYear) / totalPreviousYear) * 100
        : 0;

    return { totalCurrentYear, totalPreviousYear, growth };
  };

  // Calculate market leader
  const calculateMarketLeader = () => {
    const companyTotals = data.monthlySales.companies.map((company) => {
      const total = company.branches.reduce(
        (sum, branch) => sum + branch.monthlySalesCYear.reduce((a, b) => a + b, 0),
        0
      );
      return { name: company.name, total };
    });

    const leader = companyTotals.reduce((prev, current) =>
      prev.total > current.total ? prev : current
    );

    const totalMarket = companyTotals.reduce((sum, company) => sum + company.total, 0);
    const marketShare = totalMarket > 0 ? (leader.total / totalMarket) * 100 : 0;

    return { ...leader, marketShare };
  };

  // Calculate best performing branch
  const calculateBestBranch = () => {
    let bestBranch = { name: '', growth: -Infinity, company: '' };

    data.monthlySales.companies.forEach((company) => {
      company.branches.forEach((branch) => {
        const currentTotal = branch.monthlySalesCYear.reduce((a, b) => a + b, 0);
        const previousTotal = branch.monthlySalesPYear.reduce((a, b) => a + b, 0);
        const growth =
          previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;

        if (growth > bestBranch.growth) {
          bestBranch = { name: branch.name, growth, company: company.name };
        }
      });
    });

    return bestBranch;
  };

  // Calculate average monthly sales
  const calculateMonthlyAverage = () => {
    const { totalCurrentYear } = calculateTotalSales();
    const monthsWithSales = data.monthlySales.companies[0].branches[0].monthlySalesCYear.filter(
      (sales) => sales > 0
    ).length;

    return monthsWithSales > 0 ? totalCurrentYear / monthsWithSales : 0;
  };

  const { totalCurrentYear, totalPreviousYear, growth } = calculateTotalSales();
  const marketLeader = calculateMarketLeader();
  const bestBranch = calculateBestBranch();
  const monthlyAverage = calculateMonthlyAverage();

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        ملخص تنفيذي - نظرة عامة على الأداء
      </Typography>

      <Grid container spacing={3}>
        {/* Total Sales KPI */}
        <Grid item xs={12} md={6} lg={3}>
          <StyledCard>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 2,
                }}
              >
                <Avatar sx={{ bgcolor: 'primary.light', width: 48, height: 48 }}>
                  <Assessment />
                </Avatar>
                <PercentageChange value={growth} size="large" />
              </Box>
              <Typography color="text.secondary" gutterBottom>
                إجمالي المبيعات {year}
              </Typography>
              <KPIValue color="primary">
                {new Intl.NumberFormat('ar-SA').format(Math.round(totalCurrentYear))}
              </KPIValue>
              <Typography variant="body2" color="text.secondary">
                مقارنة بـ {new Intl.NumberFormat('ar-SA').format(Math.round(totalPreviousYear))} في{' '}
                {year - 1}
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Market Leader KPI */}
        <Grid item xs={12} md={6} lg={3}>
          <StyledCard>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 2,
                }}
              >
                <Avatar sx={{ bgcolor: 'success.light', width: 48, height: 48 }}>
                  <PieChart />
                </Avatar>
                <Chip
                  label={`${marketLeader.marketShare.toFixed(1)}%`}
                  color="success"
                  size="small"
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
              <Typography color="text.secondary" gutterBottom>
                الشركة الرائدة
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {marketLeader.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                حصة سوقية {marketLeader.marketShare.toFixed(1)}% من إجمالي المبيعات
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Best Performing Branch KPI */}
        <Grid item xs={12} md={6} lg={3}>
          <StyledCard>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 2,
                }}
              >
                <Avatar sx={{ bgcolor: 'warning.light', width: 48, height: 48 }}>
                  <ShowChart />
                </Avatar>
                <PercentageChange value={bestBranch.growth} />
              </Box>
              <Typography color="text.secondary" gutterBottom>
                أفضل فرع أداءً
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {bestBranch.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {bestBranch.company} - نمو {bestBranch.growth.toFixed(1)}%
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Monthly Average KPI */}
        <Grid item xs={12} md={6} lg={3}>
          <StyledCard>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 2,
                }}
              >
                <Avatar sx={{ bgcolor: 'info.light', width: 48, height: 48 }}>
                  <Speed />
                </Avatar>
              </Box>
              <Typography color="text.secondary" gutterBottom>
                متوسط المبيعات الشهرية
              </Typography>
              <KPIValue color="info">
                {new Intl.NumberFormat('ar-SA').format(Math.round(monthlyAverage))}
              </KPIValue>
              <Typography variant="body2" color="text.secondary">
                طن شهرياً
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Performance Summary Bar */}
      <Paper elevation={0} sx={{ mt: 3, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              معدل النمو السنوي
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LinearProgress
                variant="determinate"
                value={Math.min(Math.abs(growth), 100)}
                sx={{
                  flexGrow: 1,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'grey.300',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: growth >= 0 ? 'success.main' : 'error.main',
                  },
                }}
              />
              <Typography variant="h6" sx={{ minWidth: 60 }}>
                {growth.toFixed(1)}%
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              عدد الشركات النشطة
            </Typography>
            <Typography variant="h6">{data.monthlySales.companies.length} شركات</Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              إجمالي الفروع
            </Typography>
            <Typography variant="h6">
              {data.monthlySales.companies.reduce(
                (sum, company) => sum + company.branches.length,
                0
              )}{' '}
              فرع
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
