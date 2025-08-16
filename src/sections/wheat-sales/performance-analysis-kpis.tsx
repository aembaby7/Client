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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { LocalFireDepartment, AcUnit, Warning, CheckCircle, Cancel } from '@mui/icons-material';
import { mainInfo } from './sales-data-view';

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

export default function PerformanceAnalysisKPIs({ data, year }: PerformanceAnalysisKPIsProps) {
  const theme = useTheme();

  // Calculate performance metrics for each branch
  const calculateBranchPerformance = () => {
    const performances: any[] = [];

    data.monthlySales.companies.forEach((company) => {
      company.branches.forEach((branch) => {
        const currentTotal = branch.monthlySalesCYear.reduce((a, b) => a + b, 0);
        const previousTotal = branch.monthlySalesPYear.reduce((a, b) => a + b, 0);
        const growth =
          previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;

        // Calculate consistency score (lower variance = higher score)
        const monthlyGrowthRates = branch.monthlySalesCYear
          .map((curr, idx) => {
            const prev = branch.monthlySalesPYear[idx];
            return prev > 0 ? ((curr - prev) / prev) * 100 : 0;
          })
          .filter((rate) => !isNaN(rate));

        const avgGrowth = monthlyGrowthRates.reduce((a, b) => a + b, 0) / monthlyGrowthRates.length;
        const variance =
          monthlyGrowthRates.reduce((sum, rate) => sum + Math.pow(rate - avgGrowth, 2), 0) /
          monthlyGrowthRates.length;
        const consistencyScore = Math.max(0, 100 - Math.sqrt(variance));

        // Calculate momentum (recent 3 months vs previous 3 months)
        const recent3Months = branch.monthlySalesCYear.slice(-3).reduce((a, b) => a + b, 0);
        const previous3Months = branch.monthlySalesCYear.slice(-6, -3).reduce((a, b) => a + b, 0);
        const momentum =
          previous3Months > 0 ? ((recent3Months - previous3Months) / previous3Months) * 100 : 0;

        // Calculate overall performance score
        const performanceScore =
          (growth > 0 ? 40 : 20) + consistencyScore * 0.3 + (momentum > 0 ? 30 : 10);

        performances.push({
          company: company.name,
          branch: branch.name,
          currentTotal,
          previousTotal,
          growth,
          consistencyScore,
          momentum,
          performanceScore,
          monthsWithZeroSales: branch.monthlySalesCYear.filter((s) => s === 0).length,
        });
      });
    });

    return performances.sort((a, b) => b.performanceScore - a.performanceScore);
  };

  const branchPerformances = calculateBranchPerformance();

  // Categorize branches by performance
  const excellentPerformers = branchPerformances.filter((p) => p.performanceScore >= 70);
  const goodPerformers = branchPerformances.filter(
    (p) => p.performanceScore >= 50 && p.performanceScore < 70
  );
  const needsImprovement = branchPerformances.filter((p) => p.performanceScore < 50);

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
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        تحليل الأداء التفصيلي
      </Typography>

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
            تفاصيل أداء الفروع
          </Typography>

          <Box sx={{ overflowX: 'auto' }}>
            <Stack spacing={2}>
              {branchPerformances.slice(0, 10).map((branch, index) => (
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
                      branchPerformances.sort((a, b) => b.consistencyScore - a.consistencyScore)[0]
                        ?.branch
                    }
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    أقوى زخم
                  </Typography>
                  <Typography variant="body1">
                    {branchPerformances.sort((a, b) => b.momentum - a.momentum)[0]?.branch}
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
                تحديات الأداء
              </Typography>
              <Stack spacing={2} divider={<Divider />}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    فروع بدون مبيعات
                  </Typography>
                  <Typography variant="body1">
                    {branchPerformances.filter((b) => b.monthsWithZeroSales > 0).length} فرع
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    فروع بنمو سلبي
                  </Typography>
                  <Typography variant="body1">
                    {branchPerformances.filter((b) => b.growth < 0).length} فرع
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    متوسط النمو العام
                  </Typography>
                  <Typography variant="body1">
                    {(
                      branchPerformances.reduce((sum, b) => sum + b.growth, 0) /
                      branchPerformances.length
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
