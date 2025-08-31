'use client';

import React from 'react';
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import AnalysisPeriod, { getDataPeriod } from './analysis-period';

// ----------------------------------------------------------------------

interface CompanyComparisonData {
  name: string;
  currentPeriod: number;
  previousPeriod: number;
}

export default function SalesDataComparisonCompany({ data, year }: { data: any; year: number }) {
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

    // Get companies array
    let companies = [];
    if (Array.isArray(data.monthlySales)) {
      companies = data.monthlySales;
    } else if (data.monthlySales.companies && Array.isArray(data.monthlySales.companies)) {
      companies = data.monthlySales.companies;
    }

    // Process company comparison data for the actual data period
    const comparisonData: CompanyComparisonData[] = [];

    companies.forEach((company: any) => {
      if (!company || !company.name) {
        return;
      }

      let currentPeriod = 0;
      let previousPeriod = 0;

      if (company.branches && Array.isArray(company.branches)) {
        company.branches.forEach((branch: any) => {
          if (branch) {
            // Calculate only for the data period
            currentPeriod += (branch.monthlySalesCYear || [])
              .slice(firstMonthIndex, lastMonthIndex + 1)
              .reduce((a: number, b: any) => a + (Number(b) || 0), 0);

            previousPeriod += (branch.monthlySalesPYear || [])
              .slice(firstMonthIndex, lastMonthIndex + 1)
              .reduce((a: number, b: any) => a + (Number(b) || 0), 0);
          }
        });
      }

      comparisonData.push({
        name: String(company.name || 'شركة غير محددة'),
        currentPeriod,
        previousPeriod,
      });
    });

    // Sort by current period sales (descending)
    comparisonData.sort((a, b) => b.currentPeriod - a.currentPeriod);

    if (comparisonData.length === 0) {
      return (
        <Card>
          <CardContent>
            <Typography>لا توجد بيانات شركات متاحة</Typography>
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
    const totalCurrentPeriod = comparisonData.reduce((sum, item) => sum + item.currentPeriod, 0);
    const totalPreviousPeriod = comparisonData.reduce((sum, item) => sum + item.previousPeriod, 0);

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
            مبيعات الشركات
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
                    {totalCurrentPeriod % 1 === 0
                      ? totalCurrentPeriod.toLocaleString()
                      : totalCurrentPeriod.toLocaleString(undefined, {
                          minimumFractionDigits: 1,
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
                    {totalPreviousPeriod % 1 === 0
                      ? totalPreviousPeriod.toLocaleString()
                      : totalPreviousPeriod.toLocaleString(undefined, {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1,
                        })}{' '}
                    طن
                  </Typography>
                </Box>

                {/* Change percentage */}
                {totalPreviousPeriod > 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      bgcolor: totalCurrentPeriod >= totalPreviousPeriod ? '#c8e6c9' : '#ffcdd2',
                      px: 2,
                      py: 0.75,
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: totalCurrentPeriod >= totalPreviousPeriod ? '#2e7d32' : '#c62828',
                      }}
                    >
                      معدل التغيير
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: totalCurrentPeriod >= totalPreviousPeriod ? '#2e7d32' : '#c62828',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                      }}
                    >
                      {totalCurrentPeriod >= totalPreviousPeriod ? '↑' : '↓'}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: totalCurrentPeriod >= totalPreviousPeriod ? '#2e7d32' : '#c62828',
                        fontWeight: 'bold',
                      }}
                    >
                      {Math.abs(
                        ((totalCurrentPeriod - totalPreviousPeriod) / totalPreviousPeriod) * 100
                      ).toFixed(1)}
                      %
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Comparison bars */}
            <Box sx={{ mb: 4 }}>
              {comparisonData.map((item, index) => {
                // Calculate percentages of total
                const currentPercentage =
                  totalCurrentPeriod > 0 ? (item.currentPeriod / totalCurrentPeriod) * 100 : 0;
                const previousPercentage =
                  totalPreviousPeriod > 0 ? (item.previousPeriod / totalPreviousPeriod) * 100 : 0;

                const barColor = companyColors[item.name] || '#90A4AE';
                const changePercent =
                  item.previousPeriod > 0
                    ? (
                        ((item.currentPeriod - item.previousPeriod) / item.previousPeriod) *
                        100
                      ).toFixed(1)
                    : '0';
                const isPositive = item.currentPeriod >= item.previousPeriod;

                return (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6">{item.name}</Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: isPositive ? 'success.main' : 'error.main',
                          fontWeight: 'bold',
                        }}
                      >
                        {isPositive ? '+' : ''}
                        {changePercent}%
                      </Typography>
                    </Box>

                    {/* Current year bar */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ minWidth: 100, color: 'text.secondary' }}>
                        العام الحالي:
                      </Typography>
                      <Box
                        sx={{
                          flex: 1,
                          height: 24,
                          bgcolor: 'grey.200',
                          borderRadius: 1,
                          overflow: 'hidden',
                          mr: 1,
                          position: 'relative',
                        }}
                      >
                        <Box
                          sx={{
                            width: `${currentPercentage}%`,
                            height: '100%',
                            bgcolor: barColor,
                            transition: 'width 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            pr: 1,
                          }}
                        >
                          {currentPercentage > 5 && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '0.75rem',
                              }}
                            >
                              {currentPercentage.toFixed(1)}%
                            </Typography>
                          )}
                        </Box>
                        {currentPercentage <= 5 && currentPercentage > 0 && (
                          <Typography
                            variant="caption"
                            sx={{
                              position: 'absolute',
                              left: `${currentPercentage}%`,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              ml: 0.5,
                              fontWeight: 'bold',
                              fontSize: '0.7rem',
                            }}
                          >
                            {currentPercentage.toFixed(1)}%
                          </Typography>
                        )}
                      </Box>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{ minWidth: 80, textAlign: 'right' }}
                      >
                        {item.currentPeriod.toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 1,
                        })}{' '}
                        طن
                      </Typography>
                    </Box>

                    {/* Previous year bar */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ minWidth: 100, color: 'text.secondary' }}>
                        العام السابق:
                      </Typography>
                      <Box
                        sx={{
                          flex: 1,
                          height: 24,
                          bgcolor: 'grey.200',
                          borderRadius: 1,
                          overflow: 'hidden',
                          mr: 1,
                          position: 'relative',
                        }}
                      >
                        <Box
                          sx={{
                            width: `${previousPercentage}%`,
                            height: '100%',
                            bgcolor: 'grey.400',
                            transition: 'width 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            pr: 1,
                          }}
                        >
                          {previousPercentage > 5 && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '0.75rem',
                              }}
                            >
                              {previousPercentage.toFixed(1)}%
                            </Typography>
                          )}
                        </Box>
                        {previousPercentage <= 5 && previousPercentage > 0 && (
                          <Typography
                            variant="caption"
                            sx={{
                              position: 'absolute',
                              left: `${previousPercentage}%`,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              ml: 0.5,
                              fontWeight: 'bold',
                              fontSize: '0.7rem',
                            }}
                          >
                            {previousPercentage.toFixed(1)}%
                          </Typography>
                        )}
                      </Box>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{ minWidth: 80, textAlign: 'right' }}
                      >
                        {item.previousPeriod.toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 1,
                        })}{' '}
                        طن
                      </Typography>
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
    console.error('Error in SalesDataComparisonCompany:', error);

    return (
      <Card>
        <CardContent>
          <Typography color="error">حدث خطأ في عرض البيانات</Typography>
        </CardContent>
      </Card>
    );
  }
}
