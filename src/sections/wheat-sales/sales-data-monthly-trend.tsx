'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Paper, Fade, Chip } from '@mui/material';
import AnalysisPeriod, { getDataPeriod } from './analysis-period';

// ----------------------------------------------------------------------

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

interface TooltipData {
  month: string;
  currentYear: number;
  previousYear: number;
  x: number;
  y: number;
  change: number;
  changePercent: string;
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

export default function SalesDataMonthlyTrend({
  data,
  currentYearLabel = '2024',
  previousYearLabel = '2023',
}: {
  data: SalesData;
  currentYearLabel?: string;
  previousYearLabel?: string;
}) {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgWidth, setSvgWidth] = useState(1000);

  useEffect(() => {
    const updateWidth = () => {
      if (svgRef.current) {
        setSvgWidth(svgRef.current.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

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

    // Parse year from label
    const year = parseInt(currentYearLabel) || new Date().getFullYear();

    // Get companies array with proper typing
    let companies: Company[] = [];
    if (Array.isArray(data.monthlySales)) {
      companies = data.monthlySales;
    } else if (data.monthlySales.companies && Array.isArray(data.monthlySales.companies)) {
      companies = data.monthlySales.companies;
    }

    // Calculate total sales for each month
    const monthlyData = MONTHS.map((month, index) => {
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

    // Use the data period from getDataPeriod instead of finding it again
    const dataToShow = monthlyData.slice(firstMonthIndex, lastMonthIndex + 1);

    // Find max value for scaling
    const maxValue = Math.max(...dataToShow.flatMap((d) => [d.currentYear, d.previousYear]));

    // Calculate chart dimensions
    const chartHeight = 400;
    const containerPadding = 40;
    const numPoints = dataToShow.length;

    // Helper functions
    const getXPosition = (index: number) => {
      if (numPoints === 1) return svgWidth / 2;
      return containerPadding + (index * (svgWidth - 2 * containerPadding)) / (numPoints - 1);
    };

    const getYPosition = (value: number) => {
      if (maxValue === 0) return chartHeight - 50;
      return chartHeight - 50 - (value / maxValue) * (chartHeight - 100);
    };

    const formatNumber = (num: number) => {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
      } else if (num >= 1000) {
        return (num / 1000).toFixed(2) + ' ألف';
      }
      return num.toFixed(0);
    };

    // Reverse data for RTL display
    const rtlData = [...dataToShow].reverse();

    // Handle mouse events
    const handleMouseMove = (event: React.MouseEvent<SVGElement>, monthIndex: number) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;

      const d = rtlData[monthIndex];
      const x = getXPosition(monthIndex);
      const y = Math.min(getYPosition(d.currentYear), getYPosition(d.previousYear)) - 20;

      const change = d.currentYear - d.previousYear;
      const changePercent = d.previousYear > 0 ? ((change / d.previousYear) * 100).toFixed(1) : '0';

      setTooltipData({
        month: d.month,
        currentYear: d.currentYear,
        previousYear: d.previousYear,
        x: x,
        y: y,
        change: change,
        changePercent: changePercent,
      });
    };

    const handleMouseLeave = () => {
      setHoveredMonth(null);
      setTooltipData(null);
    };

    // Create SVG paths
    const currentYearPath = rtlData
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getXPosition(i)} ${getYPosition(d.currentYear)}`)
      .join(' ');

    const previousYearPath = rtlData
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getXPosition(i)} ${getYPosition(d.previousYear)}`)
      .join(' ');

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
            اتجاه المبيعات الشهرية
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
            {/* Line Chart */}
            <Box
              sx={{
                width: '100%',
                height: chartHeight + 80,
                position: 'relative',
                direction: 'rtl',
              }}
            >
              <svg
                ref={svgRef}
                width="100%"
                height={chartHeight + 80}
                style={{ display: 'block', cursor: 'crosshair' }}
                onMouseLeave={handleMouseLeave}
              >
                <defs>
                  <linearGradient id="currentYearGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2E7D32" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#2E7D32" stopOpacity="0.05" />
                  </linearGradient>
                  <linearGradient id="previousYearGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#F57C00" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#F57C00" stopOpacity="0.05" />
                  </linearGradient>
                </defs>

                {/* Background areas */}
                <path
                  d={`${currentYearPath} L ${getXPosition(rtlData.length - 1)} ${
                    chartHeight - 50
                  } L ${getXPosition(0)} ${chartHeight - 50} Z`}
                  fill="url(#currentYearGradient)"
                />
                <path
                  d={`${previousYearPath} L ${getXPosition(rtlData.length - 1)} ${
                    chartHeight - 50
                  } L ${getXPosition(0)} ${chartHeight - 50} Z`}
                  fill="url(#previousYearGradient)"
                />

                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                  const y = chartHeight - 50 - ratio * (chartHeight - 100);
                  return (
                    <line
                      key={ratio}
                      x1="0"
                      y1={y}
                      x2={svgWidth}
                      y2={y}
                      stroke="#e0e0e0"
                      strokeDasharray="2,2"
                      opacity="0.3"
                    />
                  );
                })}

                {/* Lines */}
                <path d={currentYearPath} fill="none" stroke="#2E7D32" strokeWidth="3" />
                <path d={previousYearPath} fill="none" stroke="#F57C00" strokeWidth="3" />

                {/* Interactive areas and points */}
                {rtlData.map((d, i) => {
                  const x = getXPosition(i);
                  const yCurrent = getYPosition(d.currentYear);
                  const yPrevious = getYPosition(d.previousYear);
                  const isHovered = hoveredMonth === i;

                  return (
                    <g key={i}>
                      {/* Invisible hover area */}
                      <rect
                        x={x - 30}
                        y={0}
                        width={60}
                        height={chartHeight}
                        fill="transparent"
                        onMouseEnter={() => setHoveredMonth(i)}
                        onMouseMove={(e) => handleMouseMove(e, i)}
                        style={{ cursor: 'pointer' }}
                      />

                      {/* Vertical line on hover */}
                      {isHovered && (
                        <line
                          x1={x}
                          y1={50}
                          x2={x}
                          y2={chartHeight - 50}
                          stroke="#666"
                          strokeWidth="1"
                          strokeDasharray="3,3"
                          opacity="0.5"
                        />
                      )}

                      {/* Current year point */}
                      {d.currentYear > 0 && (
                        <circle
                          cx={x}
                          cy={yCurrent}
                          r={isHovered ? '8' : '5'}
                          fill="#2E7D32"
                          stroke="white"
                          strokeWidth="2"
                          style={{ transition: 'r 0.2s ease' }}
                        />
                      )}

                      {/* Previous year point */}
                      {d.previousYear > 0 && (
                        <circle
                          cx={x}
                          cy={yPrevious}
                          r={isHovered ? '8' : '5'}
                          fill="#F57C00"
                          stroke="white"
                          strokeWidth="2"
                          style={{ transition: 'r 0.2s ease' }}
                        />
                      )}

                      {/* Month label */}
                      <text
                        x={x}
                        y={chartHeight + 20}
                        textAnchor="middle"
                        fill={isHovered ? '#000' : '#666'}
                        fontSize={isHovered ? '14' : '13'}
                        fontWeight={isHovered ? 'bold' : 'normal'}
                        style={{ transition: 'all 0.2s ease' }}
                      >
                        {d.month}
                      </text>
                    </g>
                  );
                })}

                {/* Tooltip */}
                {tooltipData && (
                  <g>
                    {/* Adjust tooltip position to keep it within bounds */}
                    {(() => {
                      const tooltipWidth = 280;
                      const tooltipHeight = 120;
                      let tooltipX = tooltipData.x - tooltipWidth / 2;
                      let tooltipY = tooltipData.y - tooltipHeight - 10;

                      // Keep tooltip within left/right bounds
                      if (tooltipX < 10) tooltipX = 10;
                      if (tooltipX + tooltipWidth > svgWidth - 10) {
                        tooltipX = svgWidth - tooltipWidth - 10;
                      }

                      // If tooltip would go above chart, show it below
                      if (tooltipY < 10) {
                        tooltipY = tooltipData.y + 40;
                      }

                      return (
                        <>
                          <rect
                            x={tooltipX}
                            y={tooltipY}
                            width={tooltipWidth}
                            height={tooltipHeight}
                            fill="rgba(255, 255, 255, 0.98)"
                            stroke="#ccc"
                            strokeWidth="1"
                            rx="6"
                            filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))"
                          />

                          {/* Month title */}
                          <text
                            x={tooltipX + tooltipWidth / 2}
                            y={tooltipY + 25}
                            textAnchor="middle"
                            fontSize="15"
                            fontWeight="bold"
                            fill="#333"
                          >
                            {tooltipData.month}
                          </text>

                          {/* Current year data */}
                          <text
                            x={tooltipX + 185}
                            y={tooltipY + 55}
                            fontSize="13"
                            fill="#2E7D32"
                            fontWeight="500"
                            textAnchor="middle"
                            direction="rtl"
                          >
                            {currentYearLabel}: {formatNumber(tooltipData.currentYear)} طن
                          </text>

                          {/* Previous year data */}
                          <text
                            x={tooltipX + 185}
                            y={tooltipY + 85}
                            fontSize="13"
                            fill="#F57C00"
                            fontWeight="500"
                            textAnchor="middle"
                            direction="rtl"
                          >
                            {previousYearLabel}: {formatNumber(tooltipData.previousYear)} طن
                          </text>

                          {/* Change percentage */}
                          <rect
                            x={tooltipX + 15}
                            y={tooltipY + 50}
                            width={60}
                            height={28}
                            fill={tooltipData.change >= 0 ? '#E8F5E9' : '#FFEBEE'}
                            rx="4"
                          />
                          <text
                            x={tooltipX + 45}
                            y={tooltipY + 67}
                            textAnchor="middle"
                            fontSize="13"
                            fontWeight="bold"
                            fill={tooltipData.change >= 0 ? '#2E7D32' : '#C62828'}
                          >
                            {tooltipData.change >= 0 ? '+' : ''}
                            {tooltipData.changePercent}%
                          </text>
                        </>
                      );
                    })()}
                  </g>
                )}
              </svg>
            </Box>

            {/* Legend */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, bgcolor: '#2E7D32', borderRadius: '50%' }} />
                <Typography variant="body2" fontWeight="medium">
                  {currentYearLabel}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, bgcolor: '#F57C00', borderRadius: '50%' }} />
                <Typography variant="body2" fontWeight="medium">
                  {previousYearLabel}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  } catch (error) {
    console.error('Error in SalesDataMonthlyTrend:', error);

    return (
      <Card>
        <CardContent>
          <Typography color="error">حدث خطأ في عرض البيانات</Typography>
        </CardContent>
      </Card>
    );
  }
}
