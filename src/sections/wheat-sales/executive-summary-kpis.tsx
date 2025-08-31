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
  alpha,
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
import AnalysisPeriod, { getDataPeriod } from './analysis-period';

// Type definitions
interface BranchMonthlySales {
  name: string;
  monthlySalesCYear: number[];
  monthlySalesPYear: number[];
}

interface CompanyMonthlySales {
  name: string;
  branches: BranchMonthlySales[];
}

interface mainInfo {
  monthlySales: {
    companies: CompanyMonthlySales[];
  };
  [key: string]: any; // For other properties we don't use
}

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
      label={`${
        Math.abs(value) >= 10 || Number.isInteger(value)
          ? Math.abs(value).toFixed(0)
          : Math.abs(value).toFixed(1)
      }%`}
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

  // Use the shared helper function
  const {
    firstMonth: firstMonthIndex,
    lastMonth: lastMonthIndex,
    monthsCount,
  } = getDataPeriod(data);

  // Calculate total sales and growth for the same period
  const calculateTotalSales = () => {
    let totalCurrentYear = 0;
    let totalPreviousYear = 0;

    data.monthlySales.companies.forEach((company: CompanyMonthlySales) => {
      company.branches.forEach((branch: BranchMonthlySales) => {
        // Only sum up to the data period (inclusive)
        for (let i = firstMonthIndex; i <= lastMonthIndex; i++) {
          totalCurrentYear += branch.monthlySalesCYear[i] || 0;
          totalPreviousYear += branch.monthlySalesPYear[i] || 0;
        }
      });
    });

    const growth =
      totalPreviousYear > 0
        ? ((totalCurrentYear - totalPreviousYear) / totalPreviousYear) * 100
        : 0;

    return { totalCurrentYear, totalPreviousYear, growth };
  };

  // Calculate market leader based on same period
  const calculateMarketLeader = () => {
    const companyTotals = data.monthlySales.companies.map((company: CompanyMonthlySales) => {
      const total = company.branches.reduce((sum: number, branch: BranchMonthlySales) => {
        let branchTotal = 0;
        for (let i = 0; i <= lastMonthIndex; i++) {
          branchTotal += branch.monthlySalesCYear[i] || 0;
        }
        return sum + branchTotal;
      }, 0);
      return { name: company.name, total };
    });

    const leader = companyTotals.reduce((prev, current) =>
      prev.total > current.total ? prev : current
    );

    const totalMarket = companyTotals.reduce(
      (sum: number, company: { name: string; total: number }) => sum + company.total,
      0
    );
    const marketShare = totalMarket > 0 ? (leader.total / totalMarket) * 100 : 0;

    return { ...leader, marketShare };
  };

  // Calculate best performing branch based on same period
  const calculateBestBranch = () => {
    let bestBranch = { name: '', growth: -Infinity, company: '' };

    data.monthlySales.companies.forEach((company: CompanyMonthlySales) => {
      company.branches.forEach((branch: BranchMonthlySales) => {
        let currentTotal = 0;
        let previousTotal = 0;

        // Calculate totals for the same period
        for (let i = 0; i <= lastMonthIndex; i++) {
          currentTotal += branch.monthlySalesCYear[i] || 0;
          previousTotal += branch.monthlySalesPYear[i] || 0;
        }

        const growth =
          previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;

        if (growth > bestBranch.growth) {
          bestBranch = { name: branch.name, growth, company: company.name };
        }
      });
    });

    return bestBranch;
  };

  // Calculate average monthly sales for the period with data
  const calculateMonthlyAverage = () => {
    const { totalCurrentYear } = calculateTotalSales();
    return monthsCount > 0 ? totalCurrentYear / monthsCount : 0;
  };

  const { totalCurrentYear, totalPreviousYear, growth } = calculateTotalSales();
  const marketLeader = calculateMarketLeader();
  const bestBranch = calculateBestBranch();
  const monthlyAverage = calculateMonthlyAverage();

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Box
        sx={{
          mb: 3,
          p: 2,
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          borderLeft: '5px solid',
          borderLeftColor: '#2E7D32',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            textAlign: 'left',
            fontWeight: 'bold',
            color: 'text.primary',
          }}
        >
          ملخص تنفيذي - نظرة عامة على الأداء
        </Typography>
      </Box>
      <AnalysisPeriod
        firstMonthIndex={firstMonthIndex}
        lastMonthIndex={lastMonthIndex}
        monthsCount={monthsCount}
        year={year}
      />

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
                {Math.round(totalCurrentYear).toLocaleString('en-US')}
              </KPIValue>
              <Typography variant="body2" color="text.secondary">
                مقارنة بـ {Math.round(totalPreviousYear).toLocaleString('en-US')} في نفس الفترة{' '}
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
              <KPIValue color="info">{Math.round(monthlyAverage).toLocaleString('en-US')}</KPIValue>
              <Typography variant="body2" color="text.secondary">
                طن شهرياً (لـ {lastMonthIndex + 1} أشهر)
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
              معدل النمو للفترة
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
                (sum: number, company: CompanyMonthlySales) => sum + company.branches.length,
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
