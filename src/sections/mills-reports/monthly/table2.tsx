import React from 'react';
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
import { styled } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

// --- STYLES ---
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  textAlign: 'center',
  padding: '8px',
  fontSize: '0.8rem',
  whiteSpace: 'nowrap',
}));

const BandedTableCell = styled(StyledTableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
}));

const HeaderTableCell = styled(StyledTableCell)(({ theme }) => ({
  backgroundColor: '#e6f2e6',
  fontWeight: 'bold',
  color: theme.palette.text.primary,
}));

const BandedHeaderTableCell = styled(HeaderTableCell)({
  backgroundColor: '#d9ead3',
});

const TotalTableCell = styled(StyledTableCell)(({ theme }) => ({
  backgroundColor: '#f0f2e6',
  fontWeight: 'bold',
}));

const BandedTotalTableCell = styled(TotalTableCell)({
  backgroundColor: '#e0e2d6',
});

const MonthCell = styled(StyledTableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: '#e6f2e6',
  textAlign: 'center',
  paddingRight: '10px',
}));

// --- DATA & TYPES ---
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

type BranchMonthlySales = {
  name: string;
  monthlySalesCYear: number[];
  monthlySalesPYear: number[];
};

type CompanyMonthlySales = {
  name: string;
  branches: BranchMonthlySales[];
};

interface MillingCompaniesSalesComparisonTableProps {
  data: {
    reportTitle: string;
    companies: CompanyMonthlySales[];
  };
  year: number;
}

// --- HELPER COMPONENTS & FUNCTIONS ---
const formatNumber = (num: number) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(num);

const calculateChange = (current: number, previous: number): number => {
  if (previous === 0) {
    return current > 0 ? 100.0 : 0.0;
  }
  return ((current - previous) / previous) * 100;
};

const ChangePercentage = ({ value }: { value: number }) => {
  const isPositive = value >= 0;
  const color = isPositive ? '#2E7D32' : 'error.main';
  const Icon = isPositive ? TrendingUpIcon : TrendingDownIcon;
  const formattedValue = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(value);
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color,
        gap: 0.5,
        direction: 'ltr',
      }}
    >
      <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
        {`${formattedValue}%`}
      </Typography>
      <Icon sx={{ fontSize: '1rem' }} />
    </Box>
  );
};

// --- MAIN COMPONENT ---
export default function MillingCompaniesSalesComparisonTable({
  data,
  year,
}: MillingCompaniesSalesComparisonTableProps) {
  const { reportTitle, companies } = data;
  const allBranches = companies.flatMap((c) => c.branches);

  const grandTotal2025 = allBranches.reduce(
    (sum, b) => sum + b.monthlySalesCYear.reduce((a, c) => a + c, 0),
    0
  );
  const grandTotal2024 = allBranches.reduce(
    (sum, b) => sum + b.monthlySalesPYear.reduce((a, c) => a + c, 0),
    0
  );

  const stickyStyles = {
    position: 'sticky',
    left: 0,
    zIndex: 1,
    borderRight: (theme: any) => `1px solid ${theme.palette.divider}`,
  };

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h6" gutterBottom align="center" sx={{ mb: 2 }}>
        {reportTitle}
      </Typography>

      <TableContainer component={Paper} sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <HeaderTableCell
                rowSpan={2}
                sx={{
                  ...stickyStyles,
                  zIndex: (theme) => theme.zIndex.appBar,
                  backgroundColor: '#e6f2e6',
                }}
              >
                الشهر
              </HeaderTableCell>
              {companies.map((company, index) =>
                index % 2 === 0 ? (
                  <HeaderTableCell key={company.name} colSpan={company.branches.length}>
                    {company.name}
                  </HeaderTableCell>
                ) : (
                  <BandedHeaderTableCell key={company.name} colSpan={company.branches.length}>
                    {company.name}
                  </BandedHeaderTableCell>
                )
              )}
              <HeaderTableCell rowSpan={2}>الإجمالي للعام الحالي</HeaderTableCell>
              <BandedHeaderTableCell rowSpan={2}>الإجمالي للعام السابق</BandedHeaderTableCell>
              <HeaderTableCell rowSpan={2}>نسبة التغير</HeaderTableCell>
            </TableRow>
            <TableRow>
              {companies.map((company, companyIndex) =>
                company.branches.map((branch) =>
                  companyIndex % 2 === 0 ? (
                    <HeaderTableCell key={branch.name}>{branch.name}</HeaderTableCell>
                  ) : (
                    <BandedHeaderTableCell key={branch.name}>{branch.name}</BandedHeaderTableCell>
                  )
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {months.map((month, monthIndex) => {
              const monthlyTotal2025 = allBranches.reduce(
                (sum, b) => sum + (b.monthlySalesCYear[monthIndex] || 0),
                0
              );
              const monthlyTotal2024 = allBranches.reduce(
                (sum, b) => sum + (b.monthlySalesPYear[monthIndex] || 0),
                0
              );
              const monthlyChange = calculateChange(monthlyTotal2025, monthlyTotal2024);

              return (
                <TableRow key={month}>
                  <MonthCell sx={{ ...stickyStyles }}>{month}</MonthCell>
                  {companies.map((company, companyIndex) =>
                    company.branches.map((branch) =>
                      companyIndex % 2 === 0 ? (
                        <StyledTableCell key={branch.name}>
                          {formatNumber(branch.monthlySalesCYear[monthIndex] || 0)}
                        </StyledTableCell>
                      ) : (
                        <BandedTableCell key={branch.name}>
                          {formatNumber(branch.monthlySalesCYear[monthIndex] || 0)}
                        </BandedTableCell>
                      )
                    )
                  )}
                  <TotalTableCell>{formatNumber(monthlyTotal2025)}</TotalTableCell>
                  <BandedTotalTableCell>{formatNumber(monthlyTotal2024)}</BandedTotalTableCell>
                  <TotalTableCell>
                    <ChangePercentage value={monthlyChange} />
                  </TotalTableCell>
                </TableRow>
              );
            })}
            {/* --- Footer Rows --- */}
            <TableRow>
              <TotalTableCell sx={{ ...stickyStyles }}>الإجمالي للعام الحالي</TotalTableCell>
              {companies.map((company, companyIndex) =>
                company.branches.map((branch) => {
                  const total = branch.monthlySalesCYear.reduce((a, c) => a + c, 0);
                  return companyIndex % 2 === 0 ? (
                    <TotalTableCell key={branch.name}>{formatNumber(total)}</TotalTableCell>
                  ) : (
                    <BandedTotalTableCell key={branch.name}>
                      {formatNumber(total)}
                    </BandedTotalTableCell>
                  );
                })
              )}
              <TotalTableCell>{formatNumber(grandTotal2025)}</TotalTableCell>
              <BandedTotalTableCell>{formatNumber(grandTotal2024)}</BandedTotalTableCell>
              <TotalTableCell>
                <ChangePercentage value={calculateChange(grandTotal2025, grandTotal2024)} />
              </TotalTableCell>
            </TableRow>
            <TableRow>
              <TotalTableCell sx={{ ...stickyStyles }}>الإجمالي للعام السابق</TotalTableCell>
              {companies.map((company, companyIndex) =>
                company.branches.map((branch) => {
                  const totalPYear = branch.monthlySalesPYear.reduce((a, c) => a + c, 0);
                  return companyIndex % 2 === 0 ? (
                    <TotalTableCell key={branch.name}>{formatNumber(totalPYear)}</TotalTableCell>
                  ) : (
                    <BandedTotalTableCell key={branch.name}>
                      {formatNumber(totalPYear)}
                    </BandedTotalTableCell>
                  );
                })
              )}
              <TotalTableCell colSpan={3}>{formatNumber(grandTotal2024)}</TotalTableCell>
            </TableRow>
            <TableRow>
              <TotalTableCell sx={{ ...stickyStyles }}>نسبة التغير</TotalTableCell>
              {companies.map((company, companyIndex) =>
                company.branches.map((branch) => {
                  const total2025 = branch.monthlySalesCYear.reduce((a, c) => a + c, 0);
                  const total2024 = branch.monthlySalesPYear.reduce((a, c) => a + c, 0);
                  const change = calculateChange(total2025, total2024);
                  return companyIndex % 2 === 0 ? (
                    <TotalTableCell key={branch.name}>
                      <ChangePercentage value={change} />
                    </TotalTableCell>
                  ) : (
                    <BandedTotalTableCell key={branch.name}>
                      <ChangePercentage value={change} />
                    </BandedTotalTableCell>
                  );
                })
              )}
              <TotalTableCell colSpan={3}>
                <ChangePercentage value={calculateChange(grandTotal2025, grandTotal2024)} />
              </TotalTableCell>
            </TableRow>
            <TableRow>
              <TotalTableCell sx={{ ...stickyStyles }}>الحصة السوقية</TotalTableCell>
              {companies.map((company, companyIndex) =>
                company.branches.map((branch) => {
                  const total2025 = branch.monthlySalesCYear.reduce((a, c) => a + c, 0);
                  const share = grandTotal2025 === 0 ? 0 : (total2025 / grandTotal2025) * 100;
                  const formattedShare = new Intl.NumberFormat('en-US', {
                    maximumFractionDigits: 1,
                  }).format(share);
                  return companyIndex % 2 === 0 ? (
                    <TotalTableCell key={branch.name}>{formattedShare}%</TotalTableCell>
                  ) : (
                    <BandedTotalTableCell key={branch.name}>{formattedShare}%</BandedTotalTableCell>
                  );
                })
              )}
              <TotalTableCell colSpan={3}>100%</TotalTableCell>
            </TableRow>
            <TableRow>
              <TotalTableCell sx={{ ...stickyStyles }}>الحصة السوقية</TotalTableCell>
              {companies.map((company, companyIndex) => {
                const companyTotal2025 = company.branches.reduce(
                  (sum, b) => sum + b.monthlySalesCYear.reduce((a, c) => a + c, 0),
                  0
                );
                const companyShare =
                  grandTotal2025 === 0 ? 0 : (companyTotal2025 / grandTotal2025) * 100;
                const formattedCompanyShare = new Intl.NumberFormat('en-US', {
                  maximumFractionDigits: 1,
                }).format(companyShare);
                return companyIndex % 2 === 0 ? (
                  <TotalTableCell key={company.name} colSpan={company.branches.length}>
                    {formattedCompanyShare}%
                  </TotalTableCell>
                ) : (
                  <BandedTotalTableCell key={company.name} colSpan={company.branches.length}>
                    {formattedCompanyShare}%
                  </BandedTotalTableCell>
                );
              })}
              <TotalTableCell colSpan={3}></TotalTableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
