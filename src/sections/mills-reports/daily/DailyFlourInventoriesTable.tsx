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
  Button,
  Theme,
  SxProps,
  Menu,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState, useMemo, useCallback } from 'react';
import { fNumber } from 'src/utils/format-number';
import Iconify from 'src/components/iconify';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';

// --- STYLES ---

// Styles for Main Details Table
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
  backgroundColor: alpha(theme.palette.grey[500], 0.1),
  textAlign: 'left',
}));

// Styles for new Summary Header Table
const SummaryHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  color: theme.palette.primary.dark,
  fontWeight: 'bold',
  textAlign: 'center',
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  padding: '12px',
}));

const SummaryColumnHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  color: theme.palette.text.primary,
  fontWeight: 'bold',
  textAlign: 'center',
  borderBottom: `2px solid ${theme.palette.divider}`,
  padding: '12px',
}));

const SummaryRowHeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.secondary,
  textAlign: 'left',
  padding: '16px',
  borderBottom: `1px dashed ${theme.palette.divider}`,
}));

const SummaryDataCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1rem',
  color: theme.palette.text.primary,
  textAlign: 'center',
  padding: '16px',
  borderBottom: `1px dashed ${theme.palette.divider}`,
}));

// Common Styles
const CompanyHeaderCell = styled(StyledTableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  fontWeight: 'bold',
  textAlign: 'center',
  paddingLeft: theme.spacing(2),
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.grey[300],
  },
}));

const GrandTotalTableCell = styled(StyledTableCell)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1rem',
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.common.white,
  borderTop: `2px solid ${theme.palette.primary.main}`,
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
  month: number;
  day: number;
  companies: CompanyDailyInventory[];
};

type DailyFlourInventoriesData = {
  reportTitle: string;
  days: DailyRecord[];
};

type companySalesDailyAvg = {
  companyId: number;
  avgDailyFlourSalesInTons: number;
};

type branchSalesDailyAvg = {
  companyId: number;
  branchId: number;
  avgDailyFlourSalesInTons: number;
};

type mainInfo = {
  dailyFlourInventories: DailyFlourInventoriesData;
  companySalesDailyAvg: companySalesDailyAvg[];
  branchSalesDailyAvg: branchSalesDailyAvg[];
  totalConsumedFlourPackAndBulk: number;
  householdBagsLocal: number;
  householdBagsImported: number;
};

interface DailyFlourInventoriesTableProps {
  data: mainInfo;
  loading?: boolean;
}

// --- HELPER FUNCTION FOR ADEQUACY STATUS ---
const getAdequacyStatus = (
  days: number
): { label: string; color: 'success' | 'info' | 'error' } => {
  if (days < 2) return { label: 'حرج', color: 'error' };
  if (days < 6) return { label: 'تنبيه', color: 'info' };
  return { label: 'آمن', color: 'success' };
};

// --- CONSUMPTION AND ADEQUACY COMPONENT ---
function ConsumptionAndAdequacy({
  packAndBulkConsumption,
  homeLocalConsumption,
  homeImportedConsumption,
  currentPackInventory,
  currentBulkInventory,
  currentHomeInventory,
  previousPackInventory,
  previousBulkInventory,
  previousHomeInventory,
  isDataComplete,
}: {
  packAndBulkConsumption: number;
  homeLocalConsumption: number;
  homeImportedConsumption: number;
  currentPackInventory: number;
  currentBulkInventory: number;
  currentHomeInventory: number;
  previousPackInventory: number;
  previousBulkInventory: number;
  previousHomeInventory: number;
  isDataComplete: boolean;
}) {
  // Calculations
  const totalHomeConsumption = homeLocalConsumption + homeImportedConsumption;
  const dailyConsumptionPackAndBulk = packAndBulkConsumption > 0 ? packAndBulkConsumption / 365 : 0;
  const dailyConsumptionHome = totalHomeConsumption > 0 ? totalHomeConsumption / 365 : 0;

  const totalPackAndBulkInventory = currentPackInventory + currentBulkInventory;
  const prevTotalPackAndBulkInventory = previousPackInventory + previousBulkInventory;

  const adequacyPackAndBulk =
    dailyConsumptionPackAndBulk > 0 ? totalPackAndBulkInventory / dailyConsumptionPackAndBulk : 0;
  const adequacyHome = dailyConsumptionHome > 0 ? currentHomeInventory / dailyConsumptionHome : 0;

  const lessImportantRowSx: SxProps<Theme> = {
    backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.04),
  };

  const lessImportantCellSx: SxProps<Theme> = {
    fontWeight: 500,
    color: 'text.secondary',
  };

  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{ mt: 2, borderRadius: 2, background: 'transparent' }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="consumption and adequacy table">
        <TableHead>
          <TableRow>
            <SummaryHeaderCell
              sx={{ width: '40%', borderTopLeftRadius: (theme) => theme.spacing(2) }}
            >
              المؤشر
            </SummaryHeaderCell>
            <SummaryColumnHeaderCell>معبأ 45 كجم + سائب</SummaryColumnHeaderCell>
            <SummaryColumnHeaderCell sx={{ borderTopRightRadius: (theme) => theme.spacing(2) }}>
              عبوات منزلية
            </SummaryColumnHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow sx={lessImportantRowSx}>
            <SummaryRowHeaderCell component="th" scope="row" sx={lessImportantCellSx}>
              اجمالي استهلاك المملكة السنوي من الدقيق (طن) -
              <Typography
                component="span"
                sx={{
                  color: '#adb2ab',
                  fontWeight: 'inherit',
                  fontSize: 'inherit',
                  mx: 0.5,
                }}
              >
                محلي + مستورد
              </Typography>
            </SummaryRowHeaderCell>
            <SummaryDataCell sx={lessImportantCellSx}>
              {fNumber(packAndBulkConsumption)}
            </SummaryDataCell>
            <SummaryDataCell sx={lessImportantCellSx}>
              <Box>
                <Typography component="span" sx={{ fontWeight: 'inherit', fontSize: 'inherit' }}>
                  {fNumber(totalHomeConsumption)}
                </Typography>
              </Box>
            </SummaryDataCell>
          </TableRow>
          <TableRow sx={lessImportantRowSx}>
            <SummaryRowHeaderCell component="th" scope="row" sx={lessImportantCellSx}>
              متوسط الإستهلاك اليومي (طن) -
              <Typography
                component="span"
                sx={{
                  color: '#adb2ab',
                  fontWeight: 'inherit',
                  fontSize: 'inherit',
                  mx: 0.5,
                }}
              >
                محلي + مستورد
              </Typography>
            </SummaryRowHeaderCell>
            <SummaryDataCell sx={lessImportantCellSx}>
              {dailyConsumptionPackAndBulk.toFixed(2)}
            </SummaryDataCell>
            <SummaryDataCell sx={lessImportantCellSx}>
              {dailyConsumptionHome.toFixed(2)}
            </SummaryDataCell>
          </TableRow>
          <TableRow>
            <SummaryRowHeaderCell
              component="th"
              scope="row"
              sx={!isDataComplete ? { color: 'text.disabled' } : {}}
            >
              المخزون بشركات المطاحن (طن) - محلي
            </SummaryRowHeaderCell>
            {isDataComplete ? (
              <>
                <SummaryDataCell>
                  <PercentageChange
                    value={totalPackAndBulkInventory}
                    previousValue={prevTotalPackAndBulkInventory}
                  />
                </SummaryDataCell>
                <SummaryDataCell>
                  <PercentageChange
                    value={currentHomeInventory}
                    previousValue={previousHomeInventory}
                  />
                </SummaryDataCell>
              </>
            ) : (
              <SummaryDataCell colSpan={2}>
                <Typography variant="caption" color="text.disabled">
                  قيد الانتظار: تحديث بيانات المخزون لكامل قطاع شركات المطاحن
                </Typography>
              </SummaryDataCell>
            )}
          </TableRow>
          <TableRow>
            <SummaryRowHeaderCell
              component="th"
              scope="row"
              sx={{
                borderBottom: 'none',
                ...(!isDataComplete && { color: 'text.disabled' }),
              }}
            >
              كفاية المخزون (يوم) - محلي
            </SummaryRowHeaderCell>
            {isDataComplete ? (
              <>
                <SummaryDataCell sx={{ borderBottom: 'none' }}>
                  <Stack alignItems="center" spacing={0.5}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {adequacyPackAndBulk.toFixed(1)}
                    </Typography>
                    <Chip
                      label={getAdequacyStatus(adequacyPackAndBulk).label}
                      color={getAdequacyStatus(adequacyPackAndBulk).color}
                      size="small"
                      sx={{ width: '60px' }}
                    />
                  </Stack>
                </SummaryDataCell>
                <SummaryDataCell sx={{ borderBottom: 'none' }}>
                  <Stack alignItems="center" spacing={0.5}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {adequacyHome.toFixed(1)}
                    </Typography>
                    <Chip
                      label={getAdequacyStatus(adequacyHome).label}
                      color={getAdequacyStatus(adequacyHome).color}
                      size="small"
                      sx={{ width: '60px' }}
                    />
                  </Stack>
                </SummaryDataCell>
              </>
            ) : (
              <SummaryDataCell colSpan={2}>
                <Typography variant="subtitle1" color="text.disabled" sx={{ fontWeight: 400 }}>
                  ---
                </Typography>
              </SummaryDataCell>
            )}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// --- INVENTORY ADEQUACY LEGEND COMPONENT ---
function InventoryAdequacyLegend() {
  const theme = useTheme();
  const legendItems = [
    { label: 'آمن', range: '6 أيام أو أكثر', color: 'success' as const },
    { label: 'تنبيه', range: 'من 2 إلى أقل من 6 أيام', color: 'info' as const },
    { label: 'حرج', range: 'أقل من يومين', color: 'error' as const },
  ];

  return (
    <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1.5, mt: 2 }}>
      <Typography sx={{ mb: 2, textAlign: 'center' }}>دلالات مؤشر كفاية المخزون</Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="space-around"
        alignItems="center"
      >
        {legendItems.map((item) => (
          <Stack key={item.label} direction="row" alignItems="center" spacing={1.5}>
            <Chip label={item.label} color={item.color} sx={{ width: '80px' }} />
            <Typography variant="body2" color="text.secondary">
              {item.range}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

// --- PERCENTAGE CHANGE COMPONENT (NOW WITH FORMATTER) ---
function PercentageChange({
  value,
  previousValue,
  showTrend = true,
  size = 'medium',
  formatter,
}: {
  value: number;
  previousValue: number;
  showTrend?: boolean;
  size?: 'small' | 'medium' | 'large';
  formatter?: (value: number) => string;
}) {
  const diff = value - previousValue;
  const percentage = previousValue !== 0 ? (diff / Math.abs(previousValue)) * 100 : 0;
  const isPositive = diff > 0;
  const isNegative = diff < 0;
  const theme = useTheme();
  const color = isPositive
    ? theme.palette.success.main
    : isNegative
      ? theme.palette.error.main
      : theme.palette.text.secondary;
  const icon = isPositive ? 'eva:trending-up-fill' : 'eva:trending-down-fill';

  const fontSize = size === 'small' ? '0.75rem' : size === 'large' ? '1.1rem' : '0.875rem';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize }}>
        {formatter ? formatter(value) : fNumber(value)}
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

// --- MAIN COMPONENT ---
export default function DailyFlourInventoriesTable({
  data,
  loading = false,
}: DailyFlourInventoriesTableProps) {
  const {
    dailyFlourInventories,
    companySalesDailyAvg,
    branchSalesDailyAvg,
    totalConsumedFlourPackAndBulk,
    householdBagsLocal,
    householdBagsImported,
  } = data;
  const { reportTitle, days } = dailyFlourInventories;
  const [currentPage, setCurrentPage] = useState(days.length - 1);
  const [expandedCompanies, setExpandedCompanies] = useState<Set<number>>(() => {
    const initialDayRecord = days[days.length - 1];
    if (!initialDayRecord) {
      return new Set();
    }
    return new Set(initialDayRecord.companies.map((company) => company.companyId));
  });
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const todayRecord = days[currentPage];
  const yesterdayRecord = currentPage > 0 ? days[currentPage - 1] : undefined;

  const EXPECTED_BRANCHES = 13;
  const branchesCount = useMemo(
    () => todayRecord?.companies.reduce((sum, company) => sum + company.branches.length, 0) || 0,
    [todayRecord]
  );
  const isDataComplete = branchesCount === EXPECTED_BRANCHES;

  // FIX: This function now uses the month and day from the API data for accuracy.
  const formatDate = (record?: DailyRecord) => {
    if (!record) return ''; // Return empty string if the record is not available yet.

    const { month, day } = record;
    // We still need the year. For now, we get it from the current system date.
    // A more robust solution would be to have the API provide the year in the DailyRecord.
    const year = new Date().getFullYear();

    // The 'month' from API is 1-based (1-12), but JS Date constructor needs a 0-based month (0-11).
    const date = new Date(year, month - 1, day);

    const arabicDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const arabicMonths = [
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
    const dayName = arabicDays[date.getDay()];
    const monthName = arabicMonths[date.getMonth()];

    return `${dayName}, ${day} ${monthName} ${year}`;
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
  const yesterdayTotals = useMemo(
    () => calculateTotals(yesterdayRecord),
    [calculateTotals, yesterdayRecord]
  );
  const totalAvgSales = useMemo(
    () =>
      companySalesDailyAvg?.reduce((acc, company) => acc + company.avgDailyFlourSalesInTons, 0) ||
      0,
    [companySalesDailyAvg]
  );
  const yesterdayTotalAvgSales = useMemo(() => {
    if (!yesterdayRecord) return 0;
    return (
      companySalesDailyAvg?.reduce((acc, company) => acc + company.avgDailyFlourSalesInTons, 0) || 0
    );
  }, [companySalesDailyAvg, yesterdayRecord]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleDownloadChoice = (reportType: 'full' | 'summary') => {
    handleMenuClose();
    generatePDFReport(reportType);
  };

  const generatePDFReport = async (reportType: 'full' | 'summary') => {
    setGeneratingPDF(true);

    try {
      const now = new Date();

      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;

      const minutes = String(now.getMinutes()).padStart(2, '0');
      let hours = now.getHours();
      const ampm = hours >= 12 ? 'م' : 'ص';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedTime = `${hours}:${minutes} ${ampm}`;

      const printDate = `${formattedDate} ${formattedTime}`;

      const mainReportHtml =
        reportType === 'full'
          ? `
            <table class="main-table page-break-before">
              <thead>
                <tr>
                  <th>فرع</th>
                  <th>معبأ 45 كجم (بالطن)</th>
                  <th>السائب (بالطن)</th>
                  <th>العبوات المنزلية (بالطن)</th>
                  <th>إجمالي الدقيق (بالطن)</th>
                  <th>متوسط الإستهلاك اليومي (بالطن)</th>
                  <th>كفاية المخزون (باليوم)</th>
                </tr>
              </thead>
              <tbody>
                ${todayRecord.companies
                  .map((company) => {
                    const companyTotals = company.branches.reduce(
                      (acc, branch) => {
                        acc.grand += branch.grandFlourTotalQuantityInTons;
                        acc.pack += branch.packFlourTotalQuantityInTons;
                        acc.bulk += branch.bulkFlourTotalQuantityInTons;
                        acc.home += branch.homePackagesFlourTotalQuantityInTons;
                        return acc;
                      },
                      { grand: 0, pack: 0, bulk: 0, home: 0 }
                    );

                    const companyAvgSales =
                      companySalesDailyAvg?.find((s) => s.companyId === company.companyId)
                        ?.avgDailyFlourSalesInTons || 0;
                    const companyAdequacy =
                      companyAvgSales > 0 ? companyTotals.grand / companyAvgSales : 0;
                    const adequacyStatus = getAdequacyStatus(companyAdequacy);

                    return `
                    <tr>
                      <td class="company-header">${company.companyName}</td>
                      <td class="company-header">${fNumber(companyTotals.pack)}</td>
                      <td class="company-header">${fNumber(companyTotals.bulk)}</td>
                      <td class="company-header">${fNumber(companyTotals.home)}</td>
                      <td class="company-header">${fNumber(companyTotals.grand)}</td>
                      <td class="company-header">${fNumber(companyAvgSales)}</td>
                      <td class="company-header">
                        <div>${companyAdequacy.toFixed(1)}</div>
                        <span class="status-badge ${
                          adequacyStatus.color === 'success'
                            ? 'status-safe'
                            : adequacyStatus.color === 'info'
                              ? 'status-info'
                              : 'status-danger'
                        }">
                          ${adequacyStatus.label}
                        </span>
                      </td>
                    </tr>
                    ${company.branches
                      .map((branch) => {
                        const branchAvgSales =
                          branchSalesDailyAvg?.find((s) => s.branchId === branch.branchId)
                            ?.avgDailyFlourSalesInTons || 0;
                        const branchAdequacy =
                          branchAvgSales > 0
                            ? branch.grandFlourTotalQuantityInTons / branchAvgSales
                            : 0;
                        const branchAdequacyStatus = getAdequacyStatus(branchAdequacy);

                        return `
                        <tr class="branch-row">
                          <td class="branch-name">${branch.branchName}</td>
                          <td>${fNumber(branch.packFlourTotalQuantityInTons)}</td>
                          <td>${fNumber(branch.bulkFlourTotalQuantityInTons)}</td>
                          <td>${fNumber(branch.homePackagesFlourTotalQuantityInTons)}</td>
                          <td>${fNumber(branch.grandFlourTotalQuantityInTons)}</td>
                          <td>${fNumber(branchAvgSales)}</td>
                          <td>
                            <div>${branchAdequacy.toFixed(1)}</div>
                            <span class="status-badge ${
                              branchAdequacyStatus.color === 'success'
                                ? 'status-safe'
                                : branchAdequacyStatus.color === 'info'
                                  ? 'status-info'
                                  : 'status-danger'
                            }">
                              ${branchAdequacyStatus.label}
                            </span>
                          </td>
                        </tr>
                      `;
                      })
                      .join('')}
                  `;
                  })
                  .join('')}
                
                ${
                  isDataComplete
                    ? `
                  <tr class="grand-total">
                    <td style="text-align: right; padding-right: 20px;">الإجمالي العام (بالطن)</td>
                    <td>${fNumber(todayTotals.pack)}</td>
                    <td>${fNumber(todayTotals.bulk)}</td>
                    <td>${fNumber(todayTotals.home)}</td>
                    <td>${fNumber(todayTotals.grand)}</td>
                    <td>${fNumber(totalAvgSales)}</td>
                    <td>
                      <div>${
                        totalAvgSales > 0 ? (todayTotals.grand / totalAvgSales).toFixed(1) : '0.0'
                      }</div>
                      <span class="status-badge ${
                        getAdequacyStatus(totalAvgSales > 0 ? todayTotals.grand / totalAvgSales : 0)
                          .color === 'success'
                          ? 'status-safe'
                          : getAdequacyStatus(
                                totalAvgSales > 0 ? todayTotals.grand / totalAvgSales : 0
                              ).color === 'info'
                            ? 'status-info'
                            : 'status-danger'
                      }">
                        ${
                          getAdequacyStatus(
                            totalAvgSales > 0 ? todayTotals.grand / totalAvgSales : 0
                          ).label
                        }
                      </span>
                    </td>
                  </tr>
                `
                    : ''
                }
              </tbody>
            </table>
            
            <div class="footer-note">
              <p>يتم قياس متوسط المبيعات اليومي وفق قوائم المبيعات المسجلة لكل فرع العام السابق | 2024 م</p>
              <p style="margin-top: 10px;">يتم حساب كفاية المخزون وفق اجمالي المخزون المسجل لشركات المطاحن الى متوسط الإستهلاك اليومي الخاص بالعام السابق | 2024 م وذلك حسب التصنيف المبين.</p>
            </div>
            
            <div class="legend">
              <h3>دلالات مؤشر كفاية المخزون</h3>
              <div class="legend-items">
                <div class="legend-item">
                  <span class="status-badge status-safe">آمن</span>
                  <span>6 أيام أو أكثر</span>
                </div>
                <div class="legend-item">
                  <span class="status-badge status-info">تنبيه</span>
                  <span>من 2 إلى أقل من 6 أيام</span>
                </div>
                <div class="legend-item">
                  <span class="status-badge status-danger">حرج</span>
                  <span>أقل من يومين</span>
                </div>
                </div>
              </div>
            `
          : '';

      const htmlContent = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
          <head>
            <meta charset="UTF-8">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                font-family: 'Arial', sans-serif;
                background: white;
                color: #333;
                direction: rtl;
              }
              
              @page {
                size: A4 landscape;
              }
              
              /* Main content styles */
              .content-wrapper {
                margin: 20px;
              }
              
              .header {
                text-align: center;
                margin-bottom: 30px;
                padding: 20px;
                background: #f5f5f5;
                border-radius: 8px;
                position: relative;
              }
              
              .header h1 {
                color: #333;
                margin-bottom: 10px;
                font-size: 24px;
              }
              
              .date-chip {
                display: inline-block;
                padding: 8px 16px;
                background: #e3f2fd;
                border: 1px solid #1976d2;
                border-radius: 16px;
                color: #1976d2;
                font-weight: bold;
              }
              
              /* Summary Table Styles */
              .summary-section {
                margin-bottom: 30px;
              }
              .summary-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
                background: white;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              }
              .summary-table th {
                background: #e3f2fd;
                color: #1565c0;
                font-weight: bold;
                text-align: center;
                padding: 12px;
                border: 1px solid #ddd;
              }
              .summary-table td {
                padding: 12px;
                text-align: center;
                border: 1px solid #ddd;
              }
              .summary-table tr.less-important {
                background-color: #fafafa;
                color: #666;
              }
              .row-header {
                font-weight: 600;
                text-align: right !important;
                background: #f5f5f5;
              }
              
              /* Main Table Styles */
              .main-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
                font-size: 14px;
              }
              .main-table th {
                background: #e6f2e6;
                font-weight: bold;
                text-align: center;
                padding: 10px;
                border: 1px solid #ddd;
              }
              .main-table td {
                padding: 8px;
                text-align: center;
                border: 1px solid #ddd;
              }
              .main-table tr {
                page-break-inside: avoid;
              }
              .company-header {
                background: #e0e0e0;
                font-weight: bold;
                text-align: right !important;
                padding-right: 20px !important;
              }
              .branch-row {
                background: #fafafa;
              }
              .branch-name {
                text-align: right !important;
                padding-right: 40px !important;
              }
              .grand-total {
                background: #f0f0f0;
                font-weight: bold;
                font-size: 16px;
                border-top: 2px solid #1976d2;
              }
              
              /* Status Badges */
              .status-badge {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: bold;
              }
              .status-safe { background: #c8e6c9; color: #2e7d32; }
              .status-info { background: #bbdefb; color: #1565c0; }
              .status-danger { background: #ffcdd2; color: #c62828; }
              
              /* Legend */
              .legend {
                margin-top: 30px;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 8px;
                background: #fafafa;
              }
              .legend h3 {
                text-align: center;
                margin-bottom: 15px;
              }
              .legend-items {
                display: flex;
                justify-content: space-around;
                flex-wrap: wrap;
                gap: 15px;
              }
              .legend-item {
                display: flex;
                align-items: center;
                gap: 10px;
              }
              
              /* Footer */
              .footer-note {
                margin-top: 20px;
                padding: 15px;
                background: #f5f5f5;
                border-radius: 8px;
                text-align: center;
                font-size: 13px;
                color: #666;
              }
              
              .page-break-before {
                page-break-before: always;
              }
            </style>
          </head>
          <body>
            
            <div class="content-wrapper">

              <div style="direction: rtl; text-align: right; margin-bottom: 20px;">
                 <img src="/logo/gfsaLogoB.png" alt="شعار الهيئة" style="height: 70px; width: auto;" />
              </div>

              <div class="header">
                <h1>${reportTitle}</h1>
                <div class="date-chip">${formatDate(todayRecord)}</div>
              </div>
            
            <div class="summary-section">
              <table class="summary-table">
                <thead>
                  <tr>
                    <th style="width: 40%">المؤشر</th>
                    <th>معبأ 45 كجم + سائب</th>
                    <th>عبوات منزلية</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="less-important">
                    <td class="row-header">اجمالي استهلاك المملكة السنوي من الدقيق (طن) - <small>محلي + مستورد</small></td>
                    <td><strong>${fNumber(totalConsumedFlourPackAndBulk)}</strong></td>
                    <td>
                      <strong>${fNumber(householdBagsLocal + householdBagsImported)}</strong>
                    </td>
                  </tr>
                  <tr class="less-important">
                    <td class="row-header">متوسط الإستهلاك اليومي (طن) - <small>محلي + مستورد</small></td>
                    <td><strong>${(totalConsumedFlourPackAndBulk / 365).toFixed(2)}</strong></td>
                    <td><strong>${((householdBagsLocal + householdBagsImported) / 365).toFixed(
                      2
                    )}</strong></td>
                  </tr>
                  <tr>
                    <td class="row-header">المخزون بشركات المطاحن (طن) - محلي</td>
                    <td><strong>${fNumber(todayTotals.pack + todayTotals.bulk)}</strong></td>
                    <td><strong>${fNumber(todayTotals.home)}</strong></td>
                  </tr>
                  <tr>
                    <td class="row-header">كفاية المخزون (يوم) - محلي</td>
                    <td>
                      <span class="status-badge ${
                        getAdequacyStatus(
                          (todayTotals.pack + todayTotals.bulk) /
                            (totalConsumedFlourPackAndBulk / 365)
                        ).color === 'success'
                          ? 'status-safe'
                          : getAdequacyStatus(
                                (todayTotals.pack + todayTotals.bulk) /
                                  (totalConsumedFlourPackAndBulk / 365)
                              ).color === 'info'
                            ? 'status-info'
                            : 'status-danger'
                      }">
                        ${(
                          (todayTotals.pack + todayTotals.bulk) /
                          (totalConsumedFlourPackAndBulk / 365)
                        ).toFixed(1)} يوم
                      </span>
                    </td>
                    <td>
                      <span class="status-badge ${
                        getAdequacyStatus(
                          todayTotals.home / ((householdBagsLocal + householdBagsImported) / 365)
                        ).color === 'success'
                          ? 'status-safe'
                          : getAdequacyStatus(
                                todayTotals.home /
                                  ((householdBagsLocal + householdBagsImported) / 365)
                              ).color === 'info'
                            ? 'status-info'
                            : 'status-danger'
                      }">
                        ${(
                          todayTotals.home /
                          ((householdBagsLocal + householdBagsImported) / 365)
                        ).toFixed(1)} يوم
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            ${mainReportHtml}
            
            </div>
          </body>
        </html>
      `;

      const logoResponse = await fetch('/logo/gfsaLogoB.png');
      const logoBlob = await logoResponse.blob();
      const logoBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(logoBlob);
      });

      const htmlWithLogo = htmlContent.replace(/\/logo\/gfsaLogoB\.png/g, logoBase64);

      const response = await fetch('/api/generate-pdf/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html: htmlWithLogo,
          filename: `تقرير-مخزون-الدقيق-${todayRecord.day}-${
            new Date().getMonth() + 1
          }-${new Date().getFullYear()}.pdf`,
          options: {
            format: 'A4',
            landscape: true,
            printBackground: true,
            margin: {
              top: '20mm',
              right: '15mm',
              bottom: '60px',
              left: '15mm',
            },
            displayHeaderFooter: true,
            headerTemplate: '<div></div>',
            footerTemplate: `
              <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 0 30px; font-size: 12px; color: #666; direction: rtl;">
                <div style="text-align: right;">
                    <div>الهيئة العامة للأمن الغذائي</div>
                    <div style="font-size: 11px;">منصة البيانات المركزية</div>
                </div>
                <div style="text-align: center; font-weight: bold;">صفحة <span class="pageNumber"></span></div>
                <div style="text-align: left; direction: ltr;">${printDate}</div>
              </div>
            `,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `تقرير-مخزون-الدقيق-${todayRecord.day}-${
        new Date().getMonth() + 1
      }-${new Date().getFullYear()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setGeneratingPDF(false);
    }
  };

  // --- Reusable Options Menu component ---
  const optionsMenu = isDataComplete ? (
    <>
      <NavigationButton
        id="download-button"
        onClick={handleMenuOpen}
        disabled={generatingPDF}
        aria-label="Open download options"
        aria-controls={isMenuOpen ? 'download-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={isMenuOpen ? 'true' : undefined}
        sx={{ '&:hover': { transform: 'scale(1.1)' } }}
      >
        {generatingPDF ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          <Iconify icon="eva:more-vertical-fill" width={24} height={24} />
        )}
      </NavigationButton>
      <Menu
        id="download-menu"
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        MenuListProps={{ 'aria-labelledby': 'download-button' }}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: 'visible',
            mt: 1.5,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => handleDownloadChoice('full')}
          disabled={generatingPDF}
          sx={{ pl: 1, pr: 2 }}
        >
          <Iconify icon="mdi:file-document-outline" sx={{ mr: 2 }} />
          تحميل التقرير الكامل
        </MenuItem>
        <MenuItem
          onClick={() => handleDownloadChoice('summary')}
          disabled={generatingPDF}
          sx={{ pl: 1, pr: 2 }}
        >
          <Iconify icon="mdi:file-table-outline" sx={{ mr: 2 }} />
          تحميل الملخص فقط
        </MenuItem>
      </Menu>
    </>
  ) : null;

  if (loading) {
    return (
      <Box sx={{ my: 3 }}>
        <Skeleton variant="rectangular" height={230} sx={{ mb: 2 }} />
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
        <StyledPaper sx={{ mb: 3, p: { xs: 1.5, sm: 2, md: 3 } }}>
          <Stack spacing={2}>
            {/* --- Final Responsive Header --- */}
            <Stack spacing={1}>
              {/* Row 1: Mobile Options Button (top-left) */}
              <Box sx={{ display: { xs: 'block', sm: 'none' }, textAlign: 'left' }}>
                {optionsMenu}
              </Box>

              {/* Row 2 (Mobile) / The Only Row (Desktop) */}
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Desktop Options Button (top-right) */}
                <Box
                  sx={{
                    display: { xs: 'none', sm: 'block' },
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                >
                  {optionsMenu}
                </Box>

                {/* Main Content */}
                <NavigationButton onClick={handlePreviousDay} disabled={currentPage === 0}>
                  <Iconify icon="eva:arrow-ios-forward-fill" width={24} height={24} />
                </NavigationButton>
                <Box sx={{ mx: { xs: 1, sm: 3 }, textAlign: 'center' }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      typography: { xs: 'h6', sm: 'h5' },
                    }}
                  >
                    {reportTitle}
                  </Typography>
                  <Chip
                    label={formatDate(todayRecord)}
                    color="primary"
                    variant="outlined"
                    icon={<Iconify icon="eva:calendar-fill" />}
                  />
                </Box>
                <NavigationButton
                  onClick={handleNextDay}
                  disabled={currentPage === days.length - 1}
                >
                  <Iconify icon="eva:arrow-ios-back-fill" width={24} height={24} />
                </NavigationButton>
              </Box>
            </Stack>

            {/* Consumption and Adequacy Table */}
            <ConsumptionAndAdequacy
              packAndBulkConsumption={totalConsumedFlourPackAndBulk}
              homeLocalConsumption={householdBagsLocal}
              homeImportedConsumption={householdBagsImported}
              currentPackInventory={todayTotals.pack}
              currentBulkInventory={todayTotals.bulk}
              currentHomeInventory={todayTotals.home}
              previousPackInventory={yesterdayTotals.pack}
              previousBulkInventory={yesterdayTotals.bulk}
              previousHomeInventory={yesterdayTotals.home}
              isDataComplete={isDataComplete}
            />
          </Stack>
        </StyledPaper>

        {/* Main Details Table */}
        <Paper sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
          <TableContainer>
            <Table
              sx={{
                minWidth: 900,
                borderCollapse: 'collapse',
                '& td, & th': {
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                },
              }}
              size="small"
            >
              <TableHead>
                <TableRow>
                  <HeaderTableCell>فرع</HeaderTableCell>
                  <HeaderTableCell>معبأ 45 كجم (بالطن)</HeaderTableCell>
                  <HeaderTableCell>السائب (بالطن)</HeaderTableCell>
                  <HeaderTableCell>العبوات المنزلية (بالطن)</HeaderTableCell>
                  <HeaderTableCell>إجمالي الدقيق (بالطن)</HeaderTableCell>
                  <HeaderTableCell>متوسط الإستهلاك اليومي (بالطن)</HeaderTableCell>
                  <HeaderTableCell>كفاية المخزون (باليوم)</HeaderTableCell>
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

                  const companyAvgSales =
                    companySalesDailyAvg?.find((s) => s.companyId === company.companyId)
                      ?.avgDailyFlourSalesInTons || 0;
                  const companyAdequacy =
                    companyAvgSales > 0 ? todayCompanyTotals.grand / companyAvgSales : 0;
                  const prevCompanyAdequacy =
                    companyAvgSales > 0 ? yesterdayCompanyTotals.grand / companyAvgSales : 0;

                  return (
                    <React.Fragment key={company.companyId}>
                      <TableRow sx={{ '&:hover': { backgroundColor: alpha('#919EAB', 0.04) } }}>
                        <CompanyHeaderCell
                          onClick={() => toggleCompany(company.companyId)}
                          style={{ textAlign: 'left' }}
                        >
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
                        <CompanyHeaderCell>
                          <PercentageChange
                            value={todayCompanyTotals.grand}
                            previousValue={yesterdayCompanyTotals.grand}
                            size="large"
                          />
                        </CompanyHeaderCell>
                        <CompanyHeaderCell>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, fontSize: '1.1rem' }}
                          >
                            {fNumber(companyAvgSales)}
                          </Typography>
                        </CompanyHeaderCell>
                        <CompanyHeaderCell sx={{ verticalAlign: 'middle' }}>
                          <Stack alignItems="center" spacing={0.5}>
                            <PercentageChange
                              value={companyAdequacy}
                              previousValue={prevCompanyAdequacy}
                              formatter={(v) => v.toFixed(1)}
                              size="large"
                            />
                            <Chip
                              label={getAdequacyStatus(companyAdequacy).label}
                              color={getAdequacyStatus(companyAdequacy).color}
                              size="small"
                              sx={{ width: '60px' }}
                            />
                          </Stack>
                        </CompanyHeaderCell>
                      </TableRow>

                      <AnimatePresence>
                        {isExpanded &&
                          company.branches.map((branch) => {
                            const prevDayBranch = prevDayCompany?.branches.find(
                              (b) => b.branchId === branch.branchId
                            );
                            const branchAvgSales =
                              branchSalesDailyAvg?.find((s) => s.branchId === branch.branchId)
                                ?.avgDailyFlourSalesInTons || 0;
                            const branchAdequacy =
                              branchAvgSales > 0
                                ? branch.grandFlourTotalQuantityInTons / branchAvgSales
                                : 0;
                            const prevBranchAdequacy =
                              branchAvgSales > 0
                                ? (prevDayBranch?.grandFlourTotalQuantityInTons || 0) /
                                  branchAvgSales
                                : 0;

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
                                    previousValue={
                                      prevDayBranch?.homePackagesFlourTotalQuantityInTons || 0
                                    }
                                  />
                                </StyledTableCell>
                                <StyledTableCell>
                                  <PercentageChange
                                    value={branch.grandFlourTotalQuantityInTons}
                                    previousValue={
                                      prevDayBranch?.grandFlourTotalQuantityInTons || 0
                                    }
                                  />
                                </StyledTableCell>
                                <StyledTableCell>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    {fNumber(branchAvgSales)}
                                  </Typography>
                                </StyledTableCell>
                                <StyledTableCell sx={{ verticalAlign: 'middle' }}>
                                  <Stack alignItems="center" spacing={0.5}>
                                    <PercentageChange
                                      value={branchAdequacy}
                                      previousValue={prevBranchAdequacy}
                                      formatter={(v) => v.toFixed(1)}
                                    />
                                    <Chip
                                      label={getAdequacyStatus(branchAdequacy).label}
                                      color={getAdequacyStatus(branchAdequacy).color}
                                      size="small"
                                      sx={{ width: '60px' }}
                                    />
                                  </Stack>
                                </StyledTableCell>
                              </m.tr>
                            );
                          })}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}

                {/* Grand Total Row */}
                {isDataComplete && (
                  <TableRow>
                    <GrandTotalTableCell sx={{ textAlign: 'left', pl: 2 }}>
                      الإجمالي العام (بالطن)
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
                    <GrandTotalTableCell>
                      <PercentageChange
                        value={todayTotals.grand}
                        previousValue={yesterdayTotals.grand}
                        size="large"
                        showTrend={false}
                      />
                    </GrandTotalTableCell>
                    <GrandTotalTableCell>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {fNumber(totalAvgSales)}
                      </Typography>
                    </GrandTotalTableCell>
                    <GrandTotalTableCell sx={{ verticalAlign: 'middle' }}>
                      <Stack alignItems="center" spacing={0.5}>
                        <PercentageChange
                          value={totalAvgSales > 0 ? todayTotals.grand / totalAvgSales : 0}
                          previousValue={
                            yesterdayTotalAvgSales > 0
                              ? yesterdayTotals.grand / yesterdayTotalAvgSales
                              : 0
                          }
                          formatter={(v) => v.toFixed(1)}
                          size="large"
                        />
                        <Chip
                          label={
                            getAdequacyStatus(
                              totalAvgSales > 0 ? todayTotals.grand / totalAvgSales : 0
                            ).label
                          }
                          color={
                            getAdequacyStatus(
                              totalAvgSales > 0 ? todayTotals.grand / totalAvgSales : 0
                            ).color
                          }
                          size="small"
                          sx={{ width: '60px' }}
                        />
                      </Stack>
                    </GrandTotalTableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Box
          sx={{
            mt: 2,
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            border: (theme) => `1px dashed ${theme.palette.divider}`,
            borderRadius: 1.5,
            backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.04),
          }}
        >
          <Iconify icon="eva:info-outline" sx={{ color: 'text.secondary', flexShrink: 0 }} />
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
            يتم قياس متوسط المبيعات اليومي وفق قوائم المبيعات المسجلة لكل فرع العام السابق | 2024 م
          </Typography>
        </Box>
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            border: (theme) => `1px dashed ${theme.palette.divider}`,
            borderRadius: 1.5,
            backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.04),
          }}
        >
          <Iconify icon="eva:info-outline" sx={{ color: 'text.secondary', flexShrink: 0 }} />
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
            يتم حساب كفاية المخزون وفق اجمالي المخزون المسجل لشركات المطاحن الى متوسط الإستهلاك
            اليومي الخاص بالعام السابق | 2024 م وذلك حسب التصنيف المبين.
          </Typography>
        </Box>
        <InventoryAdequacyLegend />
      </Box>
    </LazyMotion>
  );
}
