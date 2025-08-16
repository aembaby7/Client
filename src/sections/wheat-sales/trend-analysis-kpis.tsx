import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  Stack,
  Avatar,
  useTheme,
  alpha,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  Timeline,
  ShowChart,
  TrendingUp,
  CalendarToday,
  Analytics,
  Speed,
} from '@mui/icons-material';
import { mainInfo } from './sales-data-view';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

interface TrendAnalysisKPIsProps {
  data: mainInfo;
  year: number;
}

const months = [
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

export default function TrendAnalysisKPIs({ data, year }: TrendAnalysisKPIsProps) {
  const theme = useTheme();

  // Prepare monthly trend data
  const prepareMonthlyTrendData = () => {
    const monthlyData = months.map((month, index) => {
      let currentYearTotal = 0;
      let previousYearTotal = 0;

      data.monthlySales.companies.forEach((company) => {
        company.branches.forEach((branch) => {
          currentYearTotal += branch.monthlySalesCYear[index] || 0;
          previousYearTotal += branch.monthlySalesPYear[index] || 0;
        });
      });

      const growth =
        previousYearTotal > 0
          ? ((currentYearTotal - previousYearTotal) / previousYearTotal) * 100
          : 0;

      return {
        month,
        currentYear: currentYearTotal,
        previousYear: previousYearTotal,
        growth,
      };
    });

    return monthlyData;
  };

  // Calculate seasonal patterns
  const calculateSeasonalPatterns = () => {
    const monthlyData = prepareMonthlyTrendData();
    const quarters = [
      { name: 'Q1', months: [0, 1, 2] },
      { name: 'Q2', months: [3, 4, 5] },
      { name: 'Q3', months: [6, 7, 8] },
      { name: 'Q4', months: [9, 10, 11] },
    ];

    return quarters.map((quarter) => {
      const currentYear = quarter.months.reduce(
        (sum, monthIdx) => sum + monthlyData[monthIdx].currentYear,
        0
      );
      const previousYear = quarter.months.reduce(
        (sum, monthIdx) => sum + monthlyData[monthIdx].previousYear,
        0
      );

      return {
        quarter: quarter.name,
        currentYear,
        previousYear,
        growth: previousYear > 0 ? ((currentYear - previousYear) / previousYear) * 100 : 0,
      };
    });
  };

  // Calculate moving averages
  const calculateMovingAverages = () => {
    const monthlyData = prepareMonthlyTrendData();
    return monthlyData.map((data, index) => {
      // 3-month moving average
      const start = Math.max(0, index - 2);
      const values = monthlyData.slice(start, index + 1);
      const ma3 = values.reduce((sum, d) => sum + d.currentYear, 0) / values.length;

      return {
        ...data,
        ma3,
      };
    });
  };

  // Prepare company performance radar data
  const prepareRadarData = () => {
    return data.monthlySales.companies.map((company) => {
      const totalSales = company.branches.reduce(
        (sum, branch) => sum + branch.monthlySalesCYear.reduce((a, b) => a + b, 0),
        0
      );
      const previousTotal = company.branches.reduce(
        (sum, branch) => sum + branch.monthlySalesPYear.reduce((a, b) => a + b, 0),
        0
      );
      const growth = previousTotal > 0 ? ((totalSales - previousTotal) / previousTotal) * 100 : 0;

      // Calculate consistency (inverse of coefficient of variation)
      const monthlySales = Array(12)
        .fill(0)
        .map((_, idx) =>
          company.branches.reduce((sum, branch) => sum + branch.monthlySalesCYear[idx], 0)
        );
      const avg = monthlySales.reduce((a, b) => a + b, 0) / monthlySales.length;
      const variance =
        monthlySales.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / monthlySales.length;
      const cv = avg > 0 ? Math.sqrt(variance) / avg : 0;
      const consistency = Math.max(0, (1 - cv) * 100);

      return {
        company: company.name,
        sales: Math.min(100, (totalSales / 1000000) * 10), // Normalized to 0-100
        growth: Math.min(100, Math.max(0, growth + 50)), // Normalized with 50 as baseline
        consistency: consistency,
        branches: company.branches.length * 10, // Normalized based on branch count
      };
    });
  };

  const monthlyTrendData = prepareMonthlyTrendData();
  const seasonalData = calculateSeasonalPatterns();
  const movingAverageData = calculateMovingAverages();
  const radarData = prepareRadarData();

  // Calculate trend statistics
  const trendStats = {
    bestMonth: monthlyTrendData.reduce((best, current) =>
      current.currentYear > best.currentYear ? current : best
    ),
    worstMonth: monthlyTrendData.reduce((worst, current) =>
      current.currentYear < worst.currentYear ? current : worst
    ),
    avgMonthlyGrowth:
      monthlyTrendData.reduce((sum, d) => sum + d.growth, 0) / monthlyTrendData.length,
    volatility: Math.sqrt(
      monthlyTrendData.reduce(
        (sum, d) =>
          sum +
          Math.pow(
            d.growth - monthlyTrendData.reduce((s, d) => s + d.growth, 0) / monthlyTrendData.length,
            2
          ),
        0
      ) / monthlyTrendData.length
    ),
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        تحليل الاتجاهات والأنماط
      </Typography>

      {/* Key Trend Indicators */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard sx={{ bgcolor: alpha(theme.palette.success.main, 0.08) }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.light' }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    أفضل شهر
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {trendStats.bestMonth.month}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {new Intl.NumberFormat('ar-SA').format(
                  Math.round(trendStats.bestMonth.currentYear)
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                طن في المبيعات
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StyledCard sx={{ bgcolor: alpha(theme.palette.info.main, 0.08) }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'info.light' }}>
                  <ShowChart />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    متوسط النمو الشهري
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                {trendStats.avgMonthlyGrowth.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                معدل النمو
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StyledCard sx={{ bgcolor: alpha(theme.palette.warning.main, 0.08) }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.light' }}>
                  <Speed />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    معامل التقلب
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                {trendStats.volatility.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                الانحراف المعياري للنمو
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StyledCard sx={{ bgcolor: alpha(theme.palette.error.main, 0.08) }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'error.light' }}>
                  <CalendarToday />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    أضعف شهر
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {trendStats.worstMonth.month}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                {new Intl.NumberFormat('ar-SA').format(
                  Math.round(trendStats.worstMonth.currentYear)
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                طن في المبيعات
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Monthly Trend Chart with Moving Average */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                اتجاه المبيعات الشهرية مع المتوسط المتحرك
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={movingAverageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="previousYear"
                    stackId="1"
                    stroke={alpha(theme.palette.grey[500], 0.8)}
                    fill={alpha(theme.palette.grey[300], 0.4)}
                    name={`${year - 1}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="currentYear"
                    stackId="2"
                    stroke={theme.palette.primary.main}
                    fill={alpha(theme.palette.primary.main, 0.4)}
                    name={`${year}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="ma3"
                    stroke={theme.palette.error.main}
                    strokeWidth={2}
                    dot={false}
                    name="متوسط 3 شهور"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Seasonal Analysis and Company Performance Radar */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                التحليل الفصلي
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={seasonalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="previousYear"
                    fill={alpha(theme.palette.primary.main, 0.5)}
                    name={`${year - 1}`}
                  />
                  <Bar dataKey="currentYear" fill={theme.palette.primary.main} name={`${year}`} />
                </BarChart>
              </ResponsiveContainer>
              <Stack spacing={1} sx={{ mt: 2 }}>
                {seasonalData.map((quarter) => (
                  <Box
                    key={quarter.quarter}
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Typography variant="body2">{quarter.quarter}</Typography>
                    <Chip
                      size="small"
                      label={`${quarter.growth >= 0 ? '+' : ''}${quarter.growth.toFixed(1)}%`}
                      color={quarter.growth >= 0 ? 'success' : 'error'}
                    />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                مقارنة أداء الشركات
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="company" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="المبيعات"
                    dataKey="sales"
                    stroke={theme.palette.primary.main}
                    fill={theme.palette.primary.main}
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="النمو"
                    dataKey="growth"
                    stroke={theme.palette.success.main}
                    fill={theme.palette.success.main}
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="الثبات"
                    dataKey="consistency"
                    stroke={theme.palette.info.main}
                    fill={theme.palette.info.main}
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Growth Rate Trend */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                معدل النمو الشهري
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="growth"
                    stroke={theme.palette.secondary.main}
                    strokeWidth={2}
                    dot={{ fill: theme.palette.secondary.main }}
                    name="معدل النمو %"
                  />
                </LineChart>
              </ResponsiveContainer>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      أعلى نمو شهري
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      {Math.max(...monthlyTrendData.map((d) => d.growth)).toFixed(1)}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      أدنى نمو شهري
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                      {Math.min(...monthlyTrendData.map((d) => d.growth)).toFixed(1)}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      عدد الشهور الإيجابية
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {monthlyTrendData.filter((d) => d.growth > 0).length} / 12
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
}
