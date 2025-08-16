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

// SWR fetcher function for POST requests
const postFetcher = async ([url, data]: [string, IDashMonthlyReportsFilters]) => {
  const res = await axios.post(url, data);
  const { isSuccess, result, errorMessages } = res.data;

  if (!isSuccess) {
    const error: Error & { info?: any } = new Error(
      errorMessages || 'An error occurred while fetching the data.'
    );
    error.info = res.data;
    throw error;
  }

  return result.mainInfo as mainInfo;
};

export default function MillsDailyDashboardView() {
  const now = new Date();
  const [warningLimit, setWarningLimit] = useState(50);
  const [fairLimit, setFairLimit] = useState(9000);
  const [moreLimit, setMoreLimit] = useState(90);

  const printingAreaRef = useRef<HTMLDivElement>(null);
  const btnPrintingRef = useRef<HTMLDivElement>(null);

  const theme = useTheme();
  const settings = useSettingsContext();

  // FIX: Initialize filters dynamically inside the component
  const getDynamicDefaultFilters = (): IDashMonthlyReportsFilters => {
    const today = new Date();
    return {
      year: today.getFullYear(), // Gets the current year (e.g., 2025)
      fromMonth: today.getMonth() + 1, // Gets the current month (e.g., 7 for July)
      toMonth: today.getMonth() + 1, // Gets the current month (e.g., 7 for July)
      companyId: 0,
      branchId: 0,
    };
  };

  const [filters, setFilters] = useState(getDynamicDefaultFilters());
  const [currentTab, setCurrentTab] = useState('dReports'); // Set 'dReports' as default

  const {
    data: mainInfo,
    error,
    isLoading,
    mutate,
  } = useSWR([endpoints.dashMR.getMRDailyDashboard, filters], postFetcher, {
    refreshInterval: 30000, // Refresh data every 30 seconds
  });

  const errorMsg = error ? error.message : '';
  const showContent = !isLoading && !error && mainInfo;

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
  function handleChangeMonth(event: SelectChangeEvent) {
    handleFilters('month', Number(event.target.value));
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
    // Manually trigger a re-fetch using SWR's mutate function
    mutate();
  }

  // FIX: Update the reset handler to use the dynamic filters
  const handleResetFilters = useCallback(() => {
    setFilters(getDynamicDefaultFilters());
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
          <Grid xs={12}>
            <DailyFlourInventoriesTable data={mainInfo} />
          </Grid>
        </>
      )}
    </>
  );

  return (
    <>
      <div ref={printingAreaRef}>
        <Container maxWidth={settings.themeStretch ? false : 'xl'} id="fullPage">
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
                  {/* مخزون الدقيق */}
                </Typography>
                <Box sx={{ mt: 3, mb: 1 }} hidden>
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
                        <InputLabel>الشهر</InputLabel>
                        <Select
                          value={filters.toMonth.toString()}
                          onChange={(e: any) => handleChangeMonth(e)}
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
            {isLoading ? renderLoading : showContent ? renderDash : renderEmpty}
          </Box>
        </Container>
      </div>
    </>
  );
}
