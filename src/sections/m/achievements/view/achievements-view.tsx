'use client';
import useSWR from 'swr';
import axios, { fetcher, endpoints } from 'src/utils/axios';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import React, { ReactElement } from 'react';

import {
  _bookings,
  _bookingNew,
  _bookingReview,
  _bookingsOverview,
  _ecommerceSalesOverview,
} from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import { useAuthContext } from 'src/auth/hooks';
import BookingBooked from '../booking-booked';
import BookingDetails from '../booking-details';
import BookingWidgetSummary from '../booking-widget-summary';

import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import { useTranslate } from 'src/locales';
import { DashboardBranchResponse, DashboardSalesAdminResponse } from '../types';

import LocalShippingTwoToneIcon from '@mui/icons-material/LocalShippingTwoTone';
import WarehouseTwoToneIcon from '@mui/icons-material/WarehouseTwoTone';
import ScaleTwoToneIcon from '@mui/icons-material/ScaleTwoTone';
import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';
import LocalAtmTwoToneIcon from '@mui/icons-material/LocalAtmTwoTone';
import PriceCheckTwoToneIcon from '@mui/icons-material/PriceCheckTwoTone';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { fDate } from 'src/utils/format-time';
import Badge, { badgeClasses } from '@mui/material/Badge';
import {
  Alert,
  Button,
  CardActions,
  Collapse,
  FormControl,
  IconButtonProps,
  InputAdornment,
  InputLabel,
  ListItemIcon,
  OutlinedInput,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  Tabs,
  TextField,
} from '@mui/material';
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TableContainer,
  Tooltip,
  Typography,
  Slider,
} from '@mui/material';
import AppWidget from 'src/sections/app/app-widget';
import {
  fNumber,
  fPercent,
  fShortenNumber,
  fShortenNumber0,
  fShortenNumber2,
  fShortenNumber_,
  fShortenNumber__,
} from 'src/utils/format-number';
import AppsPie from 'src/sections/sales_dashboard/apps-pie';
import AppsPieN from 'src/sections/sales_dashboard/apps-pie-n';
import ChartColumnMultiple from 'src/sections/app/chart-column-multiple';
import SeasonWeightTotalChart from 'src/sections/sales_dashboard/season-weight-total';
import RejectDetails from 'src/sections/sales_dashboard/reject-details';
import { useCallback, useEffect, useRef, useState } from 'react';
import Iconify from 'src/components/iconify';
import { format } from 'date-fns';
import {
  GridAddIcon,
  GridArrowDownwardIcon,
  GridArrowUpwardIcon,
  GridExpandMoreIcon,
  GridLoadIcon,
  GridMenuIcon,
} from '@mui/x-data-grid';
import styled from '@emotion/styled';
import {
  AccountBalance,
  AddAlert,
  ArrowCircleDown,
  ArrowCircleUp,
  Upload,
  Download,
  ArrowDownward,
  ArrowUpward,
  AssuredWorkload,
  Cabin,
  DateRange,
  DirectionsBoat,
  HouseSiding,
  ImportContacts,
  ImportContactsOutlined,
  ImportExport,
  LocalShipping,
  ManageHistory,
  NotificationAdd,
  NotificationsActive,
  OtherHouses,
  PointOfSale,
  Receipt,
  Today,
  Upgrade,
  Verified,
  Visibility,
  VisibilityOff,
  CreditCard,
  SwapVert,
  Store,
  Houseboat,
} from '@mui/icons-material';
import { DatePicker, DateRangeIcon } from '@mui/x-date-pickers';
import FileDataActivity from '../file-data-activity';
import { SelectChangeEvent } from '@mui/material/Select';
import { useGetYearlyDashboard } from 'src/api/dash';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { length } from 'stylis';
import YSalesOverview from '../sales-overview';
import { LoadingScreen } from 'src/components/loading-screen';
import EmptyContent from 'src/components/empty-content';
import BookingTotalIncomes from '../booking-total-incomes';
import AnalyticsCurrentVisits from 'src/sections/analytics-current-visits';
import AnalyticsConversionRates from 'src/sections/analytics-conversion-rates';
import { BarChart as BarChartIcon, TableChart as TableChartIcon } from '@mui/icons-material';
import { RHFTextField } from 'src/components/hook-form';
import { IDashMFilters, IDashStockFilters } from 'src/types/dashStock';
import AnalyticsWebsiteVisits from '../analytics-website-visits';
import BarleyAppWidget from '../app-widget';
import AppCurrentDownload from '../app-current-download';
import LocationStockSufficiencyView from '../location-stock-sufficiency-view';
import BookingAvailable from '../booking-available';
import { date } from 'yup';
import StockMonthly from '../stock-monthly';
import StationStockTxInfo from '../station-stock-tx-info';
import PriceMonthly from '../price-monthly';
import BookingWidgetSummary_ from '../booking-widget-summary_';
import YearlySalesInQty from '../yearly-sales-in-qty';
import LocationBalanceStatistics from '../location-balance-statistics';
import LocationPriceAverage from '../location-price-average';
import ColorCodedLine from '../color-coded-line';
import BankingBalanceStatistics_ from '../banking-balance-statistics_';
import BankingBalanceMonthly from '../banking-balance-montly';
import BankingBalanceStatistics from '../banking-balance-statistics';

var today = new Date();
var yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const defaultFilters: IDashMFilters = {};

type labelValue = {
  label: string;
  value: string;
};
type labelValueN = {
  label: string;
  value: number;
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
  year: ['2024'],
};

type mInfo = {
  name: string;
  customersQtyInQuarter: customersQtyInPeriod[];
  customersQtyInMonth: customersQtyInPeriod[];
  stoppedCustomersInQuarter: stoppedCustomersInQuarterType[];
  customersEvents: customersEvent[];
  dashCustomers: dashCustomers;
};
type customersEvents = customersEvent[];
type dashCustomers = {
  cntCustomers: number;
  cntDirBen: number;
  cntBadDirBen: number;
  cntBadUnDirBen: number;
  qtyBadDirBen: number;
  qtyBadUnDirBen: number;
  totalQtyInTons: number;

  cntBadDirBalady: number;
  qtyBadDirBalady: number;
  cntBadUnDirBalady: number;
  qtyBadUnDirBalady: number;

  cntHasIstimara: number;
  qtyHasIstimara: number;
  cntNoIstimara: number;
  qtyNoIstimara: number;

  cnt45TonHasIstimara: number;
  qty45TonHasIstimara: number;
  cnt45TonNoIstimara: number;
  qty45TonNoIstimara: number;
};
type customersEvent = {
  id: number;
  eventDesc: string;
  txDate: Date;
  txNumber: number;
  totalQtyInTons: number;
  totalQtyInTonsBefore: number;
  totalQtyInTonsDiff: number;
  totalQtyInTonsDiffPer: number;
  cntCustomers: number;
  cntCustomersBefore: number;
  cntCustomersDiff: number;
  cntCustomersDiffPer: number;
};
type customersQtyInPeriod = {
  year: number;
  quarter: number;
  quarterDesc: string;
  quarterFDesc: string;
  month: number;
  monthDesc: string;
  monthFDesc: string;
  cntCustomers: number;
  totalQtyInTons: number;
};
type stoppedCustomersInQuarterType = {
  year: number;
  quarter: number;
  quarterDesc: string;
  quarterFDesc: string;
  cntCustomers: number;
  totalQtyInTons: number;
};
type seriesNameData = {
  name: string;
  type: string;
  fill: string;
  data: number[];
};

const SPACING = 3;

export default function MDashboardView() {
  const now = new Date();
  const [dangerLimit, setDangerLimit] = useState(0);
  const [warningLimit, setWarningLimit] = useState(50);
  const [fairLimit, setFairLimit] = useState(9000);
  const [moreLimit, setMoreLimit] = useState(90);
  const formattedDate = format(now, 'dd/ MM/yyyy');
  const formattedTime = format(now, 'hh:mm a').replace('AM', 'ص').replace('PM', 'م');

  const printingAreaRef = useRef<HTMLDivElement>(null);
  const btnPrintingRef = useRef<HTMLDivElement>(null);

  const theme = useTheme();
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [expanded, setExpanded] = useState(true);
  const [filters, setFilters] = useState(defaultFilters);
  const [isFLoading, setIsFLoading] = useState<boolean>(true);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [mainData, setMainData] = useState();
  const [mInfo, setMInfo] = useState<mInfo>();

  const [customersQtyInQuarterNames, setCustomersQtyInQuarterNames] = useState<string[]>([]);
  const [customersQtyInQuarterValues, setCustomersQtyInQuarterValues] = useState<number[]>([]);
  const [customersQtyInQuarterCounter, setCustomersQtyInQuarterCounter] = useState<number[]>([]);

  const [stoppedCustomersInQuarterNames, setStoppedCustomersInQuarterNames] = useState<string[]>(
    []
  );
  const [stoppedCustomersInQuarterValues, setStoppedCustomersInQuarterValues] = useState<number[]>(
    []
  );
  const [stoppedCustomersInQuarterCounter, setStoppedCustomersInQuarterCounter] = useState<
    number[]
  >([]);

  const [halfTable, setHalfTable] = useState(false);
  const [quarterTable, setQuarterTable] = useState(false);
  const [monthlyTable, setMonthlyTable] = useState(false);

  const getData = useCallback(async () => {
    setErrorMsg('');
    setIsLoading(true);
    const data = {};
    const res = await axios.post(endpoints.dashM.getMDashboard, data);
    // dashY: (data?.result as IDashYSales
    const { isSuccess, result, errorMessages, httpStatusCode } = res.data;
    setIsLoading(false);
    if (isSuccess) {
      const { mInfo } = res.data.result;
      setMInfo(mInfo);
      console.log(mInfo);

      const arrCustomersQtyInQuarterNames: string[] = [];
      const arrCustomersQtyInQuarterValues: number[] = [];
      const arrCustomersQtyInQuarterCounter: number[] = [];

      result.mInfo?.customersQtyInQuarter.forEach((setVal: any) => {
        arrCustomersQtyInQuarterNames.push(setVal.quarterFDesc);
        arrCustomersQtyInQuarterValues.push(setVal.totalQtyInTons);
        arrCustomersQtyInQuarterCounter.push(setVal.cntCustomers);
      });
      const arrStoppedCustomersInQuarterNames: string[] = [];
      const arrStoppedCustomersInQuarterValues: number[] = [];
      const arrStoppedCustomersInQuarterCounter: number[] = [];

      result.mInfo?.stoppedCustomersInQuarter.forEach((setVal: any) => {
        arrStoppedCustomersInQuarterNames.push(setVal.quarterFDesc);
        arrStoppedCustomersInQuarterValues.push(setVal.totalQtyInTons);
        arrStoppedCustomersInQuarterCounter.push(setVal.cntCustomers);
      });
      setCustomersQtyInQuarterNames(arrCustomersQtyInQuarterNames);
      setCustomersQtyInQuarterValues(arrCustomersQtyInQuarterValues);
      setCustomersQtyInQuarterCounter(arrCustomersQtyInQuarterCounter);

      setStoppedCustomersInQuarterNames(arrStoppedCustomersInQuarterNames);
      setStoppedCustomersInQuarterValues(arrStoppedCustomersInQuarterValues);
      setStoppedCustomersInQuarterCounter(arrStoppedCustomersInQuarterCounter);
      setShowContent(true);
    } else {
      setErrorMsg('لم يتم تحميل البيانات المطلوبة، يرجى التواصل مع مدير النظام');
      setShowContent(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, []);

  function getArray(datalist: any, property: any) {
    const arr: any[] = [];
    datalist.forEach((row: any) => {
      arr.push(row[property]);
    });
    return arr;
  }

  function getDataListTotal(datalist: any) {
    let total = 0;
    datalist.map((r: any) => (total += r));
    return fShortenNumber2(total);
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
    const yyyy = date.getFullYear();
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

    return ddDesc + '/' + mmDesc + '/' + yyyy;
  }

  const getPercentageString = (value: number, total: number) => {
    if (total === 0) {
      return `(0%)`;
    }
    const percentage = (value / total) * 100;
    const formattedPercentage = percentage.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    });
    return `(${formattedPercentage}%)`;
  };

  const renderIcon = (IconComponent: React.ElementType, color: string, bgColor: string) => (
    <Box
      sx={{
        width: 120,
        height: 120,
        display: 'flex',
        borderRadius: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
        bgcolor: bgColor,
      }}
    >
      <IconComponent sx={{ fontSize: 70 }} />
    </Box>
  );

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
      {mInfo && (
        <Grid container spacing={SPACING} disableEqualOverflow>
          <Grid xs={12}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                borderBottom: `2px solid ${theme.palette.primary.main}`,
                pb: 2,
                pl: 1,
                mb: 2,
              }}
            >
              <AssuredWorkload sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                سجل عملاء الدقيق المدعوم
              </Typography>
            </Box>
          </Grid>
          <Grid xs={12} md={3}>
            <BookingWidgetSummary
              title={'اجمالي عدد العملاء'}
              total={mInfo.dashCustomers.cntCustomers}
              icon={renderIcon(AssuredWorkload, '#009688d6', '#F4F6F8')}
            />
          </Grid>
          <Grid xs={12} md={3}>
            <BookingWidgetSummary
              title={'عدد الموزعين'}
              total={mInfo.dashCustomers.cntCustomers - mInfo.dashCustomers.cntDirBen}
              subTitle={getPercentageString(
                mInfo.dashCustomers.cntCustomers - mInfo.dashCustomers.cntDirBen,
                mInfo.dashCustomers.cntCustomers
              )}
              icon={renderIcon(AssuredWorkload, '#009688d6', '#F4F6F8')}
            />
          </Grid>
          <Grid xs={12} md={3}>
            <BookingWidgetSummary
              title={'عدد العملاء' + ' ' + 'مباشرين | مستفيدين'}
              total={mInfo.dashCustomers.cntDirBen}
              subTitle={getPercentageString(
                mInfo.dashCustomers.cntDirBen,
                mInfo.dashCustomers.cntCustomers
              )}
              icon={renderIcon(AssuredWorkload, '#009688d6', '#F4F6F8')}
              sx={{ borderRight: { xs: 'none', md: `5px solid #009688` } }}
            />
          </Grid>
          <Grid xs={12} md={3}>
            <BookingWidgetSummary
              title={'اجمالي الكميات المخصصة بالطن'}
              total={mInfo.dashCustomers.totalQtyInTons}
              icon={renderIcon(LocalShipping, '#009688d6', '#F4F6F8')}
              sx={{ borderLeft: { xs: 'none', md: `5px solid #009688` } }}
            />
          </Grid>
          <Grid xs={12} md={3}>
            <BookingWidgetSummary
              title={'عملاء لديهم استمارة زيارة' + ' ' + 'مباشرين | مستفيدين'}
              total={mInfo.dashCustomers.cntHasIstimara}
              subTitle={getPercentageString(
                mInfo.dashCustomers.cntHasIstimara,
                mInfo.dashCustomers.cntDirBen
              )}
              icon={renderIcon(ImportContacts, '#009688d6', '#F4F6F8')}
              sx={{ borderRight: { xs: 'none', md: `5px solid #009688` } }}
            />
          </Grid>
          <Grid xs={12} md={3}>
            <BookingWidgetSummary
              title={'الكمية المخصصة لهم شهرياً بالطن'}
              total={mInfo.dashCustomers.qtyHasIstimara}
              subTitle={getPercentageString(
                mInfo.dashCustomers.qtyHasIstimara,
                mInfo.dashCustomers.totalQtyInTons
              )}
              icon={renderIcon(LocalShipping, '#009688d6', '#F4F6F8')}
              sx={{ borderLeft: { xs: 'none', md: `5px solid #009688` } }}
            />
          </Grid>

          <Grid xs={12} md={12}>
            <Box
              sx={{
                flexDirection: { xs: 'column', md: 'column' },
                border: '1px solid #6a65652b',
                borderRadius: '10px',
                backgroundColor: '#27a69a0a',
                padding: '10px',
              }}
            >
              <Box
                sx={{
                  width: 1,
                  p: 1.5,
                  mb: 2,
                  bgcolor: '#FFF7E6',
                  color: '#B76E00',
                  borderRadius: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.5,
                  border: `1px dashed #B76E00`,
                }}
              >
                <AssuredWorkload sx={{ fontSize: 32 }} />
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                  عملاء معرضون للإيقاف
                </Typography>
              </Box>
              <Grid container spacing={SPACING} disableEqualOverflow>
                <Grid xs={12} md={3}>
                  <BookingWidgetSummary
                    title={'رخص أو سجلات غير معرفة لدى الجهات الرسمية مباشرين | مستفيدين'}
                    total={mInfo.dashCustomers.cntBadDirBen}
                    subTitle={getPercentageString(
                      mInfo.dashCustomers.cntBadDirBen,
                      mInfo.dashCustomers.cntDirBen
                    )}
                    icon={renderIcon(AssuredWorkload, '#B76E00', '#FFF7E6')}
                    sx={{ borderRight: { xs: 'none', md: `5px solid #B76E00` } }}
                  />
                </Grid>
                <Grid xs={12} md={3}>
                  <BookingWidgetSummary
                    title={'الكمية المخصصة لهم شهرياً بالطن'}
                    total={mInfo.dashCustomers.qtyBadDirBen}
                    subTitle={getPercentageString(
                      mInfo.dashCustomers.qtyBadDirBen,
                      mInfo.dashCustomers.totalQtyInTons
                    )}
                    icon={renderIcon(LocalShipping, '#B76E00', '#FFF7E6')}
                    sx={{ borderLeft: { xs: 'none', md: `5px solid #B76E00` } }}
                  />
                </Grid>
                <Grid xs={12} md={3}>
                  <BookingWidgetSummary
                    title={'رخص أو سجلات غير معرفة لدى الجهات الرسمية موزعين | متعددين'}
                    total={mInfo.dashCustomers.cntBadUnDirBen}
                    icon={renderIcon(AssuredWorkload, '#B76E00', '#FFF7E6')}
                    sx={{ borderRight: { xs: 'none', md: `5px solid #B76E00` } }}
                  />
                </Grid>
                <Grid xs={12} md={3}>
                  <BookingWidgetSummary
                    title={'الكمية المخصصة لهم شهرياً بالطن'}
                    total={mInfo.dashCustomers.qtyBadUnDirBen}
                    subTitle={getPercentageString(
                      mInfo.dashCustomers.qtyBadUnDirBen,
                      mInfo.dashCustomers.totalQtyInTons
                    )}
                    icon={renderIcon(LocalShipping, '#B76E00', '#FFF7E6')}
                    sx={{ borderLeft: { xs: 'none', md: `5px solid #B76E00` } }}
                  />
                </Grid>

                <Grid xs={12} md={3}>
                  <BookingWidgetSummary
                    title={'عملاء دون استمارة زيارة' + ' ' + 'مباشرين | مستفيدين'}
                    total={mInfo.dashCustomers.cntNoIstimara}
                    subTitle={getPercentageString(
                      mInfo.dashCustomers.cntNoIstimara,
                      mInfo.dashCustomers.cntDirBen
                    )}
                    icon={renderIcon(ImportContactsOutlined, '#B76E00', '#FFF7E6')}
                    sx={{ borderRight: { xs: 'none', md: `5px solid #B76E00` } }}
                  />
                </Grid>
                <Grid xs={12} md={3}>
                  <BookingWidgetSummary
                    title={'الكمية المخصصة لهم شهرياً بالطن'}
                    total={mInfo.dashCustomers.qtyNoIstimara}
                    subTitle={getPercentageString(
                      mInfo.dashCustomers.qtyNoIstimara,
                      mInfo.dashCustomers.totalQtyInTons
                    )}
                    icon={renderIcon(LocalShipping, '#B76E00', '#FFF7E6')}
                    sx={{ borderLeft: { xs: 'none', md: `5px solid #B76E00` } }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid xs={12} md={12}>
            <Stack spacing={3}>
              <BankingBalanceMonthly
                title={'الكميات المخصصة للعملاء (مباشرين | مستفيدين) شهرياً'}
                defaultState="عام"
                chart={{
                  categories: getArray(mInfo.customersQtyInMonth, 'monthFDesc'),
                  series: [
                    {
                      type: 'عام',
                      data: [
                        {
                          name: 'الكميات المخصصة بالطن',
                          data: getArray(mInfo.customersQtyInMonth, 'totalQtyInTons'),
                        },
                        {
                          name: 'عدد العملاء',
                          data: getArray(mInfo.customersQtyInMonth, 'cntCustomers'),
                        },
                      ],
                    },
                    {
                      type: 'عملاء',
                      data: [
                        {
                          name: 'عدد العملاء',
                          data: getArray(mInfo.customersQtyInMonth, 'cntCustomers'),
                        },
                      ],
                    },
                    {
                      type: 'الكميات',
                      data: [
                        {
                          name: 'الكميات المخصصة بالطن',
                          data: getArray(mInfo.customersQtyInMonth, 'totalQtyInTons'),
                        },
                      ],
                    },
                  ],
                }}
              />
            </Stack>
          </Grid>
          <Grid xs={12} md={12}>
            <BookingDetails
              id="actionInBranch"
              title="بيان الإجراءات الرئيسية المنفذة (وفق التعاميم الصادرة)"
              subheader="الكميات المذكورة هي المخصصة شهرياً بالطن"
              tableData={mInfo.customersEvents}
              tableLabels={[
                { id: 'serial', label: '#', align: 'center' },
                { id: 'txDate', label: 'تاريخ الإجراء', align: 'center' },
                { id: 'eventDesc', label: 'الوصف', align: 'center' },
                {
                  id: 'totalQtyInTonsBefore',
                  label: 'الكميات المخصصة (قبل)',
                  align: 'center',
                },
                { id: 'totalQtyInTons', label: '(بعد)', align: 'center' },
                { id: 'totalQtyInTonsDiff', label: 'التغير الكمي', align: 'center' },
                { id: 'totalQtyInTonsDiffPer', label: 'التغير النسبي %', align: 'center' },

                { id: 'cntCustomersBefore', label: 'عدد العملاء (قبل)', align: 'center' },
                { id: 'cntCustomers', label: '(بعد)', align: 'center' },
                { id: 'cntCustomersDiff', label: 'الفارق', align: 'center' },
              ]}
            />
          </Grid>

          <Grid xs={12} md={12}>
            <Stack spacing={3}>
              <BankingBalanceStatistics_
                title="عملاء موقوفون وفق الفترة"
                defaultState="عام"
                // subheader="(+43% Income | +12% Expense) than last year"
                chart={{
                  categories: stoppedCustomersInQuarterNames,
                  series: [
                    {
                      type: 'عام',
                      data: [
                        {
                          name: 'الكميات المخصصة',
                          data: stoppedCustomersInQuarterValues,
                        },
                        {
                          name: 'عدد العملاء',
                          data: stoppedCustomersInQuarterCounter,
                        },
                      ],
                    },
                    {
                      type: 'عملاء',
                      data: [
                        {
                          name: 'عدد العملاء',
                          data: stoppedCustomersInQuarterCounter,
                        },
                      ],
                    },
                    {
                      type: 'الكميات',
                      data: [
                        {
                          name: 'الكميات المخصصة',
                          data: stoppedCustomersInQuarterValues,
                        },
                      ],
                    },
                  ],
                }}
              />
            </Stack>
          </Grid>
        </Grid>
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
                <Typography variant="h4" component="h2">
                  اجراءات تصحيح بيانات عملاء الدقيق والكميات المخصصة خلال الفترة من 2023 وحتى 2025 م
                </Typography>
              </Box>
            </Box>
            {!!errorMsg && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {errorMsg}
              </Alert>
            )}
            {isLoading ? renderLoading : showContent && mInfo && renderDash}
          </Box>
        </Container>
      </div>
    </>
  );
}
