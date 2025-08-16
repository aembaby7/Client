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
import { useAuthContext } from 'src/auth/hooks';
import BookingWidgetSummary from '../booking-widget-summary';

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
  Search as SearchIcon, // Import the Search Icon
} from '@mui/icons-material';
import { SelectChangeEvent } from '@mui/material/Select';
import { LoadingScreen } from 'src/components/loading-screen';
import EmptyContent from 'src/components/empty-content';
import { IDashMonthlyReportsFilters } from 'src/types/dashStock';
import ColorCodedLine from '../color-coded-line';
import MillsCompanyReportTable from '../table1'; // Adjust path if needed
import MillingCompaniesSalesComparisonTable from '../table2';
import QuarterlySalesComparisonTable from '../table3';
import ProducedAndSoldFlourTable from '../table4';
import DailyFlourInventoriesTable from '../DailyFlourInventoriesTable'; // Import the new daily report table
import { filter } from 'lodash';
// Adjust path if needed
var today = new Date();
var yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const defaultFilters: IDashMonthlyReportsFilters = {
  year: 2025,
  fromMonth: 1,
  toMonth: 6,
  companyId: 0,
  branchId: 0,
};

// --- LOOKUP DATA ---
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
  year: ['2025', '2024', '2023', '2022'],
};

// Define the new structured types
type MillsReportDataObject = {
  reportTitle: string;
  rows: ReportRow[];
};

type MonthlySalesDataObject = {
  reportTitle: string;
  companies: CompanyMonthlySales[];
};

// --- UPDATED TYPE for Daily Flour Inventories ---
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

type mainInfo = {
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
  dailyFlourInventories: DailyFlourInventoriesData; // Add new report data to mainInfo
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
type CompanyMonthlySales = {
  name: string;
  branches: BranchMonthlySales[];
};

type BranchMonthlySales = {
  name: string;
  monthlySalesCYear: number[];
  monthlySalesPYear: number[];
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

const SPACING = 3;

export default function MillsMonthlyDashboardView() {
  const now = new Date();
  const [warningLimit, setWarningLimit] = useState(50);
  const [fairLimit, setFairLimit] = useState(9000);
  const [moreLimit, setMoreLimit] = useState(90);

  const printingAreaRef = useRef<HTMLDivElement>(null);
  const btnPrintingRef = useRef<HTMLDivElement>(null);

  const theme = useTheme();
  const settings = useSettingsContext();
  const [filters, setFilters] = useState(defaultFilters);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [mainInfo, setmainInfo] = useState<mainInfo>();
  const [currentTab, setCurrentTab] = useState('yReports'); // Set 'dReports' as default

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
      const res = await axios.post(endpoints.dashMR.getMRDashboard, data);
      // dashY: (data?.result as IDashYSales
      console.log('filter', filters);
      console.log('res', res.data);
      const { isSuccess, result, errorMessages, httpStatusCode } = res.data;
      setIsLoading(false);
      if (isSuccess) {
        const apiMainInfo = result.mainInfo;

        // --- UPDATED MOCK DATA for the new Daily Flour Inventories report ---
        const daysInMonth = new Date(year, toMonth, 0).getDate();
        const dailyRecords: DailyRecord[] = [];

        for (let day = 1; day <= 22; day++) {
          const companiesData: CompanyDailyInventory[] = lookups.companies.map((company) => {
            const companyBranches = lookups.branches.filter((b) => b.companyId === company.id);
            const branchesData: BranchDailyInventory[] = companyBranches.map((branch) => {
              const grand = Math.floor(Math.random() * 200) + 800;
              const pack = Math.floor(Math.random() * 100) + 400;
              const bulk = Math.floor(Math.random() * 100) + 250;
              const home = Math.floor(Math.random() * 50) + 150;
              return {
                branchId: branch.id,
                branchName: branch.name,
                grandFlourTotalQuantityInTons: grand,
                packFlourTotalQuantityInTons: pack,
                bulkFlourTotalQuantityInTons: bulk,
                homePackagesFlourTotalQuantityInTons: home,
              };
            });
            return {
              companyId: company.id,
              companyName: company.name,
              branches: branchesData,
            };
          });
          dailyRecords.push({ day, companies: companiesData });
        }

        const mockDailyData: DailyFlourInventoriesData = {
          reportTitle: 'المخزونات اليومية من الدقيق',
          days: dailyRecords,
        };

        const transformedMainInfo: mainInfo = {
          ...apiMainInfo,
          monthlySales: {
            reportTitle: 'مبيعات شركات المطاحن من الدقيق بالمقارنة مع مبيعات العام السابق',
            companies: apiMainInfo.monthlySales,
          },
          millsReportData: {
            reportTitle: 'مبيعات وإنتاج شركات المطاحن وكفاية المخزونات',
            rows: apiMainInfo.millsReportData,
          },
          dailyFlourInventories: mockDailyData, // Add mock data to the main info object
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
    console.log(filters);
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
  function getDataListTotal(datalist: any) {
    let total = 0;
    datalist.map((r: any) => (total += r));
    return fShortenNumber2(total);
  }

  function formatPercentageSubtitle(value: number, total: number, description: string): string {
    const percentage = total > 0 ? ((value / total) * 100).toFixed(0) : 0;
    return `%${percentage} ${description}`;
  }

  function printPDF(): void {
    btnPrintingRef.current!.style.display = 'none';
    html2canvas(printingAreaRef.current!).then(async (canvas) => {
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('p', 'px', [canvas.width, canvas.height]);
      pdf.addImage(contentDataURL, 'PNG', 0, 0, canvas.width, canvas.height);
      // await new Promise((r) => setTimeout(r, 180000));
      pdf.save('Matahin-Dash ' + fDate(new Date(), 'dd-MM-yyyy') + '.pdf');
      // setIsPrinting(false);
    });
    btnPrintingRef.current!.style.display = '';
  }

  function GetColorName(NumberInDays: number) {
    if (NumberInDays >= moreLimit) return '#007867';
    else if (NumberInDays >= fairLimit) return '#006C9C';
    else if (NumberInDays >= warningLimit) return '#B76E00';
    else return '#a02500';
    // else return 'linear-gradient(to right, #a02500, #cc2e04)';
  }
  function GetFormattedDate(date: Date) {
    const findex = date.getFullYear();
    let mm = date.getMonth() + 1; // Months start at 0!
    let dd = date.getDate();
    let ddDesc = dd.toString();
    let mmDesc = mm.toString();
    if (dd < 10) {
      ddDesc = '0' + dd;
    }
    if (mm < 10) {
      mmDesc = '0' + mm;
    }

    return ddDesc + '/' + mmDesc + '/' + findex;
  }

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
            <Tabs value={currentTab} onChange={handleTabChange}>
              <Tab label="تقارير سنوية" value="yReports" />
              <Tab label="ربع سنوية" value="qReports" />
              <Tab label="شهرية" value="mReports" />
              <Tab label="الإنتاج" value="production" />
              <Tab label="المبيعات" value="sales" />
              <Tab label="المخزون" value="inventory" />
            </Tabs>
          </Box>

          {currentTab === 'dReports' && mainInfo.dailyFlourInventories && (
            <>
              <Grid container spacing={SPACING}>
                <Grid xs={12}>
                  <DailyFlourInventoriesTable data={mainInfo.dailyFlourInventories} />
                </Grid>
              </Grid>
            </>
          )}

          {currentTab === 'production' && (
            <Grid container spacing={SPACING} disableEqualOverflow>
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  title={'اجمالي القمح المستلم بالطن'}
                  total={mainInfo ? mainInfo!.del!.totalWheatDeliveredInTons : 0}
                  icon={<WarehouseTwoToneIcon sx={{ color: '#007867' }} />}
                />
              </Grid>
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  title={'اجمالي القمح المستهلك بالطن'}
                  total={mainInfo ? mainInfo!.prod!.totalWheatUsedInProductionInTons : 0}
                  icon={<WarehouseTwoToneIcon sx={{ color: '#007867' }} />}
                  subTitle={formatPercentageSubtitle(
                    mainInfo.prod.totalWheatUsedInProductionInTons,
                    mainInfo.del.totalWheatDeliveredInTons,
                    'من القمح المستلم'
                  )}
                />
              </Grid>
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  title={'اجمالي الدقيق المنتج بالطن'}
                  total={mainInfo ? mainInfo!.prod!.grandFlourTotalQuantityInTons : 0}
                  icon={<LocalShippingTwoToneIcon sx={{ color: '#007867' }} />}
                  subTitle={formatPercentageSubtitle(
                    mainInfo.prod.grandFlourTotalQuantityInTons,
                    mainInfo.prod.totalWheatUsedInProductionInTons,
                    'من القمح المستهلك'
                  )}
                />
              </Grid>
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  title={'اجمالي مشتقات القمح المنتجة بالطن'}
                  total={mainInfo ? mainInfo!.prod!.wheatDerivativesTotalQuantityInTons : 0}
                  icon={<AssuredWorkload sx={{ color: '#007867' }} />}
                  subTitle={formatPercentageSubtitle(
                    mainInfo.prod.wheatDerivativesTotalQuantityInTons,
                    mainInfo.prod.totalWheatUsedInProductionInTons,
                    'من القمح المستهلك'
                  )}
                />
              </Grid>
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  title={'اجمالي النخالة الحيوانية المنتجة بالطن'}
                  total={mainInfo ? mainInfo!.prod!.animalBranTotalQuantityInTons : 0}
                  icon={<LocalShipping sx={{ color: '#007867' }} />}
                  subTitle={formatPercentageSubtitle(
                    mainInfo.prod.animalBranTotalQuantityInTons,
                    mainInfo.prod.totalWheatUsedInProductionInTons,
                    'من القمح المستهلك'
                  )}
                />
              </Grid>
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  title={'اجمالي الأعلاف المنتج بالطن'}
                  total={mainInfo ? mainInfo!.prod!.feedTotalQuantityInTons : 0}
                  icon={<HouseSiding sx={{ color: '#007867' }} />}
                  subTitle={formatPercentageSubtitle(
                    mainInfo.prod.feedTotalQuantityInTons,
                    mainInfo.prod.animalBranTotalQuantityInTons,
                    'من النخالة الحيوانية المنتجة'
                  )}
                />
              </Grid>
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  title={'اجمالي القمح المستورد بالطن'}
                  total={mainInfo ? mainInfo!.prod!.importedWheatTotalQuantityInTons : 0}
                  icon={<DirectionsBoat sx={{ color: '#007867' }} />}
                />
              </Grid>
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  title={'اجمالي الدقيق المنتج من القمح المستورد بالطن'}
                  total={mainInfo ? mainInfo!.prod!.importedFlourTotalQuantityInTons : 0}
                  icon={<ImportExport sx={{ color: '#007867' }} />}
                />
              </Grid>
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  title={'(قمح محلي (خارج الهيئة'}
                  total={mainInfo ? mainInfo!.prod!.localNotGFSAFlourTotalQuantityInTons : 0}
                  icon={<Houseboat sx={{ color: '#007867' }} />}
                />
              </Grid>
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  title={'(دقيق منتج من قمح محلي (خارج الهيئة'}
                  total={mainInfo ? mainInfo!.prod!.localNotGFSAWheatTotalQuantityInTons : 0}
                  icon={<Houseboat sx={{ color: '#007867' }} />}
                />
              </Grid>
            </Grid>
          )}

          {currentTab === 'sales' && (
            <Grid container spacing={SPACING} disableEqualOverflow>
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  title={'اجمالي مبيعات الدقيق بالطن'}
                  total={mainInfo.sales.grandFlourTotalQuantityInTons}
                  icon={<PointOfSale sx={{ color: '#006C9C' }} />}
                  subTitle={formatPercentageSubtitle(
                    mainInfo.sales.grandFlourTotalQuantityInTons,
                    mainInfo.prod.grandFlourTotalQuantityInTons,
                    'من الدقيق المنتج'
                  )}
                />
              </Grid>
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  title={'اجمالي مبيعات السائب بالطن'}
                  total={mainInfo ? mainInfo!.sales!.bulkFlourTotalQuantityInTons : 0}
                  icon={<Upload sx={{ color: '#006C9C' }} />}
                  subTitle={formatPercentageSubtitle(
                    mainInfo.sales.bulkFlourTotalQuantityInTons,
                    mainInfo.sales.grandFlourTotalQuantityInTons,
                    'من الدقيق المباع'
                  )}
                />
              </Grid>
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  title={'اجمالي مبيعات المعبأ بالطن'}
                  total={mainInfo ? mainInfo!.sales!.packFlourTotalQuantityInTons : 0}
                  icon={<Store sx={{ color: '#006C9C' }} />}
                  subTitle={formatPercentageSubtitle(
                    mainInfo.sales.packFlourTotalQuantityInTons,
                    mainInfo.sales.grandFlourTotalQuantityInTons,
                    'من الدقيق المباع'
                  )}
                />
              </Grid>
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  title={'اجمالي مبيعات العبوات المنزلية بالطن'}
                  total={mainInfo ? mainInfo!.sales!.homePackagesFlourTotalQuantityInTons : 0}
                  icon={<OtherHouses sx={{ color: '#006C9C' }} />}
                  subTitle={formatPercentageSubtitle(
                    mainInfo.sales.homePackagesFlourTotalQuantityInTons,
                    mainInfo.sales.grandFlourTotalQuantityInTons,
                    'من الدقيق المباع'
                  )}
                />
              </Grid>
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  title={'اجمالي مبيعات مشتقات القمح بالطن'}
                  total={mainInfo ? mainInfo!.sales!.wheatDerivativesTotalQuantityInTons : 0}
                  icon={<MonetizationOnTwoToneIcon sx={{ color: '#006C9C' }} />}
                  subTitle={formatPercentageSubtitle(
                    mainInfo.sales.wheatDerivativesTotalQuantityInTons,
                    mainInfo.prod.wheatDerivativesTotalQuantityInTons,
                    'من مشتقات القمح المنتجة'
                  )}
                />
              </Grid>
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  title={'اجمالي مبيعات النخالة الحيوانية بالطن'}
                  total={mainInfo ? mainInfo!.sales!.animalBranTotalQuantityInTons : 0}
                  icon={<LocalAtmTwoToneIcon sx={{ color: '#006C9C' }} />}
                  subTitle={formatPercentageSubtitle(
                    mainInfo.sales.animalBranTotalQuantityInTons,
                    mainInfo.prod.animalBranTotalQuantityInTons,
                    'من النخالة الحيوانية المنتجة'
                  )}
                />
              </Grid>
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  title={'اجمالي مبيعات الأعلاف بالطن'}
                  total={mainInfo ? mainInfo!.sales!.feedTotalQuantityInTons : 0}
                  icon={<PriceCheckTwoToneIcon sx={{ color: '#006C9C' }} />}
                  subTitle={formatPercentageSubtitle(
                    mainInfo.sales.feedTotalQuantityInTons,
                    mainInfo.prod.feedTotalQuantityInTons,
                    'من الأعلاف المنتجة'
                  )}
                />
              </Grid>
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  title={'اجمالي مبيعات الدقيق المستورد بالطن'}
                  total={mainInfo ? mainInfo!.sales!.importedFlourTotalQuantityInTons : 0}
                  icon={<Download sx={{ color: '#006C9C' }} />}
                />
              </Grid>
            </Grid>
          )}

          {currentTab === 'inventory' && (
            <>
              <Box sx={{ marginBottom: '25px' }}>
                <ColorCodedLine />
              </Box>
              <Grid container spacing={SPACING} disableEqualOverflow>
                <Grid xs={12} md={3}>
                  <BookingWidgetSummary
                    title={'اجمالي رصيد القمح بالطن'}
                    total={0}
                    icon={<WarehouseTwoToneIcon sx={{ color: theme.palette.warning.dark }} />}
                  />
                </Grid>
                <Grid xs={12} md={3}>
                  <BookingWidgetSummary
                    title={'اجمالي رصيد الدقيق بالطن'}
                    total={0}
                    icon={<HouseSiding sx={{ color: theme.palette.warning.dark }} />}
                  />
                </Grid>
              </Grid>
            </>
          )}

          {currentTab === 'yReports' && (
            <>
              <Grid container spacing={SPACING}>
                <Grid xs={12}>
                  <MillingCompaniesSalesComparisonTable
                    data={mainInfo!.monthlySales}
                    year={filters.year}
                  />
                </Grid>
              </Grid>
            </>
          )}

          {currentTab === 'qReports' && (
            <>
              <Grid container spacing={SPACING}>
                <Grid xs={12}>
                  <QuarterlySalesComparisonTable data={mainInfo!.quarterlyComparisonData} />
                </Grid>
              </Grid>
            </>
          )}

          {currentTab === 'mReports' && (
            <>
              <Grid container spacing={SPACING}>
                <Grid xs={12}>
                  <MillsCompanyReportTable data={mainInfo!.millsReportData} />
                </Grid>
                <Grid xs={12}>
                  <ProducedAndSoldFlourTable data={mainInfo!.flourReport} />
                </Grid>
              </Grid>
            </>
          )}

          {/* <Divider sx={{ my: 5 }}>
            <Typography variant="overline" sx={{ color: 'text.secondary' }}>
              التقارير التفصيلية
            </Typography>
          </Divider> */}
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
              padding: 4, // Add padding of 4
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
                  انتاج/ مخزون/ مبيعات الدقيق
                </Typography>
                <Box sx={{ mt: 3, mb: 1 }}>
                  <Grid container spacing={1} alignItems="center">
                    {/* Year Filter */}
                    <Grid xs={12} sm={2} md={2}>
                      <FormControl fullWidth>
                        <InputLabel>السنة</InputLabel>
                        <Select
                          value={filters.year.toString()}
                          onChange={(e: any) => handleChangeYear(e)}
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
                          onChange={(e: any) => handleChangeFromMonth(e)}
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
                          onChange={(e: any) => handleChangeToMonth(e)}
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
                          onChange={(e: any) => handleChangeCompany(e)}
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
                          onChange={(e: any) => handleChangeBranch(e)}
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
                        {/* <Tooltip title="طباعة">
                          <IconButton onClick={printPDF} sx={{ fontSize: '1.5rem' }}>
                            <Iconify icon="solar:printer-minimalistic-bold" />
                          </IconButton>
                        </Tooltip> */}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* <Typography variant="body2" color="textSecondary">
                  {formattedDate} | {formattedTime}
                </Typography> */}
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
