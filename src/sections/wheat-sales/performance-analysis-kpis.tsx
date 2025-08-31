import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Rating,
  Tooltip,
  Stack,
  Divider,
  useTheme,
  alpha,
  Paper,
  Avatar,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  LocalFireDepartment,
  AcUnit,
  Warning,
  CheckCircle,
  Cancel,
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

const PerformanceCard = styled(Card)(({ theme }) => ({
  height: '100%',
  position: 'relative',
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
}));

const StatusIndicator = styled(Box)(({ theme }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  position: 'absolute',
  top: 16,
  right: 16,
}));

interface PerformanceAnalysisKPIsProps {
  data: mainInfo;
  year: number;
}

interface BranchPerformance {
  company: string;
  branch: string;
  currentTotal: number;
  previousTotal: number;
  growth: number;
  consistencyScore: number;
  momentum: number;
  performanceScore: number;
  monthsWithZeroSales: number;
}

export default function PerformanceAnalysisKPIs({ data, year }: PerformanceAnalysisKPIsProps) {
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

  // Calculate performance metrics for each branch based on same period
  const calculateBranchPerformance = (): BranchPerformance[] => {
    const performances: BranchPerformance[] = [];

    data.monthlySales.companies.forEach((company: CompanyMonthlySales) => {
      company.branches.forEach((branch: BranchMonthlySales) => {
        // Calculate totals for the same period only
        let currentTotal = 0;
        let previousTotal = 0;

        for (let i = firstMonthIndex; i <= lastMonthIndex; i++) {
          currentTotal += branch.monthlySalesCYear[i] || 0;
          previousTotal += branch.monthlySalesPYear[i] || 0;
        }

        const growth =
          previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;

        // Calculate consistency score (lower variance = higher score) for the same period
        const monthlyGrowthRates = [];
        for (let i = firstMonthIndex; i <= lastMonthIndex; i++) {
          const curr = branch.monthlySalesCYear[i] || 0;
          const prev = branch.monthlySalesPYear[i] || 0;
          if (prev > 0) {
            monthlyGrowthRates.push(((curr - prev) / prev) * 100);
          }
        }

        const avgGrowth =
          monthlyGrowthRates.length > 0
            ? monthlyGrowthRates.reduce((a: number, b: number) => a + b, 0) /
              monthlyGrowthRates.length
            : 0;
        const variance =
          monthlyGrowthRates.length > 0
            ? monthlyGrowthRates.reduce(
                (sum: number, rate: number) => sum + Math.pow(rate - avgGrowth, 2),
                0
              ) / monthlyGrowthRates.length
            : 0;
        const consistencyScore = Math.max(0, 100 - Math.sqrt(variance));

        // Calculate momentum (recent 3 months vs previous 3 months) within the period
        const recentMonths = Math.min(3, lastMonthIndex + 1);
        const recent3Months = branch.monthlySalesCYear
          .slice(Math.max(0, lastMonthIndex - recentMonths + 1), lastMonthIndex + 1)
          .reduce((a: number, b: number) => a + b, 0);

        const previousMonthsStart = Math.max(0, lastMonthIndex - recentMonths * 2 + 1);
        const previousMonthsEnd = Math.max(0, lastMonthIndex - recentMonths);
        const previous3Months =
          previousMonthsEnd >= previousMonthsStart
            ? branch.monthlySalesCYear
                .slice(previousMonthsStart, previousMonthsEnd + 1)
                .reduce((a: number, b: number) => a + b, 0)
            : 0;

        const momentum =
          previous3Months > 0 ? ((recent3Months - previous3Months) / previous3Months) * 100 : 0;

        // Calculate overall performance score
        const performanceScore =
          (growth > 0 ? 40 : 20) + consistencyScore * 0.3 + (momentum > 0 ? 30 : 10);

        // Count months with zero sales in the period
        let monthsWithZeroSales = 0;
        for (let i = firstMonthIndex; i <= lastMonthIndex; i++) {
          if ((branch.monthlySalesCYear[i] || 0) === 0) {
            monthsWithZeroSales++;
          }
        }

        performances.push({
          company: company.name,
          branch: branch.name,
          currentTotal,
          previousTotal,
          growth,
          consistencyScore,
          momentum,
          performanceScore,
          monthsWithZeroSales,
        });
      });
    });

    return performances.sort(
      (a: BranchPerformance, b: BranchPerformance) => b.performanceScore - a.performanceScore
    );
  };

  const branchPerformances = calculateBranchPerformance();

  // Categorize branches by performance
  const excellentPerformers = branchPerformances.filter(
    (p: BranchPerformance) => p.performanceScore >= 70
  );
  const goodPerformers = branchPerformances.filter(
    (p: BranchPerformance) => p.performanceScore >= 50 && p.performanceScore < 70
  );
  const needsImprovement = branchPerformances.filter(
    (p: BranchPerformance) => p.performanceScore < 50
  );

  const getStatusColor = (score: number) => {
    if (score >= 70) return theme.palette.success.main;
    if (score >= 50) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getStatusIcon = (score: number) => {
    if (score >= 70) return <CheckCircle sx={{ color: 'success.main' }} />;
    if (score >= 50) return <Warning sx={{ color: 'warning.main' }} />;
    return <Cancel sx={{ color: 'error.main' }} />;
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
          تحليل الأداء التفصيلي
        </Typography>
      </Box>
      <AnalysisPeriod
        firstMonthIndex={firstMonthIndex}
        lastMonthIndex={lastMonthIndex}
        monthsCount={monthsCount}
        year={year}
      />

      {/* Performance Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <PerformanceCard sx={{ bgcolor: alpha(theme.palette.success.main, 0.08) }}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2,
                }}
              >
                <LocalFireDepartment sx={{ color: 'success.main', fontSize: 40 }} />
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  {excellentPerformers.length}
                </Typography>
              </Box>
              <Typography variant="h6" gutterBottom>
                أداء ممتاز
              </Typography>
              <Typography variant="body2" color="text.secondary">
                فروع تحقق نمواً مستداماً وأداءً متميزاً
              </Typography>
            </CardContent>
          </PerformanceCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <PerformanceCard sx={{ bgcolor: alpha(theme.palette.warning.main, 0.08) }}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2,
                }}
              >
                <Warning sx={{ color: 'warning.main', fontSize: 40 }} />
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                  {goodPerformers.length}
                </Typography>
              </Box>
              <Typography variant="h6" gutterBottom>
                أداء جيد
              </Typography>
              <Typography variant="body2" color="text.secondary">
                فروع تحتاج لتحسينات طفيفة للوصول للتميز
              </Typography>
            </CardContent>
          </PerformanceCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <PerformanceCard sx={{ bgcolor: alpha(theme.palette.error.main, 0.08) }}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2,
                }}
              >
                <AcUnit sx={{ color: 'error.main', fontSize: 40 }} />
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                  {needsImprovement.length}
                </Typography>
              </Box>
              <Typography variant="h6" gutterBottom>
                يحتاج تحسين
              </Typography>
              <Typography variant="body2" color="text.secondary">
                فروع تتطلب اهتماماً عاجلاً وخطط تحسين
              </Typography>
            </CardContent>
          </PerformanceCard>
        </Grid>
      </Grid>

      {/* Detailed Performance Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            تفاصيل أداء الفروع (لفترة {monthsCount} أشهر)
          </Typography>

          <Box sx={{ overflowX: 'auto' }}>
            <Stack spacing={2}>
              {branchPerformances.slice(0, 10).map((branch: BranchPerformance, index: number) => (
                <Box key={index}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      borderRadius: 1,
                      bgcolor: alpha(getStatusColor(branch.performanceScore), 0.08),
                      border: `1px solid ${alpha(getStatusColor(branch.performanceScore), 0.2)}`,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {getStatusIcon(branch.performanceScore)}
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {branch.branch}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {branch.company}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Tooltip title="معدل النمو">
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            النمو
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              color: branch.growth >= 0 ? 'success.main' : 'error.main',
                              fontWeight: 'bold',
                            }}
                          >
                            {branch.growth.toFixed(1)}%
                          </Typography>
                        </Box>
                      </Tooltip>

                      <Tooltip title="درجة الثبات في الأداء">
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            الثبات
                          </Typography>
                          <Rating
                            value={branch.consistencyScore / 20}
                            precision={0.5}
                            size="small"
                            readOnly
                          />
                        </Box>
                      </Tooltip>

                      <Tooltip title="الزخم (آخر 3 شهور)">
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            الزخم
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              color: branch.momentum >= 0 ? 'info.main' : 'error.main',
                              fontWeight: 'bold',
                            }}
                          >
                            {branch.momentum > 0 ? '↑' : '↓'} {Math.abs(branch.momentum).toFixed(0)}
                            %
                          </Typography>
                        </Box>
                      </Tooltip>

                      <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                        <Typography variant="caption" color="text.secondary">
                          النقاط
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {branch.performanceScore.toFixed(0)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>

          {branchPerformances.length > 10 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
              عرض أفضل 10 فروع من أصل {branchPerformances.length} فرع
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                رؤى الأداء
              </Typography>
              <Stack spacing={2} divider={<Divider />}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    أعلى نمو
                  </Typography>
                  <Typography variant="body1">
                    {branchPerformances[0]?.branch} ({branchPerformances[0]?.growth.toFixed(1)}%)
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    أكثر ثباتاً
                  </Typography>
                  <Typography variant="body1">
                    {
                      branchPerformances.sort(
                        (a: BranchPerformance, b: BranchPerformance) =>
                          b.consistencyScore - a.consistencyScore
                      )[0]?.branch
                    }
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    أقوى زخم
                  </Typography>
                  <Typography variant="body1">
                    {
                      branchPerformances.sort(
                        (a: BranchPerformance, b: BranchPerformance) => b.momentum - a.momentum
                      )[0]?.branch
                    }
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                تحديات الأداء (خلال {monthsCount} أشهر)
              </Typography>
              <Stack spacing={2} divider={<Divider />}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    فروع بدون مبيعات
                  </Typography>
                  <Typography variant="body1">
                    {
                      branchPerformances.filter((b: BranchPerformance) => b.monthsWithZeroSales > 0)
                        .length
                    }{' '}
                    فرع
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    فروع بنمو سلبي
                  </Typography>
                  <Typography variant="body1">
                    {branchPerformances.filter((b: BranchPerformance) => b.growth < 0).length} فرع
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    متوسط النمو العام
                  </Typography>
                  <Typography variant="body1">
                    {(
                      branchPerformances.reduce(
                        (sum: number, b: BranchPerformance) => sum + b.growth,
                        0
                      ) / branchPerformances.length
                    ).toFixed(1)}
                    %
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
