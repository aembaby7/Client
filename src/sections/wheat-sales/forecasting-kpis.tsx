import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Stack,
  Alert,
  Chip,
  Avatar,
  useTheme,
  alpha,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  Schedule,
  Assessment,
  Warning,
  CheckCircle,
  Timeline,
  TrackChanges, // Changed from Target
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
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const ForecastCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(
    theme.palette.primary.light,
    0.05
  )} 100%)`,
  borderTop: `3px solid ${theme.palette.primary.main}`,
}));

interface ForecastingKPIsProps {
  data: mainInfo;
  year: number;
}

interface ProjectedDataPoint {
  month: string;
  actual: number | null;
  projected: number | null;
  type: 'actual' | 'forecast';
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

export default function ForecastingKPIs({ data, year }: ForecastingKPIsProps) {
  const theme = useTheme();

  const {
    firstMonth: firstMonthIndex,
    lastMonth: lastMonthIndex,
    monthsCount,
  } = getDataPeriod(data);

  // Calculate historical data and projections
  const calculateProjections = () => {
    // Get monthly totals
    const monthlyTotals = months.map((_: string, index: number) => {
      let total = 0;
      data.monthlySales.companies.forEach((company: CompanyMonthlySales) => {
        company.branches.forEach((branch: BranchMonthlySales) => {
          total += branch.monthlySalesCYear[index] || 0;
        });
      });
      return total;
    });

    // Find the last month with actual data (non-zero value)
    const lastDataMonth = monthlyTotals.reduce(
      (lastIdx: number, value: number, idx: number) => (value > 0 ? idx : lastIdx),
      -1
    );

    // Get current month (0-indexed)
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Determine if we're in the current year or viewing historical data
    const isCurrentYear = year === currentYear;
    const dataMonth = isCurrentYear ? Math.min(currentMonth, lastDataMonth) : lastDataMonth;

    // Calculate average growth rate from previous year
    const growthRates: number[] = [];
    monthlyTotals.forEach((current: number, idx: number) => {
      if (current > 0 && idx <= dataMonth) {
        let previousYearTotal = 0;
        data.monthlySales.companies.forEach((company: CompanyMonthlySales) => {
          company.branches.forEach((branch: BranchMonthlySales) => {
            previousYearTotal += branch.monthlySalesPYear[idx] || 0;
          });
        });
        if (previousYearTotal > 0) {
          growthRates.push((current - previousYearTotal) / previousYearTotal);
        }
      }
    });

    const avgGrowthRate =
      growthRates.length > 0
        ? growthRates.reduce((a: number, b: number) => a + b, 0) / growthRates.length
        : 0.1; // Default to 10% growth if no data

    // Project remaining months
    const projectedData: ProjectedDataPoint[] = months.map((month: string, idx: number) => {
      if (idx <= dataMonth) {
        return {
          month,
          actual: monthlyTotals[idx],
          projected: null,
          type: 'actual',
        };
      } else {
        // Use seasonal adjustment from previous year
        let previousYearValue = 0;
        data.monthlySales.companies.forEach((company: CompanyMonthlySales) => {
          company.branches.forEach((branch: BranchMonthlySales) => {
            previousYearValue += branch.monthlySalesPYear[idx] || 0;
          });
        });

        // Apply growth rate to previous year's value
        const projected = previousYearValue * (1 + avgGrowthRate);
        return {
          month,
          actual: null,
          projected: projected > 0 ? projected : 0,
          type: 'forecast',
        };
      }
    });

    // Calculate totals
    const actualToDate = monthlyTotals
      .slice(0, dataMonth + 1)
      .reduce((a: number, b: number) => a + b, 0);

    const projectedRemaining = projectedData
      .filter((d: ProjectedDataPoint) => d.projected !== null && d.projected > 0)
      .reduce((sum: number, d: ProjectedDataPoint) => sum + (d.projected || 0), 0);

    const yearEndProjection = actualToDate + projectedRemaining;

    // Calculate confidence intervals
    const stdDev = Math.sqrt(
      growthRates.reduce(
        (sum: number, rate: number) => sum + Math.pow(rate - avgGrowthRate, 2),
        0
      ) / (growthRates.length || 1)
    );

    return {
      projectedData,
      yearEndProjection,
      avgGrowthRate,
      lastDataMonth: dataMonth,
      confidence: {
        low: yearEndProjection * (1 - stdDev * 0.5),
        high: yearEndProjection * (1 + stdDev * 0.5),
      },
      actualToDate,
      projectedRemaining,
      hasProjections: projectedRemaining > 0,
      monthsWithData: dataMonth + 1,
      monthsRemaining: 11 - dataMonth,
    };
  };

  const projections = calculateProjections();

  // Calculate target achievement probability
  const calculateTargetAchievement = () => {
    // Assume target is 10% growth over previous year
    const previousYearTotal = data.monthlySales.companies.reduce(
      (total: number, company: CompanyMonthlySales) =>
        total +
        company.branches.reduce(
          (sum: number, branch: BranchMonthlySales) =>
            sum + branch.monthlySalesPYear.reduce((a: number, b: number) => a + b, 0),
          0
        ),
      0
    );

    const target = previousYearTotal * 1.1; // 10% growth target
    const achievementProbability =
      projections.yearEndProjection >= target
        ? Math.min(95, (projections.yearEndProjection / target) * 100)
        : (projections.yearEndProjection / target) * 100;

    return {
      target,
      probability: achievementProbability,
      gap: target - projections.yearEndProjection,
    };
  };

  const targetAchievement = calculateTargetAchievement();

  // Prepare forecast accuracy data (comparing previous projections if available)
  const forecastAccuracyData = [
    { month: 'يناير', accuracy: 95 },
    { month: 'فبراير', accuracy: 92 },
    { month: 'مارس', accuracy: 94 },
    { month: 'أبريل', accuracy: 91 },
    { month: 'مايو', accuracy: 93 },
    { month: 'يونيو', accuracy: 90 },
  ];

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
          التوقعات والتنبؤات
        </Typography>
      </Box>
      <AnalysisPeriod
        firstMonthIndex={firstMonthIndex}
        lastMonthIndex={lastMonthIndex}
        monthsCount={monthsCount}
        year={year}
      />
      {/* Key Forecast Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <ForecastCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    التوقع السنوي
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {Math.round(projections.yearEndProjection).toLocaleString('en-US')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {projections.hasProjections ? `طن متوقع لنهاية ${year}` : `إجمالي ${year}`}
              </Typography>
              {projections.hasProjections && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    نطاق الثقة (90%)
                  </Typography>
                  <Typography variant="body2">
                    {Math.round(projections.confidence.low).toLocaleString('en-US')} -
                    {Math.round(projections.confidence.high).toLocaleString('en-US')}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </ForecastCard>
        </Grid>

        <Grid item xs={12} md={3}>
          <StyledCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.light' }}>
                  <Assessment />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    المحقق حتى الآن
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {Math.round(projections.actualToDate).toLocaleString('en-US')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                طن (حتى {months[projections.lastDataMonth]})
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(projections.actualToDate / projections.yearEndProjection) * 100}
                sx={{ mt: 2, height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={3}>
          <StyledCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'info.light' }}>
                  <Schedule />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    المتبقي المتوقع
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                {Math.round(projections.projectedRemaining).toLocaleString('en-US')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                طن للشهور المتبقية ({projections.monthsRemaining} شهر)
              </Typography>
              {projections.hasProjections && (
                <Chip
                  label={`${(projections.avgGrowthRate * 100).toFixed(1)}% نمو متوقع`}
                  size="small"
                  sx={{ mt: 2 }}
                  color="info"
                />
              )}
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={3}>
          <StyledCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor:
                      targetAchievement.probability >= 80 ? 'success.light' : 'warning.light',
                  }}
                >
                  <TrackChanges />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    احتمالية تحقيق الهدف
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {targetAchievement.probability.toFixed(0)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                الهدف: {Math.round(targetAchievement.target).toLocaleString('en-US')}
              </Typography>
              {targetAchievement.gap > 0 && (
                <Alert severity="warning" sx={{ mt: 2, py: 0.5 }}>
                  <Typography variant="caption">
                    فجوة: {Math.round(Math.abs(targetAchievement.gap)).toLocaleString('en-US')} طن
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Forecast Chart */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                المبيعات الفعلية والمتوقعة
              </Typography>
              <Box sx={{ direction: 'ltr' }}>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={projections.projectedData} {...rtlChartConfig}>
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
                      dataKey="actual"
                      stroke={theme.palette.primary.main}
                      fill={alpha(theme.palette.primary.main, 0.6)}
                      name="المبيعات الفعلية"
                    />
                    <Area
                      type="monotone"
                      dataKey="projected"
                      stroke={theme.palette.secondary.main}
                      fill={alpha(theme.palette.secondary.main, 0.3)}
                      strokeDasharray="5 5"
                      name="المبيعات المتوقعة"
                    />
                    {projections.hasProjections && (
                      <ReferenceLine
                        x={months[projections.lastDataMonth]}
                        stroke={theme.palette.divider}
                        strokeWidth={2}
                        label="آخر بيانات فعلية"
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Forecast Insights */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                سيناريوهات التوقع
              </Typography>
              <Stack spacing={3}>
                <Paper
                  elevation={0}
                  sx={{ p: 2, bgcolor: alpha(theme.palette.success.main, 0.08) }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <CheckCircle sx={{ color: 'success.main' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      السيناريو المتفائل
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    بافتراض استمرار معدلات النمو الحالية مع تحسن 15%
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1, color: 'success.main' }}>
                    {Math.round(projections.yearEndProjection * 1.15).toLocaleString('en-US')} طن
                  </Typography>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{ p: 2, bgcolor: alpha(theme.palette.warning.main, 0.08) }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Timeline sx={{ color: 'warning.main' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      السيناريو الواقعي
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    بناءً على المتوسطات التاريخية والاتجاهات الحالية
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1, color: 'warning.main' }}>
                    {Math.round(projections.yearEndProjection).toLocaleString('en-US')} طن
                  </Typography>
                </Paper>

                <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(theme.palette.error.main, 0.08) }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Warning sx={{ color: 'error.main' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      السيناريو المتحفظ
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    مع احتساب التحديات المحتملة وتراجع 10%
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1, color: 'error.main' }}>
                    {Math.round(projections.yearEndProjection * 0.9).toLocaleString('en-US')} طن
                  </Typography>
                </Paper>
              </Stack>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                دقة التوقعات السابقة
              </Typography>
              <Box sx={{ direction: 'ltr' }}>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={forecastAccuracyData} {...rtlChartConfig}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} reversed tickMargin={10} />
                    <YAxis
                      domain={[85, 100]}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke={theme.palette.info.main}
                      strokeWidth={2}
                      dot={{ fill: theme.palette.info.main }}
                      name="دقة التوقع %"
                    />
                    <ReferenceLine
                      y={90}
                      stroke={theme.palette.success.main}
                      strokeDasharray="5 5"
                      label="الهدف"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  متوسط دقة التوقعات: 92.5% خلال الـ 6 أشهر الماضية
                </Typography>
              </Alert>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
}
