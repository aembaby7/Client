'use client';

import useSWR from 'swr';
import axios, { fetcher, endpoints } from 'src/utils/axios';
import { useTheme, styled, alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import {
  _bookings,
  _bookingNew,
  _bookingReview,
  _bookingsOverview,
  _ecommerceSalesOverview,
} from 'src//_mock';

import { useSettingsContext } from 'src/components/settings';

import Box from '@mui/material/Box';
import { useTranslate } from 'src/locales';

import LocalShippingTwoToneIcon from '@mui/icons-material/LocalShippingTwoTone';
import WarehouseTwoToneIcon from '@mui/icons-material/WarehouseTwoTone';
import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';
import LocalAtmTwoToneIcon from '@mui/icons-material/LocalAtmTwoTone';
import PriceCheckTwoToneIcon from '@mui/icons-material/PriceCheckTwoTone';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { fDate } from 'src/utils/format-time';
import {
  Alert,
  Button,
  Divider,
  FormControl,
  InputLabel,
  OutlinedInput,
  Tab,
  Tabs,
} from '@mui/material';
import { MenuItem, Select, Typography } from '@mui/material';
import AppWidget from 'src/sections/app/app-widget';
import { fShortenNumber2 } from 'src/utils/format-number';
import { useCallback, useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import {
  Upload,
  Download,
  AssuredWorkload,
  DirectionsBoat,
  HouseSiding,
  ImportExport,
  LocalShipping,
  OtherHouses,
  PointOfSale,
  Store,
  Houseboat,
  Search as SearchIcon,
} from '@mui/icons-material';
import { SelectChangeEvent } from '@mui/material/Select';
import { LoadingScreen } from 'src/components/loading-screen';
import EmptyContent from 'src/components/empty-content';
import { IDashMonthlyReportsFilters } from 'src/types/dashStock';
import { filter } from 'lodash';

// Import all typed components
import MillingCompaniesSalesComparisonTable from '../sales-data-table';
import ExecutiveSummaryKPIs from '../executive-summary-kpis';
import PerformanceAnalysisKPIs from '../performance-analysis-kpis';
import MarketShareKPIs from '../market-share-kpis';
import TrendAnalysisKPIs from '../trend-analysis-kpis';
import ForecastingKPIs from '../forecasting-kpis';

import SalesDataComparisonBranch from '../sales-data-comparison-branch';
import SalesDataComparisonCompany from '../sales-data-comparison-company';
import SalesDataComparisonMonth from '../sales-data-comparison-month';
import SalesDataMonthlyTrend from '../sales-data-monthly-trend';
import { COMPANY_COLORS, COMPANY_ORDER, getCompanyColor } from 'src/config/company-config';

// Type definitions
interface BranchMonthlySales {
  name: string;
  monthlySalesCYear: number[];
  monthlySalesPYear: number[];
}

interface CompanyMonthlySales {
  name: string;
  branches: BranchMonthlySales[];
}

interface MonthlySalesDataObject {
  reportTitle: string;
  companies: CompanyMonthlySales[];
}

// Define other types used in the component
type MillsReportDataObject = {
  reportTitle: string;
  rows: ReportRow[];
};

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

type DailyFlourInventoriesData = {
  reportTitle: string;
  days: DailyRecord[];
};

export type mainInfo = {
  sales: {
    grandFlourTotalQuantityInTons: number;
    premiumFlourTotalQuantityInTons: number;
    bakeryFlourTotalQuantityInTons: number;
    wholeWheatFlourTotalQuantityInTons: number;
    premiumWholeWheatFlourTotalQuantityInTons: number;
    packFlourTotalQuantityInTons: number;
    bulkFlourTotalQuantityInTons: number;
    homePackagesFlourTotalQuantityInTons: number;
    otherFlourTotalQuantityInTons: number;
    wheatDerivativesTotalQuantityInTons: number;
    animalBranTotalQuantityInTons: number;
    feedTotalQuantityInTons: number;
    importedFlourTotalQuantityInTons: number;
    localNotGFSAFlourTotalQuantityInTons: number;
  };
  prod: {
    totalWheatUsedInProductionInTons: number;
    grandFlourTotalQuantityInTons: number;
    premiumFlourTotalQuantityInTons: number;
    bakeryFlourTotalQuantityInTons: number;
    wholeWheatFlourTotalQuantityInTons: number;
    premiumWholeWheatFlourTotalQuantityInTons: number;
    otherFlourTotalQuantityInTons: number;
    wheatDerivativesTotalQuantityInTons: number;
    animalBranTotalQuantityInTons: number;
    feedTotalQuantityInTons: number;
    importedWheatTotalQuantityInTons: number;
    importedFlourTotalQuantityInTons: number;
    localNotGFSAWheatTotalQuantityInTons: number;
    localNotGFSAFlourTotalQuantityInTons: number;
  };
  del: {
    totalWheatDeliveredInTons: number;
  };
  sufficiencyInDays: number;
  millsReportData: MillsReportDataObject;
  monthlySales: MonthlySalesDataObject;
  flourReport: FlourReport;
  quarterlyComparisonData: QuarterlyComparisonData;
  dailyFlourInventories: DailyFlourInventoriesData;
};

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

type ReportRow = {
  branchId: number;
  branch: string;
  openingBalance: {
    wheat: number;
    flour: { kg45Bags: number; bulk: number; householdBags: number };
  };
  flourSales: { kg45Bags: number; bulk: number; householdBags: number; total: number };
  wheatAndProd: { received: number; consumed: number; flour: number };
  closingBalance: {
    wheat: number;
    flour: { kg45Bags: number; bulk: number; householdBags: number };
  };
  wheatSufficiency: { avgConsumption: number; sufficiencyPerMonth: number };
  flourSufficiency: { avgConsumption: number; sufficiencyPerMonth: number };
};

type Branch = {
  name: string;
  receivedWheat: number;
  producedFlour: number;
  soldFlour: number;
};

type Company = {
  name: string;
  colSpan: number;
  branches: Branch[];
};

type FlourReport = {
  title: string;
  companies: Company[];
};

// Constants
var today = new Date();
var yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

const defaultFilters: IDashMonthlyReportsFilters = {
  year: 2025,
  fromMonth: 0,
  toMonth: 0,
  companyId: 0,
  branchId: 0,
};

// Lookup data
const lookups = {
  companies: [
    { id: 1, name: 'الأولى' },
    { id: 2, name: 'العربية' },
    { id: 3, name: 'الحديثة' },
    { id: 4, name: 'الرابعة' },
  ],
  branches: [
    { id: 14, companyId: 1, name: 'فرع جدة' },
    { id: 15, companyId: 1, name: 'فرع القصيم' },
    { id: 19, companyId: 1, name: 'فرع تبوك' },
    { id: 25, companyId: 1, name: 'فرع الإحساء' },
    { id: 12, companyId: 2, name: 'فرع الرياض' },
    { id: 20, companyId: 2, name: 'فرع حائل' },
    { id: 24, companyId: 2, name: 'فرع جازان' },
    { id: 16, companyId: 3, name: 'فرع خميس مشيط' },
    { id: 23, companyId: 3, name: 'فرع الجموم' },
    { id: 18, companyId: 3, name: 'فرع الجوف' },
    { id: 13, companyId: 4, name: 'فرع الدمام' },
    { id: 17, companyId: 4, name: 'فرع الخرج' },
    { id: 22, companyId: 4, name: 'فرع المدينة المنورة' },
  ],
};

const TIME_LABELS = {
  month: [
    { id: 1, name: 'يناير' },
    { id: 2, name: 'فبراير' },
    { id: 3, name: 'مارس' },
    { id: 4, name: 'ابريل' },
    { id: 5, name: 'مايو' },
    { id: 6, name: 'يونيو' },
    { id: 7, name: 'يوليو' },
    { id: 8, name: 'أغسطس' },
    { id: 9, name: 'سبتمبر' },
    { id: 10, name: 'اكتوبر' },
    { id: 11, name: 'نوفمبر' },
    { id: 12, name: 'ديسمبر' },
  ],
  year: ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'],
};

const SPACING = 3;

export default function DevSalesDataView() {
  const now = new Date();
  const [warningLimit, setWarningLimit] = useState(50);
  const [fairLimit, setFairLimit] = useState(9000);
  const [moreLimit, setMoreLimit] = useState(90);

  const printingAreaRef = useRef<HTMLDivElement>(null);
  const btnPrintingRef = useRef<HTMLDivElement>(null);

  const theme = useTheme();
  const settings = useSettingsContext();
  const [filters, setFilters] = useState(defaultFilters);
  const [displayYear, setDisplayYear] = useState(defaultFilters.year);

  const [showContent, setShowContent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [mainInfo, setmainInfo] = useState<mainInfo>();
  const [currentTab, setCurrentTab] = useState('executiveSummary');

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  const handleLocationBalanceStatisticsTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setTabLocationBalanceStatisticsIndex(newValue);
  };
  const [tabLocationBalanceStatisticsIndex, setTabLocationBalanceStatisticsIndex] = useState(0);

  const getData = useCallback(
    async (
      year: number,
      fromMonth: number,
      toMonth: number,
      branchId: number,
      companyId: number
    ) => {
      setErrorMsg('');
      setIsLoading(true);
      const data = {
        year,
        fromMonth,
        toMonth,
        branchId,
        companyId,
      };
      const res = await axios.post(endpoints.dashWheatSales.getDashboard, data);

      const { isSuccess, result, errorMessages, httpStatusCode } = res.data;
      setIsLoading(false);
      if (isSuccess) {
        const apiMainInfo = result.mainInfo;
        const transformedMainInfo: mainInfo = {
          ...apiMainInfo,
          monthlySales: {
            companies: apiMainInfo.monthlySales,
          },
        };

        setmainInfo(transformedMainInfo);
        setShowContent(true);
      } else {
        setErrorMsg('لم يتم تحميل البيانات المطلوبة، يرجى التأكد من مدخلات البحث');
        setShowContent(false);
      }
    },
    []
  );

  useEffect(() => {
    getData(filters.year, filters.fromMonth, filters.toMonth, filters.companyId, filters.branchId);
  }, []);

  function handleFilters(name: string, value: number) {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleFiltersText(name: string, value: string) {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleFiltersDate(name: string, value: Date | null) {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(filters);
  }

  function handleChangeYear(event: SelectChangeEvent) {
    handleFilters('year', Number(event.target.value));
  }

  function handleChangeFromMonth(event: SelectChangeEvent) {
    handleFilters('fromMonth', Number(event.target.value));
  }

  function handleChangeToMonth(event: SelectChangeEvent) {
    handleFilters('toMonth', Number(event.target.value));
  }

  function handleChangeCompany(event: SelectChangeEvent) {
    handleFilters('companyId', Number(event.target.value));
    handleFilters('branchId', 0);
  }

  function handleChangeBranch(event: SelectChangeEvent) {
    handleFilters('branchId', Number(event.target.value));
  }

  function handleChangeText(event: React.ChangeEvent<HTMLInputElement>) {
    console.log((event.target as HTMLInputElement).value);
    handleFiltersText('text', (event.target as HTMLInputElement).value);
  }

  const handleFilterFromDate = useCallback(
    (newValue: Date | null) => {
      handleFiltersDate('fromDate', newValue);
    },
    [handleFiltersDate]
  );

  const handleFilterToDate = useCallback(
    (newValue: Date | null) => {
      handleFiltersDate('toDate', newValue);
    },
    [handleFiltersDate]
  );

  function handleOnClick() {
    setDisplayYear(filters.year);
    getData(filters.year, filters.fromMonth, filters.toMonth, filters.branchId, filters.companyId);
  }

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  function filterYearMonth(yearX: number, month: number) {
    return null;
  }

  function getPreviousperiodInfo() {
    return null;
  }

  let AYStatus = 0;
  let BYStatus = 0;

  function getDataListTotal(datalist: any[]) {
    let total = 0;
    datalist.map((r: number) => (total += r));
    return fShortenNumber2(total);
  }

  function formatPercentageSubtitle(value: number, total: number, description: string): string {
    const percentage = total > 0 ? ((value / total) * 100).toFixed(0) : 0;
    return `%${percentage} ${description}`;
  }

  // Helper function to use company colors with actual data
  const getChartDataWithColors = useCallback(() => {
    if (!mainInfo || !mainInfo.monthlySales) return [];

    return COMPANY_ORDER.map((companyName) => {
      const companyData = mainInfo.monthlySales.companies.find((c) => c.name === companyName);
      return {
        name: companyName,
        value: companyData
          ? companyData.branches.reduce(
              (sum, branch) => sum + branch.monthlySalesCYear.reduce((a, b) => a + b, 0),
              0
            )
          : 0,
        color: COMPANY_COLORS[companyName],
      };
    });
  }, [mainInfo]);

  const renderLoading = (
    <>
      <Box height={100}></Box>
      <LoadingScreen
        sx={{
          borderRadius: 1.5,
          bgcolor: 'background.default',
        }}
      />
      <Box height={100}></Box>
    </>
  );

  const renderEmpty = (
    <EmptyContent
      title={`لا تتوفر بيانات`}
      description="لا توجد سجلات وفق مدخلات البحث"
      imgUrl="/assets/icons/empty/ic_folder_empty.svg"
      sx={{
        borderRadius: 1.5,
        maxWidth: { md: 320 },
        bgcolor: 'background.default',
      }}
    />
  );

  const renderDash = (
    <>
      {mainInfo && (
        <>
          <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="بيان تفصيلي " value="mReports" />
              <Tab label="الملخص التنفيذي" value="executiveSummary" />
              {/* <Tab label="تحليل الأداء" value="performanceAnalysis" /> */}
              <Tab label="الحصص السوقية" value="marketShare" />
              <Tab label="تحليل الاتجاهات" value="trendAnalysis" />
              <Tab label="التوقعات" value="forecasting" />

              <Tab label="مبيعات الفروع" value="compareBranch" />
              <Tab label="مبيعات الشركات" value="compareCompany" />
              <Tab label="مقارنة شهرية" value="CompareMonthl" />
              <Tab label="اتجاه المبيعات الشهرية" value="monthlyTrend" />
            </Tabs>
          </Box>

          {/* Executive Summary KPIs */}
          {currentTab === 'executiveSummary' && (
            <Grid container spacing={SPACING}>
              <Grid xs={12}>
                <ExecutiveSummaryKPIs data={mainInfo} year={displayYear} />
              </Grid>
            </Grid>
          )}

          {/* Performance Analysis KPIs */}
          {currentTab === 'performanceAnalysis' && (
            <Grid container spacing={SPACING}>
              <Grid xs={12}>
                <PerformanceAnalysisKPIs data={mainInfo} year={displayYear} />
              </Grid>
            </Grid>
          )}

          {/* Market Share KPIs */}
          {currentTab === 'marketShare' && (
            <Grid container spacing={SPACING}>
              <Grid xs={12}>
                <MarketShareKPIs data={mainInfo} year={displayYear} />
              </Grid>
            </Grid>
          )}

          {/* Trend Analysis KPIs */}
          {currentTab === 'trendAnalysis' && (
            <Grid container spacing={SPACING}>
              <Grid xs={12}>
                <TrendAnalysisKPIs data={mainInfo} year={displayYear} />
              </Grid>
            </Grid>
          )}

          {/* Forecasting KPIs */}
          {currentTab === 'forecasting' && (
            <Grid container spacing={SPACING}>
              <Grid xs={12}>
                <ForecastingKPIs data={mainInfo} year={displayYear} />
              </Grid>
            </Grid>
          )}

          {/* Original Comprehensive Report */}
          {currentTab === 'mReports' && (
            <Grid container spacing={SPACING}>
              <Grid xs={12}>
                <MillingCompaniesSalesComparisonTable
                  data={mainInfo!.monthlySales}
                  year={displayYear}
                />
              </Grid>
            </Grid>
          )}

          {currentTab === 'compareBranch' && (
            <Grid container spacing={SPACING}>
              <Grid xs={12}>
                <SalesDataComparisonBranch data={mainInfo} year={displayYear} />
              </Grid>
            </Grid>
          )}

          {currentTab === 'compareCompany' && (
            <Grid container spacing={SPACING}>
              <Grid xs={12}>
                <SalesDataComparisonCompany data={mainInfo} year={displayYear} />
              </Grid>
            </Grid>
          )}

          {currentTab === 'CompareMonthl' && mainInfo && (
            <Grid container spacing={SPACING}>
              <Grid xs={12}>
                <SalesDataComparisonMonth data={mainInfo} year={displayYear} />
              </Grid>
            </Grid>
          )}
          {currentTab === 'monthlyTrend' && mainInfo && (
            <Grid container spacing={SPACING}>
              <Grid xs={12}>
                <SalesDataMonthlyTrend
                  data={mainInfo}
                  currentYearLabel={displayYear.toString()}
                  previousYearLabel={(displayYear - 1).toString()}
                />
              </Grid>
            </Grid>
          )}
        </>
      )}
    </>
  );

  return (
    <>
      <div ref={printingAreaRef}>
        <Container maxWidth={false} id="fullPage">
          <Box
            sx={{
              width: 1,
              height: '100%',
              borderRadius: 2,
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
              border: (theme) => `dashed 1px ${theme.palette.divider}`,
              padding: 4,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '#607D8B 0px 20px 11px -20px',
                borderRadius: 1,
                marginBottom: 3,
                marginTop: -3,
                padding: '5px 25px',
                color: 'GrayText',
                marginRight: '-45px',
                marginLeft: '-45px',
              }}
            >
              <Box sx={{ width: 1 }}>
                <Typography variant="h5" component="h2">
                  مبيعات الهيئة من القمح الى شركات المطاحن
                </Typography>
                <Box sx={{ mt: 3, mb: 1 }}>
                  <Grid container spacing={1} alignItems="center">
                    {/* Year Filter */}
                    <Grid xs={12} sm={2} md={2}>
                      <FormControl fullWidth>
                        <InputLabel>السنة</InputLabel>
                        <Select
                          value={filters.year.toString()}
                          onChange={(e: SelectChangeEvent) => handleChangeYear(e)}
                          input={<OutlinedInput label="السنة" />}
                          sx={{ textTransform: 'capitalize' }}
                        >
                          {TIME_LABELS.year.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid xs={12} sm={2} md={2}>
                      <FormControl fullWidth>
                        <InputLabel>من شهر</InputLabel>
                        <Select
                          value={filters.fromMonth.toString()}
                          onChange={(e: SelectChangeEvent) => handleChangeFromMonth(e)}
                          input={<OutlinedInput label="الشهر" />}
                          sx={{ textTransform: 'capitalize' }}
                        >
                          <MenuItem key={0} value={0}>
                            الكل
                          </MenuItem>
                          {TIME_LABELS.month.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid xs={12} sm={2} md={2}>
                      <FormControl fullWidth>
                        <InputLabel>الى شهر</InputLabel>
                        <Select
                          value={filters.toMonth.toString()}
                          onChange={(e: SelectChangeEvent) => handleChangeToMonth(e)}
                          input={<OutlinedInput label="الشهر" />}
                          sx={{ textTransform: 'capitalize' }}
                        >
                          <MenuItem key={0} value={0}>
                            الكل
                          </MenuItem>
                          {TIME_LABELS.month.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    {/* Company Filter */}
                    <Grid xs={12} sm={2} md={2}>
                      <FormControl fullWidth>
                        <InputLabel>الشركة</InputLabel>
                        <Select
                          value={filters.companyId.toString()}
                          onChange={(e: SelectChangeEvent) => handleChangeCompany(e)}
                          input={<OutlinedInput label="الشركة" />}
                          sx={{ textTransform: 'capitalize' }}
                        >
                          <MenuItem key={0} value={0}>
                            الكل
                          </MenuItem>
                          {lookups.companies.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Region Filter */}
                    <Grid xs={12} sm={2} md={2}>
                      <FormControl fullWidth>
                        <InputLabel>الفرع</InputLabel>
                        <Select
                          value={filters.branchId.toString()}
                          onChange={(e: SelectChangeEvent) => handleChangeBranch(e)}
                          input={<OutlinedInput label="الفرع" />}
                          sx={{ textTransform: 'الفرع' }}
                        >
                          <MenuItem key={0} value={0}>
                            الكل
                          </MenuItem>
                          {lookups.branches
                            .filter((obj) => {
                              if (filters.companyId === 0) return true;
                              if (filters.companyId !== 0 && obj.companyId === filters.companyId)
                                return true;
                              return false;
                            })
                            .map((item) => (
                              <MenuItem key={item.id} value={item.id}>
                                {item.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Search and Print Actions */}
                    <Grid xs={12} sm={1} md={1}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Button
                          color="inherit"
                          variant="outlined"
                          size="large"
                          onClick={handleOnClick}
                          startIcon={<SearchIcon />}
                        >
                          بحث
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Box>
            {!!errorMsg && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {errorMsg}
              </Alert>
            )}
            {isLoading ? renderLoading : showContent && mainInfo && renderDash}
          </Box>
        </Container>
      </div>
    </>
  );
}
