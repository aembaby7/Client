'use client';
import useSWR from 'swr';
import { fetcher, endpoints } from 'src/utils/axios';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { _bookings, _bookingNew, _bookingReview, _bookingsOverview } from 'src/_mock';

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
  CardActions,
  Collapse,
  IconButtonProps,
  ListItemIcon,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
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
import { useCallback, useRef, useState } from 'react';
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
import { ImportContacts, ImportContactsOutlined } from '@mui/icons-material';
import { DateRangeIcon } from '@mui/x-date-pickers';
import FileDataActivity from '../file-data-activity';
import { SelectChangeEvent } from '@mui/material/Select';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import CategoryIcon from '@mui/icons-material/Category';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const SPACING = 3;
interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}
const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
}));

const TIME_LABELS = {
  week: ['Mon', 'Tue', 'Web', 'Thu', 'Fri', 'Sat', 'Sun'],
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  year: ['2017', '2018', '2019', '2020', '2021', '2022', '2023', 'النصف الأول 2024'],
};

type dsYearMonthInfo = {
  year: number;
  month: number;
  cntCustomers: number;
  smtotalWeightInTons: number;
  smPrice: number;
  cntProductId: number;
  cntInvoices: number;
};
export default function SalesYDashboardViewAA() {
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
  const [expanded, setExpanded] = useState(false);
  const [yearIndex, setYearIndex] = useState(7);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleChangeYear = useCallback((event: SelectChangeEvent) => {
    setYearIndex(Number(event.target.value));
  }, []);

  const { data, error } = useSWR<DashboardSalesAdminResponse>(
    endpoints.dashSales.getMainDashboard,
    fetcher,
    {
      revalidateIfStale: false,
      // revalidateOnFocus: false,
      // revalidateOnReconnect: false
      refreshInterval: 300000,
    }
  ); //on stale
  // Infer loading state
  const isLoading = !data && !error;
  console.log('data111', data);
  if (isLoading) return <div>جاري تحميل البيانات...</div>;
  if (error) return;
  <>
    {error}
    <div>هناط خطأ في تحميل البيانات. تم إبلاغ مدير النظام</div>;
  </>;
  let labels = ['الرياض', 'القصيم', 'الخرج', 'الجوف', 'تبوك', 'حائل', 'وادي الدواسر', 'الأحساء'];
  let peiodLabels = ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'];
  let peiodHLabels = ['النصف الأول', 'النصف الثاني'];
  let monthLabels = [
    'يناير',
    'فبراير',
    'مارس',
    'ابريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'اكتوبر',
    'نوفمبر',
    'ديسمبر',
  ];
  let companiesLabels = ['الأولى', 'العربية', 'الحديثة', 'الرابعة'];
  let branchesLabels = [
    'الرياض',
    'الدمام',
    'جدة',
    'القصيم',
    'خميس مشيط',
    'الخرج',
    'الجوف',
    'تبوك',
    'حائل',
    'المدينة المنورة',
    'الجموم',
    'جازان',
    'الإحساء',
  ];
  let productLabels = [
    'فاخر 70%',
    'مخابز 80%',
    'بر 95%',
    'بر فاخر 95% ',
    'طحين الحبة الكاملة',
    'عبوات منزلية',
  ];
  let ActivitiesLabels = ['مخابز', 'مصانع', 'أخرى'];

  let subtitleText;
  function printPDF(): void {
    btnPrintingRef.current!.style.display = 'none';
    html2canvas(printingAreaRef.current!).then(async (canvas) => {
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('p', 'px', [canvas.width, canvas.height]);
      pdf.addImage(contentDataURL, 'PNG', 0, 0, canvas.width, canvas.height);
      // await new Promise((r) => setTimeout(r, 180000));
      pdf.save('Mahsoli-Dash ' + fDate(new Date(), 'dd-MM-yyyy') + '.pdf');
      // setIsPrinting(false);
    });
    btnPrintingRef.current!.style.display = '';
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  function getRelativeImpactDesc(FYear: number, SYear: number) {
    let diff = SYear - FYear;
    const diffPer = (diff / FYear) * 100;
    const diffPerFormatted = fPercent(diffPer);
    // return fPercent((diff / FYear) * 100);

    return (
      <>
        <Box sx={{ position: 'relative', mr: 2 }}>
          {diffPer > 0 ? '' : diffPerFormatted}
          <span>&nbsp;&nbsp;&nbsp;</span>
          <Badge
            overlap="circular"
            color={diffPer > 0 ? 'success' : 'error'}
            anchorOrigin={{
              vertical: diffPer > 0 ? 'bottom' : 'top',
              horizontal: diffPer > 0 ? 'right' : 'left',
            }}
            badgeContent={
              <Iconify
                icon={
                  diffPer > 0
                    ? 'eva:diagonal-arrow-left-down-fill'
                    : 'eva:diagonal-arrow-right-up-fill'
                }
                width={16}
              />
            }
            sx={{
              [`& .${badgeClasses.badge}`]: {
                p: 0,
                width: 20,
              },
            }}
          ></Badge>
          <span>&nbsp;&nbsp;&nbsp;</span>
          {diffPer > 0 ? diffPerFormatted : ' '}
        </Box>
      </>
    );
  }

  function getRelativeImpact(FYear: number, SYear: number) {
    let diff = SYear - FYear;
    const diffPer = (diff / FYear) * 100;
    const diffPerFormatted = fPercent(diffPer);
    return fPercent((diff / FYear) * 100);
  }
  function getRelativeImpactNumber(FYear: number, SYear: number) {
    let diff = SYear - FYear;
    const diffPer = (diff / FYear) * 100;
    const diffPerFormatted = fPercent(diffPer);
    return (diff / FYear) * 100;
  }
  function getRelativeImpactNumber_(FYear: number, SYear: number) {
    let diff = FYear - SYear;
    const diffPer = (diff / SYear) * 100;
    const diffPerFormatted = fPercent(diffPer);
    return (diff / SYear) * 100;
  }
  function getYearName(year: number) {
    switch (year) {
      case 7:
        return 2024;
      case 6:
        return 2023;
      case 5:
        return 2022;
      case 4:
        return 2021;
      case 3:
        return 2020;
      case 2:
        return 2019;
      case 1:
        return 2018;
      case 0:
        return 2017;
    }
  }
  function filterYearMonth(yearIndex: number, month: number) {
    //rows: dsYearMonthInfo[],
    var found = data?.result.dsYearMonthInfo.filter((r) => {
      return r.year === getYearName(yearIndex) && r.month === month;
    });
    return found?.length === 0 ? 0 : found![0]?.smtotalWeightInTons!;
  }
  let AYStatus = 0;
  let BYStatus = 0;
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
                height: '70px',

                // display: 'flex',
                // justifyContent: 'space-between',
                // alignItems: 'center',
                // marginBottom: 3,
                // marginTop: -3,
                // padding: '5px 25px',
                // height:'70px',
                // color: 'GrayText',
                // marginRight:'-32px',
                // marginLeft:'-32px',
                // borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
              }}
            >
              <Box>
                <Typography variant="h5" component="h2">
                  مبيعات الدقيق بشركات المطاحن للعام <> </>
                  <Select value={yearIndex.toString()} onChange={handleChangeYear}>
                    <MenuItem key={1} value={7}>
                      2024
                    </MenuItem>
                    <MenuItem key={1} value={6}>
                      2023
                    </MenuItem>
                    <MenuItem key={1} value={5}>
                      2022
                    </MenuItem>
                    <MenuItem key={1} value={4}>
                      2021
                    </MenuItem>
                    <MenuItem key={1} value={3}>
                      2020
                    </MenuItem>
                    <MenuItem key={1} value={2}>
                      2019
                    </MenuItem>
                    <MenuItem key={1} value={1}>
                      2018
                    </MenuItem>
                    <MenuItem key={1} value={0}>
                      2017
                    </MenuItem>
                  </Select>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {formattedDate} | {formattedTime}
                </Typography>
              </Box>
              <div ref={btnPrintingRef}>
                {!isPrinting && (
                  <>
                    {/* <Tooltip title={expanded ? 'إخفاء جداول البيانات' : 'عرض جداول البيانات'}>
                      <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                      >
                        <GridExpandMoreIcon />
                      </ExpandMore>
                    </Tooltip> */}
                    <Tooltip title="طباعة">
                      <IconButton onClick={printPDF} sx={{ fontSize: '1.5rem' }}>
                        <Iconify icon="solar:printer-minimalistic-bold" />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </div>
            </Box>
            <Grid container spacing={SPACING} disableEqualOverflow>
              <Grid xs={12} md={4}>
                <BookingWidgetSummary
                  // sx={{ backgroundColor: '#009688', color: '#fff' }}
                  title={t('عدد العملاء (مباشرين/ موزعين)')}
                  total={data?.result.dsYearInfo![yearIndex].cntCustomers!}
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
              <Grid xs={12} md={4}>
                <BookingWidgetSummary
                  // sx={{ backgroundColor: '#009688', color: '#fff' }}
                  title={t('اجمالي المبيعات بالطن')}
                  total={data?.result.dsYearInfo![yearIndex].smtotalWeightInTons!}
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
                      <MonitorWeightIcon sx={{ fontSize: 70 }} />
                    </Box>
                  }
                />
              </Grid>
              <Grid xs={12} md={4}>
                <BookingWidgetSummary
                  title={t('قيمة المبيعات وفق الفواتير الصادرة (غير شامل الضريبة)')}
                  total={data?.result.dsYearInfo![yearIndex].smPrice!}
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
                  title={t('عدد منتجات الدقيق النشطة')}
                  total={data?.result.dsYearInfo![yearIndex].cntProductId!}
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
                      <CategoryIcon sx={{ fontSize: 70 }} />
                    </Box>
                  }
                />
              </Grid>

              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  title={t('عدد فواتير البيع الصادرة')}
                  total={data?.result.dsYearInfo![yearIndex].cntInvoices!}
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
                      <ReceiptIcon sx={{ fontSize: 70 }} />
                    </Box>
                  }
                />
              </Grid>
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  title={t('التغير عن العام السابق')}
                  total={
                    (BYStatus = getRelativeImpactNumber_(
                      filterYearMonth(yearIndex, 1) +
                        filterYearMonth(yearIndex, 2) +
                        filterYearMonth(yearIndex, 3) +
                        filterYearMonth(yearIndex, 4) +
                        filterYearMonth(yearIndex, 5) +
                        filterYearMonth(yearIndex, 6) +
                        filterYearMonth(yearIndex, 7) +
                        filterYearMonth(yearIndex, 8) +
                        filterYearMonth(yearIndex, 9) +
                        filterYearMonth(yearIndex, 10) +
                        filterYearMonth(yearIndex, 11) +
                        filterYearMonth(yearIndex, 12),
                      filterYearMonth(yearIndex - 1, 1) +
                        filterYearMonth(yearIndex - 1, 2) +
                        filterYearMonth(yearIndex - 1, 3) +
                        filterYearMonth(yearIndex - 1, 4) +
                        filterYearMonth(yearIndex - 1, 5) +
                        filterYearMonth(yearIndex - 1, 6) +
                        filterYearMonth(yearIndex - 1, 7) +
                        filterYearMonth(yearIndex - 1, 8) +
                        filterYearMonth(yearIndex - 1, 9) +
                        filterYearMonth(yearIndex - 1, 10) +
                        filterYearMonth(yearIndex - 1, 11) +
                        filterYearMonth(yearIndex - 1, 12)
                    ))
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
                        color: BYStatus > 0 ? '#009688d6' : '#FF5722',
                      }}
                    >
                      {BYStatus > 0 && <TrendingUpIcon sx={{ fontSize: 70 }} />}
                      {BYStatus < 0 && <TrendingDownIcon sx={{ fontSize: 70 }} />}
                    </Box>
                  }
                />
              </Grid>
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  title={t('التغير عن العام التالي')}
                  total={
                    (AYStatus = getRelativeImpactNumber(
                      filterYearMonth(yearIndex, 1) +
                        filterYearMonth(yearIndex, 2) +
                        filterYearMonth(yearIndex, 3) +
                        filterYearMonth(yearIndex, 4) +
                        filterYearMonth(yearIndex, 5) +
                        filterYearMonth(yearIndex, 6) +
                        filterYearMonth(yearIndex, 7) +
                        filterYearMonth(yearIndex, 8) +
                        filterYearMonth(yearIndex, 9) +
                        filterYearMonth(yearIndex, 10) +
                        filterYearMonth(yearIndex, 11) +
                        filterYearMonth(yearIndex, 12),
                      filterYearMonth(yearIndex + 1, 1) +
                        filterYearMonth(yearIndex + 1, 2) +
                        filterYearMonth(yearIndex + 1, 3) +
                        filterYearMonth(yearIndex + 1, 4) +
                        filterYearMonth(yearIndex + 1, 5) +
                        filterYearMonth(yearIndex + 1, 6) +
                        filterYearMonth(yearIndex + 1, 7) +
                        filterYearMonth(yearIndex + 1, 8) +
                        filterYearMonth(yearIndex + 1, 9) +
                        filterYearMonth(yearIndex + 1, 10) +
                        filterYearMonth(yearIndex + 1, 11) +
                        filterYearMonth(yearIndex + 1, 12)
                    ))
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
                        color: BYStatus > 0 ? '#009688d6' : '#FF5722',
                      }}
                    >
                      {BYStatus > 0 && <TrendingUpIcon sx={{ fontSize: 70 }} />}
                      {BYStatus < 0 && <TrendingDownIcon sx={{ fontSize: 70 }} />}
                    </Box>
                  }
                />
              </Grid>
              {yearIndex > 0 && (
                <Grid xs={12} md={12}>
                  <Card>
                    {/* <CardHeader title="المقارنة الشهرية للمبيعات الإجمالية" /> */}
                    <CardHeader
                      title="المقارنة الشهرية للمبيعات الإجمالية"
                      action={
                        <IconButton onClick={handleToggle}>
                          {expanded ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      }
                    />
                    <CardContent>
                      <ChartColumnMultiple
                        series={[
                          {
                            name: getYearName(yearIndex)?.toString()!,
                            data: [
                              filterYearMonth(yearIndex, 1),
                              filterYearMonth(yearIndex, 2),
                              filterYearMonth(yearIndex, 3),
                              filterYearMonth(yearIndex, 4),
                              filterYearMonth(yearIndex, 5),
                              filterYearMonth(yearIndex, 6),
                              filterYearMonth(yearIndex, 7),
                              filterYearMonth(yearIndex, 8),
                              filterYearMonth(yearIndex, 9),
                              filterYearMonth(yearIndex, 10),
                              filterYearMonth(yearIndex, 11),
                              filterYearMonth(yearIndex, 12),
                            ],
                            labels: monthLabels,
                          },
                          {
                            name: getYearName(yearIndex - 1)?.toString()!,
                            data: [
                              filterYearMonth(yearIndex - 1, 1),
                              filterYearMonth(yearIndex - 1, 2),
                              filterYearMonth(yearIndex - 1, 3),
                              filterYearMonth(yearIndex - 1, 4),
                              filterYearMonth(yearIndex - 1, 5),
                              filterYearMonth(yearIndex - 1, 6),
                              filterYearMonth(yearIndex - 1, 7),
                              filterYearMonth(yearIndex - 1, 8),
                              filterYearMonth(yearIndex - 1, 9),
                              filterYearMonth(yearIndex - 1, 10),
                              filterYearMonth(yearIndex - 1, 11),
                              filterYearMonth(yearIndex - 1, 12),
                            ],
                            labels: monthLabels,
                          },
                        ]}
                      />
                    </CardContent>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                      <CardContent>
                        <TableContainer component={Paper}>
                          <Table size="small" aria-label="a dense table">
                            <TableHead>
                              <TableRow>
                                <TableCell style={{ textAlign: 'center' }}>البيان</TableCell>
                                <TableCell style={{ textAlign: 'center' }}> 2023</TableCell>
                                <TableCell style={{ textAlign: 'center' }}> 2024</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>يناير</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <b>
                                    {fShortenNumber2(data?.result.salesTotalPerMonth[0].qtyY2023)}
                                  </b>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <b>
                                    {fShortenNumber2(data?.result.salesTotalPerMonth[0].qtyY2024)}
                                  </b>
                                </TableCell>
                              </TableRow>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>فبراير</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <b>
                                    {fShortenNumber2(data?.result.salesTotalPerMonth[1].qtyY2023)}
                                  </b>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <b>
                                    {fShortenNumber2(data?.result.salesTotalPerMonth[1].qtyY2024)}
                                  </b>
                                </TableCell>
                              </TableRow>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>مارس</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <b>
                                    {fShortenNumber2(data?.result.salesTotalPerMonth[2].qtyY2023)}
                                  </b>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <b>
                                    {fShortenNumber2(data?.result.salesTotalPerMonth[2].qtyY2024)}
                                  </b>
                                </TableCell>
                              </TableRow>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>ابريل</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <b>
                                    {fShortenNumber2(data?.result.salesTotalPerMonth[3].qtyY2023)}
                                  </b>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <b>
                                    {fShortenNumber2(data?.result.salesTotalPerMonth[3].qtyY2024)}
                                  </b>
                                </TableCell>
                              </TableRow>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>مايو</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <b>
                                    {fShortenNumber2(data?.result.salesTotalPerMonth[4].qtyY2023)}
                                  </b>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <b>
                                    {fShortenNumber2(data?.result.salesTotalPerMonth[4].qtyY2024)}
                                  </b>
                                </TableCell>
                              </TableRow>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>يونيو</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <b>
                                    {fShortenNumber2(data?.result.salesTotalPerMonth[5].qtyY2023)}
                                  </b>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <b>
                                    {fShortenNumber2(data?.result.salesTotalPerMonth[5].qtyY2024)}
                                  </b>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                            <TableFooter>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>الإجمالي</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <b>
                                    {fShortenNumber2(
                                      data?.result.salesTotalPerMonth[0].qtyY2023! +
                                        data?.result.salesTotalPerMonth[1].qtyY2023! +
                                        data?.result.salesTotalPerMonth[2].qtyY2023! +
                                        data?.result.salesTotalPerMonth[3].qtyY2023! +
                                        data?.result.salesTotalPerMonth[4].qtyY2023! +
                                        data?.result.salesTotalPerMonth[5].qtyY2023!
                                    )}
                                  </b>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <b>
                                    {fShortenNumber2(
                                      data?.result.salesTotalPerMonth[0].qtyY2024! +
                                        data?.result.salesTotalPerMonth[1].qtyY2024! +
                                        data?.result.salesTotalPerMonth[2].qtyY2024! +
                                        data?.result.salesTotalPerMonth[3].qtyY2024! +
                                        data?.result.salesTotalPerMonth[4].qtyY2024! +
                                        data?.result.salesTotalPerMonth[5].qtyY2024!
                                    )}
                                  </b>
                                </TableCell>
                              </TableRow>
                            </TableFooter>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Collapse>
                  </Card>
                </Grid>
              )}
              {yearIndex > 0 && (
                <Grid xs={12} md={6}>
                  <Card>
                    <CardHeader title="المقارنة الربعية للمبيعات الإجمالية" />
                    <CardContent>
                      <ChartColumnMultiple
                        series={[
                          {
                            name: getYearName(yearIndex)?.toString()!,
                            data: [
                              filterYearMonth(yearIndex, 1) +
                                filterYearMonth(yearIndex, 2) +
                                filterYearMonth(yearIndex, 3),
                              filterYearMonth(yearIndex, 4) +
                                filterYearMonth(yearIndex, 5) +
                                filterYearMonth(yearIndex, 6),
                              filterYearMonth(yearIndex, 7) +
                                filterYearMonth(yearIndex, 8) +
                                filterYearMonth(yearIndex, 9),
                              filterYearMonth(yearIndex, 10) +
                                filterYearMonth(yearIndex, 11) +
                                filterYearMonth(yearIndex, 12),
                            ],
                            labels: peiodLabels,
                          },
                          {
                            name: getYearName(yearIndex - 1)?.toString()!,
                            data: [
                              filterYearMonth(yearIndex - 1, 1) +
                                filterYearMonth(yearIndex - 1, 2) +
                                filterYearMonth(yearIndex - 1, 3),
                              filterYearMonth(yearIndex - 1, 4) +
                                filterYearMonth(yearIndex - 1, 5) +
                                filterYearMonth(yearIndex - 1, 6),
                              filterYearMonth(yearIndex - 1, 7) +
                                filterYearMonth(yearIndex - 1, 8) +
                                filterYearMonth(yearIndex - 1, 9),
                              filterYearMonth(yearIndex - 1, 10) +
                                filterYearMonth(yearIndex - 1, 11) +
                                filterYearMonth(yearIndex - 1, 12),
                            ],
                            labels: peiodLabels,
                          },
                        ]}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {yearIndex > 0 && (
                <Grid xs={12} md={6}>
                  <Card>
                    <CardHeader title="المقارنة النصفية للمبيعات الإجمالية" />
                    <CardContent>
                      <ChartColumnMultiple
                        series={[
                          {
                            name: getYearName(yearIndex)?.toString()!,
                            data: [
                              filterYearMonth(yearIndex, 1) +
                                filterYearMonth(yearIndex, 2) +
                                filterYearMonth(yearIndex, 3) +
                                filterYearMonth(yearIndex, 4) +
                                filterYearMonth(yearIndex, 5) +
                                filterYearMonth(yearIndex, 6),
                              filterYearMonth(yearIndex, 7) +
                                filterYearMonth(yearIndex, 8) +
                                filterYearMonth(yearIndex, 9) +
                                filterYearMonth(yearIndex, 10) +
                                filterYearMonth(yearIndex, 11) +
                                filterYearMonth(yearIndex, 12),
                            ],
                            labels: peiodHLabels,
                          },
                          {
                            name: getYearName(yearIndex - 1)?.toString()!,
                            data: [
                              filterYearMonth(yearIndex - 1, 1) +
                                filterYearMonth(yearIndex - 1, 2) +
                                filterYearMonth(yearIndex - 1, 3) +
                                filterYearMonth(yearIndex - 1, 4) +
                                filterYearMonth(yearIndex - 1, 5) +
                                filterYearMonth(yearIndex - 1, 6),
                              filterYearMonth(yearIndex - 1, 7) +
                                filterYearMonth(yearIndex - 1, 8) +
                                filterYearMonth(yearIndex - 1, 9) +
                                filterYearMonth(yearIndex - 1, 10) +
                                filterYearMonth(yearIndex - 1, 11) +
                                filterYearMonth(yearIndex - 1, 12),
                            ],
                            labels: peiodHLabels,
                          },
                        ]}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* <Grid xs={12} md={6}>
                <Card>
                  <CardHeader title="احصائي مبيعات المنتجات الرئيسية وفق الفترة" />
                  <CardContent>
                    <ChartColumnMultiple
                      series={[
                        {
                          name: 'النصف الأول 2024',
                          data: [
                            data?.result.salesTotalPerProductTypeYear[0].qtyY2024!,
                            data?.result.salesTotalPerProductTypeYear[1].qtyY2024!,
                            data?.result.salesTotalPerProductTypeYear[2].qtyY2024!,
                            data?.result.salesTotalPerProductTypeYear[3].qtyY2024!,
                            data?.result.salesTotalPerProductTypeYear[4].qtyY2024!,
                            data?.result.salesTotalPerProductTypeYear[5].qtyY2024!,
                          ],
                          labels: productLabels,
                        },
                        {
                          name: 'النصف الأول 2023',
                          data: [
                            data?.result.salesTotalPerProductTypeYear[0].qtyY2023!,
                            data?.result.salesTotalPerProductTypeYear[1].qtyY2023!,
                            data?.result.salesTotalPerProductTypeYear[2].qtyY2023!,
                            data?.result.salesTotalPerProductTypeYear[3].qtyY2023!,
                            data?.result.salesTotalPerProductTypeYear[4].qtyY2023!,
                            data?.result.salesTotalPerProductTypeYear[5].qtyY2023! + 3000,
                          ],
                          labels: productLabels,
                        },
                      ]}
                    />
                  </CardContent>
                  <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                      <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
                          <TableHead>
                            <TableRow>
                              <TableCell style={{ textAlign: 'center' }}>البيان</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                النصف الأول 2023
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                النصف الأول 2024
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>{productLabels[0]}</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesTotalPerProductTypeYear[0].qtyY2023
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesTotalPerProductTypeYear[0].qtyY2024
                                  )}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>{productLabels[1]}</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesTotalPerProductTypeYear[1].qtyY2023
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesTotalPerProductTypeYear[1].qtyY2024
                                  )}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>{productLabels[2]}</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesTotalPerProductTypeYear[2].qtyY2023
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesTotalPerProductTypeYear[2].qtyY2024
                                  )}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>{productLabels[3]}</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesTotalPerProductTypeYear[3].qtyY2023
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesTotalPerProductTypeYear[3].qtyY2024
                                  )}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>{productLabels[4]}</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesTotalPerProductTypeYear[4].qtyY2023
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesTotalPerProductTypeYear[4].qtyY2024
                                  )}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>{productLabels[5]}</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesTotalPerProductTypeYear[5].qtyY2023! + 3000
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesTotalPerProductTypeYear[5].qtyY2024
                                  )}
                                </b>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                          <TableFooter>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>الإجمالي</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesTotalPerProductTypeYear[0].qtyY2023! +
                                      data?.result.salesTotalPerProductTypeYear[1].qtyY2023! +
                                      data?.result.salesTotalPerProductTypeYear[2].qtyY2023! +
                                      data?.result.salesTotalPerProductTypeYear[3].qtyY2023! +
                                      data?.result.salesTotalPerProductTypeYear[4].qtyY2023! +
                                      data?.result.salesTotalPerProductTypeYear[5].qtyY2023! +
                                      3000
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesTotalPerProductTypeYear[0].qtyY2024! +
                                      data?.result.salesTotalPerProductTypeYear[1].qtyY2024! +
                                      data?.result.salesTotalPerProductTypeYear[2].qtyY2024! +
                                      data?.result.salesTotalPerProductTypeYear[3].qtyY2024! +
                                      data?.result.salesTotalPerProductTypeYear[4].qtyY2024! +
                                      data?.result.salesTotalPerProductTypeYear[5].qtyY2024!
                                  )}
                                </b>
                              </TableCell>
                            </TableRow>
                          </TableFooter>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Collapse>
                </Card>
              </Grid>

              <Grid xs={12} md={6}>
                <Card>
                  <CardHeader title="احصائي المبيعات الإجمالية حسب المنتجات " />
                  <CardContent
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AppsPie
                      series={[
                        data?.result.salesTotalPerProductType[0].qty!,
                        data?.result.salesTotalPerProductType[1].qty!,
                        data?.result.salesTotalPerProductType[2].qty!,
                        data?.result.salesTotalPerProductType[3].qty!,
                        data?.result.salesTotalPerProductType[4].qty!,
                        data?.result.salesTotalPerProductType[5].qty!,
                      ]}
                      labels={productLabels}
                    />
                  </CardContent>
                  <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                      <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
                          <TableHead>
                            <TableRow>
                              <TableCell style={{ textAlign: 'center' }}>البيان</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>المبيعات بالطن</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>{productLabels[0]}</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerProductType[0].qty)}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>{productLabels[1]}</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerProductType[1].qty)}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>{productLabels[2]}</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerProductType[2].qty)}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>{productLabels[3]}</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerProductType[3].qty)}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>{productLabels[4]}</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerProductType[4].qty)}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>{productLabels[5]}</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerProductType[5].qty)}
                                </b>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                          <TableFooter>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>الإجمالي</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesTotalPerProductType[0].qty! +
                                      data?.result.salesTotalPerProductType[1].qty! +
                                      data?.result.salesTotalPerProductType[2].qty! +
                                      data?.result.salesTotalPerProductType[3].qty! +
                                      data?.result.salesTotalPerProductType[4].qty! +
                                      data?.result.salesTotalPerProductType[5].qty!
                                  )}
                                </b>
                              </TableCell>
                            </TableRow>
                          </TableFooter>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Collapse>
                </Card>
              </Grid>
              <Grid xs={12} md={6}>
                <Card>
                  <CardHeader title="احصائي المبيعات الإجمالية حسب أنشطة العملاء " />
                  <CardContent
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AppsPie
                      series={[
                        data?.result.dashMain.actvBakeriesQty!,
                        data?.result.dashMain.actv113Qty!,
                        data?.result.dashMain.actvOthersQty!,
                      ]}
                      labels={ActivitiesLabels}
                    />
                  </CardContent>
                  <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                      <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
                          <TableHead>
                            <TableRow>
                              <TableCell style={{ textAlign: 'center' }}>البيان</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>المبيعات بالطن</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>{ActivitiesLabels[0]}</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.dashMain.actvBakeriesQty)}</b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>{ActivitiesLabels[1]}</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.dashMain.actv113Qty)}</b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>{ActivitiesLabels[2]}</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.dashMain.actvOthersQty)}</b>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                          <TableFooter>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>الإجمالي</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.dashMain.actvBakeriesQty! +
                                      data?.result.dashMain.actv113Qty! +
                                      data?.result.dashMain.actvOthersQty!
                                  )}
                                </b>
                              </TableCell>
                            </TableRow>
                          </TableFooter>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Collapse>
                </Card>
              </Grid>

              <Grid xs={12} md={6}>
                <BookingBooked
                  title={'كبار العملاء'}
                  subheader="وفق المبيعات بالطن ونسبتهم من اجمالي المبيعات العام"
                  data={data?.result.salesTop10List!}
                />
              </Grid> */}
            </Grid>
          </Box>
        </Container>
      </div>
    </>
  );
}
