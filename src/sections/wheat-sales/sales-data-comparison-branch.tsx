'use client';

import React from 'react';
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import AnalysisPeriod, { getDataPeriod } from './analysis-period';

// ----------------------------------------------------------------------

interface ComparisonData {
  name: string;
  companyName: string;
  currentPeriod: number;
  previousPeriod: number;
}

export default function SalesDataComparisonBranch({ data, year }: { data: any; year: number }) {
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

    // Get the current year from the first branch that has data
    let currentYear = new Date().getFullYear();
    const companies = Array.isArray(data.monthlySales)
      ? data.monthlySales
      : data.monthlySales.companies || [];

    // Try to get year from data if available
    if (data.year) {
      currentYear = data.year;
    }

    // Process all branches with comparison data for the actual data period
    const comparisonData: ComparisonData[] = [];

    companies.forEach((company: any) => {
      if (!company || !company.branches || !Array.isArray(company.branches)) {
        return;
      }

      company.branches.forEach((branch: any) => {
        if (!branch || !branch.name) {
          return;
        }

        // Calculate totals only for the data period
        const currentPeriod = (branch.monthlySalesCYear || [])
          .slice(firstMonthIndex, lastMonthIndex + 1)
          .reduce((a: number, b: any) => a + (Number(b) || 0), 0);

        const previousPeriod = (branch.monthlySalesPYear || [])
          .slice(firstMonthIndex, lastMonthIndex + 1)
          .reduce((a: number, b: any) => a + (Number(b) || 0), 0);

        // Only add branches that have data (either current or previous year)
        if (currentPeriod > 0 || previousPeriod > 0) {
          comparisonData.push({
            name: String(branch.name || 'غير محدد'),
            companyName: String(company.name || 'شركة غير محددة'),
            currentPeriod,
            previousPeriod,
          });
        }
      });
    });

    // Sort by current period sales (descending)
    comparisonData.sort((a, b) => b.currentPeriod - a.currentPeriod);

    if (comparisonData.length === 0) {
      return (
        <Card>
          <CardContent>
            <Typography>لا توجد بيانات فروع متاحة</Typography>
          </CardContent>
        </Card>
      );
    }

    // Define colors for each company
    const companyColors: { [key: string]: string } = {
      الأولى: '#64B5F6',
      العربية: '#81C784',
      الحديثة: '#FFB74D',
      الرابعة: '#BA68C8',
    };

    // Calculate total quantities for current and previous periods
    const totalCurrent = comparisonData.reduce((sum, item) => sum + item.currentPeriod, 0);
    const totalPrevious = comparisonData.reduce((sum, item) => sum + item.previousPeriod, 0);

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
            مبيعات الفروع
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
            {/* Total quantities display - Compact design */}
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
                    {totalCurrent.toLocaleString(undefined, {
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
                    {totalPrevious.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 1,
                    })}{' '}
                    طن
                  </Typography>
                </Box>

                {/* Change percentage */}
                {totalPrevious > 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      bgcolor: totalCurrent >= totalPrevious ? '#c8e6c9' : '#ffcdd2',
                      px: 2,
                      py: 0.75,
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: totalCurrent >= totalPrevious ? '#2e7d32' : '#c62828',
                      }}
                    >
                      معدل التغيير
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: totalCurrent >= totalPrevious ? '#2e7d32' : '#c62828',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                      }}
                    >
                      {totalCurrent >= totalPrevious ? '↑' : '↓'}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: totalCurrent >= totalPrevious ? '#2e7d32' : '#c62828',
                        fontWeight: 'bold',
                      }}
                    >
                      {Math.abs(((totalCurrent - totalPrevious) / totalPrevious) * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Comparison bars - 3 column grid */}
            <Box
              sx={{
                mb: 4,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                gap: 2,
              }}
            >
              {comparisonData.map((item, index) => {
                // Calculate percentages based on total quantities
                const currentPercentage =
                  totalCurrent > 0 ? (item.currentPeriod / totalCurrent) * 100 : 0;
                const previousPercentage =
                  totalPrevious > 0 ? (item.previousPeriod / totalPrevious) * 100 : 0;

                const barColor = companyColors[item.companyName] || '#90A4AE';
                const changePercent =
                  item.previousPeriod > 0
                    ? (
                        ((item.currentPeriod - item.previousPeriod) / item.previousPeriod) *
                        100
                      ).toFixed(1)
                    : '0';
                const isPositive = item.currentPeriod >= item.previousPeriod;

                return (
                  <Box
                    key={index}
                    sx={{
                      bgcolor: 'white',
                      borderRadius: 2,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                      overflow: 'hidden',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      position: 'relative',
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: '0 12px 20px rgba(0,0,0,0.15), 0 8px 10px rgba(0,0,0,0.12)',
                        zIndex: 10,
                        '& .branch-header': {
                          background: `linear-gradient(135deg, ${barColor}25 0%, ${barColor}10 100%)`,
                        },
                        '& .progress-bar': {
                          opacity: 1,
                        },
                        '& .branch-name': {
                          color: barColor,
                        },
                      },
                    }}
                  >
                    {/* Card Header - Modern gradient approach */}
                    <Box
                      className="branch-header"
                      sx={{
                        background: `linear-gradient(135deg, ${barColor}15 0%, ${barColor}05 100%)`,
                        borderBottom: `3px solid ${barColor}`,
                        px: 2.5,
                        py: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'background 0.3s ease',
                      }}
                    >
                      <Box>
                        <Typography
                          className="branch-name"
                          variant="h6"
                          fontWeight="600"
                          color="text.primary"
                          sx={{ transition: 'color 0.3s ease' }}
                        >
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.companyName}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          bgcolor: isPositive ? 'success.light' : 'error.light',
                          color: isPositive ? 'success.dark' : 'error.dark',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 2,
                          fontWeight: 'bold',
                        }}
                      >
                        {isPositive ? (
                          <Typography variant="body2" sx={{ fontSize: '1rem' }}>
                            ↑
                          </Typography>
                        ) : (
                          <Typography variant="body2" sx={{ fontSize: '1rem' }}>
                            ↓
                          </Typography>
                        )}
                        <Typography variant="body2">
                          {Math.abs(parseFloat(changePercent))}%
                        </Typography>
                      </Box>
                    </Box>

                    {/* Card Content */}
                    <Box sx={{ p: 2.5, flex: 1 }}>
                      {/* Current year section */}
                      <Box
                        sx={{
                          mb: 1.5,
                          pb: 1.5,
                          borderBottom: '1px dashed',
                          borderColor: 'grey.300',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Typography
                            variant="caption"
                            sx={{ minWidth: 80, color: 'text.secondary' }}
                          >
                            وفق فترة البحث:
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              ml: 1,
                              fontWeight: 'bold',
                              color: barColor,
                              bgcolor: `${barColor}20`,
                              px: 0.75,
                              py: 0.25,
                              borderRadius: 0.5,
                            }}
                          >
                            {currentPercentage.toFixed(1)}%
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              flex: 1,
                              height: 24,
                              bgcolor: 'white',
                              borderRadius: 1,
                              overflow: 'hidden',
                              mr: 1,
                              position: 'relative',
                              border: '1px solid',
                              borderColor: 'grey.300',
                            }}
                          >
                            <Box
                              className="progress-bar"
                              sx={{
                                width: `${currentPercentage}%`,
                                height: '100%',
                                bgcolor: barColor,
                                transition: 'width 0.3s ease, opacity 0.3s ease',
                                opacity: 0.9,
                              }}
                            />
                          </Box>
                          <Typography
                            variant="caption"
                            fontWeight="bold"
                            sx={{ minWidth: 70, textAlign: 'right' }}
                          >
                            {item.currentPeriod.toLocaleString(undefined, {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 1,
                            })}{' '}
                            طن
                          </Typography>
                        </Box>
                      </Box>

                      {/* Previous year section */}
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Typography
                            variant="caption"
                            sx={{ minWidth: 70, color: 'text.secondary' }}
                          >
                            من العام السابق:
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              ml: 1,
                              fontWeight: 'bold',
                              color: 'grey.700',
                              bgcolor: 'grey.200',
                              px: 0.75,
                              py: 0.25,
                              borderRadius: 0.5,
                            }}
                          >
                            {previousPercentage.toFixed(1)}%
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              flex: 1,
                              height: 24,
                              bgcolor: 'white',
                              borderRadius: 1,
                              overflow: 'hidden',
                              mr: 1,
                              position: 'relative',
                              border: '1px solid',
                              borderColor: 'grey.300',
                            }}
                          >
                            <Box
                              className="progress-bar"
                              sx={{
                                width: `${previousPercentage}%`,
                                height: '100%',
                                bgcolor: 'grey.500',
                                transition: 'width 0.3s ease, opacity 0.3s ease',
                                opacity: 0.9,
                              }}
                            />
                          </Box>
                          <Typography
                            variant="caption"
                            fontWeight="bold"
                            sx={{ minWidth: 70, textAlign: 'right' }}
                          >
                            {item.previousPeriod.toLocaleString(undefined, {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 1,
                            })}{' '}
                            طن
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  } catch (error) {
    console.error('Error in SalesDataComparisonBranch:', error);

    return (
      <Card>
        <CardContent>
          <Typography color="error">حدث خطأ في عرض البيانات</Typography>
        </CardContent>
      </Card>
    );
  }
}
