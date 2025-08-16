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
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
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
  ImportContacts,
  ImportContactsOutlined,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { DateRangeIcon } from '@mui/x-date-pickers';
import FileDataActivity from '../file-data-activity';
import { SelectChangeEvent } from '@mui/material/Select';
import { useGetYearlyDashboard } from 'src/api/dash';
import { IDashYSales, IDashYSalesFilters } from 'src/types/dashSales';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { length } from 'stylis';
import YSalesOverview from '../sales-overview';
import { LoadingScreen } from 'src/components/loading-screen';
import EmptyContent from 'src/components/empty-content';
import YearlySales from '../yearly-sales';
import BookingTotalIncomes from '../booking-total-incomes';
import AnalyticsCurrentVisits from 'src/sections/analytics-current-visits';
import AnalyticsConversionRates from 'src/sections/analytics-conversion-rates';
import { BarChart as BarChartIcon, TableChart as TableChartIcon } from '@mui/icons-material';
import { RHFTextField } from 'src/components/hook-form';

const defaultFilters: IDashYSalesFilters = {
  year: 2024,
  period: 0,
  month: 0,
  customerTypeId: 0,
  itemCatId: 0,
  mcId: 0,
  branchId: 0,
  text: '',
};
type dsperiodInfo = {
  year: number;
  companyId: number;
  branchId: number;
  cntCustomers: number;
  smtotalWeightInTons: number;
  smPrice: number;
  cntProductId: number;
  cntInvoices: number;
  growthRate: number;
};
type dsYearInfoDto = {
  companyId: number;
  branchId: number;
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
  percent?: number;
};
type customerYearsTotalSales = {
  uCustomerId: number;
  year: number;
  totalWeightInTons: number;
};
type companyYearTotalQtys = {
  yearList: string[];
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
const TIME_LABELS = {
  period: [
    { id: '1', name: 'النصف الأول' },
    { id: '2', name: 'النصف الثاني' },
    { id: '12', name: 'الربع الأول' },
    { id: '12', name: 'الربع الثاني' },
    { id: '13', name: 'الربع الثالث' },
    { id: '14', name: 'الربع الرابع' },
  ],
  month: [
    { id: '1', name: 'يناير', half: '1', quarter: '11' },
    { id: '2', name: 'فبراير', half: '1', quarter: '11' },
    { id: '3', name: 'مارس', half: '1', quarter: '11' },
    { id: '4', name: 'ابريل', half: '1', quarter: '12' },
    { id: '5', name: 'مايو', half: '1', quarter: '12' },
    { id: '6', name: 'يونيو', half: '1', quarter: '12' },
    { id: '7', name: 'يوليو', half: '2', quarter: '13' },
    { id: '8', name: 'اغسطس', half: '2', quarter: '13' },
    { id: '9', name: 'سبتمبر', half: '2', quarter: '13' },
    { id: '10', name: 'اكتوبر', half: '2', quarter: '14' },
    { id: '11', name: 'نوفمبر', half: '2', quarter: '14' },
    { id: '12', name: 'ديسمبر', half: '2', quarter: '14' },
  ],
  year: ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017'],
};
const SPACING = 3;

export default function SalesYDashboardPartialView() {
  const now = new Date();
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [mainData, setMainData] = useState();
  const [periodsInfo, setPeriodsInfo] = useState<dsYearInfoDto[]>();

  const [halfTable, setHalfTable] = useState(false);
  const [quarterTable, setQuarterTable] = useState(false);
  const [monthlyTable, setMonthlyTable] = useState(false);
  let isDashAdmin: boolean = user!.isDashAdmin;
  let isDashSAdmin: boolean = user!.isDashSAdmin;
  let isDashPFSales: boolean = user!.isDashPFSales;

  const getData = useCallback(
    async (
      year: number,
      period: number,
      month: number,
      customerTypeId: number,
      itemCatId: number,
      companyId: number,
      branchId: number,
      text: string
    ) => {
      setErrorMsg('');
      setIsLoading(true);
      const data = {
        year,
        period,
        month,
        customerTypeId,
        itemCatId,
        companyId,
        branchId,
        text,
      };
      console.log('text', text);
      const res = await axios.post(endpoints.dashSales.getYearlyDashboard, data);
      // dashY: (data?.result as IDashYSales
      console.log('filter', filters);
      console.log('res', res.data);
      const { isSuccess, result, errorMessages, httpStatusCode } = res.data;
      setIsLoading(false);
      if (isSuccess) {
        const { listYearsInfo } = res.data.result;
        setPeriodsInfo(listYearsInfo);
      } else {
        setErrorMsg('لا يمكن تحميل البيانات المطلوبة، يرجى مخاطبة مدير النظام');
      }
    },
    []
  );

  useEffect(() => {
    getData(
      filters.year,
      filters.period,
      filters.month,
      filters.customerTypeId,
      filters.itemCatId,
      filters.mcId,
      filters.branchId,
      filters.text
    );
  }, []);

  // const [dashMain, setDashMain] = useState<IDashSales>([]);
  // useEffect(() => {
  //   if (dashY && dashY!.dsperiodInfo) {
  //     handleperiodInfo();
  //   }
  // }, [dashY]);

  // useEffect(() => {
  //   getData(filters.year, filters.mcId, filters.branchId);
  // }, []]);

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

  function handleChangeText(event: React.ChangeEvent<HTMLInputElement>) {
    console.log((event.target as HTMLInputElement).value);
    handleFiltersText('text', (event.target as HTMLInputElement).value);
  }

  function handleChangeYear(event: SelectChangeEvent) {
    handleFilters('year', Number(event.target.value));
  }

  function handleChangePeriod(event: SelectChangeEvent) {
    handleFilters('period', Number(event.target.value));
  }

  function handleChangeMonth(event: SelectChangeEvent) {
    handleFilters('month', Number(event.target.value));
  }

  function handleChangeCompany(event: SelectChangeEvent) {
    handleFilters('mcId', Number(event.target.value));
    handleFilters('branchId', 0);
  }
  function handleChangeBranch(event: SelectChangeEvent) {
    handleFilters('branchId', Number(event.target.value));
  }
  function handleChangeItemCat(event: SelectChangeEvent) {
    handleFilters('itemCatId', Number(event.target.value));
  }

  function handleChangeCustomerType(event: SelectChangeEvent) {
    handleFilters('customerTypeId', Number(event.target.value));
  }

  function handleOnClick() {
    getData(
      filters.year,
      filters.period,
      filters.month,
      filters.customerTypeId,
      filters.itemCatId,
      filters.mcId,
      filters.branchId,
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
  function getYearList(objList: companyYearTotalQtys[]) {
    console.log('objList: ', objList);
    let years: string[] = [];
    objList.map((item) => {
      years.push(item.year);
    });
    console.log('years: ', years);
    return years;
  }
  // if (error) return;
  // <>
  //   {error}
  //   <div>هناك خطأ في تحميل البيانات. تم إبلاغ مدير النظام</div>;
  // </>;

  let companiesLabels = ['الشركة الأولى', 'الشركة العربية', 'الشركة الحديثة', 'الشركة الرابعة'];

  const itemCats = [
    { id: 101, name: 'دقيق فاخر' },
    { id: 102, name: 'دقيق مخابز' },
    { id: 104, name: 'دقيق بر' },
    { id: 106, name: 'طحين الحبة الكاملة' },
    { id: 400, name: 'عبوات منزلية' },
    { id: 500, name: 'مشتقات قمح' },
    { id: 12, name: 'أصناف مقيدة' },
    { id: 99, name: 'بدون مشتقات القمح' },
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
    <Grid container spacing={SPACING} disableEqualOverflow>
      <Grid xs={12} md={4} hidden>
        <BookingTotalIncomes
          title="المبيعات بالطن خلال الفترة"
          total={18765}
          percent={2.6}
          chart={{
            series: [
              { x: 1, y: 111 },
              { x: 2, y: 136 },
              { x: 3, y: 76 },
              { x: 4, y: 108 },
              { x: 5, y: 74 },
              { x: 6, y: 54 },
              { x: 7, y: 57 },
              { x: 8, y: 84 },
            ],
          }}
        />
      </Grid>
      <Grid xs={12} md={4}>
        <BookingWidgetSummary
          // sx={{ backgroundColor: '#009688', color: '#fff' }}
          title={
            'اجمالي المبيعات بالطن' +
            ' ' +
            (periodsInfo && periodsInfo.length > 0 && periodsInfo![0].maxMonthDesc)
          }
          total={periodsInfo ? periodsInfo[0]!.smTotalWeightInTons! : 0}
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
              <DateRangeIcon sx={{ fontSize: 70 }} />
            </Box>
          }
        />
      </Grid>
      {periodsInfo && periodsInfo.length > 1 && (
        <>
          <Grid xs={12} md={4}>
            <BookingWidgetSummary
              // sx={{ backgroundColor: '#009688', color: '#fff' }}
              title={t(
                filters.year === 2024
                  ? 'اجمالي مبيعات الفترة من العام السابق بالطن'
                  : 'اجمالي مبيعات العام السابق بالطن'
              )}
              total={periodsInfo ? periodsInfo[1]!.smTotalWeightInTons! : 0}
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
                  <DateRangeIcon sx={{ fontSize: 70 }} />
                </Box>
              }
            />
          </Grid>
          <Grid xs={12} md={4}>
            <BookingWidgetSummary
              title={t(
                filters.year === 2024 ? 'نسبة نمو المبيعات للفترة ' : 'نسبة نمو المبيعات السنوية '
              )}
              total={periodsInfo[0]!.growthRate!}
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
                    color: periodsInfo[0]!.growthRate! > 0 ? '#009688d6' : '#FF5722',
                  }}
                >
                  {periodsInfo[0]!.growthRate! > 0 && <TrendingUpIcon sx={{ fontSize: 70 }} />}
                  {periodsInfo[0]!.growthRate! < 0 && <TrendingDownIcon sx={{ fontSize: 70 }} />}
                </Box>
              }
            />
          </Grid>
        </>
      )}

      <Grid xs={12} md={3}>
        <BookingWidgetSummary
          title={t('قيمة المبيعات وفق الفواتير الصادرة (غير شامل الضريبة)')}
          total={periodsInfo ? periodsInfo[0]!.smPrice! : 0}
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
              <img
                src="\assets\images\Saudi_Riyal_Symbol.svg"
                alt="Saudi Riyal"
                style={{ width: 70, height: 70 }}
              />
            </Box>
          }
        />
      </Grid>
      <Grid xs={12} md={3}>
        <BookingWidgetSummary
          title={t('عدد فواتير البيع الصادرة')}
          total={periodsInfo ? periodsInfo[0]!.cntInvoices! : 0}
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
              <GridExpandMoreIcon sx={{ fontSize: 70 }} />
            </Box>
          }
        />
      </Grid>
      <Grid xs={12} md={3}>
        <BookingWidgetSummary
          title={t('عدد منتجات الدقيق النشطة')}
          total={periodsInfo ? periodsInfo[0]!.cntProducts! : 0}
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
              <ImportContacts sx={{ fontSize: 70 }} />
            </Box>
          }
        />
      </Grid>
      <Grid xs={12} md={3}>
        <BookingWidgetSummary
          // sx={{ backgroundColor: '#009688', color: '#fff' }}
          title={t('عدد العملاء')}
          total={periodsInfo ? periodsInfo[0]!.cntCustomers! : 0}
          // total={dashY!.dsperiodInfo![getYearIndex(filters.year)].cntCustomers!}
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
              <WarehouseTwoToneIcon sx={{ fontSize: 70 }} />
            </Box>
          }
        />
      </Grid>

      {periodsInfo && periodsInfo.length > 0 && (
        <Grid xs={12} md={12} lg={12}>
          <YearlySales
            title="المبيعات السنوية وفق الفترة"
            selectedYear={periodsInfo![0].companyYearTotalQtys[0].year}
            chart={{
              categories: periodsInfo![0].companyYearTotalQtys[0].yearList,
              series: periodsInfo![0].companyYearTotalQtys,
            }}
          />
        </Grid>
      )}

      {periodsInfo && periodsInfo.length > 0 && (
        <Grid xs={12} md={12} lg={12}>
          <YearlySales
            title="مبيعات الفترة على أساس شهري"
            selectedYear={periodsInfo![0].year.toString()}
            chart={{
              categories: periodsInfo![0].monthlyLabelList,
              series: [
                {
                  year: periodsInfo![0].year.toString(),
                  data: periodsInfo![0].companyMonthTotalQtys,
                },
              ],
            }}
          />
        </Grid>
      )}
      {/* {periodsInfo && periodsInfo.length > 0 && filters.mcId == 0 && (
        <Grid xs={12} md={12} lg={12}>
          <YearlySales
            title="المبيعات السنوية على أساس شهري"
            selectedYear={periodsInfo![0].year.toString()}
            chart={{
              categories: periodsInfo![0].monthlyLabelList,
              series: [
                {
                  year: periodsInfo![0].year.toString(),
                  data: [
                    {
                      name: 'الشركة الأولى',
                      data: periodsInfo![0].mC1MonthlyDataList,
                    },
                    {
                      name: 'الشركة العربية',
                      data: periodsInfo![0].mC2MonthlyDataList,
                    },
                    {
                      name: 'الشركة الحديثة',
                      data: periodsInfo![0].mC3MonthlyDataList,
                    },
                    {
                      name: 'الشركة الرابعة',
                      data: periodsInfo![0].mC4MonthlyDataList,
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>
      )} */}

      {periodsInfo && periodsInfo.length == 2 && (
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">المقارنة النصفية للمبيعات الإجمالية</Typography>

                <Box display="flex" alignItems="center" ml={2}>
                  <Tooltip title="عرض البيانات">
                    <IconButton onClick={() => setHalfTable((s) => !s)}>
                      <TableChartIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Box mt={2} width="100%">
                <ChartColumnMultiple
                  series={[
                    {
                      name: periodsInfo[0].year.toString(),
                      data: periodsInfo[0].halfDataList,
                      labels: periodsInfo[0].halfLabelList,
                    },
                    {
                      name: periodsInfo[1].year.toString(),
                      data: periodsInfo[1].halfDataList,
                      labels: periodsInfo[1].halfLabelList,
                    },
                  ]}
                />
                {halfTable && (
                  <Box mt={2} width="100%">
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                      <CardContent>
                        <TableContainer component={Paper}>
                          <Table size="small" aria-label="a dense table">
                            <TableHead>
                              <TableRow>
                                <TableCell style={{ textAlign: 'center' }}>البيان</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  {periodsInfo[0].year}
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  {periodsInfo[1].year}
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {periodsInfo[0].halfDataList.map((option, index) => {
                                return (
                                  <TableRow
                                    key={index + 1}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                  >
                                    <TableCell>{periodsInfo[0].halfLabelList[index]}</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                      <b>{fShortenNumber2(periodsInfo[0].halfDataList[index])}</b>
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                      <b>{fShortenNumber2(periodsInfo[1].halfDataList[index])}</b>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                            <TableFooter>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>الإجمالي</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <b>{getDataListTotal(periodsInfo[0].halfDataList)}</b>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <b>{getDataListTotal(periodsInfo[1].halfDataList)}</b>
                                </TableCell>
                              </TableRow>
                            </TableFooter>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Collapse>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}
      {periodsInfo && periodsInfo.length > 2 && (
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">المقارنة النصفية للمبيعات الإجمالية</Typography>
                <Box display="flex" alignItems="center" ml={2}>
                  <Tooltip title="عرض البيانات">
                    <IconButton onClick={() => setHalfTable((s) => !s)}>
                      <TableChartIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Box mt={2} width="100%">
                <ChartColumnMultiple
                  series={[
                    {
                      name: periodsInfo[0].year.toString(),
                      data: periodsInfo[0].halfDataList,
                      labels: periodsInfo[0].halfLabelList,
                    },
                    {
                      name: periodsInfo[1].year.toString(),
                      data: periodsInfo[1].halfDataList,
                      labels: periodsInfo[1].halfLabelList,
                    },
                    {
                      name: periodsInfo[2].year.toString(),
                      data: periodsInfo[2].halfDataList,
                      labels: periodsInfo[2].halfLabelList,
                    },
                  ]}
                />
                {halfTable && (
                  <Box mt={2} width="100%">
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                      <CardContent>
                        <TableContainer component={Paper}>
                          <Table size="small" aria-label="a dense table">
                            <TableHead>
                              <TableRow>
                                <TableCell style={{ textAlign: 'center' }}>البيان</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  {periodsInfo[0].year}
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  {periodsInfo[1].year}
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  {periodsInfo[2].year}
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {periodsInfo[0].halfDataList.map((option, index) => {
                                return (
                                  <TableRow
                                    key={index + 1}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                  >
                                    <TableCell>{periodsInfo[0].halfLabelList[index]}</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                      <b>{fShortenNumber2(periodsInfo[0].halfDataList[index])}</b>
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                      <b>{fShortenNumber2(periodsInfo[1].halfDataList[index])}</b>
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                      <b>{fShortenNumber2(periodsInfo[2].halfDataList[index])}</b>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                            <TableFooter>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>الإجمالي</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <b>{getDataListTotal(periodsInfo[0].halfDataList)}</b>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <b>{getDataListTotal(periodsInfo[1].halfDataList)}</b>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <b>{getDataListTotal(periodsInfo[2].halfDataList)}</b>
                                </TableCell>
                              </TableRow>
                            </TableFooter>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Collapse>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}

      {periodsInfo && periodsInfo.length == 2 && (
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">المقارنة الربعية للمبيعات الإجمالية</Typography>

                <Box display="flex" alignItems="center" ml={2}>
                  <Tooltip title="عرض البيانات">
                    <IconButton onClick={() => setQuarterTable((s) => !s)}>
                      <TableChartIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Box mt={2} width="100%">
                <ChartColumnMultiple
                  series={[
                    {
                      name: periodsInfo[0].year.toString(),
                      data: periodsInfo[0].quarterDataList,
                      labels: periodsInfo[0].quarterLabelList,
                    },
                    {
                      name: periodsInfo[1].year.toString(),
                      data: periodsInfo[1].quarterDataList,
                      labels: periodsInfo[1].quarterLabelList,
                    },
                  ]}
                />
                {quarterTable && (
                  <Box mt={2} width="100%">
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                      <CardContent>
                        <TableContainer component={Paper}>
                          <Table size="small" aria-label="a dense table">
                            <TableHead>
                              <TableRow>
                                <TableCell style={{ textAlign: 'center' }}>البيان</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  {periodsInfo[0].year}
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  {periodsInfo[1].year}
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {periodsInfo[0].quarterDataList.map((option, index) => {
                                return (
                                  <TableRow
                                    key={index + 1}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                  >
                                    <TableCell>{periodsInfo[0].quarterLabelList[index]}</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                      <b>
                                        {fShortenNumber2(periodsInfo[0].quarterDataList[index])}
                                      </b>
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                      <b>
                                        {fShortenNumber2(periodsInfo[1].quarterDataList[index])}
                                      </b>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                            <TableFooter>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>الإجمالي</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <b>{getDataListTotal(periodsInfo[0].quarterDataList)}</b>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <b>{getDataListTotal(periodsInfo[1].quarterDataList)}</b>
                                </TableCell>
                              </TableRow>
                            </TableFooter>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Collapse>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}

      {periodsInfo && periodsInfo.length > 2 && (
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">المقارنة الربعية للمبيعات الإجمالية</Typography>

                <Box display="flex" alignItems="center" ml={2}>
                  <Tooltip title="عرض البيانات">
                    <IconButton onClick={() => setQuarterTable((s) => !s)}>
                      <TableChartIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Box mt={2} width="100%">
                <ChartColumnMultiple
                  series={[
                    {
                      name: periodsInfo[0].year.toString(),
                      data: periodsInfo[0].quarterDataList,
                      labels: periodsInfo[0].quarterLabelList,
                    },
                    {
                      name: periodsInfo[1].year.toString(),
                      data: periodsInfo[1].quarterDataList,
                      labels: periodsInfo[1].quarterLabelList,
                    },
                    {
                      name: periodsInfo[2].year.toString(),
                      data: periodsInfo[2].quarterDataList,
                      labels: periodsInfo[2].quarterLabelList,
                    },
                  ]}
                />
                {quarterTable && (
                  <Box mt={2} width="100%">
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                      <CardContent>
                        <TableContainer component={Paper}>
                          <Table size="small" aria-label="a dense table">
                            <TableHead>
                              <TableRow>
                                <TableCell style={{ textAlign: 'center' }}>البيان</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  {periodsInfo[0].year}
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  {periodsInfo[1].year}
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  {periodsInfo[2].year}
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {periodsInfo[0].quarterDataList.map((option, index) => {
                                return (
                                  <TableRow
                                    key={index + 1}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                  >
                                    <TableCell>{periodsInfo[0].quarterLabelList[index]}</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                      <b>
                                        {fShortenNumber2(periodsInfo[0].quarterDataList[index])}
                                      </b>
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                      <b>
                                        {fShortenNumber2(periodsInfo[1].quarterDataList[index])}
                                      </b>
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                      <b>
                                        {fShortenNumber2(periodsInfo[2].quarterDataList[index])}
                                      </b>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                            <TableFooter>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>الإجمالي</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <b>{getDataListTotal(periodsInfo[0].quarterDataList)}</b>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <b>{getDataListTotal(periodsInfo[1].quarterDataList)}</b>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <b>{getDataListTotal(periodsInfo[2].quarterDataList)}</b>
                                </TableCell>
                              </TableRow>
                            </TableFooter>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Collapse>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}

      {periodsInfo && periodsInfo.length == 2 && (
        <Grid xs={12} md={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">المقارنة الشهرية وفق الفترة</Typography>
                <Box display="flex" alignItems="center" ml={2}>
                  <Tooltip title="عرض البيانات">
                    <IconButton onClick={() => setMonthlyTable((s) => !s)}>
                      <TableChartIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Box mt={2} width="100%">
                <ChartColumnMultiple
                  series={[
                    {
                      name: periodsInfo[0].year.toString(),
                      data: periodsInfo[0].monthlyDataList,
                      labels: periodsInfo[0].monthlyLabelList,
                    },
                    {
                      name: periodsInfo[1].year.toString(),
                      data: periodsInfo[1].monthlyDataList,
                      labels: periodsInfo[1].monthlyLabelList,
                    },
                  ]}
                />
                {monthlyTable && (
                  <Box mt={2} width="100%">
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                      <CardContent>
                        <TableContainer component={Paper}>
                          <Table size="small" aria-label="a dense table">
                            <TableHead>
                              <TableRow>
                                <TableCell style={{ textAlign: 'center' }}>البيان</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  {periodsInfo[0].year}
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  {periodsInfo[1].year}
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {periodsInfo[0].monthlyDataList.map((option, index) => {
                                return (
                                  <TableRow
                                    key={index + 1}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                  >
                                    <TableCell>{periodsInfo[0].monthlyLabelList[index]}</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                      <b>
                                        {fShortenNumber2(periodsInfo[0].monthlyDataList[index])}
                                      </b>
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                      <b>
                                        {fShortenNumber2(periodsInfo[1].monthlyDataList[index])}
                                      </b>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                            <TableFooter>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>الإجمالي</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <b>{getDataListTotal(periodsInfo[0].monthlyDataList)}</b>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <b>{getDataListTotal(periodsInfo[1].monthlyDataList)}</b>
                                </TableCell>
                              </TableRow>
                            </TableFooter>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Collapse>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}
      {periodsInfo && periodsInfo.length > 2 && (
        <Grid xs={12} md={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">المقارنة الشهرية للمبيعات الإجمالية</Typography>
                <Box display="flex" alignItems="center" ml={2}>
                  <Tooltip title="عرض البيانات">
                    <IconButton onClick={() => setMonthlyTable((s) => !s)}>
                      <TableChartIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Box mt={2} width="100%">
                <ChartColumnMultiple
                  series={[
                    {
                      name: periodsInfo[0].year.toString(),
                      data: periodsInfo[0].monthlyDataList,
                      labels: periodsInfo[0].monthlyLabelList,
                    },
                    {
                      name: periodsInfo[1].year.toString(),
                      data: periodsInfo[1].monthlyDataList,
                      labels: periodsInfo[1].monthlyLabelList,
                    },
                    {
                      name: periodsInfo[2].year.toString(),
                      data: periodsInfo[2].monthlyDataList,
                      labels: periodsInfo[2].monthlyLabelList,
                    },
                  ]}
                />
                {monthlyTable && (
                  <Box mt={2} width="100%">
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                      <CardContent>
                        <TableContainer component={Paper}>
                          <Table size="small" aria-label="a dense table">
                            <TableHead>
                              <TableRow>
                                <TableCell style={{ textAlign: 'center' }}>البيان</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  {periodsInfo[0].year}
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  {periodsInfo[1].year}
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  {periodsInfo[2].year}
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {periodsInfo[0].monthlyDataList.map((option, index) => {
                                return (
                                  <TableRow
                                    key={index + 1}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                  >
                                    <TableCell>{periodsInfo[0].monthlyLabelList[index]}</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                      <b>
                                        {fShortenNumber2(periodsInfo[0].monthlyDataList[index])}
                                      </b>
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                      <b>
                                        {fShortenNumber2(periodsInfo[1].monthlyDataList[index])}
                                      </b>
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                      <b>
                                        {fShortenNumber2(periodsInfo[2].monthlyDataList[index])}
                                      </b>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                            <TableFooter>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>الإجمالي</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <b>{getDataListTotal(periodsInfo[0].monthlyDataList)}</b>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <b>{getDataListTotal(periodsInfo[1].monthlyDataList)}</b>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <b>{getDataListTotal(periodsInfo[2].monthlyDataList)}</b>
                                </TableCell>
                              </TableRow>
                            </TableFooter>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Collapse>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}

      {periodsInfo && periodsInfo.length > 0 && (
        <Grid xs={12} md={6} lg={6}>
          <AnalyticsConversionRates
            title={'مبيعات المنتجات الرئيسية وفق الفترة' + '/ ' + periodsInfo![0].year}
            chart={{
              series: periodsInfo![0].itemsQty,
            }}
          />
        </Grid>
      )}
      {periodsInfo && periodsInfo.length > 1 && (
        <Grid xs={12} md={6} lg={6}>
          <AnalyticsConversionRates
            title={'مبيعات المنتجات الرئيسية وفق الفترة' + '/ ' + periodsInfo![1].year}
            chart={{
              series: periodsInfo![1].itemsQty,
            }}
          />
        </Grid>
      )}

      {periodsInfo && periodsInfo.length > 0 && (
        <Grid xs={12} md={6} lg={6}>
          <AnalyticsCurrentVisits
            title={
              'مبيعات الأنشطة الرئيسية للعملاء المباشرين وفق الفترة' + '/ ' + periodsInfo![0].year
            }
            chart={{
              series: periodsInfo![0].activitiesQty,
            }}
          />
        </Grid>
      )}
      {periodsInfo && periodsInfo.length > 1 && (
        <Grid xs={12} md={6} lg={6}>
          <AnalyticsCurrentVisits
            title={
              'مبيعات الأنشطة الرئيسية للعملاء المباشرين وفق الفترة' + '/ ' + periodsInfo![1].year
            }
            chart={{
              series: periodsInfo![1].activitiesQty,
            }}
          />
        </Grid>
      )}

      {!isDashPFSales && periodsInfo && periodsInfo.length > 0 && (
        <Grid xs={12} md={12} lg={filters.year != 0 && filters.year != 2017 ? 12 : 12}>
          <YSalesOverview
            title={
              'كبار العملاء من المباشرين وفق الفترة' + (filters.year > 0 ? '/ ' + filters.year : '')
            }
            data={periodsInfo![0].top10!}
            total={periodsInfo ? periodsInfo[0]!.smTotalWeightInTons! : 0}
          />
        </Grid>
      )}
      {/* {periodsInfo && periodsInfo.length > 1 && (
        <Grid xs={12} md={6} lg={6}>
          <YSalesOverview
            title={'كبار العملاء من المباشرين وفق الفترة/ ' + (filters.year - 1)}
            data={periodsInfo[1].top10!}
            total={periodsInfo ? periodsInfo[1]!.smTotalWeightInTons! : 0}
          />
        </Grid>
      )} */}

      {/* {periodsInfo && periodsInfo.length > 0 && (
        <Grid xs={12} md={6} lg={filters.year != 0 && filters.year != 2017 ? 6 : 12}>
          <YSalesOverview
            title={
              'كبار العملاء من الموزعين وفق الفترة' + (filters.year > 0 ? '/ ' + filters.year : '')
            }
            data={periodsInfo![0].top10U!}
            total={periodsInfo ? periodsInfo[0]!.smTotalWeightInTons! : 0}
          />
        </Grid>
      )}
      {periodsInfo && periodsInfo.length > 1 && (
        <Grid xs={12} md={6} lg={6}>
          <YSalesOverview
            title={'كبار العملاء من الموزعين وفق الفترة/ ' + (filters.year - 1)}
            data={periodsInfo[1].top10U!}
            total={periodsInfo ? periodsInfo[1]!.smTotalWeightInTons! : 0}
          />
        </Grid>
      )} */}
    </Grid>
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
                marginBottom: 4,
                marginTop: -3,
                padding: '5px 25px',
                color: 'GrayText',
                marginRight: '-45px',
                marginLeft: '-45px',
              }}
            >
              <Box sx={{ width: 1 }}>
                <Typography variant="h5" component="h2">
                  مبيعات الدقيق بشركات المطاحن
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Grid container spacing={1}>
                    <Grid xs={12} sm={3}>
                      <FormControl
                        sx={{
                          flexShrink: 0,
                        }}
                        fullWidth
                      >
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
                    <Grid xs={12} sm={3}>
                      <FormControl
                        sx={{
                          flexShrink: 0,
                        }}
                        fullWidth
                      >
                        <InputLabel>الفترة</InputLabel>
                        <Select
                          value={filters.period.toString()}
                          onChange={(e: any) => handleChangePeriod(e)}
                          input={<OutlinedInput label="الفترة" />}
                          sx={{ textTransform: 'capitalize' }}
                        >
                          <MenuItem key={0} value={0}>
                            الكل
                          </MenuItem>
                          {TIME_LABELS.period.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    {filters.period !== 0 && (
                      <Grid xs={12} sm={3}>
                        <FormControl
                          sx={{
                            flexShrink: 0,
                          }}
                          fullWidth
                        >
                          <InputLabel>الشهر</InputLabel>
                          <Select
                            value={filters.month.toString()}
                            onChange={(e: any) => handleChangeMonth(e)}
                            input={<OutlinedInput label="الشهر" />}
                            sx={{ textTransform: 'capitalize' }}
                          >
                            <MenuItem key={0} value={0}>
                              الكل
                            </MenuItem>
                            {TIME_LABELS.month
                              .filter(
                                (item) =>
                                  +item.half == filters.period || +item.quarter == filters.period
                              )
                              .map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                  {option.name}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    )}

                    <Grid xs={12} sm={3}>
                      <FormControl
                        sx={{
                          flexShrink: 0,
                        }}
                        fullWidth
                      >
                        <InputLabel>شركة المطاحن</InputLabel>
                        <Select
                          value={filters.mcId.toString()}
                          onChange={(e: any) => handleChangeCompany(e)}
                          input={<OutlinedInput label="شركة المطاحن" />}
                          sx={{ textTransform: 'capitalize' }}
                        >
                          <MenuItem key={0} value={0}>
                            الكل
                          </MenuItem>
                          {companiesLabels.map((option, index) => (
                            <MenuItem key={index + 1} value={index + 1}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    {filters.mcId !== 0 && (
                      <Grid xs={12} sm={3}>
                        <FormControl
                          sx={{
                            flexShrink: 0,
                          }}
                          fullWidth
                        >
                          <InputLabel>الفرع</InputLabel>
                          <Select
                            value={filters.branchId.toString()}
                            onChange={(e: any) => handleChangeBranch(e)}
                            input={<OutlinedInput label="الفرع" />}
                            sx={{ textTransform: 'capitalize' }}
                          >
                            <MenuItem key={0} value={0}>
                              الكل
                            </MenuItem>
                            {filters.mcId === 1 && (
                              <MenuItem key={14} value={14}>
                                فرع جدة
                              </MenuItem>
                            )}
                            {filters.mcId === 1 && (
                              <MenuItem key={15} value={15}>
                                فرع القصيم
                              </MenuItem>
                            )}
                            {filters.mcId === 1 && (
                              <MenuItem key={19} value={19}>
                                فرع تبوك
                              </MenuItem>
                            )}
                            {filters.mcId === 1 && (
                              <MenuItem key={25} value={25}>
                                فرع الإحساء
                              </MenuItem>
                            )}
                            {filters.mcId === 2 && (
                              <MenuItem key={12} value={12}>
                                فرع الرياض
                              </MenuItem>
                            )}
                            {filters.mcId === 2 && (
                              <MenuItem key={20} value={20}>
                                فرع حائل
                              </MenuItem>
                            )}
                            {filters.mcId === 2 && (
                              <MenuItem key={24} value={24}>
                                فرع جازان
                              </MenuItem>
                            )}
                            {filters.mcId === 3 && (
                              <MenuItem key={16} value={16}>
                                فرع خميس مشيط
                              </MenuItem>
                            )}
                            {filters.mcId === 3 && (
                              <MenuItem key={18} value={18}>
                                فرع الجوف
                              </MenuItem>
                            )}
                            {filters.mcId === 3 && (
                              <MenuItem key={23} value={23}>
                                فرع الجموم
                              </MenuItem>
                            )}
                            {filters.mcId === 4 && (
                              <MenuItem key={13} value={13}>
                                فرع الدمام
                              </MenuItem>
                            )}
                            {filters.mcId === 4 && (
                              <MenuItem key={17} value={17}>
                                فرع الخرج
                              </MenuItem>
                            )}
                            {filters.mcId === 4 && (
                              <MenuItem key={22} value={22}>
                                فرع المدينة المنورة
                              </MenuItem>
                            )}
                          </Select>
                        </FormControl>
                      </Grid>
                    )}
                    <Grid xs={12} sm={3}>
                      <FormControl
                        sx={{
                          flexShrink: 0,
                        }}
                        fullWidth
                      >
                        <InputLabel>فئة العميل</InputLabel>
                        <Select
                          value={filters.customerTypeId.toString()}
                          onChange={(e: any) => handleChangeCustomerType(e)}
                          input={<OutlinedInput label="فئة العميل" />}
                          sx={{ textTransform: 'capitalize' }}
                        >
                          <MenuItem key={0} value={0}>
                            الكل
                          </MenuItem>
                          <MenuItem key={1} value={1}>
                            مباشرين
                          </MenuItem>
                          <MenuItem key={2} value={2}>
                            موزعين
                          </MenuItem>
                          <MenuItem key={3} value={3}>
                            متعددين
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid xs={12} sm={3}>
                      <FormControl
                        sx={{
                          flexShrink: 0,
                        }}
                        fullWidth
                      >
                        <InputLabel>فئة الصنف</InputLabel>
                        <Select
                          value={filters.itemCatId.toString()}
                          onChange={(e: any) => handleChangeItemCat(e)}
                          input={<OutlinedInput label="فئة الصنف" />}
                          sx={{ textTransform: 'capitalize' }}
                        >
                          <MenuItem key={0} value={0}>
                            الكل
                          </MenuItem>
                          {itemCats.map((item, index) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    {!isDashPFSales && (
                      <Grid xs={12} sm={3}>
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
                    )}

                    <Grid xs={12} sm={3}>
                      <FormControl
                        sx={{
                          flexShrink: 0,
                          width: { xs: 1, md: 50 },
                        }}
                      >
                        <div ref={btnPrintingRef}>
                          {!isPrinting && (
                            <>
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
                                <Tooltip title="طباعة">
                                  <IconButton onClick={printPDF} sx={{ fontSize: '1.5rem' }}>
                                    <Iconify icon="solar:printer-minimalistic-bold" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </>
                          )}
                        </div>
                      </FormControl>
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
            {isLoading ? renderLoading : periodsInfo && periodsInfo.length > 0 && renderDash}
          </Box>
        </Container>
      </div>
    </>
  );
}
