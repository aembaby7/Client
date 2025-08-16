// src/sections/dashboard/QuarterlySalesComparisonTable.tsx

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';

// --- 1. DEFINE TYPES FOR THE PROPS ---
interface QuarterlySales {
  year: number;
  sales45kg: number;
  salesBulk: number;
  salesHousehold: number;
  totalSales: number;
}

interface QuarterData {
  quarterName: string;
  yearlySales: QuarterlySales[];
}

interface QuarterlyComparisonData {
  title: string;
  quarters: QuarterData[];
}

interface Props {
  data: QuarterlyComparisonData;
}

// --- Helper Functions ---
const formatNumber = (num: number) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(num);

const formatPercent = (numerator: number, denominator: number) => {
  if (denominator === 0 || isNaN(numerator) || isNaN(denominator)) return '0%';
  const percentage = (numerator / denominator) * 100;
  const formattedPercentage = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
  }).format(percentage);
  return `${formattedPercentage}%`;
};

// --- Sub-component for rendering each quarter block ---
const QuarterRowGroup: React.FC<{ quarterData: QuarterData }> = ({ quarterData }) => {
  const prevYearData = quarterData.yearlySales[0];
  const currYearData = quarterData.yearlySales[1];

  const prevYearTotal = prevYearData.totalSales;
  const currYearTotal = currYearData.totalSales;

  // --- Style Objects ---
  const headerCellStyle = {
    backgroundColor: '#e6f2e6',
    border: (theme: any) => `1px solid ${theme.palette.divider}`,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '0.8rem',
  };
  const bodyCellStyle = {
    border: (theme: any) => `1px solid ${theme.palette.divider}`,
    textAlign: 'center',
    fontSize: '0.8rem',
  };
  const percentageCellStyle = {
    ...bodyCellStyle,
    backgroundColor: '#f8f9fa',
  };
  const quarterNameCellStyle = {
    ...headerCellStyle,
    verticalAlign: 'middle',
    width: '15%',
  };

  return (
    <TableBody>
      {/* Row for Previous Year */}
      <TableRow>
        <TableCell sx={quarterNameCellStyle} rowSpan={4}>
          {quarterData.quarterName}
        </TableCell>
        <TableCell sx={bodyCellStyle}>{`${prevYearData.year} م`}</TableCell>
        <TableCell sx={bodyCellStyle}>{formatNumber(prevYearData.sales45kg)}</TableCell>
        <TableCell sx={bodyCellStyle}>{formatNumber(prevYearData.salesBulk)}</TableCell>
        <TableCell sx={bodyCellStyle}>{formatNumber(prevYearData.salesHousehold)}</TableCell>
        <TableCell sx={{ ...bodyCellStyle, fontWeight: 'bold' }}>
          {formatNumber(prevYearTotal)}
        </TableCell>
      </TableRow>

      {/* Row for Current Year */}
      <TableRow>
        <TableCell sx={bodyCellStyle}>{`${currYearData.year} م`}</TableCell>
        <TableCell sx={bodyCellStyle}>{formatNumber(currYearData.sales45kg)}</TableCell>
        <TableCell sx={bodyCellStyle}>{formatNumber(currYearData.salesBulk)}</TableCell>
        <TableCell sx={bodyCellStyle}>{formatNumber(currYearData.salesHousehold)}</TableCell>
        <TableCell sx={{ ...bodyCellStyle, fontWeight: 'bold' }}>
          {formatNumber(currYearTotal)}
        </TableCell>
      </TableRow>

      {/* Row for Growth Rate */}
      <TableRow>
        <TableCell sx={percentageCellStyle}>نسبة النمو %</TableCell>
        <TableCell sx={percentageCellStyle}>
          {formatPercent(currYearData.sales45kg - prevYearData.sales45kg, prevYearData.sales45kg)}
        </TableCell>
        <TableCell sx={percentageCellStyle}>
          {formatPercent(currYearData.salesBulk - prevYearData.salesBulk, prevYearData.salesBulk)}
        </TableCell>
        <TableCell sx={percentageCellStyle}>
          {formatPercent(
            currYearData.salesHousehold - prevYearData.salesHousehold,
            prevYearData.salesHousehold
          )}
        </TableCell>
        <TableCell sx={percentageCellStyle}>
          {formatPercent(currYearTotal - prevYearTotal, prevYearTotal)}
        </TableCell>
      </TableRow>

      {/* Row for Category Percentage */}
      <TableRow>
        <TableCell sx={percentageCellStyle}>نسبة مبيعات الصنف من إجمالي الأصناف</TableCell>
        <TableCell sx={percentageCellStyle}>
          {formatPercent(currYearData.sales45kg, currYearTotal)}
        </TableCell>
        <TableCell sx={percentageCellStyle}>
          {formatPercent(currYearData.salesBulk, currYearTotal)}
        </TableCell>
        <TableCell sx={percentageCellStyle}>
          {formatPercent(currYearData.salesHousehold, currYearTotal)}
        </TableCell>
        <TableCell sx={percentageCellStyle}>100%</TableCell>
      </TableRow>
    </TableBody>
  );
};

// --- Main Component ---
export default function QuarterlySalesComparisonTable({ data }: Props) {
  const headerCellStyle = {
    backgroundColor: '#e6f2e6',
    border: (theme: any) => `1px solid ${theme.palette.divider}`,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '0.8rem',
  };
  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h6" gutterBottom align="center" sx={{ mb: 2 }}>
        {data.title}
      </Typography>
      <TableContainer component={Paper} sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="quarterly sales comparison table">
          <TableHead>
            <TableRow>
              <TableCell sx={headerCellStyle} colSpan={2}>
                الفترة
              </TableCell>
              <TableCell sx={headerCellStyle}>دقيق ٤٥ كجم</TableCell>
              <TableCell sx={headerCellStyle}>دقيق سائب</TableCell>
              <TableCell sx={headerCellStyle}>دقيق عبوات منزلية</TableCell>
              <TableCell sx={headerCellStyle}>الإجمالي</TableCell>
            </TableRow>
          </TableHead>
          {data.quarters.map((quarter) => (
            <QuarterRowGroup key={quarter.quarterName} quarterData={quarter} />
          ))}
        </Table>
      </TableContainer>
    </Box>
  );
}
