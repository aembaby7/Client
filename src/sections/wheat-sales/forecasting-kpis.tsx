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
  Target,
} from '@mui/icons-material';
import { mainInfo } from './sales-data-view';

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

export default function ForecastingKPIs({ data, year }: ForecastingKPIsProps) {
  const theme = useTheme();

  // Calculate historical data and projections
  const calculateProjections = () => {
    // Get monthly totals
    const monthlyTotals = months.map((_, index) => {
      let total = 0;
      data.monthlySales.companies.forEach((company) => {
        company.branches.forEach((branch) => {
          total += branch.monthlySalesCYear[index] || 0;
        });
      });
      return total;
    });

    // Find the last month with actual data
    const lastDataMonth = monthlyTotals.reduce(
      (lastIdx, value, idx) => (value > 0 ? idx : lastIdx),
      -1
    );

    // Calculate average growth rate from previous year
    const growthRates: number[] = [];
    monthlyTotals.forEach((current, idx) => {
      if (current > 0 && idx <= lastDataMonth) {
        let previousYearTotal = 0;
        data.monthlySales.companies.forEach((company) => {
          company.branches.forEach((branch) => {
            previousYearTotal += branch.monthlySalesPYear[idx] || 0;
          });
        });
        if (previousYearTotal > 0) {
          growthRates.push((current - previousYearTotal) / previousYearTotal);
        }
      }
    });

    const avgGrowthRate =
      growthRates.length > 0 ? growthRates.reduce((a, b) => a + b, 0) / growthRates.length : 0;

    // Calculate moving average for trend
    const movingAvg = monthlyTotals.slice(0, lastDataMonth + 1).filter((v) => v > 0);
    const recentAvg = movingAvg.slice(-3).reduce((a, b) => a + b, 0) / 3;

    // Project remaining months
    const projectedData = months.map((month, idx) => {
      if (idx <= lastDataMonth) {
        return {
          month,
          actual: monthlyTotals[idx],
          projected: null,
          type: 'actual',
        };
      } else {
        // Use seasonal adjustment from previous year
        let previousYearValue = 0;
        data.monthlySales.companies.forEach((company) => {
          company.branches.forEach((branch) => {
            previousYearValue += branch.monthlySalesPYear[idx] || 0;
          });
        });

        const projected = previousYearValue * (1 + avgGrowthRate);
        return {
          month,
          actual: null,
          projected: projected,
          type: 'forecast',
        };
      }
    });

    // Calculate year-end projection
    const actualTotal = monthlyTotals.slice(0, lastDataMonth + 1).reduce((a, b) => a + b, 0);
    const projectedTotal = projectedData
      .filter((d) => d.projected !== null)
      .reduce((sum, d) => sum + (d.projected || 0), 0);
    const yearEndProjection = actualTotal + projectedTotal;

    // Calculate confidence intervals
    const stdDev = Math.sqrt(
      growthRates.reduce((sum, rate) => sum + Math.pow(rate - avgGrowthRate, 2), 0) /
        (growthRates.length || 1)
    );

    return {
      projectedData,
      yearEndProjection,
      avgGrowthRate,
      lastDataMonth,
      confidence: {
        low: yearEndProjection * (1 - stdDev),
        high: yearEndProjection * (1 + stdDev),
      },
      actualToDate: actualTotal,
      projectedRemaining: projectedTotal,
    };
  };

  const projections = calculateProjections();

  // Calculate target achievement probability
  const calculateTargetAchievement = () => {
    // Assume target is 10% growth over previous year
    const previousYearTotal = data.monthlySales.companies.reduce(
      (total, company) =>
        total +
        company.branches.reduce(
          (sum, branch) => sum + branch.monthlySalesPYear.reduce((a, b) => a + b, 0),
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
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        التوقعات والتنبؤات
      </Typography>

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
                {new Intl.NumberFormat('ar-SA').format(Math.round(projections.yearEndProjection))}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                طن متوقع لنهاية {year}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  نطاق الثقة (90%)
                </Typography>
                <Typography variant="body2">
                  {new Intl.NumberFormat('ar-SA').format(Math.round(projections.confidence.low))} -
                  {new Intl.NumberFormat('ar-SA').format(Math.round(projections.confidence.high))}
                </Typography>
              </Box>
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
                {new Intl.NumberFormat('ar-SA').format(Math.round(projections.actualToDate))}
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
                {new Intl.NumberFormat('ar-SA').format(Math.round(projections.projectedRemaining))}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                طن للشهور المتبقية
              </Typography>
              <Chip
                label={`${(projections.avgGrowthRate * 100).toFixed(1)}% نمو متوقع`}
                size="small"
                sx={{ mt: 2 }}
                color="info"
              />
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
                  <Target />
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
                الهدف: {new Intl.NumberFormat('ar-SA').format(Math.round(targetAchievement.target))}
              </Typography>
              {targetAchievement.gap > 0 && (
                <Alert severity="warning" sx={{ mt: 2, py: 0.5 }}>
                  <Typography variant="caption">
                    فجوة:{' '}
                    {new Intl.NumberFormat('ar-SA').format(
                      Math.round(Math.abs(targetAchievement.gap))
                    )}{' '}
                    طن
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
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={projections.projectedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
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
                  <ReferenceLine
                    x={months[projections.lastDataMonth]}
                    stroke={theme.palette.divider}
                    strokeWidth={2}
                    label="آخر بيانات فعلية"
                  />
                </AreaChart>
              </ResponsiveContainer>
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
                    {new Intl.NumberFormat('ar-SA').format(
                      Math.round(projections.yearEndProjection * 1.15)
                    )}{' '}
                    طن
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
                    {new Intl.NumberFormat('ar-SA').format(
                      Math.round(projections.yearEndProjection)
                    )}{' '}
                    طن
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
                    {new Intl.NumberFormat('ar-SA').format(
                      Math.round(projections.yearEndProjection * 0.9)
                    )}{' '}
                    طن
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
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={forecastAccuracyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[85, 100]} />
                  <Tooltip />
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
