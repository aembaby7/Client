'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Stack,
  Chip,
  Avatar,
  useTheme,
  Paper,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  Business,
  TrendingUp,
  TrendingDown,
  SwapHoriz,
  PieChart as PieChartIcon,
  DateRange,
} from '@mui/icons-material';
import { COMPANY_COLORS, COMPANY_ORDER, sortCompaniesByOrder } from 'src/config/company-config';
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

interface MarketShareData {
  name: string;
  currentYear: number;
  previousYear: number;
  currentShare: number;
  previousShare: number;
  shareChange: number;
  growth: number;
}

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface ComparisonData {
  name: string;
  [key: string]: string | number;
}

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

interface MarketShareKPIsProps {
  data: mainInfo;
  year: number;
}

// RTL Chart Configuration
const rtlChartConfig = {
  margin: { top: 20, right: 30, left: 20, bottom: 5 },
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          p: 1.5,
          boxShadow: 2,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
          {label}
        </Typography>
        {payload.map((entry: any, index: number) => (
          <Typography key={index} variant="body2" sx={{ color: entry.color }}>
            {entry.name}:{' '}
            {typeof entry.value === 'number' ? `${entry.value.toFixed(1)}%` : entry.value}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

// Custom label component for Pie chart
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontWeight="bold"
      fontSize="14"
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

export default function MarketShareKPIs({ data, year }: MarketShareKPIsProps) {
  const theme = useTheme();

  const {
    firstMonth: firstMonthIndex,
    lastMonth: lastMonthIndex,
    monthsCount,
  } = getDataPeriod(data);
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

  // Calculate market share data for the same period
  const calculateMarketShareData = (): MarketShareData[] => {
    const companyData = data.monthlySales.companies.map((company: CompanyMonthlySales) => {
      let currentYearTotal = 0;
      let previousYearTotal = 0;

      company.branches.forEach((branch: BranchMonthlySales) => {
        // Only sum the data period (inclusive)
        for (let i = firstMonthIndex; i <= lastMonthIndex; i++) {
          currentYearTotal += branch.monthlySalesCYear[i] || 0;
          previousYearTotal += branch.monthlySalesPYear[i] || 0;
        }
      });

      return {
        name: company.name,
        currentYear: currentYearTotal,
        previousYear: previousYearTotal,
      };
    });

    const totalCurrentYear = companyData.reduce(
      (sum: number, c: { name: string; currentYear: number; previousYear: number }) =>
        sum + c.currentYear,
      0
    );
    const totalPreviousYear = companyData.reduce(
      (sum: number, c: { name: string; currentYear: number; previousYear: number }) =>
        sum + c.previousYear,
      0
    );

    return companyData.map(
      (company: { name: string; currentYear: number; previousYear: number }) => ({
        ...company,
        currentShare: totalCurrentYear > 0 ? (company.currentYear / totalCurrentYear) * 100 : 0,
        previousShare: totalPreviousYear > 0 ? (company.previousYear / totalPreviousYear) * 100 : 0,
        shareChange:
          totalCurrentYear > 0 && totalPreviousYear > 0
            ? (company.currentYear / totalCurrentYear - company.previousYear / totalPreviousYear) *
              100
            : 0,
        growth:
          company.previousYear > 0
            ? ((company.currentYear - company.previousYear) / company.previousYear) * 100
            : 0,
      })
    );
  };

  const marketShareData = calculateMarketShareData();

  // Sort companies according to the specified order using the helper function
  const sortedMarketShareData = sortCompaniesByOrder([...marketShareData]);

  // Prepare data for pie chart
  const pieChartData: PieChartData[] = sortedMarketShareData.map((company: MarketShareData) => ({
    name: company.name,
    value: company.currentShare,
    color: COMPANY_COLORS[company.name] || theme.palette.grey[500],
  }));

  // Prepare data for comparison chart
  const comparisonData: ComparisonData[] = sortedMarketShareData.map(
    (company: MarketShareData) => ({
      name: company.name,
      [`${year - 1}`]: company.previousShare,
      [`${year}`]: company.currentShare,
    })
  );

  // Calculate concentration metrics
  const calculateConcentration = () => {
    const sortedShares = sortedMarketShareData
      .map((c: MarketShareData) => c.currentShare)
      .sort((a: number, b: number) => b - a);
    const top2Share = sortedShares.slice(0, 2).reduce((a: number, b: number) => a + b, 0);
    const herfindahlIndex = sortedShares.reduce(
      (sum: number, share: number) => sum + Math.pow(share / 100, 2),
      0
    );

    return {
      top2Share,
      herfindahlIndex: herfindahlIndex * 10000, // Convert to standard HHI scale
    };
  };

  const { top2Share, herfindahlIndex } = calculateConcentration();

  return (
    <Box sx={{ width: '100%' }}>
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
          تحليل الحصص السوقية
        </Typography>
      </Box>
      {/* Period indicator - Modern Card Design */}
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          p: 3,
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.1
          )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
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

      <Grid container spacing={3}>
        {/* Market Share Pie Chart */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                توزيع الحصص السوقية {year} (حتى {monthNames[lastMonthIndex]})
              </Typography>
              <Box sx={{ direction: 'ltr' }}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {pieChartData.map((entry: PieChartData, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ paddingTop: '20px', direction: 'rtl' }}
                      iconType="rect"
                      content={(props) => {
                        const { payload } = props;
                        return (
                          <ul
                            style={{
                              listStyle: 'none',
                              padding: 0,
                              margin: 0,
                              display: 'flex',
                              justifyContent: 'center',
                              gap: '20px',
                              direction: 'rtl',
                            }}
                          >
                            {COMPANY_ORDER.map((companyName) => {
                              const item = pieChartData.find((d) => d.name === companyName);
                              if (!item) return null;
                              return (
                                <li
                                  key={companyName}
                                  style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                                >
                                  <span
                                    style={{
                                      display: 'inline-block',
                                      width: '14px',
                                      height: '14px',
                                      backgroundColor: item.color,
                                      marginLeft: '5px',
                                    }}
                                  />
                                  <span>{companyName}</span>
                                </li>
                              );
                            })}
                          </ul>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Market Share Comparison Chart */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                مقارنة الحصص السوقية (نفس الفترة)
              </Typography>
              <Box sx={{ direction: 'ltr' }}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparisonData} {...rtlChartConfig}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} reversed tickMargin={10} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value.toFixed(1)}%`}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ paddingTop: '20px', direction: 'rtl' }}
                      iconType="rect"
                    />
                    <Bar dataKey={`${year - 1}`} fill={alpha(theme.palette.primary.main, 0.6)} />
                    <Bar dataKey={`${year}`} fill={theme.palette.primary.main} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Market Leaders Cards */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            قادة السوق
          </Typography>
          <Grid container spacing={2}>
            {sortedMarketShareData.slice(0, 4).map((company: MarketShareData, index: number) => (
              <Grid item xs={12} sm={6} md={3} key={company.name}>
                <StyledCard
                  sx={{
                    borderTop: `4px solid ${COMPANY_COLORS[company.name]}`,
                    bgcolor: alpha(COMPANY_COLORS[company.name], 0.04),
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: COMPANY_COLORS[company.name],
                          width: 40,
                          height: 40,
                          fontSize: '1.2rem',
                        }}
                      >
                        {index + 1}
                      </Avatar>
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {company.name}
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{ fontWeight: 'bold', color: COMPANY_COLORS[company.name] }}
                        >
                          {company.currentShare.toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>

                    <Stack spacing={1}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          التغير في الحصة
                        </Typography>
                        <Chip
                          size="small"
                          icon={company.shareChange >= 0 ? <TrendingUp /> : <TrendingDown />}
                          label={`${
                            company.shareChange >= 0 ? '+' : ''
                          }${company.shareChange.toFixed(1)}%`}
                          sx={{
                            bgcolor: company.shareChange >= 0 ? 'success.light' : 'error.light',
                            color: company.shareChange >= 0 ? 'success.dark' : 'error.dark',
                          }}
                        />
                      </Box>

                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            نمو المبيعات
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                            {company.growth.toFixed(1)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(Math.abs(company.growth), 100)}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: company.growth >= 0 ? 'success.main' : 'error.main',
                            },
                          }}
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Market Concentration Metrics */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Business sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    <Box>
                      <Typography variant="h6" color="text.secondary">
                        تركز أكبر شركتين
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {top2Share.toFixed(1)}%
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    حصة أكبر شركتين في السوق (فترة {monthsCount} أشهر)
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>

            <Grid item xs={12} md={4} hidden>
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PieChartIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
                    <Box>
                      <Typography variant="h6" color="text.secondary">
                        مؤشر هيرفندال
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {Math.round(herfindahlIndex)}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    مقياس تركز السوق (0-10000)
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SwapHoriz sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                    <Box>
                      <Typography variant="h6" color="text.secondary">
                        تقلبات الحصص
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {
                          sortedMarketShareData.filter(
                            (c: MarketShareData) => Math.abs(c.shareChange) > 1
                          ).length
                        }
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    شركات بتغير أكثر من 1% في الحصة
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
        </Grid>

        {/* Market Share Changes Summary */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ملخص التغيرات في الحصص السوقية ({monthNames[firstMonthIndex]} -{' '}
                {monthNames[lastMonthIndex]})
              </Typography>
              <Stack spacing={2}>
                {sortedMarketShareData.map((company: MarketShareData) => (
                  <Box key={company.name}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {company.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {company.previousShare.toFixed(1)}%
                        </Typography>
                        <SwapHoriz sx={{ color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {company.currentShare.toFixed(1)}%
                        </Typography>
                        <Chip
                          size="small"
                          label={`${
                            company.shareChange >= 0 ? '+' : ''
                          }${company.shareChange.toFixed(1)}%`}
                          color={company.shareChange >= 0 ? 'success' : 'error'}
                        />
                      </Box>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={company.currentShare}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: COMPANY_COLORS[company.name],
                        },
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
