// src/sections/dashboard/ProducedAndSoldFlourTable.tsx

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

// --- 1. DEFINE TYPES FOR THE PROPS ---
type BranchData = {
  name: string;
  receivedWheat: number;
  producedFlour: number;
  soldFlour: number;
};

type CompanyData = {
  name: string;
  colSpan: number;
  branches: BranchData[];
};

type FlourReportData = {
  title: string;
  companies: CompanyData[];
};

type Props = {
  data: FlourReportData;
};

// --- COMPONENT ---
export default function ProducedAndSoldFlourTable({ data }: Props) {
  // --- 2. PERFORM CALCULATIONS AND DATA TRANSFORMATIONS ---

  // Helper function to format numbers and calculate percentages safely
  const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);
  const formatPercent = (numerator: number, denominator: number) => {
    if (denominator === 0) return '0%';
    return `${((numerator / denominator) * 100).toFixed(0)}%`;
  };

  // Create a flat list of all branches for easier row mapping
  const allBranches = data.companies.flatMap((c) => c.branches);

  // Calculate totals for each row
  const totalReceivedWheat = allBranches.reduce((sum, b) => sum + b.receivedWheat, 0);
  const totalProducedFlour = allBranches.reduce((sum, b) => sum + b.producedFlour, 0);
  const totalSoldFlour = allBranches.reduce((sum, b) => sum + b.soldFlour, 0);

  // Calculate company-level totals
  const companyProducedTotals = data.companies.map((c) =>
    c.branches.reduce((sum, b) => sum + b.producedFlour, 0)
  );
  const companySoldTotals = data.companies.map((c) =>
    c.branches.reduce((sum, b) => sum + b.soldFlour, 0)
  );

  // --- 3. REUSE STYLE OBJECTS (FROM PREVIOUS STEP) ---
  const headerCellStyle = {
    border: (theme: any) => `1px solid ${theme.palette.divider}`,
    textAlign: 'center',
    padding: '8px',
    fontSize: '0.8rem',
    whiteSpace: 'nowrap',
    backgroundColor: '#e6f2e6',
    fontWeight: 'bold',
    color: (theme: any) => theme.palette.text.primary,
  };
  const rowHeaderCellStyle = { ...headerCellStyle, textAlign: 'right' };
  const bodyCellStyle = {
    border: (theme: any) => `1px solid ${theme.palette.divider}`,
    textAlign: 'center',
    padding: '8px',
    fontSize: '0.8rem',
    whiteSpace: 'nowrap',
  };
  const companyTotalCellStyle = {
    ...bodyCellStyle,
    backgroundColor: (theme: any) => theme.palette.grey[100],
    fontWeight: 'bold',
  };
  const totalValueCellStyle = { ...bodyCellStyle, fontWeight: 'bold', backgroundColor: '#f0f2e6' };

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h6" gutterBottom align="center" sx={{ mb: 2 }}>
        {data.title}
      </Typography>
      <TableContainer component={Paper} sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="produced and sold flour table">
          <TableHead>
            <TableRow>
              <TableCell sx={rowHeaderCellStyle} rowSpan={2}>
                البيان
              </TableCell>
              {data.companies.map((c) => (
                <TableCell key={c.name} sx={headerCellStyle} colSpan={c.colSpan}>
                  {c.name}
                </TableCell>
              ))}
              <TableCell sx={headerCellStyle} rowSpan={2}>
                الإجمالي
              </TableCell>
            </TableRow>
            <TableRow>
              {allBranches.map((b) => (
                <TableCell key={b.name} sx={headerCellStyle}>
                  {b.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={rowHeaderCellStyle}>القمح المستلم</TableCell>
              {allBranches.map((b, i) => (
                <TableCell key={i} sx={bodyCellStyle}>
                  {formatNumber(b.receivedWheat)}
                </TableCell>
              ))}
              <TableCell sx={totalValueCellStyle}>{formatNumber(totalReceivedWheat)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={rowHeaderCellStyle}>الدقيق المنتج للفرع</TableCell>
              {allBranches.map((b, i) => (
                <TableCell key={i} sx={bodyCellStyle}>
                  {formatNumber(b.producedFlour)}
                </TableCell>
              ))}
              <TableCell sx={totalValueCellStyle}>{formatNumber(totalProducedFlour)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={rowHeaderCellStyle}>الدقيق المباع للفرع</TableCell>
              {allBranches.map((b, i) => (
                <TableCell key={i} sx={bodyCellStyle}>
                  {formatNumber(b.soldFlour)}
                </TableCell>
              ))}
              <TableCell sx={totalValueCellStyle}>{formatNumber(totalSoldFlour)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={rowHeaderCellStyle}>نسبة الدقيق المنتج إلى القمح المستلم</TableCell>
              {allBranches.map((b, i) => (
                <TableCell key={i} sx={bodyCellStyle}>
                  {formatPercent(b.producedFlour, b.receivedWheat)}
                </TableCell>
              ))}
              <TableCell sx={totalValueCellStyle}>
                {formatPercent(totalProducedFlour, totalReceivedWheat)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={rowHeaderCellStyle}>نسبة الدقيق المباع إلى الدقيق المنتج</TableCell>
              {allBranches.map((b, i) => (
                <TableCell key={i} sx={bodyCellStyle}>
                  {formatPercent(b.soldFlour, b.producedFlour)}
                </TableCell>
              ))}
              <TableCell sx={totalValueCellStyle}>
                {formatPercent(totalSoldFlour, totalProducedFlour)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={rowHeaderCellStyle}>إجمالي الدقيق المنتج للشركة</TableCell>
              {data.companies.map((c, i) => (
                <TableCell key={i} sx={companyTotalCellStyle} colSpan={c.colSpan}>
                  {formatNumber(companyProducedTotals[i])}
                </TableCell>
              ))}
              <TableCell sx={totalValueCellStyle}>{formatNumber(totalProducedFlour)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={rowHeaderCellStyle}>إجمالي الدقيق المباع للشركة</TableCell>
              {data.companies.map((c, i) => (
                <TableCell key={i} sx={companyTotalCellStyle} colSpan={c.colSpan}>
                  {formatNumber(companySoldTotals[i])}
                </TableCell>
              ))}
              <TableCell sx={totalValueCellStyle}>{formatNumber(totalSoldFlour)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={rowHeaderCellStyle}>نسبة الدقيق المباع إلى الدقيق المنتج</TableCell>
              {data.companies.map((c, i) => (
                <TableCell key={i} sx={companyTotalCellStyle} colSpan={c.colSpan}>
                  {formatPercent(companySoldTotals[i], companyProducedTotals[i])}
                </TableCell>
              ))}
              <TableCell sx={totalValueCellStyle}>
                {formatPercent(totalSoldFlour, totalProducedFlour)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
