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
import { fNumber } from 'src/utils/format-number';
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
  monthlySalesPYear: number[]; // [FIXED] Changed to number array
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
const calculateChange = (current: number, previous: number): number => {
  if (previous === 0) {
    return current > 0 ? 100.0 : 0.0;
  }
  return ((current - previous) / previous) * 100;
};

const ChangePercentage = ({ value }: { value: number }) => {
  const isPositive = value >= 0;
  // [FIXED] Updated positive color to a lighter, more distinct green
  const color = isPositive ? '#2E7D32' : 'error.main';
  const Icon = isPositive ? TrendingUpIcon : TrendingDownIcon;
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
        {`${value.toFixed(1)}%`}
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

  // [FIXED] Grand total calculation updated for monthly array
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

              // [FIXED] Now reads from the correct month in the previous year's data array
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
                          {fNumber(branch.monthlySalesCYear[monthIndex] || 0)}
                        </StyledTableCell>
                      ) : (
                        <BandedTableCell key={branch.name}>
                          {fNumber(branch.monthlySalesCYear[monthIndex] || 0)}
                        </BandedTableCell>
                      )
                    )
                  )}
                  <TotalTableCell>{fNumber(monthlyTotal2025)}</TotalTableCell>
                  <BandedTotalTableCell>{fNumber(monthlyTotal2024)}</BandedTotalTableCell>
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
                    <TotalTableCell key={branch.name}>{fNumber(total)}</TotalTableCell>
                  ) : (
                    <BandedTotalTableCell key={branch.name}>{fNumber(total)}</BandedTotalTableCell>
                  );
                })
              )}
              <TotalTableCell>{fNumber(grandTotal2025)}</TotalTableCell>
              <BandedTotalTableCell>{fNumber(grandTotal2024)}</BandedTotalTableCell>
              <TotalTableCell>
                <ChangePercentage value={calculateChange(grandTotal2025, grandTotal2024)} />
              </TotalTableCell>
            </TableRow>
            <TableRow>
              <TotalTableCell sx={{ ...stickyStyles }}>الإجمالي للعام السابق</TotalTableCell>
              {companies.map((company, companyIndex) =>
                company.branches.map((branch) => {
                  // [FIXED] Correctly sums the monthly array to get the annual total
                  const totalPYear = branch.monthlySalesPYear.reduce((a, c) => a + c, 0);
                  return companyIndex % 2 === 0 ? (
                    <TotalTableCell key={branch.name}>{fNumber(totalPYear)}</TotalTableCell>
                  ) : (
                    <BandedTotalTableCell key={branch.name}>
                      {fNumber(totalPYear)}
                    </BandedTotalTableCell>
                  );
                })
              )}
              <TotalTableCell colSpan={3}>{fNumber(grandTotal2024)}</TotalTableCell>
            </TableRow>
            <TableRow>
              <TotalTableCell sx={{ ...stickyStyles }}>نسبة التغير</TotalTableCell>
              {companies.map((company, companyIndex) =>
                company.branches.map((branch) => {
                  const total2025 = branch.monthlySalesCYear.reduce((a, c) => a + c, 0);
                  // [FIXED] Compares annual totals correctly
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
                  return companyIndex % 2 === 0 ? (
                    <TotalTableCell key={branch.name}>{share.toFixed(1)}%</TotalTableCell>
                  ) : (
                    <BandedTotalTableCell key={branch.name}>
                      {share.toFixed(1)}%
                    </BandedTotalTableCell>
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
                return companyIndex % 2 === 0 ? (
                  <TotalTableCell key={company.name} colSpan={company.branches.length}>
                    {companyShare.toFixed(1)}%
                  </TotalTableCell>
                ) : (
                  <BandedTotalTableCell key={company.name} colSpan={company.branches.length}>
                    {companyShare.toFixed(1)}%
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
