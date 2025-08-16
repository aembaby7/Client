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
import { Business, TrendingUp, TrendingDown, SwapHoriz } from '@mui/icons-material';
import { mainInfo } from './sales-data-view';

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

export default function MarketShareKPIs({ data, year }: MarketShareKPIsProps) {
  const theme = useTheme();

  // Calculate market share data
  const calculateMarketShareData = () => {
    const companyData = data.monthlySales.companies.map((company) => {
      const currentYearTotal = company.branches.reduce(
        (sum, branch) => sum + branch.monthlySalesCYear.reduce((a, b) => a + b, 0),
        0
      );
      const previousYearTotal = company.branches.reduce(
        (sum, branch) => sum + branch.monthlySalesPYear.reduce((a, b) => a + b, 0),
        0
      );

      return {
        name: company.name,
        currentYear: currentYearTotal,
        previousYear: previousYearTotal,
      };
    });

    const totalCurrentYear = companyData.reduce((sum, c) => sum + c.currentYear, 0);
    const totalPreviousYear = companyData.reduce((sum, c) => sum + c.previousYear, 0);

    return companyData
      .map((company) => ({
        ...company,
        currentShare: (company.currentYear / totalCurrentYear) * 100,
        previousShare: (company.previousYear / totalPreviousYear) * 100,
        shareChange:
          (company.currentYear / totalCurrentYear - company.previousYear / totalPreviousYear) * 100,
        growth:
          company.previousYear > 0
            ? ((company.currentYear - company.previousYear) / company.previousYear) * 100
            : 0,
      }))
      .sort((a, b) => b.currentShare - a.currentShare);
  };

  const marketShareData = calculateMarketShareData();

  // Colors for companies
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
  ];

  // Prepare data for pie chart
  const pieChartData = marketShareData.map((company, index) => ({
    name: company.name,
    value: company.currentShare,
    color: COLORS[index % COLORS.length],
  }));

  // Prepare data for comparison chart
  const comparisonData = marketShareData.map((company) => ({
    name: company.name,
    [`${year - 1}`]: company.previousShare,
    [`${year}`]: company.currentShare,
  }));

  // Calculate concentration metrics
  const calculateConcentration = () => {
    const sortedShares = marketShareData.map((c) => c.currentShare).sort((a, b) => b - a);
    const top2Share = sortedShares.slice(0, 2).reduce((a, b) => a + b, 0);
    const herfindahlIndex = sortedShares.reduce((sum, share) => sum + Math.pow(share / 100, 2), 0);

    return {
      top2Share,
      herfindahlIndex: herfindahlIndex * 10000, // Convert to standard HHI scale
    };
  };

  const { top2Share, herfindahlIndex } = calculateConcentration();

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        تحليل الحصص السوقية
      </Typography>

      <Grid container spacing={3}>
        {/* Market Share Pie Chart */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                توزيع الحصص السوقية {year}
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ value }) => `${value.toFixed(1)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Market Share Comparison Chart */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                مقارنة الحصص السوقية
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey={`${year - 1}`} fill={alpha(theme.palette.primary.main, 0.6)} />
                  <Bar dataKey={`${year}`} fill={theme.palette.primary.main} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Market Leaders Cards */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            قادة السوق
          </Typography>
          <Grid container spacing={2}>
            {marketShareData.slice(0, 4).map((company, index) => (
              <Grid item xs={12} sm={6} md={3} key={company.name}>
                <StyledCard
                  sx={{
                    borderTop: `4px solid ${COLORS[index]}`,
                    bgcolor: alpha(COLORS[index], 0.04),
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: COLORS[index],
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
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLORS[index] }}>
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
                          }${company.shareChange.toFixed(2)}%`}
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
            <Grid item xs={12} md={4}>
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
                    حصة أكبر شركتين في السوق
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PieChart sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
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

            <Grid item xs={12} md={4}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SwapHoriz sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                    <Box>
                      <Typography variant="h6" color="text.secondary">
                        تقلبات الحصص
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {marketShareData.filter((c) => Math.abs(c.shareChange) > 1).length}
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
                ملخص التغيرات في الحصص السوقية
              </Typography>
              <Stack spacing={2}>
                {marketShareData.map((company, index) => (
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
                          }${company.shareChange.toFixed(2)}%`}
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
                          bgcolor: COLORS[index % COLORS.length],
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
