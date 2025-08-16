'use client';
import useSWR from 'swr';
import axios, { fetcher, endpoints } from 'src/utils/axios';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

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
import { IDashStockFilters } from 'src/types/dashStock';
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

var today = new Date();
var yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const defaultFilters: IDashStockFilters = {
  year: 0,
  month: 0,
  fromDate: new Date('01/01/2024'),
  toDate: yesterday,
  portId: 0,
  companyId: 0,
  stationId: 0,
  text: '',
};

type dsperiodInfo = {
  year: number;
  companyId: number;
  stationId: number;
  cntCustomers: number;
  smtotalWeightInTons: number;
  smPrice: number;
  cntProductId: number;
  cntInvoices: number;
  growthRate: number;
};
type dsYearInfoDto = {
  companyId: number;
  stationId: number;
  year: number;
  cntCustomers: number;
  smTotalWeightInTons: number;
  maxMonthDesc: string;
  smPrice: number;
  cntProducts: number;
  cntInvoices: number;
  growthRate: number;
  maxMonth: number;
  yearLabelList: string[];
  halfDataList: number[];
  halfLabelList: string[];
  quarterDataList: number[];
  quarterLabelList: string[];
  monthlyDataList: number[];
  monthlyLabelList: string[];
  mC1MonthlyDataList: number[];
  mC2MonthlyDataList: number[];
  mC3MonthlyDataList: number[];
  mC4MonthlyDataList: number[];
  top10: topRecord[];
  top10U: topRecord[];
  itemsQty: topRecord[];
  activitiesQty: topRecord[];
  companyYearTotalQty: companyYearTotalQty[];
  companyYearTotalCatQtys: companyYearTotalCatQtys[];
  companyYearTotalQtys: companyYearTotalQtys[];
  companyMonthTotalQtys: companyMonthTotalQtys[];
};
type monthlyComparison = {
  name1: string;
  dataList1: number[];
  labelList1: string[];
  name2: string;
  dataList2: number[];
  labelList2: string[];
};
type topRecord = {
  serial?: number;
  label: string;
  value: number;
  totalAmount: number;
  count?: number;
  subLabel?: string;
  yearsTotalSales?: customerYearsTotalSales[];
  growthRate?: number;
};
type customerYearsTotalSales = {
  uCustomerId: number;
  year: number;
  totalWeightInTons: number;
};
type companyYearTotalQtys = {
  year: string;
  data: companyYearTotalCatQtys[];
};
type companyYearTotalCatQtys = {
  name: string;
  data: number[];
};
type companyMonthTotalQtys = {
  name: string;
  data: number[];
};
type companyYearTotalQty = {
  companyId: number;
  companyName: string;
  labelValue: labelValue[];
};
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

type StockInfo = {
  isFullYear: boolean;
  yearTotalSalesQty: number;
  daysToYearEnd: number;
  yearTotalSalesQtyExpected: number;
  maxBag50Price: number;
  minBag50Price: number;
  dateDesc: string;
  uniquStationsAmount: number;
  smOpeningBalance: number;
  smClosingBalance: number;
  stockInDays: number;
  averagePriceBag50: number;
  averagePriceBag50LastMonth: number;
  smAddedQtyInTon: number;
  smTotalSalesQty: number;
  salesDaysAmount: number;
  salesAverage: number;
  growthRate: number;
  salesGrowthRate: number;
  addedQtyGrowthRate: number;
  sufficiencyInDays: number;
  monthlyPriceAverage: stocksInfo[];

  monthlyCBalances: stocksInfo[];
  companiesMonthlyCBalances: stocksInfo[];
  portsMonthlyCBalances: stocksInfo[];

  monthlyTotalSalesQty: stocksInfo[];
  companiesMonthlyTotalSalesQty: stocksInfo[];
  portsMonthlyTotalSalesQty: stocksInfo[];

  companiesStockSalesAddedQtyColumn: locationStockSalesAddedQtyColumns;
  portsStockSalesAddedQtyColumn: locationStockSalesAddedQtyColumns;
  companiesStockSalesAddedQty: locationStockSalesAddedQty[];
  portsStockSalesAddedQty: locationStockSalesAddedQty[];
  stationsStockSalesAddedQty: locationStockSalesAddedQty[];
  companiesCBalance: labelValueN[];
  portsCBalance: labelValueN[];
  smTodayTotalSales: number;
  missingDates: missingDates[];
  selectedLastDateDesc: string;
  stationsLastDateSales: stationLastDateSales[];
  averageCompaniesPrices: averageCompaniesPrices;
};
type averageCompaniesPrices = {
  bag50: averageCompaniesPricesList;
  bag40: averageCompaniesPricesList;
  bulk: averageCompaniesPricesList;
};
type averageCompaniesPricesList = {
  companiesList: string[];
  averagePriceList: number[];
};
type stationLastDateSales = {
  stationId: number;
  stationCode: number;
  stationTitle: string;
  totalSalesQty: number;
};
type locationStockSalesAddedQtyColumns = {
  labels: string[];
  series: seriesTypeDataColumn[];
};
type seriesTypeDataColumn = {
  type: string;
  data: seriesDataColumn[];
};
type seriesDataColumn = {
  name: string;
  data: number[];
};
type stocksInfo = {
  labels: string[];
  data: stockLine[];
};
type stockLine = {
  name: string;
  data: number[];
};
type locationStockSalesAddedQty = {
  year: string;
  labels: string[];
  data: seriesNameData[];
  locationStockSufficiency: locationStockSufficiency[];
};
type locationStockSufficiency = {
  name: string;
  stockInitial: number;
  inQty: number;
  salesQty: number;
  stockQty: number;
  salesDays: number;
  salesAverage: number;
  sufficiencyInDays: number;
  sufficiencyInDaysPercent: number;
  lastUpdate: string;
  status: number;
  statusDesc: string;
};
type seriesNameData = {
  name: string;
  type: string;
  fill: string;
  data: number[];
};
type missingDates = {
  stationId: number;
  stationCode: number;
  processDate: Date;
  processDateDesc: string;
  stationTitle: string;
};
const SPACING = 3;

export default function BarleyStocksDashboardView() {
  const now = new Date();
  const [dangerLimit, setDangerLimit] = useState(0);
  const [warningLimit, setWarningLimit] = useState(50);
  const [fairLimit, setFairLimit] = useState(9000);
  const [moreLimit, setMoreLimit] = useState(90);
  const formattedDate = format(now, 'dd/ MM/ yyyy');
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
  const [stockInfo, setStockInfo] = useState<StockInfo>();

  const [halfTable, setHalfTable] = useState(false);
  const [quarterTable, setQuarterTable] = useState(false);
  const [monthlyTable, setMonthlyTable] = useState(false);

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
      month: number,
      portId: number,
      companyId: number,
      stationId: number,
      fromDate: Date | null,
      toDate: Date | null,
      text: string
    ) => {
      setErrorMsg('');
      setIsLoading(true);
      const data = {
        year,
        month,
        portId,
        companyId,
        stationId,
        fromDate,
        toDate,
        text,
      };
      const res = await axios.post(endpoints.dashStock.getBarleyDashboard, data);
      // dashY: (data?.result as IDashYSales
      console.log('filter', filters);
      console.log('res', res.data);
      const { isSuccess, result, errorMessages, httpStatusCode } = res.data;
      setIsLoading(false);
      if (isSuccess) {
        const { stockInfo } = res.data.result;
        setStockInfo(stockInfo);
        setShowContent(true);
      } else {
        setErrorMsg('لم يتم تحميل البيانات المطلوبة، يرجى التأكد من مدخلات البحث');
        setShowContent(false);
      }
    },
    []
  );

  useEffect(() => {
    getData(
      filters.year,
      filters.month,
      filters.portId,
      filters.companyId,
      filters.stationId,
      filters.fromDate,
      filters.toDate,
      filters.text
    );
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
  function handleChangeMonth(event: SelectChangeEvent) {
    handleFilters('month', Number(event.target.value));
  }

  function handleChangePort(event: SelectChangeEvent) {
    handleFilters('portId', Number(event.target.value));
    handleFilters('stationId', 0);
  }
  function handleChangeCompany(event: SelectChangeEvent) {
    handleFilters('companyId', Number(event.target.value));
    handleFilters('stationId', 0);
  }
  function handleChangeStation(event: SelectChangeEvent) {
    handleFilters('stationId', Number(event.target.value));
  }
  function handleChangeText(event: React.ChangeEvent<HTMLInputElement>) {
    console.log((event.target as HTMLInputElement).value);
    handleFiltersText('text', (event.target as HTMLInputElement).value);
  }

  // function handleChangeToDate(event: React.ChangeEvent<HTMLInputElement>) {
  //   console.log((event.target as HTMLInputElement).value);
  //   handleFiltersText('toDate', (event.target as HTMLInputElement).value);
  // }

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
    getData(
      filters.year,
      filters.month,
      filters.portId,
      filters.companyId,
      filters.stationId,
      filters.fromDate,
      filters.toDate,
      filters.text
    );
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

  const companiesList = [
    { id: 11000022, name: ' المتميزة ' },
    { id: 11000001, name: 'البواردي' },
    { id: 11000017, name: 'الجمعية' },
    { id: 11000010, name: 'الحناكي ' },
    { id: 11000041, name: 'الغدير' },
    { id: 11000005, name: 'المتحدة ' },
    { id: 11000006, name: 'المساعد' },
    { id: 11000003, name: 'المعجل' },
    { id: 11000021, name: 'النافع ' },
    { id: 11000073, name: 'الوطنية' },
    { id: 11000016, name: 'فيدكو ' },
  ];
  const regionPortList = [
    { id: 1, name: 'الجبيل' },
    { id: 2, name: 'الجموم' },
    { id: 3, name: 'الدمام' },
    { id: 4, name: 'الشميسي' },
    { id: 5, name: 'جازان' },
    { id: 6, name: 'جدة' },
    { id: 9, name: 'رابغ' },
    { id: 7, name: 'ضباء' },
    { id: 8, name: 'ينبع' },
  ];
  const stationList = [
    { id: 1100, name: 'الجبيل الغدير', stationcode: 806, companyId: 11000041, portId: 1 },
    { id: 1018, name: 'الجبيل المتحدة', stationcode: 802, companyId: 11000005, portId: 1 },
    { id: 1070, name: 'الجبيل المتميزة', stationcode: 804, companyId: 11000022, portId: 1 },
    { id: 1015, name: 'الجبيل المعجل', stationcode: 805, companyId: 11000003, portId: 1 },
    { id: 1219, name: 'الجموم الحناكي', stationcode: 203, companyId: 11000010, portId: 2 },
    { id: 1025, name: 'الجموم المتحدة', stationcode: 201, companyId: 11000005, portId: 2 },
    { id: 1208, name: 'الجموم المعجل', stationcode: 202, companyId: 11000003, portId: 2 },
    { id: 1001, name: 'الدمام البواردي', stationcode: 701, companyId: 11000001, portId: 3 },
    { id: 1063, name: 'الدمام الجمعية', stationcode: 707, companyId: 11000017, portId: 3 },
    { id: 1021, name: 'الدمام المتحدة 2', stationcode: 704, companyId: 11000005, portId: 3 },
    { id: 1109, name: 'الدمام المتميزة', stationcode: 703, companyId: 11000022, portId: 3 },
    { id: 1010, name: 'الدمام المساعد', stationcode: 702, companyId: 11000006, portId: 3 },
    { id: 1036, name: 'الدمام فيدكو', stationcode: 705, companyId: 11000016, portId: 3 },
    { id: 1013, name: 'الشميسي المساعد', stationcode: 301, companyId: 11000006, portId: 4 },
    { id: 1042, name: 'الشميسي النافع', stationcode: 302, companyId: 11000021, portId: 4 },
    { id: 1003, name: 'جازان المتحدة', stationcode: 502, companyId: 11000005, portId: 5 },
    { id: 1009, name: 'جازان المساعد', stationcode: 501, companyId: 11000006, portId: 5 },
    { id: 1110, name: 'جازان النافع', stationcode: 503, companyId: 11000021, portId: 5 },
    { id: 1017, name: 'جدة الحناكي', stationcode: 104, companyId: 11000010, portId: 6 },
    { id: 1026, name: 'جدة المتحدة', stationcode: 103, companyId: 11000005, portId: 6 },
    { id: 1112, name: 'جدة المساعد', stationcode: 102, companyId: 11000006, portId: 6 },
    { id: 1111, name: 'جدة النافع', stationcode: 101, companyId: 11000021, portId: 6 },
    { id: 1216, name: 'جدة فيدكو', stationcode: 105, companyId: 11000016, portId: 6 },
    { id: 1226, name: 'رابغ الوطنية', stationcode: 406, companyId: 11000073, portId: 9 },
    { id: 1019, name: 'ضباء المتحدة', stationcode: 601, companyId: 11000005, portId: 7 },
    { id: 1187, name: 'ينبع الحناكي', stationcode: 404, companyId: 11000010, portId: 8 },
    { id: 1022, name: 'ينبع المتحدة', stationcode: 402, companyId: 11000005, portId: 8 },
    { id: 1004, name: 'ينبع المساعد', stationcode: 403, companyId: 11000006, portId: 8 },
    { id: 1101, name: 'ينبع النافع', stationcode: 401, companyId: 11000021, portId: 8 },
    { id: 1168, name: 'ينبع الوطنية', stationcode: 405, companyId: 11000073, portId: 8 },
  ];

  function getYearIndex(year: number) {
    switch (year) {
      case 2024:
        return 7;
      case 2023:
        return 6;
      case 2022:
        return 5;
      case 2021:
        return 4;
      case 2020:
        return 3;
      case 2019:
        return 2;
      case 2018:
        return 1;
      case 2017:
        return 0;
      default:
        return -1;
    }
  }

  let AYStatus = 0;
  let BYStatus = 0;
  function getDataListTotal(datalist: any) {
    let total = 0;
    datalist.map((r: any) => (total += r));
    return fShortenNumber2(total);
  }

  function getDataListValueTotal(datalist: topRecord[]) {
    let total = 0;
    datalist.map((r: topRecord) => (total += r.value));
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
      <Box sx={{ marginBottom: '10px' }}>
        <ColorCodedLine />
      </Box>
      {stockInfo && (
        <Grid container spacing={SPACING} disableEqualOverflow>
          <Grid xs={12} md={3}>
            <BookingWidgetSummary
              title={'اجمالي وارد الفترة بالطن'}
              total={stockInfo ? stockInfo!.smAddedQtyInTon! : 0}
              icon={
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '50%',
                    width: 120,
                    height: 120,
                    backgroundColor: '#F4F6F8',
                    color: '#009688d6',
                  }}
                >
                  <DirectionsBoat sx={{ fontSize: 70 }} />
                </Box>
              }
            />
          </Grid>
          {stockInfo.isFullYear && (
            <Grid xs={12} md={3}>
              <BookingWidgetSummary
                title="نسبة نمو الوارد"
                total={stockInfo!.addedQtyGrowthRate!}
                isPercent={true}
                icon={
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '50%',
                      width: 120,
                      height: 120,
                      backgroundColor: '#F4F6F8',
                      color: stockInfo!.addedQtyGrowthRate! > 0 ? '#009688d6' : '#FF5722',
                    }}
                  >
                    {stockInfo!.addedQtyGrowthRate! > 0 && <TrendingUpIcon sx={{ fontSize: 70 }} />}
                    {stockInfo!.addedQtyGrowthRate! < 0 && (
                      <TrendingDownIcon sx={{ fontSize: 70 }} />
                    )}
                  </Box>
                }
              />
            </Grid>
          )}
          <Grid xs={12} md={3}>
            <BookingWidgetSummary
              title={'اجمالي مبيعات الفترة بالطن'}
              total={stockInfo ? stockInfo!.smTotalSalesQty! : 0}
              icon={
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '50%',
                    width: 120,
                    height: 120,
                    backgroundColor: '#F4F6F8',
                    color: '#009688d6',
                  }}
                >
                  <LocalShipping sx={{ fontSize: 70 }} />
                </Box>
              }
            />
          </Grid>
          {stockInfo.isFullYear && (
            <Grid xs={12} md={3}>
              <BookingWidgetSummary
                title="نسبة نمو المبيعات"
                total={stockInfo!.salesGrowthRate!}
                isPercent={true}
                icon={
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '50%',
                      width: 120,
                      height: 120,
                      backgroundColor: '#F4F6F8',
                      color: stockInfo!.salesGrowthRate! > 0 ? '#009688d6' : '#FF5722',
                    }}
                  >
                    {stockInfo!.salesGrowthRate! > 0 && <TrendingUpIcon sx={{ fontSize: 70 }} />}
                    {stockInfo!.salesGrowthRate! < 0 && <TrendingDownIcon sx={{ fontSize: 70 }} />}
                  </Box>
                }
              />
            </Grid>
          )}
          <Grid xs={12} md={3}>
            <BookingWidgetSummary
              title={'المخزون الحالي بالطن'}
              total={stockInfo ? stockInfo!.smClosingBalance! : 0}
              icon={
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '50%',
                    width: 120,
                    height: 120,
                    backgroundColor: '#F4F6F8',
                    color: '#009688d6',
                  }}
                >
                  <AssuredWorkload sx={{ fontSize: 70 }} />
                </Box>
              }
            />
          </Grid>
          <Grid xs={12} md={3}>
            <BookingWidgetSummary
              title={'المخزون بداية الفترة بالطن'}
              total={stockInfo ? stockInfo!.smOpeningBalance! : 0}
              icon={
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '50%',
                    width: 120,
                    height: 120,
                    backgroundColor: '#F4F6F8',
                    color: '#009688d6',
                  }}
                >
                  <AccountBalance sx={{ fontSize: 70 }} />
                </Box>
              }
            />
          </Grid>
          <Grid xs={12} md={3}>
            <BookingWidgetSummary
              title={t('نسبة  نمو المخزون ')}
              total={stockInfo!.growthRate!}
              isPercent={true}
              icon={
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '50%',
                    width: 120,
                    height: 120,
                    backgroundColor: '#F4F6F8',
                    color: stockInfo!.growthRate! > 0 ? '#009688d6' : '#FF5722',
                  }}
                >
                  {stockInfo!.growthRate! > 0 && <TrendingUpIcon sx={{ fontSize: 70 }} />}
                  {stockInfo!.growthRate! < 0 && <TrendingDownIcon sx={{ fontSize: 70 }} />}
                </Box>
              }
            />
          </Grid>
          <Grid xs={12} md={3}>
            <BookingWidgetSummary
              title={' مبيعات: ' + (stockInfo ? stockInfo!.dateDesc : '') + ' بالطن '}
              total={stockInfo ? stockInfo!.smTodayTotalSales! : 0}
              icon={
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '50%',
                    width: 120,
                    height: 120,
                    backgroundColor: '#F4F6F8',
                    color: '#009688d6',
                  }}
                >
                  <Receipt sx={{ fontSize: 70 }} />
                </Box>
              }
            />
          </Grid>
          <Grid xs={12} md={3} hidden>
            <BookingWidgetSummary
              title={'عدد أيام البيع'}
              total={stockInfo ? stockInfo!.salesDaysAmount! : 0}
              icon={
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '50%',
                    width: 120,
                    height: 120,
                    backgroundColor: '#F4F6F8',
                    color: '#009688d6',
                  }}
                >
                  <Today sx={{ fontSize: 70 }} />
                </Box>
              }
            />
          </Grid>
          <Grid xs={12} md={3}>
            <BookingWidgetSummary
              title={'متوسط المبيعات اليومي للفترة بالطن'}
              total={stockInfo ? stockInfo!.salesAverage! : 0}
              icon={
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '50%',
                    width: 120,
                    height: 120,
                    backgroundColor: '#F4F6F8',
                    color: '#009688d6',
                  }}
                >
                  <Receipt sx={{ fontSize: 70 }} />
                </Box>
              }
            />
          </Grid>
          <Grid xs={12} md={3}>
            <BookingWidgetSummary
              title={'متوسط سعر بيع الكيس 50 كجم خلال الفترة'}
              subTitle=""
              // {'آخر شهر أو أقل وفق فترة البحث'}
              total={stockInfo ? stockInfo!.averagePriceBag50! : 0}
              isNotRound={true}
              icon={
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '50%',
                    width: 120,
                    height: 120,
                    backgroundColor: '#F4F6F8',
                    color: '#009688d6',
                  }}
                >
                  <CreditCard sx={{ fontSize: 70 }} />
                </Box>
              }
            />
          </Grid>
          {stockInfo.stockInDays > 30 && (
            <Grid xs={12} md={3}>
              <BookingWidgetSummary
                title={'متوسط سعر بيع الكيس 50 كجم (آخر شهر)'}
                subTitle=""
                // {'آخر شهر أو أقل وفق فترة البحث'}
                total={stockInfo ? stockInfo!.averagePriceBag50LastMonth! : 0}
                isNotRound={true}
                icon={
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '50%',
                      width: 120,
                      height: 120,
                      backgroundColor: '#F4F6F8',
                      color: '#009688d6',
                    }}
                  >
                    <CreditCard sx={{ fontSize: 70 }} />
                  </Box>
                }
              />
            </Grid>
          )}
          <Grid xs={12} md={3}>
            <BookingWidgetSummary_
              title={'أقل | أعلى سعر بيع كيس 50 كجم'}
              total={
                (stockInfo ? stockInfo!.minBag50Price! : 0) +
                ' | ' +
                (stockInfo ? stockInfo!.maxBag50Price! : 0)
              }
              icon={
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '50%',
                    width: 120,
                    height: 120,
                    backgroundColor: '#F4F6F8',
                    color: '#009688d6',
                  }}
                >
                  <SwapVert sx={{ fontSize: 70, color: '#92a79f' }} />
                </Box>
              }
            />
          </Grid>
          <Grid xs={12} md={3}>
            <BookingWidgetSummary
              title={'عدد محطات البيع'}
              total={stockInfo ? stockInfo!.uniquStationsAmount! : 0}
              icon={
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '50%',
                    width: 120,
                    height: 120,
                    backgroundColor: '#F4F6F8',
                    color: '#009688d6',
                  }}
                >
                  <HouseSiding sx={{ fontSize: 70 }} />
                </Box>
              }
            />
          </Grid>
          {/* '#007867' : '#006C9C' '#B76E00' : '#B71D18' */}
          <Grid xs={12} md={stockInfo.isFullYear ? 9 : 3}>
            <BookingWidgetSummary
              sx={{
                backgroundColor: GetColorName(stockInfo.sufficiencyInDays),
                color: '#ebf8f7f8',
              }}
              color="#ebf8f7f8"
              title={'كفاية المخزون (يوم)'}
              total={stockInfo ? stockInfo!.sufficiencyInDays! : 0}
              icon={
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '50%',
                    width: 120,
                    height: 120,
                    backgroundColor: '#F4F6F8',
                    color: GetColorName(stockInfo.sufficiencyInDays),
                  }}
                >
                  {stockInfo!.sufficiencyInDays! < fairLimit && (
                    <NotificationAdd
                      sx={{
                        color: GetColorName(stockInfo.sufficiencyInDays),
                        fontSize: 70,
                      }}
                    />
                  )}
                  {stockInfo!.sufficiencyInDays! >= fairLimit && (
                    <Verified
                      sx={{
                        color: GetColorName(stockInfo.sufficiencyInDays),
                        fontSize: 70,
                      }}
                    />
                  )}
                </Box>
              }
            />
          </Grid>
          {stockInfo.isFullYear && (
            <Grid xs={12} md={12}>
              <Stack spacing={3}>
                <YearlySalesInQty
                  title="بيان المبيعات السنوية"
                  // subheader="(+43% Income | +12% Expense) than last year"
                  chart={{
                    categories: ['2022', '2023', '2024'],
                    series: [
                      {
                        type: 'Year',
                        data: [
                          {
                            name: 'المبيعات',
                            data: [3900332, 3231004, stockInfo.yearTotalSalesQty],
                          },
                          // {
                          //   name: 'الوارد',
                          //   data: [0, 0, 3306180,],
                          // },
                        ],
                      },
                    ],
                  }}
                />
              </Stack>
            </Grid>
          )}
          <Grid xs={12} md={12}>
            <Stack spacing={3}>
              <LocationPriceAverage
                title="متوسط السعر وفق الشركات"
                // subheader="وفق آخر شهر أو أقل حسب الفترة المحددة بالبحث"
                chart={{
                  categories: stockInfo.averageCompaniesPrices.bag50.companiesList,
                  series: [
                    {
                      type: 'كيس 50 كجم',
                      data: [
                        {
                          name: '',
                          data: stockInfo.averageCompaniesPrices.bag50.averagePriceList,
                        },
                      ],
                    },
                    {
                      type: 'كيس 40 كجم',
                      data: [
                        {
                          name: '',
                          data: stockInfo.averageCompaniesPrices.bag40.averagePriceList,
                        },
                      ],
                    },
                    {
                      type: 'سائب',
                      data: [
                        {
                          name: '',
                          data: stockInfo.averageCompaniesPrices.bulk.averagePriceList,
                        },
                      ],
                    },
                  ],
                }}
              />
            </Stack>
          </Grid>
          <Grid xs={12} md={12} lg={12}>
            <PriceMonthly
              title="المتوسط الشهري لأسعار البيع"
              chart={{
                categories: stockInfo!.monthlyPriceAverage[0].labels,
                generalSeries: stockInfo!.monthlyPriceAverage,
              }}
            />
          </Grid>
          <Grid xs={12} md={12}>
            <Card>
              <CardHeader title="مخزونات/ مبيعات/ وارد الشعير" subheader="" />
              <Tabs
                value={tabLocationBalanceStatisticsIndex}
                onChange={handleLocationBalanceStatisticsTabChange}
                aria-label="tabs 4"
                sx={{ padding: '0 20px', marginTop: '15px' }}
              >
                <Tab label="الشركات" icon={<Store />} />
                <Tab label="الموانئ" icon={<Houseboat />} />
              </Tabs>
              {tabLocationBalanceStatisticsIndex === 0 && (
                <LocationBalanceStatistics
                  chart={{
                    categories: stockInfo!.companiesStockSalesAddedQtyColumn.labels,
                    series: stockInfo!.companiesStockSalesAddedQtyColumn.series,
                  }}
                />
              )}
              {tabLocationBalanceStatisticsIndex === 1 && (
                <LocationBalanceStatistics
                  chart={{
                    categories: stockInfo!.portsStockSalesAddedQtyColumn.labels,
                    series: stockInfo!.portsStockSalesAddedQtyColumn.series,
                  }}
                />
              )}
            </Card>
          </Grid>
          {/* <Grid xs={12} md={12} lg={12}>
            <AnalyticsWebsiteVisits
              title="مخزونات/ مبيعات/ وارد الشعير وفق الشركات"
              // subheader="(+43%) than last year"
              chart={{
                labels: stockInfo!.companiesStockSalesAddedQty[0].labels,
                series: stockInfo!.companiesStockSalesAddedQty[0].data,
              }}
            />
          </Grid>
          <Grid xs={12} md={12} lg={12}>
            <AnalyticsWebsiteVisits
              title="مخزونات/ مبيعات/ وارد الشعير وفق الموانئ"
              // subheader="(+43%) than last year"
              chart={{
                labels: stockInfo!.portsStockSalesAddedQty[0].labels,
                series: stockInfo!.portsStockSalesAddedQty[0].data,
              }}
            />
          </Grid> */}
          <Grid xs={12} md={12} lg={12}>
            <StockMonthly
              title="بيان المخزون الشهري"
              chart={{
                categories: stockInfo!.monthlyCBalances[0].labels,
                generalSeries: stockInfo!.monthlyCBalances,
                companiesSeries: stockInfo!.companiesMonthlyCBalances,
                portsSeries: stockInfo!.portsMonthlyCBalances,
              }}
            />
          </Grid>
          <Grid xs={12} md={12} lg={12}>
            <StockMonthly
              title="بيان المبيعات الشهرية"
              chart={{
                categories: stockInfo!.monthlyTotalSalesQty[0].labels,
                generalSeries: stockInfo!.monthlyTotalSalesQty,
                companiesSeries: stockInfo!.companiesMonthlyTotalSalesQty,
                portsSeries: stockInfo!.portsMonthlyTotalSalesQty,
              }}
            />
          </Grid>
          <Grid xs={12} md={7} lg={7}>
            <AppCurrentDownload
              title="توزيع المخزون بين الشركات"
              chart={{
                series: stockInfo!.companiesCBalance,
              }}
            />
          </Grid>
          <Grid xs={12} md={5} lg={5}>
            <AppCurrentDownload
              title="توزيع المخزون بين الموانئ"
              chart={{
                series: stockInfo!.portsCBalance,
              }}
            />
          </Grid>
          <Grid xs={12} md={12} lg={12}>
            <LocationStockSufficiencyView
              title="كفاية المخزون"
              listCompanies={stockInfo!.companiesStockSalesAddedQty[0]!.locationStockSufficiency}
              listPorts={stockInfo!.portsStockSalesAddedQty[0]!.locationStockSufficiency}
              listStations={stockInfo!.stationsStockSalesAddedQty[0]!.locationStockSufficiency}
            />
          </Grid>
          <Grid xs={12} md={12} lg={12}>
            <StationStockTxInfo
              title="بيان العمليات"
              selectedLastDateDesc={stockInfo!.selectedLastDateDesc}
              stationsLastDateSales={stockInfo!.stationsLastDateSales}
              missingDates={stockInfo!.missingDates}
            />
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
                <Typography variant="h5" component="h2">
                  مخزون/ مبيعات الشعير
                </Typography>
                <Box sx={{ mt: 3, mb: 1 }}>
                  <Grid container spacing={1} alignItems="center">
                    {/* Year Filter */}
                    <Grid xs={12} sm={2} md={2} hidden>
                      <FormControl fullWidth>
                        <InputLabel>السنة</InputLabel>
                        <Select
                          value={filters.year.toString()}
                          onChange={(e: any) => handleChangeYear(e)}
                          input={<OutlinedInput label="السنة" />}
                          sx={{ textTransform: 'capitalize' }}
                        >
                          <MenuItem key={0} value={0} disabled>
                            الكل
                          </MenuItem>
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
                        <DatePicker
                          minDate={new Date('01/01/2024')}
                          maxDate={new Date()}
                          localeText={{
                            toolbarTitle: '',
                            todayButtonLabel: 'اليوم',
                            dateTableLabel: 'التاريخ',
                            timeTableLabel: 'الوقت',
                            okButtonLabel: 'اختر',
                            clearButtonLabel: 'فارغ',
                            cancelButtonLabel: 'الغاء',
                          }}
                          label="من تاريخ"
                          value={filters.fromDate}
                          onChange={handleFilterFromDate}
                          format="yyyy/MM/dd"
                          slotProps={{ textField: { fullWidth: true } }}
                          // sx={{
                          //   maxWidth: { md: 180 },
                          // }}
                        />
                      </FormControl>
                    </Grid>
                    {/* Month Filter */}
                    <Grid xs={12} sm={2} md={2}>
                      <FormControl fullWidth>
                        <DatePicker
                          minDate={new Date('01/01/2024')}
                          maxDate={new Date()}
                          localeText={{
                            toolbarTitle: '',
                            todayButtonLabel: 'اليوم',
                            dateTableLabel: 'التاريخ',
                            timeTableLabel: 'الوقت',
                            okButtonLabel: 'اختر',
                            clearButtonLabel: 'فارغ',
                            cancelButtonLabel: 'الغاء',
                          }}
                          label="الى تاريخ"
                          value={filters.toDate}
                          onChange={handleFilterToDate}
                          format="yyyy/MM/dd"
                          slotProps={{ textField: { fullWidth: true } }}
                          // sx={{
                          //   maxWidth: { md: 180 },
                          // }}
                        />
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
                          {companiesList.map((item) => (
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
                        <InputLabel>الميناء</InputLabel>
                        <Select
                          value={filters.portId.toString()}
                          onChange={(e: any) => handleChangePort(e)}
                          input={<OutlinedInput label="الميناء" />}
                          sx={{ textTransform: 'capitalize' }}
                        >
                          <MenuItem key={0} value={0}>
                            الكل
                          </MenuItem>
                          {regionPortList.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Station Filter */}
                    <Grid xs={12} sm={2} md={2}>
                      <FormControl fullWidth>
                        <InputLabel>المحطة</InputLabel>
                        <Select
                          value={filters.stationId.toString()}
                          onChange={(e: any) => handleChangeStation(e)}
                          input={<OutlinedInput label="المحطة" />}
                          sx={{ textTransform: 'capitalize' }}
                        >
                          <MenuItem key={0} value={0}>
                            الكل
                          </MenuItem>
                          {stationList
                            .filter((obj) => {
                              if (filters.companyId === 0 && filters.portId === 0) return obj;
                              if (
                                filters.companyId !== 0 &&
                                filters.portId !== 0 &&
                                obj.companyId === filters.companyId &&
                                obj.portId === filters.portId
                              )
                                return obj;
                              if (
                                filters.companyId !== 0 &&
                                filters.portId === 0 &&
                                obj.companyId === filters.companyId
                              )
                                return obj;
                              if (
                                filters.companyId === 0 &&
                                filters.portId !== 0 &&
                                obj.portId === filters.portId
                              )
                                return obj;
                              return;
                            })
                            .map((item) => (
                              <MenuItem key={item.id} value={item.id}>
                                {item.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Search Field */}
                    <Grid xs={12} sm={4} md={4} hidden>
                      <TextField
                        fullWidth
                        value={filters.text}
                        onChange={handleChangeText}
                        placeholder="رقم العميل/ اسم العميل..."
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
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
            {isLoading ? renderLoading : showContent && stockInfo && renderDash}
          </Box>
        </Container>
      </div>
    </>
  );
}
