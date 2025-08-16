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
import { useRef, useState } from 'react';
import Iconify from 'src/components/iconify';
import { format } from 'date-fns';
import {
  GridAddIcon,
  GridArrowDownwardIcon,
  GridExpandMoreIcon,
  GridLoadIcon,
  GridMenuIcon,
} from '@mui/x-data-grid';
import styled from '@emotion/styled';
import { ImportContacts, ImportContactsOutlined } from '@mui/icons-material';
import { DateRangeIcon } from '@mui/x-date-pickers';
import FileDataActivity from '../file-data-activity';
import Scrollbar from 'src/components/scrollbar';
import { dir } from 'console';

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

export default function SalesY2024DashboardView() {
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
  let peiodLabels = ['الربع الأول', 'الربع الثاني'];
  let monthLabels = ['يناير', 'فبراير', 'مارس', 'ابريل', 'مايو', 'يونيو'];
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

  function GetRelativeImpact(FYear: number, SYear: number) {
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
                boxShadow: 'rgba(0, 0, 0, 0.18) 0px 2px 4px',
                borderRadius: 1,
                marginBottom: 3,
                marginTop: -1,
                padding: '5px 25px',
                color: 'GrayText',
              }}
            >
              <Box>
                <Typography variant="h5" component="h2">
                  مبيعات الدقيق بشركات المطاحن للعام 2023
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {formattedDate} | {formattedTime}
                </Typography>
              </Box>
              <div ref={btnPrintingRef}>
                {!isPrinting && (
                  <>
                    <Tooltip title={expanded ? 'إخفاء جداول البيانات' : 'عرض جداول البيانات'}>
                      <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                      >
                        <GridExpandMoreIcon />
                      </ExpandMore>
                    </Tooltip>
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
                  total={data?.result.dashMain.cntCustomers!}
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
                  total={data?.result.dashMain.totalWeightInTons!}
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
                  title={t('قيمة المبيعات شامل الضريبة وفق فواتير البيع الصادرة')}
                  total={data?.result.dashMain.totalPrice!}
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
                      <LocalAtmTwoToneIcon sx={{ fontSize: 70 }} />
                    </Box>
                  }
                />
              </Grid>
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  title={t('عدد منتجات الدقيق النشطة، تشمل العبوات المنزلية')}
                  total={data?.result.dashMain.cntProducts!}
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
              {/* <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  title={t('عدد شركات المطاحن المرخص لها من قبل الهيئة')}
                  total={data?.result.dashMain.cntCompanies!}
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
                      <GridMenuIcon sx={{ fontSize: 70 }} />
                    </Box>
                  }
                />
              </Grid>
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  title={t('عدد فروع شركات المطاحن المعتمدة')}
                  total={data?.result.dashMain.cntBranches!}
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
                      <GridMenuIcon sx={{ fontSize: 70 }} />
                    </Box>
                  }
                />
              </Grid> */}
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  title={t('مبيعات 2023')}
                  total={data?.result.dashMain.qY2023!}
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
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  title={t('مبيعات النصف الأول 2024')}
                  total={data?.result.dashMain.qY2024!}
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
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  title={t('عدد فواتير البيع الصادرة')}
                  total={data?.result.dashMain.cntInvoices!}
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
              <Grid xs={12} md={6} lg={12}>
                <Card>
                  <FileDataActivity
                    title="اجمالي المبيعات السنوية"
                    chart={{
                      labels: TIME_LABELS,
                      colors: [
                        theme.palette.primary.main,
                        theme.palette.error.main,
                        theme.palette.warning.main,
                        theme.palette.text.disabled,
                      ],
                      series: [
                        {
                          type: 'جميع المنتجات',
                          data: [
                            {
                              name: data?.result.salesAllYears[0].companyName!,
                              data: data?.result.salesAllYears[0].all!,
                            },
                            {
                              name: data?.result.salesAllYears[1].companyName!,
                              data: data?.result.salesAllYears[1].all!,
                            },
                            {
                              name: data?.result.salesAllYears[2].companyName!,
                              data: data?.result.salesAllYears[2].all!,
                            },
                            {
                              name: data?.result.salesAllYears[3].companyName!,
                              data: data?.result.salesAllYears[3].all!,
                            },
                          ],
                        },
                        {
                          type: 'أصناف مدعومة',
                          data: [
                            {
                              name: data?.result.salesAllYears[0].companyName!,
                              data: data?.result.salesAllYears[0].restricted!,
                            },
                            {
                              name: data?.result.salesAllYears[1].companyName!,
                              data: data?.result.salesAllYears[1].restricted!,
                            },
                            {
                              name: data?.result.salesAllYears[2].companyName!,
                              data: data?.result.salesAllYears[2].restricted!,
                            },
                            {
                              name: data?.result.salesAllYears[3].companyName!,
                              data: data?.result.salesAllYears[3].restricted!,
                            },
                          ],
                        },
                        {
                          type: 'عبوات منزلية',
                          data: [
                            {
                              name: data?.result.salesAllYears[0].companyName!,
                              data: data?.result.salesAllYears[0].houseRefill!,
                            },
                            {
                              name: data?.result.salesAllYears[1].companyName!,
                              data: data?.result.salesAllYears[1].houseRefill!,
                            },
                            {
                              name: data?.result.salesAllYears[2].companyName!,
                              data: data?.result.salesAllYears[2].houseRefill!,
                            },
                            {
                              name: data?.result.salesAllYears[3].companyName!,
                              data: data?.result.salesAllYears[3].houseRefill!,
                            },
                          ],
                        },
                        {
                          type: 'مشتقات قمح',
                          data: [
                            {
                              name: data?.result.salesAllYears[0].companyName!,
                              data: data?.result.salesAllYears[0].wheatDerivatives!,
                            },
                            {
                              name: data?.result.salesAllYears[1].companyName!,
                              data: data?.result.salesAllYears[1].wheatDerivatives!,
                            },
                            {
                              name: data?.result.salesAllYears[2].companyName!,
                              data: data?.result.salesAllYears[2].wheatDerivatives!,
                            },
                            {
                              name: data?.result.salesAllYears[3].companyName!,
                              data: data?.result.salesAllYears[3].wheatDerivatives!,
                            },
                          ],
                        },
                      ],
                    }}
                  />
                  <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                      <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
                          <TableHead>
                            <TableRow>
                              <TableCell style={{ textAlign: 'center' }}>السنة</TableCell>
                              <TableCell style={{ textAlign: 'center' }} colSpan={2}>
                                {data?.result.salesAllYears[0].companyName!}
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }} colSpan={2}>
                                {data?.result.salesAllYears[1].companyName!}
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }} colSpan={2}>
                                {data?.result.salesAllYears[2].companyName!}
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }} colSpan={2}>
                                {data?.result.salesAllYears[3].companyName!}
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }} colSpan={2}>
                                الإجمالي
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell style={{ textAlign: 'center' }}>{2017}</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[0].all![0])}</b>
                              </TableCell>
                              <TableCell></TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[1].all![0])}</b>
                              </TableCell>
                              <TableCell></TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[2].all![0])}</b>
                              </TableCell>
                              <TableCell></TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[3].all![0])}</b>
                              </TableCell>
                              <TableCell></TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesAllYears[0].all![0]! +
                                      data?.result.salesAllYears[1].all![0]! +
                                      data?.result.salesAllYears[2].all![0]! +
                                      data?.result.salesAllYears[3].all![0]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell style={{ textAlign: 'center' }}>2018</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[0].all![1])}</b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[0].all![0]!,
                                    data?.result.salesAllYears[0].all![1]!
                                  )}
                                </b>
                              </TableCell>

                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[1].all![1])}</b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[1].all![0]!,
                                    data?.result.salesAllYears[1].all![1]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[2].all![1])}</b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[2].all![0]!,
                                    data?.result.salesAllYears[2].all![1]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[3].all![1])}</b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[3].all![0]!,
                                    data?.result.salesAllYears[3].all![1]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesAllYears[0].all![1]! +
                                      data?.result.salesAllYears[1].all![1]! +
                                      data?.result.salesAllYears[2].all![1]! +
                                      data?.result.salesAllYears[3].all![1]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[0].all![0]! +
                                      data?.result.salesAllYears[1].all![0]! +
                                      data?.result.salesAllYears[2].all![0]! +
                                      data?.result.salesAllYears[3].all![0]!,
                                    data?.result.salesAllYears[0].all![1]! +
                                      data?.result.salesAllYears[1].all![1]! +
                                      data?.result.salesAllYears[2].all![1]! +
                                      data?.result.salesAllYears[3].all![1]!
                                  )}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell style={{ textAlign: 'center' }}>2019</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[0].all![2])}</b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[0].all![1]!,
                                    data?.result.salesAllYears[0].all![2]!
                                  )}
                                </b>
                              </TableCell>

                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[1].all![2])}</b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[1].all![1]!,
                                    data?.result.salesAllYears[1].all![2]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[2].all![2])}</b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[2].all![1]!,
                                    data?.result.salesAllYears[2].all![2]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[3].all![2])}</b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[3].all![1]!,
                                    data?.result.salesAllYears[3].all![2]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesAllYears[0].all![2]! +
                                      data?.result.salesAllYears[1].all![2]! +
                                      data?.result.salesAllYears[2].all![2]! +
                                      data?.result.salesAllYears[3].all![2]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[0].all![1]! +
                                      data?.result.salesAllYears[1].all![1]! +
                                      data?.result.salesAllYears[2].all![1]! +
                                      data?.result.salesAllYears[3].all![1]!,
                                    data?.result.salesAllYears[0].all![2]! +
                                      data?.result.salesAllYears[1].all![2]! +
                                      data?.result.salesAllYears[2].all![2]! +
                                      data?.result.salesAllYears[3].all![2]!
                                  )}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell style={{ textAlign: 'center' }}>2020</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[0].all![3])}</b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[0].all![2]!,
                                    data?.result.salesAllYears[0].all![3]!
                                  )}
                                </b>
                              </TableCell>

                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[1].all![3])}</b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[1].all![2]!,
                                    data?.result.salesAllYears[1].all![3]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[2].all![3])}</b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[2].all![2]!,
                                    data?.result.salesAllYears[2].all![3]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[3].all![3])}</b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[3].all![2]!,
                                    data?.result.salesAllYears[3].all![3]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesAllYears[0].all![3]! +
                                      data?.result.salesAllYears[1].all![3]! +
                                      data?.result.salesAllYears[2].all![3]! +
                                      data?.result.salesAllYears[3].all![3]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[0].all![2]! +
                                      data?.result.salesAllYears[1].all![2]! +
                                      data?.result.salesAllYears[2].all![2]! +
                                      data?.result.salesAllYears[3].all![2]!,
                                    data?.result.salesAllYears[0].all![3]! +
                                      data?.result.salesAllYears[1].all![3]! +
                                      data?.result.salesAllYears[2].all![3]! +
                                      data?.result.salesAllYears[3].all![3]!
                                  )}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell style={{ textAlign: 'center' }}>2021</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[0].all![4])}</b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[0].all![3]!,
                                    data?.result.salesAllYears[0].all![4]!
                                  )}
                                </b>
                              </TableCell>

                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[1].all![4])}</b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[1].all![3]!,
                                    data?.result.salesAllYears[1].all![4]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[2].all![4])}</b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[2].all![3]!,
                                    data?.result.salesAllYears[2].all![4]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[3].all![4])}</b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[3].all![3]!,
                                    data?.result.salesAllYears[3].all![4]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesAllYears[0].all![4]! +
                                      data?.result.salesAllYears[1].all![4]! +
                                      data?.result.salesAllYears[2].all![4]! +
                                      data?.result.salesAllYears[3].all![4]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[0].all![3]! +
                                      data?.result.salesAllYears[1].all![3]! +
                                      data?.result.salesAllYears[2].all![3]! +
                                      data?.result.salesAllYears[3].all![3]!,
                                    data?.result.salesAllYears[0].all![4]! +
                                      data?.result.salesAllYears[1].all![4]! +
                                      data?.result.salesAllYears[2].all![4]! +
                                      data?.result.salesAllYears[3].all![4]!
                                  )}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell style={{ textAlign: 'center' }}>2022</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[0].all![5])}</b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[0].all![4]!,
                                    data?.result.salesAllYears[0].all![5]!
                                  )}
                                </b>
                              </TableCell>

                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[1].all![5])}</b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[1].all![4]!,
                                    data?.result.salesAllYears[1].all![5]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[2].all![5])}</b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[2].all![4]!,
                                    data?.result.salesAllYears[2].all![5]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[3].all![5])}</b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[3].all![4]!,
                                    data?.result.salesAllYears[3].all![5]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesAllYears[0].all![5]! +
                                      data?.result.salesAllYears[1].all![5]! +
                                      data?.result.salesAllYears[2].all![5]! +
                                      data?.result.salesAllYears[3].all![5]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[0].all![4]! +
                                      data?.result.salesAllYears[1].all![4]! +
                                      data?.result.salesAllYears[2].all![4]! +
                                      data?.result.salesAllYears[3].all![4]!,
                                    data?.result.salesAllYears[0].all![5]! +
                                      data?.result.salesAllYears[1].all![5]! +
                                      data?.result.salesAllYears[2].all![5]! +
                                      data?.result.salesAllYears[3].all![5]!
                                  )}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell style={{ textAlign: 'center' }}>2023</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[0].all![6])}</b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[0].all![5]!,
                                    data?.result.salesAllYears[0].all![6]!
                                  )}
                                </b>
                              </TableCell>

                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[1].all![6])}</b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[1].all![5]!,
                                    data?.result.salesAllYears[1].all![6]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[2].all![6])}</b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[2].all![5]!,
                                    data?.result.salesAllYears[2].all![6]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[3].all![6])}</b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[3].all![5]!,
                                    data?.result.salesAllYears[3].all![6]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesAllYears[0].all![6]! +
                                      data?.result.salesAllYears[1].all![6]! +
                                      data?.result.salesAllYears[2].all![6]! +
                                      data?.result.salesAllYears[3].all![6]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[0].all![5]! +
                                      data?.result.salesAllYears[1].all![5]! +
                                      data?.result.salesAllYears[2].all![5]! +
                                      data?.result.salesAllYears[3].all![5]!,
                                    data?.result.salesAllYears[0].all![6]! +
                                      data?.result.salesAllYears[1].all![6]! +
                                      data?.result.salesAllYears[2].all![6]! +
                                      data?.result.salesAllYears[3].all![6]!
                                  )}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell style={{ textAlign: 'center' }}>
                                النصف الأول 2024{' '}
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[0].all![7])}</b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[0].all![6]!,
                                    data?.result.salesAllYears[0].all![7]!
                                  )}
                                </b>
                              </TableCell>

                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[1].all![7])}</b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[1].all![6]!,
                                    data?.result.salesAllYears[1].all![7]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[2].all![7])}</b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[2].all![6]!,
                                    data?.result.salesAllYears[2].all![7]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>{fShortenNumber2(data?.result.salesAllYears[3].all![7])}</b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[3].all![6]!,
                                    data?.result.salesAllYears[3].all![7]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesAllYears[0].all![7]! +
                                      data?.result.salesAllYears[1].all![7]! +
                                      data?.result.salesAllYears[2].all![7]! +
                                      data?.result.salesAllYears[3].all![7]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell>
                                <b>
                                  {GetRelativeImpact(
                                    data?.result.salesAllYears[0].all![6]! +
                                      data?.result.salesAllYears[1].all![6]! +
                                      data?.result.salesAllYears[2].all![6]! +
                                      data?.result.salesAllYears[3].all![6]!,
                                    data?.result.salesAllYears[0].all![7]! +
                                      data?.result.salesAllYears[1].all![7]! +
                                      data?.result.salesAllYears[2].all![7]! +
                                      data?.result.salesAllYears[3].all![7]!
                                  )}
                                </b>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                          <TableFooter>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell style={{ textAlign: 'center' }}>الإجمالي</TableCell>
                              <TableCell style={{ textAlign: 'center' }} colSpan={2}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesAllYears[0].all![0]! +
                                      data?.result.salesAllYears[0].all![1]! +
                                      data?.result.salesAllYears[0].all![2]! +
                                      data?.result.salesAllYears[0].all![3]! +
                                      data?.result.salesAllYears[0].all![4]! +
                                      data?.result.salesAllYears[0].all![5]! +
                                      data?.result.salesAllYears[0].all![6]! +
                                      data?.result.salesAllYears[0].all![7]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }} colSpan={2}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesAllYears[1].all![0]! +
                                      data?.result.salesAllYears[1].all![1]! +
                                      data?.result.salesAllYears[1].all![2]! +
                                      data?.result.salesAllYears[1].all![3]! +
                                      data?.result.salesAllYears[1].all![4]! +
                                      data?.result.salesAllYears[1].all![5]! +
                                      data?.result.salesAllYears[1].all![6]! +
                                      data?.result.salesAllYears[1].all![7]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }} colSpan={2}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesAllYears[2].all![0]! +
                                      data?.result.salesAllYears[2].all![1]! +
                                      data?.result.salesAllYears[2].all![2]! +
                                      data?.result.salesAllYears[2].all![3]! +
                                      data?.result.salesAllYears[2].all![4]! +
                                      data?.result.salesAllYears[2].all![5]! +
                                      data?.result.salesAllYears[2].all![6]! +
                                      data?.result.salesAllYears[2].all![7]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }} colSpan={2}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesAllYears[3].all![0]! +
                                      data?.result.salesAllYears[3].all![1]! +
                                      data?.result.salesAllYears[3].all![2]! +
                                      data?.result.salesAllYears[3].all![3]! +
                                      data?.result.salesAllYears[3].all![4]! +
                                      data?.result.salesAllYears[3].all![5]! +
                                      data?.result.salesAllYears[3].all![6]! +
                                      data?.result.salesAllYears[3].all![7]!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }} colSpan={2}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesAllYears[0].all![0]! +
                                      data?.result.salesAllYears[0].all![1]! +
                                      data?.result.salesAllYears[0].all![2]! +
                                      data?.result.salesAllYears[0].all![3]! +
                                      data?.result.salesAllYears[0].all![4]! +
                                      data?.result.salesAllYears[0].all![5]! +
                                      data?.result.salesAllYears[0].all![6]! +
                                      data?.result.salesAllYears[0].all![7]! +
                                      data?.result.salesAllYears[1].all![0]! +
                                      data?.result.salesAllYears[1].all![1]! +
                                      data?.result.salesAllYears[1].all![2]! +
                                      data?.result.salesAllYears[1].all![3]! +
                                      data?.result.salesAllYears[1].all![4]! +
                                      data?.result.salesAllYears[1].all![5]! +
                                      data?.result.salesAllYears[1].all![6]! +
                                      data?.result.salesAllYears[1].all![7]! +
                                      data?.result.salesAllYears[2].all![0]! +
                                      data?.result.salesAllYears[2].all![1]! +
                                      data?.result.salesAllYears[2].all![2]! +
                                      data?.result.salesAllYears[3].all![3]! +
                                      data?.result.salesAllYears[2].all![4]! +
                                      data?.result.salesAllYears[2].all![5]! +
                                      data?.result.salesAllYears[2].all![6]! +
                                      data?.result.salesAllYears[2].all![7]! +
                                      data?.result.salesAllYears[3].all![0]! +
                                      data?.result.salesAllYears[3].all![1]! +
                                      data?.result.salesAllYears[3].all![2]! +
                                      data?.result.salesAllYears[3].all![3]! +
                                      data?.result.salesAllYears[3].all![4]! +
                                      data?.result.salesAllYears[3].all![5]! +
                                      data?.result.salesAllYears[3].all![6]! +
                                      data?.result.salesAllYears[3].all![7]!
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
                  <CardHeader title="احصائي المبيعات وفق الفترة" />
                  <CardActions disableSpacing></CardActions>
                  <CardContent>
                    <ChartColumnMultiple
                      series={[
                        {
                          name: 'عام 2024',
                          data: [
                            data?.result.salesTotalPerPeriods[0].qtyY2024!,
                            data?.result.salesTotalPerPeriods[1].qtyY2024!,
                          ],
                          labels: peiodLabels,
                        },
                        {
                          name: 'عام 2023',
                          data: [
                            data?.result.salesTotalPerPeriods[0].qtyY2023!,
                            data?.result.salesTotalPerPeriods[1].qtyY2023!,
                          ],
                          labels: peiodLabels,
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
                              <TableCell>الربع الأول</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerPeriods[0].qtyY2023)}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerPeriods[0].qtyY2024)}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>الربع الثاني</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerPeriods[1].qtyY2023)}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerPeriods[1].qtyY2024)}
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
                                    data?.result.salesTotalPerPeriods[0].qtyY2023! +
                                      data?.result.salesTotalPerPeriods[1].qtyY2023!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesTotalPerPeriods[0].qtyY2024! +
                                      data?.result.salesTotalPerPeriods[1].qtyY2024!
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
                  <CardHeader title="احصائي المبيعات وفق الأشهر" />
                  <CardContent>
                    <ChartColumnMultiple
                      series={[
                        {
                          name: 'عام 2024',
                          data: [
                            data?.result.salesTotalPerMonth[0].qtyY2024!,
                            data?.result.salesTotalPerMonth[1].qtyY2024!,
                            data?.result.salesTotalPerMonth[2].qtyY2024!,
                            data?.result.salesTotalPerMonth[3].qtyY2024!,
                            data?.result.salesTotalPerMonth[4].qtyY2024!,
                            data?.result.salesTotalPerMonth[5].qtyY2024!,
                          ],
                          labels: monthLabels,
                        },
                        {
                          name: 'عام 2023',
                          data: [
                            data?.result.salesTotalPerMonth[0].qtyY2023!,
                            data?.result.salesTotalPerMonth[1].qtyY2023!,
                            data?.result.salesTotalPerMonth[2].qtyY2023!,
                            data?.result.salesTotalPerMonth[3].qtyY2023!,
                            data?.result.salesTotalPerMonth[4].qtyY2023!,
                            data?.result.salesTotalPerMonth[5].qtyY2023!,
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
              {/* <Grid xs={12} md={6}>
                <Card>
                  <CardHeader title="احصائي مبيعات شركات المطاحن وفق الفترة" />
                  <CardContent>
                    <ChartColumnMultiple
                      series={[
                        {
                          name: 'النصف الأول 2024',
                          data: [
                            data?.result.salesTotalPerCompany[0].qtyY2024!,
                            data?.result.salesTotalPerCompany[1].qtyY2024!,
                            data?.result.salesTotalPerCompany[2].qtyY2024!,
                            data?.result.salesTotalPerCompany[3].qtyY2024!,
                          ],
                          labels: companiesLabels,
                        },
                        {
                          name: 'النصف الأول 2023',
                          data: [
                            data?.result.salesTotalPerCompany[0].qtyY2023!,
                            data?.result.salesTotalPerCompany[1].qtyY2023!,
                            data?.result.salesTotalPerCompany[2].qtyY2023!,
                            data?.result.salesTotalPerCompany[3].qtyY2023!,
                          ],
                          labels: companiesLabels,
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
                              <TableCell>{companiesLabels[0]}</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerCompany[0].qtyY2023)}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerCompany[0].qtyY2024)}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>{companiesLabels[1]}</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerCompany[1].qtyY2023)}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerCompany[1].qtyY2024)}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>{companiesLabels[2]}</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerCompany[2].qtyY2023)}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerCompany[2].qtyY2024)}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>{companiesLabels[3]}</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerCompany[3].qtyY2023)}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerCompany[3].qtyY2024)}
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
                                    data?.result.salesTotalPerCompany[0].qtyY2023! +
                                      data?.result.salesTotalPerCompany[1].qtyY2023! +
                                      data?.result.salesTotalPerCompany[2].qtyY2023! +
                                      data?.result.salesTotalPerCompany[3].qtyY2023!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesTotalPerCompany[0].qtyY2024! +
                                      data?.result.salesTotalPerCompany[1].qtyY2024! +
                                      data?.result.salesTotalPerCompany[2].qtyY2024! +
                                      data?.result.salesTotalPerCompany[3].qtyY2024!
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
              </Grid> */}
              {/* <Grid xs={12} md={6}>
                <Card>
                  <CardHeader title="احصائي مبيعات فروع شركات المطاحن وفق الفترة" />
                  <CardContent>
                    <ChartColumnMultiple
                      series={[
                        {
                          name: 'النصف الأول 2024',
                          data: [
                            data?.result.salesTotalPerBranch[0].qtyY2024!,
                            data?.result.salesTotalPerBranch[1].qtyY2024!,
                            data?.result.salesTotalPerBranch[2].qtyY2024!,
                            data?.result.salesTotalPerBranch[3].qtyY2024!,
                            data?.result.salesTotalPerBranch[4].qtyY2024!,
                            data?.result.salesTotalPerBranch[5].qtyY2024!,
                            data?.result.salesTotalPerBranch[6].qtyY2024!,
                            data?.result.salesTotalPerBranch[7].qtyY2024!,
                            data?.result.salesTotalPerBranch[8].qtyY2024!,
                            data?.result.salesTotalPerBranch[9].qtyY2024!,
                            data?.result.salesTotalPerBranch[10].qtyY2024!,
                            data?.result.salesTotalPerBranch[11].qtyY2024!,
                            data?.result.salesTotalPerBranch[12].qtyY2024!,
                          ],
                          labels: branchesLabels,
                        },
                        {
                          name: 'النصف الأول 2023',
                          data: [
                            data?.result.salesTotalPerBranch[0].qtyY2023!,
                            data?.result.salesTotalPerBranch[1].qtyY2023!,
                            data?.result.salesTotalPerBranch[2].qtyY2023!,
                            data?.result.salesTotalPerBranch[3].qtyY2023!,
                            data?.result.salesTotalPerBranch[4].qtyY2023!,
                            data?.result.salesTotalPerBranch[5].qtyY2023!,
                            data?.result.salesTotalPerBranch[6].qtyY2023!,
                            data?.result.salesTotalPerBranch[7].qtyY2023!,
                            data?.result.salesTotalPerBranch[8].qtyY2023!,
                            data?.result.salesTotalPerBranch[9].qtyY2023!,
                            data?.result.salesTotalPerBranch[10].qtyY2023!,
                            data?.result.salesTotalPerBranch[11].qtyY2023!,
                            data?.result.salesTotalPerBranch[12].qtyY2023!,
                          ],
                          labels: branchesLabels,
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
                              <TableCell>
                                {data?.result.salesTotalPerBranch[0].branchName!}
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerBranch[0].qtyY2023)}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerBranch[0].qtyY2024)}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>
                                {data?.result.salesTotalPerBranch[1].branchName!}
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerBranch[1].qtyY2023)}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerBranch[1].qtyY2024)}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>
                                {data?.result.salesTotalPerBranch[2].branchName!}
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerBranch[2].qtyY2023)}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerBranch[2].qtyY2024)}
                                </b>
                              </TableCell>
                            </TableRow>

                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>
                                {data?.result.salesTotalPerBranch[3].branchName!}
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerBranch[3].qtyY2023)}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerBranch[3].qtyY2024)}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>
                                {data?.result.salesTotalPerBranch[4].branchName!}
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerBranch[4].qtyY2023)}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerBranch[4].qtyY2024)}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>
                                {data?.result.salesTotalPerBranch[5].branchName!}
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerBranch[5].qtyY2023)}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerBranch[5].qtyY2024)}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>
                                {data?.result.salesTotalPerBranch[6].branchName!}
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerBranch[6].qtyY2023)}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerBranch[6].qtyY2024)}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>
                                {data?.result.salesTotalPerBranch[7].branchName!}
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerBranch[7].qtyY2023)}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerBranch[7].qtyY2024)}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>
                                {data?.result.salesTotalPerBranch[8].branchName!}
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerBranch[8].qtyY2023)}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerBranch[8].qtyY2024)}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>
                                {data?.result.salesTotalPerBranch[9].branchName!}
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerBranch[9].qtyY2023)}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerBranch[9].qtyY2024)}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>
                                {data?.result.salesTotalPerBranch[10].branchName!}
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerBranch[10].qtyY2023)}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerBranch[10].qtyY2024)}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>
                                {data?.result.salesTotalPerBranch[11].branchName!}
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerBranch[11].qtyY2023)}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerBranch[11].qtyY2024)}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell>
                                {data?.result.salesTotalPerBranch[12].branchName!}
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerBranch[12].qtyY2023)}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(data?.result.salesTotalPerBranch[12].qtyY2024)}
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
                                    data?.result.salesTotalPerBranch[0].qtyY2023! +
                                      data?.result.salesTotalPerBranch[1].qtyY2023! +
                                      data?.result.salesTotalPerBranch[2].qtyY2023! +
                                      data?.result.salesTotalPerBranch[3].qtyY2023! +
                                      data?.result.salesTotalPerBranch[4].qtyY2023! +
                                      data?.result.salesTotalPerBranch[5].qtyY2023! +
                                      data?.result.salesTotalPerBranch[6].qtyY2023! +
                                      data?.result.salesTotalPerBranch[7].qtyY2023! +
                                      data?.result.salesTotalPerBranch[8].qtyY2023! +
                                      data?.result.salesTotalPerBranch[9].qtyY2023! +
                                      data?.result.salesTotalPerBranch[10].qtyY2023! +
                                      data?.result.salesTotalPerBranch[11].qtyY2023! +
                                      data?.result.salesTotalPerBranch[12].qtyY2023!
                                  )}
                                </b>
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <b>
                                  {fShortenNumber2(
                                    data?.result.salesTotalPerBranch[0].qtyY2024! +
                                      data?.result.salesTotalPerBranch[1].qtyY2024! +
                                      data?.result.salesTotalPerBranch[2].qtyY2024! +
                                      data?.result.salesTotalPerBranch[3].qtyY2024! +
                                      data?.result.salesTotalPerBranch[4].qtyY2024! +
                                      data?.result.salesTotalPerBranch[5].qtyY2024! +
                                      data?.result.salesTotalPerBranch[6].qtyY2024! +
                                      data?.result.salesTotalPerBranch[7].qtyY2024! +
                                      data?.result.salesTotalPerBranch[8].qtyY2024! +
                                      data?.result.salesTotalPerBranch[9].qtyY2024! +
                                      data?.result.salesTotalPerBranch[10].qtyY2024! +
                                      data?.result.salesTotalPerBranch[11].qtyY2024! +
                                      data?.result.salesTotalPerBranch[12].qtyY2024!
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
              </Grid> */}
              <Grid xs={12} md={6}>
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
              </Grid>
            </Grid>
          </Box>
        </Container>
      </div>
    </>
  );
}
