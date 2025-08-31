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
  Tab,
  Tabs,
  Button,
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
import { BarChart as BarChartIcon, TableChart as TableChartIcon } from '@mui/icons-material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CategoryIcon from '@mui/icons-material/Category';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';

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
  year: ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
};

export default function SalesDashboardView() {
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

  // ----------------------------------------
  // const [tabValue, setTabValue] = useState(0); // State to manage the active tab

  // const handleChange = (event, newValue) => {
  //   setTabValue(newValue);
  // };

  // const [view, setView] = useState('graph'); // State to manage the current view

  // const toggleView = () => {
  //   setView((prevView) => (prevView === 'graph' ? 'table' : 'graph'));
  // };

  const [totalSalesGraph, setTotalSalesGraph] = useState(true); // State to manage the current view
  const [totalSalesTable, setTotalSalesTable] = useState(true); // State to manage the current view
  // ----------------------------------------

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
      pdf.save('Matahin-Dash ' + fDate(new Date(), 'dd-MM-yyyy') + '.pdf');
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
                  مبيعات الدقيق بشركات المطاحن (2017 - 2024)
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
                    {/* <Tooltip title="طباعة">
                      <IconButton onClick={printPDF} sx={{ fontSize: '1.5rem' }}>
                        <Iconify icon="solar:printer-minimalistic-bold" />
                      </IconButton>
                    </Tooltip> */}
                  </>
                )}
              </div>
            </Box>
            <Grid container spacing={SPACING} disableEqualOverflow>
              {/* ------------------------------------------------- */}
              <Grid xs={12} md={12} lg={12}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">اجمالي المبيعات السنوية</Typography>

                      <Box display="flex" alignItems="center" ml={2}>
                        <IconButton
                          onClick={() => setTotalSalesGraph((s) => !s)}
                          color={totalSalesGraph ? 'primary' : 'default'}
                        >
                          <BarChartIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => setTotalSalesTable((s) => !s)}
                          color={totalSalesTable ? 'primary' : 'default'}
                        >
                          <TableChartIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Box mt={2} width="100%">
                      {totalSalesGraph && (
                        <FileDataActivity
                          title=""
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
                          sx={{ width: '100%', boxShadow: 'none' }} // Ensure the graph takes full width
                        />
                      )}
                      {totalSalesTable && (
                        <Box mt={2} width="100%">
                          <Collapse in={expanded} timeout="auto" unmountOnExit>
                            <CardContent>
                              <TableContainer component={Paper}>
                                <Table size="small" aria-label="a dense table">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell style={{ textAlign: 'center' }}>السنة</TableCell>
                                      <TableCell style={{ textAlign: 'center' }} colSpan={2}>
                                        الإجمالي
                                      </TableCell>
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
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    <TableRow
                                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                      <TableCell style={{ textAlign: 'center' }}>{2017}</TableCell>
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
                                      <TableCell style={{ textAlign: 'center' }}>
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[0].all![0])}
                                        </b>
                                      </TableCell>
                                      <TableCell></TableCell>
                                      <TableCell style={{ textAlign: 'center' }}>
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[1].all![0])}
                                        </b>
                                      </TableCell>
                                      <TableCell></TableCell>
                                      <TableCell style={{ textAlign: 'center' }}>
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[2].all![0])}
                                        </b>
                                      </TableCell>
                                      <TableCell></TableCell>
                                      <TableCell style={{ textAlign: 'center' }}>
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[3].all![0])}
                                        </b>
                                      </TableCell>
                                      <TableCell></TableCell>
                                    </TableRow>
                                    <TableRow
                                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                      <TableCell style={{ textAlign: 'center' }}>2018</TableCell>
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
                                      <TableCell style={{ textAlign: 'center' }}>
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[0].all![1])}
                                        </b>
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
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[1].all![1])}
                                        </b>
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
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[2].all![1])}
                                        </b>
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
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[3].all![1])}
                                        </b>
                                      </TableCell>
                                      <TableCell>
                                        <b>
                                          {GetRelativeImpact(
                                            data?.result.salesAllYears[3].all![0]!,
                                            data?.result.salesAllYears[3].all![1]!
                                          )}
                                        </b>
                                      </TableCell>
                                    </TableRow>
                                    <TableRow
                                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                      <TableCell style={{ textAlign: 'center' }}>2019</TableCell>
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
                                      <TableCell style={{ textAlign: 'center' }}>
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[0].all![2])}
                                        </b>
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
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[1].all![2])}
                                        </b>
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
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[2].all![2])}
                                        </b>
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
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[3].all![2])}
                                        </b>
                                      </TableCell>
                                      <TableCell>
                                        <b>
                                          {GetRelativeImpact(
                                            data?.result.salesAllYears[3].all![1]!,
                                            data?.result.salesAllYears[3].all![2]!
                                          )}
                                        </b>
                                      </TableCell>
                                    </TableRow>
                                    <TableRow
                                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                      <TableCell style={{ textAlign: 'center' }}>2020</TableCell>
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
                                      <TableCell style={{ textAlign: 'center' }}>
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[0].all![3])}
                                        </b>
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
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[1].all![3])}
                                        </b>
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
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[2].all![3])}
                                        </b>
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
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[3].all![3])}
                                        </b>
                                      </TableCell>
                                      <TableCell>
                                        <b>
                                          {GetRelativeImpact(
                                            data?.result.salesAllYears[3].all![2]!,
                                            data?.result.salesAllYears[3].all![3]!
                                          )}
                                        </b>
                                      </TableCell>
                                    </TableRow>
                                    <TableRow
                                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                      <TableCell style={{ textAlign: 'center' }}>2021</TableCell>
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
                                      <TableCell style={{ textAlign: 'center' }}>
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[0].all![4])}
                                        </b>
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
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[1].all![4])}
                                        </b>
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
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[2].all![4])}
                                        </b>
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
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[3].all![4])}
                                        </b>
                                      </TableCell>
                                      <TableCell>
                                        <b>
                                          {GetRelativeImpact(
                                            data?.result.salesAllYears[3].all![3]!,
                                            data?.result.salesAllYears[3].all![4]!
                                          )}
                                        </b>
                                      </TableCell>
                                    </TableRow>
                                    <TableRow
                                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                      <TableCell style={{ textAlign: 'center' }}>2022</TableCell>
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
                                      <TableCell style={{ textAlign: 'center' }}>
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[0].all![5])}
                                        </b>
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
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[1].all![5])}
                                        </b>
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
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[2].all![5])}
                                        </b>
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
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[3].all![5])}
                                        </b>
                                      </TableCell>
                                      <TableCell>
                                        <b>
                                          {GetRelativeImpact(
                                            data?.result.salesAllYears[3].all![4]!,
                                            data?.result.salesAllYears[3].all![5]!
                                          )}
                                        </b>
                                      </TableCell>
                                    </TableRow>
                                    <TableRow
                                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                      <TableCell style={{ textAlign: 'center' }}>2023</TableCell>
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
                                      <TableCell style={{ textAlign: 'center' }}>
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[0].all![6])}
                                        </b>
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
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[1].all![6])}
                                        </b>
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
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[2].all![6])}
                                        </b>
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
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[3].all![6])}
                                        </b>
                                      </TableCell>
                                      <TableCell>
                                        <b>
                                          {GetRelativeImpact(
                                            data?.result.salesAllYears[3].all![5]!,
                                            data?.result.salesAllYears[3].all![6]!
                                          )}
                                        </b>
                                      </TableCell>
                                    </TableRow>
                                    <TableRow
                                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                      <TableCell style={{ textAlign: 'center' }}>2024</TableCell>
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
                                      <TableCell style={{ textAlign: 'center' }}>
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[0].all![7])}
                                        </b>
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
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[1].all![7])}
                                        </b>
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
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[2].all![7])}
                                        </b>
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
                                        <b>
                                          {fShortenNumber2(data?.result.salesAllYears[3].all![7])}
                                        </b>
                                      </TableCell>
                                      <TableCell>
                                        <b>
                                          {GetRelativeImpact(
                                            data?.result.salesAllYears[3].all![6]!,
                                            data?.result.salesAllYears[3].all![7]!
                                          )}
                                        </b>
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                  <TableFooter>
                                    <TableRow
                                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                      <TableCell style={{ textAlign: 'center' }}>
                                        الإجمالي
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
              {/* ================================================ */}
            </Grid>
          </Box>
        </Container>
      </div>
    </>
  );
}
