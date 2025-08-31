'use client';
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
import AnalysisPeriod, { getDataPeriod } from './analysis-period';

// --- STYLES ---
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  textAlign: 'center',
  padding: '4px',
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

// --- MODIFIED: New style for the month column ---
const MonthCell = styled(StyledTableCell)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  backgroundColor: '#F4F6F8', // A neutral light grey
  textAlign: 'left',
  paddingLeft: theme.spacing(2), // Use theme spacing (e.g., 16px)
  fontSize: '0.8rem',
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
  if (value === 0) {
    return null;
  }
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
        height: '16px', // Set a fixed height to prevent layout shifts
      }}
    >
      <Typography variant="caption" component="span" sx={{ fontWeight: 'bold' }}>
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
  const { companies } = data;
  const allBranches = companies.flatMap((c) => c.branches);

  // Use the shared helper function to get data period
  const {
    firstMonth: firstMonthIndex,
    lastMonth: lastMonthIndex,
    monthsCount,
  } = getDataPeriod(data);

  const grandTotalCurrentYear = allBranches.reduce(
    (sum, b) => sum + b.monthlySalesCYear.reduce((a, c) => a + c, 0),
    0
  );
  const grandTotalPreviousYear = allBranches.reduce(
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
          بيان تفصيلي
        </Typography>
      </Box>

      {/* Use the shared AnalysisPeriod component */}
      <AnalysisPeriod
        firstMonthIndex={firstMonthIndex}
        lastMonthIndex={lastMonthIndex}
        monthsCount={monthsCount}
        year={year}
      />

      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          borderRadius: '8px',
          border: '1px solid rgba(224, 224, 224, 1)',
        }}
      >
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <HeaderTableCell
                rowSpan={2}
                sx={{
                  ...stickyStyles,
                  zIndex: (theme) => theme.zIndex.appBar + 2,
                  backgroundColor: '#e6f2e6',
                }}
              >
                الشهر
              </HeaderTableCell>
              {companies.map((company, index) =>
                index % 2 === 0 ? (
                  <HeaderTableCell key={company.name} colSpan={company.branches.length + 1}>
                    {company.name}
                  </HeaderTableCell>
                ) : (
                  <BandedHeaderTableCell key={company.name} colSpan={company.branches.length + 1}>
                    {company.name}
                  </BandedHeaderTableCell>
                )
              )}
              <HeaderTableCell rowSpan={2}>الإجمالي للعام الحالي</HeaderTableCell>
              <BandedHeaderTableCell rowSpan={2}>الإجمالي للعام السابق</BandedHeaderTableCell>
            </TableRow>
            <TableRow>
              {companies.map((company, companyIndex) => (
                <React.Fragment key={`${company.name}-header`}>
                  {company.branches.map((branch) =>
                    companyIndex % 2 === 0 ? (
                      <HeaderTableCell key={branch.name}>{branch.name}</HeaderTableCell>
                    ) : (
                      <BandedHeaderTableCell key={branch.name}>{branch.name}</BandedHeaderTableCell>
                    )
                  )}
                  {companyIndex % 2 === 0 ? (
                    <TotalTableCell>الإجمالي</TotalTableCell>
                  ) : (
                    <BandedTotalTableCell>الإجمالي</BandedTotalTableCell>
                  )}
                </React.Fragment>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {months.map((month, monthIndex) => {
              const monthlyTotalCurrentYear = allBranches.reduce(
                (sum, b) => sum + (b.monthlySalesCYear[monthIndex] || 0),
                0
              );
              const monthlyTotalPreviousYear = allBranches.reduce(
                (sum, b) => sum + (b.monthlySalesPYear[monthIndex] || 0),
                0
              );
              const monthlyChange = calculateChange(
                monthlyTotalCurrentYear,
                monthlyTotalPreviousYear
              );

              return (
                <TableRow hover key={month}>
                  {/* --- MODIFIED: Updated background color to match new style --- */}
                  <MonthCell sx={{ ...stickyStyles, backgroundColor: '#F4F6F8' }}>
                    {month}
                  </MonthCell>
                  {companies.map((company, companyIndex) => {
                    const companyMonthlyTotalCYear = company.branches.reduce(
                      (sum, b) => sum + (b.monthlySalesCYear[monthIndex] || 0),
                      0
                    );
                    const companyMonthlyTotalPYear = company.branches.reduce(
                      (sum, b) => sum + (b.monthlySalesPYear[monthIndex] || 0),
                      0
                    );
                    const companyMonthlyChange = calculateChange(
                      companyMonthlyTotalCYear,
                      companyMonthlyTotalPYear
                    );
                    return (
                      <React.Fragment key={`${company.name}-${month}`}>
                        {company.branches.map((branch) => {
                          const currentSales = branch.monthlySalesCYear[monthIndex] || 0;
                          const previousSales = branch.monthlySalesPYear[monthIndex] || 0;
                          const change = calculateChange(currentSales, previousSales);
                          const cellContent = (
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                              }}
                            >
                              <span>{formatNumber(currentSales)}</span>
                              {currentSales > 0 ? (
                                <ChangePercentage value={change} />
                              ) : (
                                <Box sx={{ height: '16px' }} />
                              )}
                            </Box>
                          );
                          return companyIndex % 2 === 0 ? (
                            <StyledTableCell key={branch.name}>{cellContent}</StyledTableCell>
                          ) : (
                            <BandedTableCell key={branch.name}>{cellContent}</BandedTableCell>
                          );
                        })}
                        {companyIndex % 2 === 0 ? (
                          <TotalTableCell>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                              }}
                            >
                              <span>{formatNumber(companyMonthlyTotalCYear)}</span>
                              {companyMonthlyTotalCYear > 0 ? (
                                <ChangePercentage value={companyMonthlyChange} />
                              ) : (
                                <Box sx={{ height: '16px' }} />
                              )}
                            </Box>
                          </TotalTableCell>
                        ) : (
                          <BandedTotalTableCell>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                              }}
                            >
                              <span>{formatNumber(companyMonthlyTotalCYear)}</span>
                              {companyMonthlyTotalCYear > 0 ? (
                                <ChangePercentage value={companyMonthlyChange} />
                              ) : (
                                <Box sx={{ height: '16px' }} />
                              )}
                            </Box>
                          </BandedTotalTableCell>
                        )}
                      </React.Fragment>
                    );
                  })}
                  <TotalTableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span>{formatNumber(monthlyTotalCurrentYear)}</span>
                      {monthlyTotalCurrentYear > 0 ? (
                        <ChangePercentage value={monthlyChange} />
                      ) : (
                        <Box sx={{ height: '16px' }} />
                      )}
                    </Box>
                  </TotalTableCell>
                  <BandedTotalTableCell>
                    {formatNumber(monthlyTotalPreviousYear)}
                  </BandedTotalTableCell>
                </TableRow>
              );
            })}
            {/* --- Footer Rows --- */}
            <TableRow hover>
              <TotalTableCell sx={{ ...stickyStyles, backgroundColor: '#f0f2e6' }}>
                الإجمالي
              </TotalTableCell>
              {companies.map((company, companyIndex) => {
                const companyTotalCurrentYear = company.branches.reduce(
                  (sum, b) => sum + b.monthlySalesCYear.reduce((a, c) => a + c, 0),
                  0
                );
                const companyTotalPreviousYear = company.branches.reduce(
                  (sum, b) => sum + b.monthlySalesPYear.reduce((a, c) => a + c, 0),
                  0
                );
                const companyChange = calculateChange(
                  companyTotalCurrentYear,
                  companyTotalPreviousYear
                );
                return (
                  <React.Fragment key={`${company.name}-total-cyear`}>
                    {company.branches.map((branch) => {
                      const totalCurrentYear = branch.monthlySalesCYear.reduce((a, c) => a + c, 0);
                      const totalPreviousYear = branch.monthlySalesPYear.reduce((a, c) => a + c, 0);
                      const change = calculateChange(totalCurrentYear, totalPreviousYear);
                      const cellContent = (
                        <Box
                          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        >
                          <span style={{ fontWeight: 'bold' }}>
                            {formatNumber(totalCurrentYear)}
                          </span>
                          {totalCurrentYear > 0 ? (
                            <ChangePercentage value={change} />
                          ) : (
                            <Box sx={{ height: '16px' }} />
                          )}
                        </Box>
                      );
                      return companyIndex % 2 === 0 ? (
                        <TotalTableCell key={branch.name}>{cellContent}</TotalTableCell>
                      ) : (
                        <BandedTotalTableCell key={branch.name}>{cellContent}</BandedTotalTableCell>
                      );
                    })}
                    {companyIndex % 2 === 0 ? (
                      <TotalTableCell>
                        <Box
                          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        >
                          <span style={{ fontWeight: 'bold' }}>
                            {formatNumber(companyTotalCurrentYear)}
                          </span>
                          {companyTotalCurrentYear > 0 ? (
                            <ChangePercentage value={companyChange} />
                          ) : (
                            <Box sx={{ height: '16px' }} />
                          )}
                        </Box>
                      </TotalTableCell>
                    ) : (
                      <BandedTotalTableCell>
                        <Box
                          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        >
                          <span style={{ fontWeight: 'bold' }}>
                            {formatNumber(companyTotalCurrentYear)}
                          </span>
                          {companyTotalCurrentYear > 0 ? (
                            <ChangePercentage value={companyChange} />
                          ) : (
                            <Box sx={{ height: '16px' }} />
                          )}
                        </Box>
                      </BandedTotalTableCell>
                    )}
                  </React.Fragment>
                );
              })}
              <TotalTableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold' }}>{formatNumber(grandTotalCurrentYear)}</span>
                  {grandTotalCurrentYear > 0 ? (
                    <ChangePercentage
                      value={calculateChange(grandTotalCurrentYear, grandTotalPreviousYear)}
                    />
                  ) : (
                    <Box sx={{ height: '16px' }} />
                  )}
                </Box>
              </TotalTableCell>
              <BandedTotalTableCell>{formatNumber(grandTotalPreviousYear)}</BandedTotalTableCell>
            </TableRow>
            <TableRow hover>
              <TotalTableCell sx={{ ...stickyStyles, backgroundColor: '#f0f2e6' }}>
                وفق الفترة للعام السابق
              </TotalTableCell>
              {companies.map((company, companyIndex) => {
                const companyTotal2024 = company.branches.reduce(
                  (sum, b) => sum + b.monthlySalesPYear.reduce((a, c) => a + c, 0),
                  0
                );
                return (
                  <React.Fragment key={`${company.name}-total-pyear`}>
                    {company.branches.map((branch) => {
                      const totalPYear = branch.monthlySalesPYear.reduce((a, c) => a + c, 0);
                      return companyIndex % 2 === 0 ? (
                        <TotalTableCell key={branch.name}>
                          {formatNumber(totalPYear)}
                        </TotalTableCell>
                      ) : (
                        <BandedTotalTableCell key={branch.name}>
                          {formatNumber(totalPYear)}
                        </BandedTotalTableCell>
                      );
                    })}
                    {companyIndex % 2 === 0 ? (
                      <TotalTableCell>{formatNumber(companyTotal2024)}</TotalTableCell>
                    ) : (
                      <BandedTotalTableCell>{formatNumber(companyTotal2024)}</BandedTotalTableCell>
                    )}
                  </React.Fragment>
                );
              })}
              <TotalTableCell colSpan={2}>{formatNumber(grandTotalPreviousYear)}</TotalTableCell>
            </TableRow>
            {/* --- AVERAGE ROW --- */}
            <TableRow hover>
              <TotalTableCell sx={{ ...stickyStyles, backgroundColor: '#f0f2e6' }}>
                المتوسط الشهري
              </TotalTableCell>
              {companies.map((company, companyIndex) => {
                const companyTotalCYear = company.branches.reduce(
                  (sum, b) => sum + b.monthlySalesCYear.reduce((a, c) => a + c, 0),
                  0
                );
                const companyMonthsWithSalesCYear = company.branches
                  .flatMap((b) => b.monthlySalesCYear)
                  .filter((s) => s > 0).length;
                const companyAverageCYear =
                  companyMonthsWithSalesCYear > 0
                    ? companyTotalCYear / companyMonthsWithSalesCYear
                    : 0;

                const companyTotalPYear = company.branches.reduce(
                  (sum, b) => sum + b.monthlySalesPYear.reduce((a, c) => a + c, 0),
                  0
                );
                const companyMonthsWithSalesPYear = company.branches
                  .flatMap((b) => b.monthlySalesPYear)
                  .filter((s) => s > 0).length;
                const companyAveragePYear =
                  companyMonthsWithSalesPYear > 0
                    ? companyTotalPYear / companyMonthsWithSalesPYear
                    : 0;

                const companyAverageChange = calculateChange(
                  companyAverageCYear,
                  companyAveragePYear
                );

                return (
                  <React.Fragment key={`${company.name}-average`}>
                    {company.branches.map((branch) => {
                      const totalCYear = branch.monthlySalesCYear.reduce((a, c) => a + c, 0);
                      const monthsWithSalesCYear = branch.monthlySalesCYear.filter(
                        (s) => s > 0
                      ).length;
                      const averageCYear =
                        monthsWithSalesCYear > 0 ? totalCYear / monthsWithSalesCYear : 0;

                      const totalPYear = branch.monthlySalesPYear.reduce((a, c) => a + c, 0);
                      const monthsWithSalesPYear = branch.monthlySalesPYear.filter(
                        (s) => s > 0
                      ).length;
                      const averagePYear =
                        monthsWithSalesPYear > 0 ? totalPYear / monthsWithSalesPYear : 0;

                      const change = calculateChange(averageCYear, averagePYear);

                      return companyIndex % 2 === 0 ? (
                        <TotalTableCell key={branch.name}>
                          <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                          >
                            <span>{formatNumber(averageCYear)}</span>
                            {averageCYear > 0 ? (
                              <ChangePercentage value={change} />
                            ) : (
                              <Box sx={{ height: '16px' }} />
                            )}
                          </Box>
                        </TotalTableCell>
                      ) : (
                        <BandedTotalTableCell key={branch.name}>
                          <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                          >
                            <span>{formatNumber(averageCYear)}</span>
                            {averageCYear > 0 ? (
                              <ChangePercentage value={change} />
                            ) : (
                              <Box sx={{ height: '16px' }} />
                            )}
                          </Box>
                        </BandedTotalTableCell>
                      );
                    })}
                    {companyIndex % 2 === 0 ? (
                      <TotalTableCell>
                        <Box
                          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        >
                          <span>{formatNumber(companyAverageCYear)}</span>
                          {companyAverageCYear > 0 ? (
                            <ChangePercentage value={companyAverageChange} />
                          ) : (
                            <Box sx={{ height: '16px' }} />
                          )}
                        </Box>
                      </TotalTableCell>
                    ) : (
                      <BandedTotalTableCell>
                        <Box
                          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        >
                          <span>{formatNumber(companyAverageCYear)}</span>
                          {companyAverageCYear > 0 ? (
                            <ChangePercentage value={companyAverageChange} />
                          ) : (
                            <Box sx={{ height: '16px' }} />
                          )}
                        </Box>
                      </BandedTotalTableCell>
                    )}
                  </React.Fragment>
                );
              })}
              {(() => {
                const grandMonthlyTotalsCYear = months.map((_, monthIndex) =>
                  allBranches.reduce((sum, b) => sum + (b.monthlySalesCYear[monthIndex] || 0), 0)
                );
                const grandMonthCounterCYear = grandMonthlyTotalsCYear.filter(
                  (total) => total > 0
                ).length;
                const grandAverageCYear =
                  grandMonthCounterCYear > 0 ? grandTotalCurrentYear / grandMonthCounterCYear : 0;

                const grandMonthlyTotalsPYear = months.map((_, monthIndex) =>
                  allBranches.reduce((sum, b) => sum + (b.monthlySalesPYear[monthIndex] || 0), 0)
                );
                const grandMonthCounterPYear = grandMonthlyTotalsPYear.filter(
                  (total) => total > 0
                ).length;
                const grandAveragePYear =
                  grandMonthCounterPYear > 0 ? grandTotalPreviousYear / grandMonthCounterPYear : 0;

                const grandAverageChange = calculateChange(grandAverageCYear, grandAveragePYear);

                return (
                  <TotalTableCell colSpan={2}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span>{formatNumber(grandAverageCYear)}</span>
                      {grandAverageCYear > 0 ? (
                        <ChangePercentage value={grandAverageChange} />
                      ) : (
                        <Box sx={{ height: '16px' }} />
                      )}
                    </Box>
                  </TotalTableCell>
                );
              })()}
            </TableRow>
            <TableRow hover>
              <TotalTableCell sx={{ ...stickyStyles, backgroundColor: '#f0f2e6' }}>
                الحصة السوقية
              </TotalTableCell>
              {companies.map((company, companyIndex) => {
                const companyTotalCurrentYear = company.branches.reduce(
                  (sum, b) => sum + b.monthlySalesCYear.reduce((a, c) => a + c, 0),
                  0
                );
                const companyShareCurrentYear =
                  grandTotalCurrentYear === 0
                    ? 0
                    : (companyTotalCurrentYear / grandTotalCurrentYear) * 100;

                const companyTotalPreviousYear = company.branches.reduce(
                  (sum, b) => sum + b.monthlySalesPYear.reduce((a, c) => a + c, 0),
                  0
                );
                const companySharePreviousYear =
                  grandTotalPreviousYear === 0
                    ? 0
                    : (companyTotalPreviousYear / grandTotalPreviousYear) * 100;

                const companyShareChange = companyShareCurrentYear - companySharePreviousYear;

                return (
                  <React.Fragment key={`${company.name}-market-share`}>
                    {company.branches.map((branch) => {
                      const totalCurrentYear = branch.monthlySalesCYear.reduce((a, c) => a + c, 0);
                      const shareCurrentYear =
                        grandTotalCurrentYear === 0
                          ? 0
                          : (totalCurrentYear / grandTotalCurrentYear) * 100;

                      const totalPreviousYear = branch.monthlySalesPYear.reduce((a, c) => a + c, 0);
                      const sharePreviousYear =
                        grandTotalPreviousYear === 0
                          ? 0
                          : (totalPreviousYear / grandTotalPreviousYear) * 100;

                      const shareChange = shareCurrentYear - sharePreviousYear;

                      return companyIndex % 2 === 0 ? (
                        <TotalTableCell key={branch.name}>
                          <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                          >
                            <span>{`${formatNumber(shareCurrentYear)}%`}</span>
                            {shareCurrentYear > 0 ? (
                              <ChangePercentage value={shareChange} />
                            ) : (
                              <Box sx={{ height: '16px' }} />
                            )}
                          </Box>
                        </TotalTableCell>
                      ) : (
                        <BandedTotalTableCell key={branch.name}>
                          <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                          >
                            <span>{`${formatNumber(shareCurrentYear)}%`}</span>
                            {shareCurrentYear > 0 ? (
                              <ChangePercentage value={shareChange} />
                            ) : (
                              <Box sx={{ height: '16px' }} />
                            )}
                          </Box>
                        </BandedTotalTableCell>
                      );
                    })}
                    {companyIndex % 2 === 0 ? (
                      <TotalTableCell>
                        <Box
                          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        >
                          <span>{`${formatNumber(companyShareCurrentYear)}%`}</span>
                          {companyShareCurrentYear > 0 ? (
                            <ChangePercentage value={companyShareChange} />
                          ) : (
                            <Box sx={{ height: '16px' }} />
                          )}
                        </Box>
                      </TotalTableCell>
                    ) : (
                      <BandedTotalTableCell>
                        <Box
                          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        >
                          <span>{`${formatNumber(companyShareCurrentYear)}%`}</span>
                          {companyShareCurrentYear > 0 ? (
                            <ChangePercentage value={companyShareChange} />
                          ) : (
                            <Box sx={{ height: '16px' }} />
                          )}
                        </Box>
                      </BandedTotalTableCell>
                    )}
                  </React.Fragment>
                );
              })}
              <TotalTableCell colSpan={2}>100%</TotalTableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
