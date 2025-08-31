'use client';

import React from 'react';
import { Box, Card, CardContent, Typography, Chip, Paper } from '@mui/material';
import AnalysisPeriod, { getDataPeriod } from './analysis-period';

// ----------------------------------------------------------------------

interface MonthlyData {
  month: string;
  monthId: number;
  currentYear: number;
  previousYear: number;
}

interface Branch {
  monthlySalesCYear?: number[];
  monthlySalesPYear?: number[];
}

interface Company {
  branches?: Branch[];
}

interface SalesData {
  monthlySales?: Company[] | { companies?: Company[] };
}

const MONTHS = [
  { id: 1, name: 'يناير' },
  { id: 2, name: 'فبراير' },
  { id: 3, name: 'مارس' },
  { id: 4, name: 'أبريل' },
  { id: 5, name: 'مايو' },
  { id: 6, name: 'يونيو' },
  { id: 7, name: 'يوليو' },
  { id: 8, name: 'أغسطس' },
  { id: 9, name: 'سبتمبر' },
  { id: 10, name: 'أكتوبر' },
  { id: 11, name: 'نوفمبر' },
  { id: 12, name: 'ديسمبر' },
];

export default function SalesDataComparisonMonth({
  data,
  year,
}: {
  data: SalesData;
  year: number;
}) {
  try {
    // Check if data exists
    if (!data || !data.monthlySales) {
      return (
        <Card>
          <CardContent>
            <Typography>لا توجد بيانات متاحة</Typography>
          </CardContent>
        </Card>
      );
    }

    // Use the shared helper function to get data period
    const {
      firstMonth: firstMonthIndex,
      lastMonth: lastMonthIndex,
      monthsCount,
    } = getDataPeriod(data);

    // Get companies array with proper typing
    let companies: Company[] = [];
    if (Array.isArray(data.monthlySales)) {
      companies = data.monthlySales;
    } else if (data.monthlySales.companies && Array.isArray(data.monthlySales.companies)) {
      companies = data.monthlySales.companies;
    }

    // Calculate total sales for each month across all companies and branches
    const monthlyTotals: MonthlyData[] = MONTHS.map((month, index) => {
      let currentYearTotal = 0;
      let previousYearTotal = 0;

      companies.forEach((company: Company) => {
        if (company && company.branches && Array.isArray(company.branches)) {
          company.branches.forEach((branch: Branch) => {
            if (branch) {
              const currentMonthSales = (branch.monthlySalesCYear || [])[index] || 0;
              const previousMonthSales = (branch.monthlySalesPYear || [])[index] || 0;

              currentYearTotal += Number(currentMonthSales) || 0;
              previousYearTotal += Number(previousMonthSales) || 0;
            }
          });
        }
      });

      return {
        month: month.name,
        monthId: month.id,
        currentYear: currentYearTotal,
        previousYear: previousYearTotal,
      };
    });

    // Filter out months with no data
    const activeMonths = monthlyTotals.filter(
      (item) => item.currentYear > 0 || item.previousYear > 0
    );

    // Calculate totals
    const totalCurrentYear = activeMonths.reduce((sum, item) => sum + item.currentYear, 0);
    const totalPreviousYear = activeMonths.reduce((sum, item) => sum + item.previousYear, 0);

    // Find max value for individual month scaling
    const maxMonthValue = Math.max(...activeMonths.flatMap((d) => [d.currentYear, d.previousYear]));

    // Define gradient colors for months
    const getMonthColor = (monthId: number) => {
      const monthColors = [
        '#42A5F5', // January - Blue
        '#5C6BC0', // February - Indigo
        '#66BB6A', // March - Green
        '#9CCC65', // April - Light Green
        '#FFCA28', // May - Amber
        '#FF9800', // June - Orange
        '#FF7043', // July - Deep Orange
        '#EF5350', // August - Red
        '#FF9800', // September - Orange
        '#FFCA28', // October - Amber
        '#9CCC65', // November - Light Green
        '#42A5F5', // December - Blue
      ];
      return monthColors[monthId - 1] || '#90A4AE';
    };

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
            مقارنة شهرية
          </Typography>
        </Box>

        {/* Use the shared AnalysisPeriod component */}
        <AnalysisPeriod
          firstMonthIndex={firstMonthIndex}
          lastMonthIndex={lastMonthIndex}
          monthsCount={monthsCount}
          year={year}
        />

        <Card>
          <CardContent>
            {/* Total quantities display - Same style as branch component */}
            <Box
              sx={{
                mb: 4,
                bgcolor: '#f0f7ff',
                borderRadius: 2,
                border: '1px solid #e3f2fd',
                p: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'center',
                  alignItems: { xs: 'stretch', sm: 'center' },
                  gap: 3,
                }}
              >
                {/* Current period */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#1976d2' }} />
                  <Typography variant="body2" color="text.secondary">
                    وفق فترة البحث:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" color="text.primary">
                    {totalCurrentYear.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 1,
                    })}{' '}
                    طن
                  </Typography>
                </Box>

                {/* Previous period */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#616161' }} />
                  <Typography variant="body2" color="text.secondary">
                    نفس الفترة من العام السابق:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" color="text.primary">
                    {totalPreviousYear.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 1,
                    })}{' '}
                    طن
                  </Typography>
                </Box>

                {/* Change percentage */}
                {totalPreviousYear > 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      bgcolor: totalCurrentYear >= totalPreviousYear ? '#c8e6c9' : '#ffcdd2',
                      px: 2,
                      py: 0.75,
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: totalCurrentYear >= totalPreviousYear ? '#2e7d32' : '#c62828',
                      }}
                    >
                      معدل التغيير السنوي
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: totalCurrentYear >= totalPreviousYear ? '#2e7d32' : '#c62828',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                      }}
                    >
                      {totalCurrentYear >= totalPreviousYear ? '↑' : '↓'}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: totalCurrentYear >= totalPreviousYear ? '#2e7d32' : '#c62828',
                        fontWeight: 'bold',
                      }}
                    >
                      {Math.abs(
                        ((totalCurrentYear - totalPreviousYear) / totalPreviousYear) * 100
                      ).toFixed(1)}
                      %
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
            {/* Visual chart summary */}
            <Box sx={{ mb: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                توزيع المبيعات الشهرية
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {activeMonths.map((item) => {
                  const heightPercentage =
                    maxMonthValue > 0 ? (item.currentYear / maxMonthValue) * 100 : 0;
                  const monthColor = getMonthColor(item.monthId);

                  return (
                    <Box
                      key={item.monthId}
                      sx={{
                        flex: '1 1 auto',
                        minWidth: 60,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: '100%',
                          height: 120,
                          display: 'flex',
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                        }}
                      >
                        <Box
                          sx={{
                            width: '70%',
                            height: `${heightPercentage}%`,
                            bgcolor: monthColor,
                            borderRadius: '4px 4px 0 0',
                            transition: 'height 0.6s ease',
                            minHeight: 4,
                          }}
                        />
                      </Box>
                      <Typography variant="caption" textAlign="center">
                        {item.month}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
            {/* Monthly comparison grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' },
                gap: 2,
              }}
            >
              {activeMonths.map((item, index) => {
                const monthColor = getMonthColor(item.monthId);
                const changePercent =
                  item.previousYear > 0
                    ? (((item.currentYear - item.previousYear) / item.previousYear) * 100).toFixed(
                        1
                      )
                    : '0';
                const isPositive = item.currentYear >= item.previousYear;

                // Calculate percentages relative to the year totals
                const currentYearPercentage =
                  totalCurrentYear > 0
                    ? Number(((item.currentYear / totalCurrentYear) * 100).toFixed(1))
                    : 0;
                const previousYearPercentage =
                  totalPreviousYear > 0
                    ? Number(((item.previousYear / totalPreviousYear) * 100).toFixed(1))
                    : 0;

                return (
                  <Paper
                    key={index}
                    elevation={2}
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      background: `linear-gradient(135deg, ${monthColor}08 0%, transparent 100%)`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4,
                      },
                    }}
                  >
                    {/* Month header */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 2.5,
                        alignItems: 'center',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 4,
                            height: 28,
                            bgcolor: monthColor,
                            borderRadius: 1,
                          }}
                        />
                        <Typography variant="h6" fontWeight="600">
                          {item.month}
                        </Typography>
                      </Box>
                      <Chip
                        size="small"
                        label={`${isPositive ? '+' : ''}${changePercent}%`}
                        sx={{
                          bgcolor: isPositive ? 'success.light' : 'error.light',
                          color: isPositive ? 'success.dark' : 'error.dark',
                          fontWeight: 'bold',
                          '& .MuiChip-label': {
                            px: 1,
                          },
                        }}
                      />
                    </Box>

                    {/* Comparison visualization */}
                    <Box sx={{ mb: 2 }}>
                      {/* Current year */}
                      <Box sx={{ mb: 1.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            فترة البحث
                          </Typography>
                          <Typography variant="body2" fontWeight="600">
                            {item.currentYear.toLocaleString(undefined, {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 1,
                            })}{' '}
                            طن
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            height: 8,
                            bgcolor: 'grey.200',
                            borderRadius: 1,
                            overflow: 'hidden',
                            position: 'relative',
                          }}
                        >
                          <Box
                            sx={{
                              width: `${currentYearPercentage}%`,
                              height: '100%',
                              bgcolor: monthColor,
                              transition: 'width 0.6s ease',
                            }}
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                          {currentYearPercentage.toFixed(1)}% من إجمالي الفترة
                        </Typography>
                      </Box>

                      {/* Previous year */}
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            العام السابق
                          </Typography>
                          <Typography variant="body2" fontWeight="600">
                            {item.previousYear.toLocaleString(undefined, {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 1,
                            })}{' '}
                            طن
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            height: 8,
                            bgcolor: 'grey.200',
                            borderRadius: 1,
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              width: `${previousYearPercentage}%`,
                              height: '100%',
                              bgcolor: 'grey.500',
                              transition: 'width 0.6s ease',
                            }}
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                          {previousYearPercentage.toFixed(1)}% من إجمالي الفترة
                        </Typography>
                      </Box>
                    </Box>

                    {/* Monthly insights */}
                    <Box
                      sx={{
                        pt: 2,
                        borderTop: '1px dashed',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        الفرق:{' '}
                        <Typography
                          component="span"
                          variant="caption"
                          fontWeight="bold"
                          sx={{
                            color: isPositive ? 'success.main' : 'error.main',
                          }}
                        >
                          {isPositive ? '+' : ''}
                          {Math.abs(item.currentYear - item.previousYear).toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 1,
                            }
                          )}{' '}
                          طن
                        </Typography>
                      </Typography>
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  } catch (error) {
    console.error('Error in SalesDataComparisonMonth:', error);

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
            مقارنة شهرية
          </Typography>
        </Box>
        <Card>
          <CardContent>
            <Typography color="error">حدث خطأ في عرض البيانات</Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }
}
