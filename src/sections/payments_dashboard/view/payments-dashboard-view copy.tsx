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
import {
  DashboardBranchResponse,
  DashboardMahsoliPaymentsResponse,
  DashboardSalesAdminResponse,
} from '../types';

import LocalShippingTwoToneIcon from '@mui/icons-material/LocalShippingTwoTone';
import WarehouseTwoToneIcon from '@mui/icons-material/WarehouseTwoTone';
import ScaleTwoToneIcon from '@mui/icons-material/ScaleTwoTone';
import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';
import LocalAtmTwoToneIcon from '@mui/icons-material/LocalAtmTwoTone';
import PriceCheckTwoToneIcon from '@mui/icons-material/PriceCheckTwoTone';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { fDate } from 'src/utils/format-time';
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
  fShortenNumber0,
  fShortenNumber2,
  fShortenNumber_,
  fShortenNumber__,
} from 'src/utils/format-number';
import AppsPie from 'src/sections/payments_dashboard/apps-pie';
import AppsPieN from 'src/sections/payments_dashboard/apps-pie-n';
import ChartColumnMultiple from 'src/sections/app/chart-column-multiple';
import SeasonWeightTotalChart from 'src/sections/payments_dashboard/season-weight-total';
import RejectDetails from 'src/sections/payments_dashboard/reject-details';
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
export default function MahsoliPaymentsDashboardView_() {
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

  const { data, error } = useSWR<DashboardMahsoliPaymentsResponse>(
    endpoints.dashPayments.getPaymentsDashboard,
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
  console.log(data);
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
                  صرف مستحقات مزارعي القمح المحلي للعام 2024
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
              <Grid xs={12} md={4}>
                <BookingWidgetSummary
                  // sx={{ backgroundColor: '#009688', color: '#fff' }}
                  title={t('عدد الرخص')}
                  total={data?.result.dashMain.cntLines!}
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
                  title={t('اجمالي الوزن المستلم (الصافي)')}
                  total={data?.result.dashMain.smCleanWeight!}
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
                  title={t('اجمالي خصم البروتين')}
                  total={data?.result.dashMain.smProteinDeduction!}
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
                  title={t('قيمة المستلم')}
                  total={data?.result.dashMain.smAmountToPay!}
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
                  title={t('خصم الزكاة')}
                  total={data?.result.dashMain.smZakatPayToDate!}
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
                  title={t('الضريبة المضافة')}
                  total={data?.result.dashMain.smVAT!}
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
                  title={t(' المستحق')}
                  total={data?.result.dashMain.smPayToDate!}
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
                  title={t('مستقطعات القروض التشغيلية')}
                  total={data?.result.dashMain.smADFOperationDeducted!}
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
                  title={t('مستقطع لصالح الصندوق الزراعي')}
                  total={data?.result.dashMain.smADFDeducted!}
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
                  title={t('مستقطع لصالح الصندوق العقاري')}
                  total={data?.result.dashMain.smREDFDeducted!}
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
                  title={t('اجمالي المستقطعات')}
                  total={data?.result.dashMain.smDeducted!}
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
                  title={t('صافي المستحق')}
                  total={data?.result.dashMain.smNetAmount!}
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
            </Grid>
          </Box>
        </Container>
      </div>
    </>
  );
}
