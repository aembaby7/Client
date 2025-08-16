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
  IconButton,
  Chip,
  Stack,
  useTheme,
  alpha,
  Skeleton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState, useMemo, useCallback } from 'react';
import { fNumber } from 'src/utils/format-number';
import Iconify from 'src/components/iconify';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';

// --- STYLES ---
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  textAlign: 'center',
  padding: '12px',
  fontSize: '0.875rem',
}));

const HeaderTableCell = styled(StyledTableCell)(({ theme }) => ({
  backgroundColor: '#e6f2e6',
  fontWeight: 'bold',
  color: theme.palette.text.primary,
  fontSize: '0.9rem',
}));

const RowHeaderTableCell = styled(StyledTableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: alpha(theme.palette.grey[500], 0.1), // Lighter background for sub-rows
  textAlign: 'center',
}));

const CompanyHeaderCell = styled(StyledTableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  fontWeight: 'bold',
  textAlign: 'left',
  paddingLeft: theme.spacing(2),
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.grey[300],
  },
}));

// --- NEW WHITE FOOTER STYLE ---
const GrandTotalTableCell = styled(StyledTableCell)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1rem',
  color: theme.palette.text.primary, // Dark text for contrast
  backgroundColor: theme.palette.common.white, // White background
  borderTop: `2px solid ${theme.palette.divider}`, // Prominent top border for separation
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  boxShadow: theme.shadows[3],
  background: theme.palette.background.paper,
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'scale(1.1)',
  },
  '&:disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
  },
  transition: 'all 0.2s ease',
}));

// --- TYPE DEFINITIONS & PROPS ---
type BranchDailyInventory = {
  branchId: number;
  branchName: string;
  grandFlourTotalQuantityInTons: number;
  packFlourTotalQuantityInTons: number;
  bulkFlourTotalQuantityInTons: number;
  homePackagesFlourTotalQuantityInTons: number;
};

type CompanyDailyInventory = {
  companyId: number;
  companyName: string;
  branches: BranchDailyInventory[];
};

type DailyRecord = {
  day: number;
  companies: CompanyDailyInventory[];
};

interface DailyFlourInventoriesTableProps {
  data: {
    reportTitle: string;
    days: DailyRecord[];
  };
  loading?: boolean;
}

// --- ENHANCED HELPER COMPONENTS ---
function PercentageChange({
  value,
  previousValue,
  showTrend = true,
  size = 'medium'
}: {
  value: number;
  previousValue: number;
  showTrend?: boolean;
  size?: 'small' | 'medium' | 'large';
}) {
  const diff = value - previousValue;
  const percentage = previousValue !== 0 ? (diff / Math.abs(previousValue)) * 100 : 0;
  const isPositive = diff > 0;
  const isNegative = diff < 0;
  const theme = useTheme();
  const color = isPositive ? theme.palette.success.main : isNegative ? theme.palette.error.main : theme.palette.text.secondary;
  const icon = isPositive ? 'eva:trending-up-fill' : 'eva:trending-down-fill';

  const fontSize = size === 'small' ? '0.75rem' : size === 'large' ? '1.1rem' : '0.875rem';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize }}>
        {fNumber(value)}
      </Typography>
      {showTrend && previousValue !== 0 && Math.abs(percentage) > 0.01 && (
        <m.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box
            component="span"
            sx={{
              display: 'flex',
              alignItems: 'center',
              color,
              typography: 'caption',
              backgroundColor: alpha(color, 0.1),
              px: 1,
              py: 0.25,
              borderRadius: 1,
            }}
          >
            <Iconify icon={icon} sx={{ mr: 0.5, width: 16, height: 16 }} />
            {`${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`}
          </Box>
        </m.div>
      )}
    </Box>
  );
}

function StatCard({
  title,
  value,
  previousValue,
  icon,
  color = 'primary'
}: {
  title: string;
  value: number;
  previousValue: number;
  icon: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}) {
  const theme = useTheme();
  const diff = value - previousValue;
  const percentage = previousValue !== 0 ? (diff / Math.abs(previousValue)) * 100 : 0;
  const trend = diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable';

  return (
    <m.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Paper
        sx={{
          p: 2.5,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${alpha(theme.palette[color].light, 0.1)} 0%, ${alpha(theme.palette[color].main, 0.05)} 100%)`,
          border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette[color].dark }}>
              {fNumber(value)}
            </Typography>
            {Math.abs(percentage) > 0.01 && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Iconify
                  icon={trend === 'up' ? 'eva:trending-up-fill' : 'eva:trending-down-fill'}
                  sx={{
                    width: 20,
                    height: 20,
                    color: trend === 'up' ? theme.palette.success.main : theme.palette.error.main,
                    mr: 0.5,
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: trend === 'up' ? theme.palette.success.main : theme.palette.error.main,
                    fontWeight: 600,
                  }}
                >
                  {`${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`}
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: alpha(theme.palette[color].main, 0.1),
            }}
          >
            <Iconify icon={icon} sx={{ width: 24, height: 24, color: theme.palette[color].main }} />
          </Box>
        </Box>
      </Paper>
    </m.div>
  );
}

// --- MAIN ENHANCED COMPONENT ---
export default function DailyFlourInventoriesTable({ data, loading = false }: DailyFlourInventoriesTableProps) {
  const { reportTitle, days } = data;
  const [currentPage, setCurrentPage] = useState(days.length - 1);
  const [expandedCompanies, setExpandedCompanies] = useState<Set<number>>(new Set());

  const todayRecord = days[currentPage];
  const yesterdayRecord = currentPage > 0 ? days[currentPage - 1] : undefined;

  // Function to format date
  const formatDate = (dayNumber: number) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = new Date(year, month, dayNumber);
    const arabicDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const arabicMonths = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    const dayName = arabicDays[date.getDay()];
    const monthName = arabicMonths[date.getMonth()];
    return `${dayName}, ${dayNumber} ${monthName} ${year}`;
  };

  const handlePreviousDay = useCallback(() => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNextDay = useCallback(() => {
    setCurrentPage((prev) => Math.min(days.length - 1, prev + 1));
  }, [days.length]);

  const toggleCompany = useCallback((companyId: number) => {
    setExpandedCompanies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(companyId)) {
        newSet.delete(companyId);
      } else {
        newSet.add(companyId);
      }
      return newSet;
    });
  }, []);

  // Calculate totals
  const calculateTotals = useCallback((record?: DailyRecord) => {
    if (!record) return { grand: 0, pack: 0, bulk: 0, home: 0 };
    return record.companies.reduce(
      (companyAcc, company) => {
        const companyTotals = company.branches.reduce(
          (branchAcc, branch) => {
            branchAcc.grand += branch.grandFlourTotalQuantityInTons;
            branchAcc.pack += branch.packFlourTotalQuantityInTons;
            branchAcc.bulk += branch.bulkFlourTotalQuantityInTons;
            branchAcc.home += branch.homePackagesFlourTotalQuantityInTons;
            return branchAcc;
          },
          { grand: 0, pack: 0, bulk: 0, home: 0 }
        );
        companyAcc.grand += companyTotals.grand;
        companyAcc.pack += companyTotals.pack;
        companyAcc.bulk += companyTotals.bulk;
        companyAcc.home += companyTotals.home;
        return companyAcc;
      },
      { grand: 0, pack: 0, bulk: 0, home: 0 }
    );
  }, []);

  const todayTotals = useMemo(() => calculateTotals(todayRecord), [calculateTotals, todayRecord]);
  const yesterdayTotals = useMemo(() => calculateTotals(yesterdayRecord), [calculateTotals, yesterdayRecord]);

  if (loading) {
    return (
      <Box sx={{ my: 3 }}>
        <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={400} />
      </Box>
    );
  }

  if (!todayRecord) {
    return (
      <Box sx={{ my: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          لا توجد بيانات للفترة المحددة
        </Typography>
      </Box>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      <Box sx={{ my: 3 }}>
        {/* Header Section */}
        <StyledPaper sx={{ mb: 3, p: 3 }}>
          <Stack spacing={3}>
            {/* Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <NavigationButton onClick={handlePreviousDay} disabled={currentPage === 0}>
                <Iconify icon="eva:arrow-ios-forward-fill" width={24} height={24} />
              </NavigationButton>

              <Box sx={{ mx: 3, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                  {reportTitle}
                </Typography>
                <Chip
                  label={formatDate(todayRecord.day)}
                  color="primary"
                  size="medium"
                  icon={<Iconify icon="eva:calendar-fill" />}
                />
              </Box>

              <NavigationButton onClick={handleNextDay} disabled={currentPage === days.length - 1}>
                <Iconify icon="eva:arrow-ios-back-fill" width={24} height={24} />
              </NavigationButton>
            </Box>

            {/* Stats Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
              <StatCard
                title="إجمالي الدقيق"
                value={todayTotals.grand}
                previousValue={yesterdayTotals.grand}
                icon="eva:cube-fill"
                color="primary"
              />
              <StatCard
                title="المعبأ"
                value={todayTotals.pack}
                previousValue={yesterdayTotals.pack}
                icon="eva:archive-fill"
                color="success"
              />
              <StatCard
                title="السائب"
                value={todayTotals.bulk}
                previousValue={yesterdayTotals.bulk}
                icon="eva:droplet-fill"
                color="info"
              />
              <StatCard
                title="العبوات المنزلية"
                value={todayTotals.home}
                previousValue={yesterdayTotals.home}
                icon="eva:home-fill"
                color="warning"
              />
            </Box>
          </Stack>
        </StyledPaper>

        {/* Table */}
        <Paper>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead>
                <TableRow>
                  <HeaderTableCell>فرع</HeaderTableCell>
                  <HeaderTableCell>إجمالي الدقيق (بالطن)</HeaderTableCell>
                  <HeaderTableCell>المعبأ (بالطن)</HeaderTableCell>
                  <HeaderTableCell>السائب (بالطن)</HeaderTableCell>
                  <HeaderTableCell>العبوات المنزلية (بالطن)</HeaderTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {todayRecord.companies.map((company) => {
                  const isExpanded = expandedCompanies.has(company.companyId);
                  const prevDayCompany = yesterdayRecord?.companies.find(
                    (c) => c.companyId === company.companyId
                  );

                  const todayCompanyTotals = company.branches.reduce(
                    (acc, branch) => {
                      acc.grand += branch.grandFlourTotalQuantityInTons;
                      acc.pack += branch.packFlourTotalQuantityInTons;
                      acc.bulk += branch.bulkFlourTotalQuantityInTons;
                      acc.home += branch.homePackagesFlourTotalQuantityInTons;
                      return acc;
                    },
                    { grand: 0, pack: 0, bulk: 0, home: 0 }
                  );

                  const yesterdayCompanyTotals = prevDayCompany
                    ? prevDayCompany.branches.reduce(
                        (acc, branch) => {
                          acc.grand += branch.grandFlourTotalQuantityInTons;
                          acc.pack += branch.packFlourTotalQuantityInTons;
                          acc.bulk += branch.bulkFlourTotalQuantityInTons;
                          acc.home += branch.homePackagesFlourTotalQuantityInTons;
                          return acc;
                        },
                        { grand: 0, pack: 0, bulk: 0, home: 0 }
                      )
                    : { grand: 0, pack: 0, bulk: 0, home: 0 };

                  return (
                    <React.Fragment key={company.companyId}>
                      <TableRow>
                        <CompanyHeaderCell onClick={() => toggleCompany(company.companyId)}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Iconify
                              icon={isExpanded ? 'eva:chevron-down-fill' : 'eva:chevron-left-fill'}
                              sx={{ mr: 1, transition: 'transform 0.2s' }}
                            />
                            {company.companyName}
                          </Box>
                        </CompanyHeaderCell>
                        <CompanyHeaderCell>
                          <PercentageChange
                            value={todayCompanyTotals.grand}
                            previousValue={yesterdayCompanyTotals.grand}
                            size="large"
                          />
                        </CompanyHeaderCell>
                        <CompanyHeaderCell>
                          <PercentageChange
                            value={todayCompanyTotals.pack}
                            previousValue={yesterdayCompanyTotals.pack}
                            size="large"
                          />
                        </CompanyHeaderCell>
                        <CompanyHeaderCell>
                          <PercentageChange
                            value={todayCompanyTotals.bulk}
                            previousValue={yesterdayCompanyTotals.bulk}
                            size="large"
                          />
                        </CompanyHeaderCell>
                        <CompanyHeaderCell>
                          <PercentageChange
                            value={todayCompanyTotals.home}
                            previousValue={yesterdayCompanyTotals.home}
                            size="large"
                          />
                        </CompanyHeaderCell>
                      </TableRow>
                      
                      <AnimatePresence>
                        {isExpanded && company.branches.map((branch) => {
                          const prevDayBranch = prevDayCompany?.branches.find(
                            (b) => b.branchId === branch.branchId
                          );
                          return (
                            <m.tr
                              key={branch.branchId}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              layout
                            >
                              <RowHeaderTableCell component="th" scope="row">
                                {branch.branchName}
                              </RowHeaderTableCell>
                              <StyledTableCell>
                                <PercentageChange
                                  value={branch.grandFlourTotalQuantityInTons}
                                  previousValue={prevDayBranch?.grandFlourTotalQuantityInTons || 0}
                                />
                              </StyledTableCell>
                              <StyledTableCell>
                                <PercentageChange
                                  value={branch.packFlourTotalQuantityInTons}
                                  previousValue={prevDayBranch?.packFlourTotalQuantityInTons || 0}
                                />
                              </StyledTableCell>
                              <StyledTableCell>
                                <PercentageChange
                                  value={branch.bulkFlourTotalQuantityInTons}
                                  previousValue={prevDayBranch?.bulkFlourTotalQuantityInTons || 0}
                                />
                              </StyledTableCell>
                              <StyledTableCell>
                                <PercentageChange
                                  value={branch.homePackagesFlourTotalQuantityInTons}
                                  previousValue={prevDayBranch?.homePackagesFlourTotalQuantityInTons || 0}
                                />
                              </StyledTableCell>
                            </m.tr>
                          );
                        })}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}

                {/* Grand Total Row */}
                <TableRow>
                  <GrandTotalTableCell sx={{ textAlign: 'left', pl: 2 }}>
                    الإجمالي العام (بالطن)
                  </GrandTotalTableCell>
                  <GrandTotalTableCell>
                    <PercentageChange
                      value={todayTotals.grand}
                      previousValue={yesterdayTotals.grand}
                      size="large"
                      showTrend={false}
                    />
                  </GrandTotalTableCell>
                  <GrandTotalTableCell>
                    <PercentageChange
                      value={todayTotals.pack}
                      previousValue={yesterdayTotals.pack}
                      size="large"
                      showTrend={false}
                    />
                  </GrandTotalTableCell>
                  <GrandTotalTableCell>
                    <PercentageChange
                      value={todayTotals.bulk}
                      previousValue={yesterdayTotals.bulk}
                      size="large"
                      showTrend={false}
                    />
                  </GrandTotalTableCell>
                  <GrandTotalTableCell>
                    <PercentageChange
                      value={todayTotals.home}
                      previousValue={yesterdayTotals.home}
                      size="large"
                      showTrend={false}
                    />
                  </GrandTotalTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </LazyMotion>
  );
}