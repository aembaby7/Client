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

import { LoadingButton } from '@mui/lab';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import { useTranslate } from 'src/locales';
import { DashboardBranchResponse } from '../types';

import LocalShippingTwoToneIcon from '@mui/icons-material/LocalShippingTwoTone';
import WarehouseTwoToneIcon from '@mui/icons-material/WarehouseTwoTone';
import ScaleTwoToneIcon from '@mui/icons-material/ScaleTwoTone';
import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';
import LocalAtmTwoToneIcon from '@mui/icons-material/LocalAtmTwoTone';
import PriceCheckTwoToneIcon from '@mui/icons-material/PriceCheckTwoTone';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import { json } from 'stream/consumers';
import { RHFSelect } from 'src/components/hook-form/rhf-select';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { fDate } from 'src/utils/format-time';

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
import BranchesSTS from '../brances-sts';
import AppWidget from 'src/sections/app/app-widget';
import {
  fNumber,
  fShortenNumber0,
  fShortenNumber2,
  fShortenNumber_,
  fShortenNumber__,
} from 'src/utils/format-number';
import AppsPie from '../apps-pie';
import ChartColumnMultiple from '../chart-column-multiple';
import SeasonWeightTotalChart from '../season-weight-total';
import RejectDetails from '../reject-details';
import AppsPieN from '../apps-pie-n';
import { useRef, useState } from 'react';
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';
import Iconify from 'src/components/iconify';
import { format } from 'date-fns';

const SPACING = 3;

export default function AdminDashboardView() {
  const now = new Date();
  const formattedDate = format(now, 'MMMM dd, yyyy');
  const formattedTime = format(now, 'hh:mm a');

  const printingAreaRef = useRef<HTMLDivElement>(null);

  const theme = useTheme();
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { data, error } = useSWR<DashboardBranchResponse>(
    endpoints.dashboard.getAdminDashboard + '?branchId=' + 0,
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

  if (isLoading) return <div>جاري تحميل البيانات...</div>;
  if (error) return;
  <>
    {error}
    <div>هناط خطأ في تحميل البيانات. تم إبلاغ مدير النظام</div>;
  </>;
  let labels = ['الرياض', 'القصيم', 'الخرج', 'الجوف', 'تبوك', 'حائل', 'وادي الدواسر', 'الأحساء'];
  let subtitleText;

  function printPDF(): void {
    html2canvas(printingAreaRef.current!).then((canvas) => {
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('p', 'px', [canvas.width, canvas.height]);
      pdf.addImage(contentDataURL, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('Mahsoli-Dash ' + fDate(new Date(), 'dd-mm-yyyy') + '.pdf');
    });
  }
  function getTotalDifferences(): void {
    let currYear = 0;
    let lastYear = 0;
    let diffColor: string = '#00a76f';

    for (var i = 0; i < data?.result.seasonWeightTotal.length!; i++) {
      currYear += data?.result.seasonWeightTotal[i].smS6Weight!;
      lastYear += data?.result.seasonWeightTotal[i].smS5Weight!;
    }
    // for (let i = 0; i < data?.result.seasonWeightTotal.length; i++) {
    //   //TODO: combine these 2?
    // }

    let totalDiff = (currYear / lastYear) * 100;
    totalDiff.toString() == 'Infinity' ? (totalDiff = 100) : totalDiff;
    totalDiff >= 100 ? (diffColor = '#17ae7c') : (diffColor = '#de5260');

    subtitleText = (
      <p style={{ padding: '0px 20px' }}>
        بلغ صافي كميات القمح المستلمة حتى تاريخه نحو (
        <span style={{ color: '#00a76f' }}>{fShortenNumber_(currYear)}</span>) طن بنسبة (
        <span style={{ color: diffColor }}>{fShortenNumber0(totalDiff)}%</span>) من اجمالي صافي
        القمح المستلم الموسم السابق (
        <span style={{ color: '#ffab00' }}>{fShortenNumber_(lastYear)}</span>) طن
      </p>
    );
  }

  getTotalDifferences();

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
            {/* ------------------Dashboard Header------------------------- */}
            {/* <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: 'rgba(0, 0, 0, 0.18) 0px 2px 4px',
                borderRadius: 1,
                marginBottom: 3,
                marginTop: -1,
                padding: 2,
                color: 'GrayText',
              }}
            >
              <Typography variant="h5" component="h2">
                لوحة بيانات منصة محصولي لمزارعي القمح المحلي
              </Typography>
              <Box>
                <Typography variant="body1" color="textSecondary">
                  {formattedDate} | {formattedTime}
                </Typography>
              </Box>
              <Box>
                <Stack direction="row-reverse" spacing={1} flexGrow={1} sx={{ width: 1 }}>
                  <Tooltip title="Print">
                    <IconButton onClick={printPDF}>
                      <Iconify icon="solar:printer-minimalistic-bold" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            </Box> */}

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
                  لوحة بيانات منصة محصولي لمزارعي القمح المحلي
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {formattedDate} | {formattedTime}
                </Typography>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center" sx={{marginBottom:-1}}>
                {/* <Typography variant="body2" component="p">
                  مطبعة
                </Typography> */}
                <Tooltip title="Print">
                  <IconButton onClick={printPDF} sx={{ fontSize: '1.5rem', paddingTop:0 }}>
                    <Iconify icon="solar:printer-minimalistic-bold" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            {/* --------------------/Dashboard Header----------------------- */}

            <Grid container spacing={SPACING} disableEqualOverflow>
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  // sx={{ backgroundColor: '#009688', color: '#fff' }}
                  title={t('اجمالي عدد العملاء')}
                  total={data?.result.clientStats.clientsNumber!}
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
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  // sx={{ backgroundColor: '#009688', color: '#fff' }}
                  title={t('اجمالي الكمية')}
                  total={data?.result.clientStats.qtyTotal!}
                  icon={
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '50%',
                        width:  120,
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
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  // sx={{ backgroundColor: '#009688', color: '#fff' }}
                  title={
                    t('حاجزي المقر') +
                    ' ' +
                    fShortenNumber0(
                      (data?.result.clientStats.clientsHasBranch! /
                        data?.result.clientStats.clientsNumber!) *
                        100
                    ) +
                    '%'
                  }
                  total={data?.result.clientStats.clientsHasBranch!}
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
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  // sx={{ backgroundColor: '#009688', color: '#fff' }}
                  title={
                    t('الكمية المخصصة') +
                    ' ' +
                    fShortenNumber0(
                      (data?.result.clientStats.clientsHasBranchTotalQty! /
                        data?.result.clientStats.qtyTotal!) *
                        100
                    ) +
                    '%'
                  }
                  total={data?.result.clientStats.clientsHasBranchTotalQty!}
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
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  // sx={{ backgroundColor: '#009688', color: '#fff' }}
                  title={
                    t('عدد الموردين') +
                    ' ' +
                    fShortenNumber0(
                      (data?.result.clientStats.clientsHasDelivery! /
                        data?.result.clientStats.clientsHasBranch!) *
                        100
                    ) +
                    '%'
                  }
                  total={data?.result.clientStats.clientsHasDelivery!}
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
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  title={
                    t('smWeight') +
                    ' ' +
                    fShortenNumber0(
                      (data?.result.dashMain.smWeight! /
                        data?.result.clientStats.clientsHasBranchTotalQty!) *
                        100
                    ) +
                    '%'
                  }
                  total={data?.result.dashMain.smWeight!}
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
                        color: '#ffa500e0',
                      }}
                    >
                      <LocalShippingTwoToneIcon sx={{ fontSize: 70 }} />
                    </Box>
                  }
                />
              </Grid>
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  title={
                    t('smCleanWeight') +
                    ' ' +
                    fShortenNumber0(
                      (data?.result.dashMain.smCleanWeight! / data?.result.dashMain.smWeight!) * 100
                    ) +
                    '%'
                  }
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
                      <ScaleTwoToneIcon sx={{ fontSize: 70 }} />
                    </Box>
                  }
                />
              </Grid>
              <Grid xs={12} md={3}>
                <BookingWidgetSummary
                  title={
                    t('smDockage') +
                    ' ' +
                    fShortenNumber0(
                      (data?.result.dashMain.smDockage! / data?.result.dashMain.smWeight!) * 100
                    ) +
                    '%'
                  }
                  total={data?.result.dashMain.smDockage!}
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
                        color: '#ffa500e0',
                      }}
                    >
                      <ScaleTwoToneIcon sx={{ fontSize: 70 }} />
                    </Box>
                  }
                />
              </Grid>
              <Grid xs={12} md={4}>
                <BookingWidgetSummary
                  title={t('smAmountToPay')}
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
                      <LocalAtmTwoToneIcon sx={{ fontSize: 70 }} />
                    </Box>
                  }
                />
              </Grid>
              <Grid xs={12} md={4}>
                <BookingWidgetSummary
                  title={
                    t('smZakatPayToDate') +
                    ' ' +
                    fShortenNumber0(
                      (data?.result.dashMain.smZakatPayToDate! /
                        data?.result.dashMain.smAmountToPay!) *
                        100
                    ) +
                    '%'
                  }
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
                        color: '#ffa500e0',
                      }}
                    >
                      <PriceCheckTwoToneIcon sx={{ fontSize: 70 }} />
                    </Box>
                  }
                />
              </Grid>
              <Grid xs={12} md={4}>
                <BookingWidgetSummary
                  title={
                    t('smPayToDate') +
                    ' ' +
                    fShortenNumber0(
                      (data?.result.dashMain.smPayToDate! / data?.result.dashMain.smAmountToPay!) *
                        100
                    ) +
                    '%'
                  }
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
                      <MonetizationOnTwoToneIcon sx={{ fontSize: 70 }} />
                    </Box>
                  }
                />
              </Grid>
              <Grid container xs={12}>
                <Grid xs={12} md={6}>
                  <BookingBooked
                    title={'المواعيد'}
                    total={data?.result.dashMain.totalFullAllowedTrucks}
                    data={data?.result.bookings!}
                  />
                </Grid>

                <Grid xs={12} md={6}>
                  <Card>
                    <CardHeader title="مواعيد في إنتظار التوريد اليوم" />
                    {data?.result.branchesTodayWaitingApps!.length! > 0 && (
                      <CardContent
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <AppsPieN
                          series={[
                            data?.result.branchesTodayWaitingApps[0]?.appsCounter!,
                            data?.result.branchesTodayWaitingApps[1]?.appsCounter!,
                            data?.result.branchesTodayWaitingApps[2]?.appsCounter!,
                            data?.result.branchesTodayWaitingApps[3]?.appsCounter!,
                            data?.result.branchesTodayWaitingApps[4]?.appsCounter!,
                            data?.result.branchesTodayWaitingApps[5]?.appsCounter!,
                            data?.result.branchesTodayWaitingApps[6]?.appsCounter!,
                            data?.result.branchesTodayWaitingApps[7]?.appsCounter!,
                          ]}
                          labels={[
                            data?.result.branchesTodayWaitingApps[0]?.branchName!,
                            data?.result.branchesTodayWaitingApps[1]?.branchName!,
                            data?.result.branchesTodayWaitingApps[2]?.branchName!,
                            data?.result.branchesTodayWaitingApps[3]?.branchName!,
                            data?.result.branchesTodayWaitingApps[4]?.branchName!,
                            data?.result.branchesTodayWaitingApps[5]?.branchName!,
                            data?.result.branchesTodayWaitingApps[6]?.branchName!,
                            data?.result.branchesTodayWaitingApps[7]?.branchName!,
                          ]}
                        />
                      </CardContent>
                    )}
                    {data?.result.branchesTodayWaitingApps!.length! == 0 && (
                      <CardContent>لا توجد مواعيد توريد اليوم</CardContent>
                    )}
                  </Card>
                </Grid>
                <Grid xs={12} md={6}>
                  <Card>
                    <CardHeader title="مواعيد في إنتظار التوريد الى نهاية الموسم" />
                    <CardContent
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <AppsPie
                        series={[
                          data?.result.dashBranch[0].cntWaiting!,
                          data?.result.dashBranch[1].cntWaiting!,
                          data?.result.dashBranch[2].cntWaiting!,
                          data?.result.dashBranch[3].cntWaiting!,
                          data?.result.dashBranch[4].cntWaiting!,
                          data?.result.dashBranch[5].cntWaiting!,
                          data?.result.dashBranch[6].cntWaiting!,
                          data?.result.dashBranch[7].cntWaiting!,
                        ]}
                      />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid xs={12} md={6}>
                  <Card>
                    <CardHeader title="عدد المزارعين المُسجلين لتوريد القمح" />
                    <CardContent>
                      <ChartColumnMultiple
                        //id "chartId"
                        series={[
                          {
                            name: 'الموسم الحالي 2024',
                            data: [
                              data?.result.seasonFarmsCounter[0].cntS6Farms!,
                              data?.result.seasonFarmsCounter[1].cntS6Farms!,
                              data?.result.seasonFarmsCounter[2].cntS6Farms!,
                              data?.result.seasonFarmsCounter[3].cntS6Farms!,
                              data?.result.seasonFarmsCounter[4].cntS6Farms!,
                              data?.result.seasonFarmsCounter[5].cntS6Farms!,
                              data?.result.seasonFarmsCounter[6].cntS6Farms!,
                              data?.result.seasonFarmsCounter[7].cntS6Farms!,
                              data?.result.seasonFarmsCounter[8].cntS6Farms!,
                            ],
                            labels: ['غير محدد'].concat(labels),
                          },
                          {
                            name: 'الموسم السابق 2023',
                            data: [
                              data?.result.seasonFarmsCounter[0].cntS5Farms!,
                              data?.result.seasonFarmsCounter[1].cntS5Farms!,
                              data?.result.seasonFarmsCounter[2].cntS5Farms!,
                              data?.result.seasonFarmsCounter[3].cntS5Farms!,
                              data?.result.seasonFarmsCounter[4].cntS5Farms!,
                              data?.result.seasonFarmsCounter[5].cntS5Farms!,
                              data?.result.seasonFarmsCounter[6].cntS5Farms!,
                              data?.result.seasonFarmsCounter[7].cntS5Farms!,
                              data?.result.seasonFarmsCounter[8].cntS5Farms!,
                            ],
                            labels: ['غير محدد'].concat(labels),
                          },
                        ]}
                      />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid xs={12} md={6}>
                  {/* <BookingBooked
                  title={'الشاحنات المستلمة'}
                  total={data?.result.dashMain.cntUsed!}
                  data={data?.result.trucksStatus!}
                /> */}
                  <Card>
                    <CardHeader
                      title="الشاحنات المستلمة"
                      action={<b>({fShortenNumber_(data?.result.dashMain.cntUsed!)})</b>}
                    />
                    <CardContent
                      sx={{
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Stack spacing={3}>
                        <AppWidget
                          title="عدد الشاحنات المقبولة"
                          total={data?.result.dashMain.cntAccepted!}
                          icon="solar:user-rounded-bold"
                          chart={{
                            series: Number(
                              fNumber(
                                (data?.result.dashMain.cntAccepted! /
                                  data?.result.dashMain.cntUsed!) *
                                  100
                              )
                            ),
                          }}
                        />
                        <AppWidget
                          title="عدد الشاحنات المرفوضة"
                          total={data?.result.dashMain.cntRejected!}
                          icon="fluent:mail-24-filled"
                          sx={{ backgroundColor: '#8f4242' }}
                          chart={{
                            series: Number(
                              fNumber(
                                (data?.result.dashMain.cntRejected! /
                                  data?.result.dashMain.cntUsed!) *
                                  100
                              )
                            ),
                          }}
                        />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid xs={12} md={6}>
                  <Card>
                    <CardHeader title="أسباب رفض الشاحنات" />
                    <CardContent
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <AppsPieN
                        series={[
                          data?.result.trucksRejectReasons[0].counter!,
                          data?.result.trucksRejectReasons[1].counter!,
                          data?.result.trucksRejectReasons[2].counter!,
                          data?.result.trucksRejectReasons[3].counter!,
                          data?.result.trucksRejectReasons[4].counter!,
                          data?.result.trucksRejectReasons[5].counter!,
                          data?.result.trucksRejectReasons[6].counter!,
                          data?.result.trucksRejectReasons[7].counter!,
                        ]}
                        labels={[
                          data?.result.trucksRejectReasons[0].rejectReasons!,
                          data?.result.trucksRejectReasons[1].rejectReasons!,
                          data?.result.trucksRejectReasons[2].rejectReasons!,
                          data?.result.trucksRejectReasons[3].rejectReasons!,
                          data?.result.trucksRejectReasons[4].rejectReasons!,
                          data?.result.trucksRejectReasons[5].rejectReasons!,
                          data?.result.trucksRejectReasons[6].rejectReasons!,
                          data?.result.trucksRejectReasons[7].rejectReasons!,
                        ]}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid xs={12} md={6}>
                  <Card>
                    <CardHeader title="متوسط نسبة الشوائب بين الفروع" />
                    <CardContent
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <AppsPieN
                        series={[
                          data?.result.branchesTrucksDockages[0].dockageDeductionAverage!,
                          data?.result.branchesTrucksDockages[1].dockageDeductionAverage!,
                          data?.result.branchesTrucksDockages[2].dockageDeductionAverage!,
                          data?.result.branchesTrucksDockages[3].dockageDeductionAverage!,
                          data?.result.branchesTrucksDockages[4].dockageDeductionAverage!,
                          data?.result.branchesTrucksDockages[5].dockageDeductionAverage!,
                          data?.result.branchesTrucksDockages[6].dockageDeductionAverage!,
                          data?.result.branchesTrucksDockages[7].dockageDeductionAverage!,
                        ]}
                        labels={[
                          data?.result.branchesTrucksDockages[0].branchName!,
                          data?.result.branchesTrucksDockages[1].branchName!,
                          data?.result.branchesTrucksDockages[2].branchName!,
                          data?.result.branchesTrucksDockages[3].branchName!,
                          data?.result.branchesTrucksDockages[4].branchName!,
                          data?.result.branchesTrucksDockages[5].branchName!,
                          data?.result.branchesTrucksDockages[6].branchName!,
                          data?.result.branchesTrucksDockages[7].branchName!,
                        ]}
                      />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid xs={12} md={6}>
                  <Card>
                    <CardHeader title="مقارنة استلام الشاحنات بالفروع" />
                    <CardContent>
                      <SeasonWeightTotalChart
                        series={[
                          {
                            name: 'الشاحنات المستلمة',
                            data: [
                              data?.result.branchesTrucks[0].trucksAccepted!,
                              data?.result.branchesTrucks[1].trucksAccepted!,
                              data?.result.branchesTrucks[2].trucksAccepted!,
                              data?.result.branchesTrucks[3].trucksAccepted!,
                              data?.result.branchesTrucks[4].trucksAccepted!,
                              data?.result.branchesTrucks[5].trucksAccepted!,
                              data?.result.branchesTrucks[6].trucksAccepted!,
                              data?.result.branchesTrucks[7].trucksAccepted!,
                            ],
                            labels,
                          },
                          {
                            name: 'الشاحنات المرفوضة',
                            data: [
                              data?.result.branchesTrucks[0].trucksRejeced!,
                              data?.result.branchesTrucks[1].trucksRejeced!,
                              data?.result.branchesTrucks[2].trucksRejeced!,
                              data?.result.branchesTrucks[3].trucksRejeced!,
                              data?.result.branchesTrucks[4].trucksRejeced!,
                              data?.result.branchesTrucks[5].trucksRejeced!,
                              data?.result.branchesTrucks[6].trucksRejeced!,
                              data?.result.branchesTrucks[7].trucksRejeced!,
                            ],
                            labels,
                          },
                        ]}
                      />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid xs={12} md={6}>
                  <Card>
                    <CardHeader title="مقارنة صافي القمح المستلم مع اجمالي الموسم السابق" />
                    <CardContent>
                      <ChartColumnMultiple
                        series={[
                          {
                            name: 'الموسم الحالي 2024',
                            data: [
                              data?.result.seasonWeightTotal[0].smS6Weight!,
                              data?.result.seasonWeightTotal[1].smS6Weight!,
                              data?.result.seasonWeightTotal[2].smS6Weight!,
                              data?.result.seasonWeightTotal[3].smS6Weight!,
                              data?.result.seasonWeightTotal[4].smS6Weight!,
                              data?.result.seasonWeightTotal[5].smS6Weight!,
                              data?.result.seasonWeightTotal[6].smS6Weight!,
                              data?.result.seasonWeightTotal[7].smS6Weight!,
                            ],
                            labels,
                          },
                          {
                            name: 'الموسم السابق 2023',
                            data: [
                              data?.result.seasonWeightTotal[0].smS5Weight!,
                              data?.result.seasonWeightTotal[1].smS5Weight!,
                              data?.result.seasonWeightTotal[2].smS5Weight!,
                              data?.result.seasonWeightTotal[3].smS5Weight!,
                              data?.result.seasonWeightTotal[4].smS5Weight!,
                              data?.result.seasonWeightTotal[5].smS5Weight!,
                              data?.result.seasonWeightTotal[6].smS5Weight!,
                              data?.result.seasonWeightTotal[7].smS5Weight!,
                            ],
                            labels,
                          },
                        ]}
                      />
                    </CardContent>
                    {subtitleText}
                  </Card>
                </Grid>
                <Grid xs={12} md={6}>
                  <Card>
                    <CardHeader title="مقارنة صافي القمح المستلم مع نفس الفترة الموسم السابق" />
                    <CardContent>
                      <ChartColumnMultiple
                        series={[
                          {
                            name: 'الموسم الحالي 2024',
                            data: [
                              data?.result.seasonDateWeightTotal[0].smS6Weight!,
                              data?.result.seasonDateWeightTotal[1].smS6Weight!,
                              data?.result.seasonDateWeightTotal[2].smS6Weight!,
                              data?.result.seasonDateWeightTotal[3].smS6Weight!,
                              data?.result.seasonDateWeightTotal[4].smS6Weight!,
                              data?.result.seasonDateWeightTotal[5].smS6Weight!,
                              data?.result.seasonDateWeightTotal[6].smS6Weight!,
                              data?.result.seasonDateWeightTotal[7].smS6Weight!,
                            ],
                            labels,
                          },
                          {
                            name: 'الموسم السابق 2023',
                            data: [
                              data?.result.seasonDateWeightTotal[0].smS5Weight!,
                              data?.result.seasonDateWeightTotal[1].smS5Weight!,
                              data?.result.seasonDateWeightTotal[2].smS5Weight!,
                              data?.result.seasonDateWeightTotal[3].smS5Weight!,
                              data?.result.seasonDateWeightTotal[4].smS5Weight!,
                              data?.result.seasonDateWeightTotal[5].smS5Weight!,
                              data?.result.seasonDateWeightTotal[6].smS5Weight!,
                              data?.result.seasonDateWeightTotal[7].smS5Weight!,
                            ],
                            labels,
                          },
                        ]}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </div>

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
          <Grid container spacing={SPACING} disableEqualOverflow>
            <Grid xs={12}>
              <BookingDetails
                id="actionInBranch"
                title="بيان العمليات بالفروع"
                tableData={data?.result.dashBranch!}
                //tableData={_bookings}
                tableLabels={[
                  { id: 'branchLabel', label: 'الفرع' },
                  { id: 'cntBranchSelected', label: 'حجز المقر' },
                  { id: 'smQty', label: 'الكميات المخصصة' },
                  { id: 'smWeight', label: 'الوزن المستلم' },
                  { id: 'smCleanWeight', label: 'الوزن الصافي' },
                  { id: 'smDockage', label: 'الشوائب' },
                  { id: 'totalFullAllowedTrucks', label: 'اجمالي المواعيد' },
                  { id: 'totalAllowedTrucks', label: 'مواعيد متاحة للحجز' },
                  { id: 'cntUsed', label: 'مواعيد مستخدمة' },
                  { id: 'cntWaiting', label: 'مواعيد بإنتظار التوريد' },
                  { id: 'cntDateOver', label: 'مواعيد منتهية' },
                  { id: 'cntProcessing', label: 'شاحنات تحت المعالجة' },
                  { id: 'cntAccepted', label: 'شاحنات مقبولة' },
                  { id: 'cntRejected', label: 'شاحنات مرفوضة' },
                ]}
              />
            </Grid>

            <Grid xs={12}>
              <RejectDetails
                title="بيان الشاحنات المستلمة"
                tableData={data?.result.dashBranch!}
                //tableData={_bookings}
                tableLabels={[
                  { id: 'branchLabel', label: 'الفرع' },
                  { id: 'cntAccepted', label: 'مقبول' },
                  { id: 'acceptedSaudi1', label: 'سعودي 1' },
                  { id: 'acceptedSaudi2', label: 'سعودي 2' },
                  { id: 'cntRejected', label: 'مرفوض' },
                  { id: 'rejectReason5', label: 'إنخفاض الوزن النوعي' },
                  { id: 'rejectReason8', label: 'إصابة حشرية (حية)' },
                  { id: 'rejectReason10', label: 'إرتفاع نسبة الرطوبة' },
                  { id: 'rejectReason13', label: 'شوائب زائدة' },
                  { id: 'rejectReason14', label: 'حبوب متعفنة' },
                ]}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}
