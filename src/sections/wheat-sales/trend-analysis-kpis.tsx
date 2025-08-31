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
  Paper,
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
  DateRange,
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

interface MonthlyData {
  month: string;
  currentYear: number;
  previousYear: number;
  growth: number;
}

interface MovingAverageData extends MonthlyData {
  ma3: number;
}

interface QuarterData {
  quarter: string;
  currentYear: number;
  previousYear: number;
  growth: number;
}

interface RadarData {
  company: string;
  sales: number;
  growth: number;
  consistency: number;
  branches: number;
}

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

// RTL configuration for charts
const rtlChartConfig = {
  margin: { top: 5, right: 20, bottom: 25, left: 10 },
};

// Custom RTL Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 1.5,
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          boxShadow: 2,
          direction: 'rtl',
          textAlign: 'right',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5, textAlign: 'right' }}>
          {label}
        </Typography>
        {payload.map((entry: any, index: number) => (
          <Typography
            key={index}
            variant="body2"
            sx={{ color: entry.color, textAlign: 'right' }}
            dir="rtl"
          >
            {entry.name}:{' '}
            {Number.isInteger(entry.value)
              ? entry.value.toLocaleString('en-US')
              : entry.value.toFixed(1)}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

export default function TrendAnalysisKPIs({ data, year }: TrendAnalysisKPIsProps) {
  const theme = useTheme();
  const {
    firstMonth: firstMonthIndex,
    lastMonth: lastMonthIndex,
    monthsCount,
  } = getDataPeriod(data);

  // Prepare monthly trend data for the same period only
  const prepareMonthlyTrendData = (): MonthlyData[] => {
    const monthlyData = [];

    for (let index = firstMonthIndex; index <= lastMonthIndex; index++) {
      let currentYearTotal = 0;
      let previousYearTotal = 0;

      data.monthlySales.companies.forEach((company: CompanyMonthlySales) => {
        company.branches.forEach((branch: BranchMonthlySales) => {
          currentYearTotal += branch.monthlySalesCYear[index] || 0;
          previousYearTotal += branch.monthlySalesPYear[index] || 0;
        });
      });

      const growth =
        previousYearTotal > 0
          ? ((currentYearTotal - previousYearTotal) / previousYearTotal) * 100
          : 0;

      monthlyData.push({
        month: months[index],
        currentYear: currentYearTotal,
        previousYear: previousYearTotal,
        growth,
      });
    }

    return monthlyData;
  };

  // Calculate seasonal patterns for available quarters only
  const calculateSeasonalPatterns = (): QuarterData[] => {
    const monthlyData = prepareMonthlyTrendData();
    const quarters = [
      { name: 'الربع الأول', months: [0, 1, 2] },
      { name: 'الربع الثاني', months: [3, 4, 5] },
      { name: 'الربع الثالث', months: [6, 7, 8] },
      { name: 'الربع الرابع', months: [9, 10, 11] },
    ];

    const availableQuarters = quarters.filter((quarter) =>
      quarter.months.some((monthIdx) => monthIdx >= firstMonthIndex && monthIdx <= lastMonthIndex)
    );

    return availableQuarters.map((quarter: { name: string; months: number[] }) => {
      const currentYear = quarter.months.reduce((sum: number, monthIdx: number) => {
        if (
          monthIdx >= firstMonthIndex &&
          monthIdx <= lastMonthIndex &&
          monthlyData[monthIdx - firstMonthIndex]
        ) {
          return sum + monthlyData[monthIdx - firstMonthIndex].currentYear;
        }
        return sum;
      }, 0);
      const previousYear = quarter.months.reduce((sum: number, monthIdx: number) => {
        if (
          monthIdx >= firstMonthIndex &&
          monthIdx <= lastMonthIndex &&
          monthlyData[monthIdx - firstMonthIndex]
        ) {
          return sum + monthlyData[monthIdx - firstMonthIndex].previousYear;
        }
        return sum;
      }, 0);

      return {
        quarter: quarter.name,
        currentYear,
        previousYear,
        growth: previousYear > 0 ? ((currentYear - previousYear) / previousYear) * 100 : 0,
      };
    });
  };

  // Calculate moving averages for available data only
  const calculateMovingAverages = (): MovingAverageData[] => {
    const monthlyData = prepareMonthlyTrendData();
    return monthlyData.map((data: MonthlyData, index: number) => {
      // 3-month moving average
      const start = Math.max(0, index - 2);
      const values = monthlyData.slice(start, index + 1);
      const ma3 =
        values.reduce((sum: number, d: MonthlyData) => sum + d.currentYear, 0) / values.length;

      return {
        ...data,
        ma3,
      };
    });
  };

  // Prepare company performance radar data based on same period
  const prepareRadarData = (): RadarData[] => {
    return data.monthlySales.companies.map((company: CompanyMonthlySales) => {
      let totalSales = 0;
      let previousTotal = 0;

      company.branches.forEach((branch: BranchMonthlySales) => {
        for (let i = firstMonthIndex; i <= lastMonthIndex; i++) {
          totalSales += branch.monthlySalesCYear[i] || 0;
          previousTotal += branch.monthlySalesPYear[i] || 0;
        }
      });

      const growth = previousTotal > 0 ? ((totalSales - previousTotal) / previousTotal) * 100 : 0;

      // Calculate consistency for the available period
      const monthlySales = [];
      for (let idx = firstMonthIndex; idx <= lastMonthIndex; idx++) {
        const monthTotal = company.branches.reduce(
          (sum: number, branch: BranchMonthlySales) => sum + (branch.monthlySalesCYear[idx] || 0),
          0
        );
        monthlySales.push(monthTotal);
      }

      const avg = monthlySales.reduce((a: number, b: number) => a + b, 0) / monthlySales.length;
      const variance =
        monthlySales.reduce((sum: number, val: number) => sum + Math.pow(val - avg, 2), 0) /
        monthlySales.length;
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

  // Calculate trend statistics for the available period
  const trendStats = {
    bestMonth: monthlyTrendData.reduce((best: MonthlyData, current: MonthlyData) =>
      current.currentYear > best.currentYear ? current : best
    ),
    worstMonth: monthlyTrendData.reduce((worst: MonthlyData, current: MonthlyData) =>
      current.currentYear < worst.currentYear ? current : worst
    ),
    avgMonthlyGrowth:
      monthlyTrendData.reduce((sum: number, d: MonthlyData) => sum + d.growth, 0) /
      monthlyTrendData.length,
    volatility: Math.sqrt(
      monthlyTrendData.reduce(
        (sum: number, d: MonthlyData) =>
          sum +
          Math.pow(
            d.growth -
              monthlyTrendData.reduce((s: number, d: MonthlyData) => s + d.growth, 0) /
                monthlyTrendData.length,
            2
          ),
        0
      ) / monthlyTrendData.length
    ),
  };

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
          تحليل الاتجاهات والأنماط
        </Typography>
      </Box>
      <AnalysisPeriod
        firstMonthIndex={firstMonthIndex}
        lastMonthIndex={lastMonthIndex}
        monthsCount={monthsCount}
        year={year}
      />

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
                    أعلى شهر
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {trendStats.bestMonth.month}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {Math.round(trendStats.bestMonth.currentYear).toLocaleString('en-US')}
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
                    أقل شهر
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {trendStats.worstMonth.month}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                {Math.round(trendStats.worstMonth.currentYear).toLocaleString('en-US')}
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
              <Box sx={{ direction: 'ltr' }}>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={movingAverageData} {...rtlChartConfig}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      reversed
                      height={60}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      tickMargin={10}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => {
                        if (Number.isInteger(value)) {
                          return value.toLocaleString('en-US');
                        }
                        return value.toFixed(1);
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ paddingTop: '20px', direction: 'rtl' }}
                      iconType="rect"
                    />
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
              </Box>
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
                التحليل الفصلي (للفترة المتاحة)
              </Typography>
              <Box sx={{ direction: 'ltr' }}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={seasonalData} {...rtlChartConfig}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" tick={{ fontSize: 12 }} reversed tickMargin={10} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => {
                        if (Number.isInteger(value)) {
                          return value.toLocaleString('en-US');
                        }
                        return value.toFixed(1);
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ paddingTop: '20px', direction: 'rtl' }}
                      iconType="rect"
                    />
                    <Bar
                      dataKey="previousYear"
                      fill={alpha(theme.palette.primary.main, 0.5)}
                      name={`${year - 1}`}
                    />
                    <Bar dataKey="currentYear" fill={theme.palette.primary.main} name={`${year}`} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
              <Stack spacing={1} sx={{ mt: 2 }}>
                {seasonalData.map((quarter: QuarterData) => (
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
                مقارنة أداء الشركات (لفترة {monthsCount} أشهر)
              </Typography>
              <Box sx={{ direction: 'ltr' }}>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="company" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
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
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ paddingTop: '20px', direction: 'rtl' }}
                      iconType="rect"
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </Box>
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
              <Box sx={{ direction: 'ltr' }}>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={monthlyTrendData} {...rtlChartConfig}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      reversed
                      height={60}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      tickMargin={10}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) =>
                        `${Number.isInteger(value) ? value : value.toFixed(1)}%`
                      }
                    />
                    <Tooltip content={<CustomTooltip />} />
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
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      أعلى نمو شهري
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      {Math.max(...monthlyTrendData.map((d: MonthlyData) => d.growth)).toFixed(1)}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      أدنى نمو شهري
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                      {Math.min(...monthlyTrendData.map((d: MonthlyData) => d.growth)).toFixed(1)}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      عدد الشهور الإيجابية
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {monthlyTrendData.filter((d: MonthlyData) => d.growth > 0).length} /{' '}
                      {monthlyTrendData.length}
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
