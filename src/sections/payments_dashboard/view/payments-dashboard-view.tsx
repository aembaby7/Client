'use client';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import { useSettingsContext } from 'src/components/settings';
import { useAuthContext } from 'src/auth/hooks';
import { useTranslate } from 'src/locales';
import axios, { fetcher, endpoints } from 'src/utils/axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import {
  Alert,
  Typography,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  OutlinedInput,
  SelectChangeEvent,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { LoadingScreen } from 'src/components/loading-screen';
import EmptyContent from 'src/components/empty-content';
import Grid from '@mui/material/Unstable_Grid2';

import BookingWidgetSummary from '../booking-widget-summary';
import WarehouseTwoToneIcon from '@mui/icons-material/WarehouseTwoTone';
import LocalAtmTwoToneIcon from '@mui/icons-material/LocalAtmTwoTone';
import { DateRangeIcon } from '@mui/x-date-pickers';
import { ImportContacts, ImportContactsOutlined } from '@mui/icons-material';

const SPACING = 3;
let SeasonLabels = [
  {
    id: 8,
    name: 'موسم 2025',
  },
  {
    id: 7,
    name: 'موسم 2024 / الكميات الإضافية',
  },
  {
    id: 6,
    name: 'موسم 2024',
  },
];

const defaultFilters = {
  seasonId: 8,
};
type payment = {
  seasonId: number;
  cntLines: number;
  smCleanWeight: number;
  smProteinDeduction: number;
  smAmountToPay: number;
  smZakatPayToDate: number;
  smVAT: number;
  smPayToDate: number;
  smADFOperationDeducted: number;
  smADFDeducted: number;
  smREDFDeducted: number;
  smDeducted: number;
  smNetAmount: number;
};
export default function MahsoliPaymentsDashboardView() {
  const [resResult, setResResult] = useState<payment>();
  const [showContent, setShowContent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState('');

  const theme = useTheme();
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const [filters, setFilters] = useState(defaultFilters);

  const getData = useCallback(async (seasonId: number) => {
    const filterData = {
      seasonId,
    };
    setErrorMsg('');
    setIsLoading(true);
    const res = await axios.post(endpoints.dashPayments.getPaymentsDashboard, filterData);
    const { isSuccess, result, errorMessages, httpStatusCode } = res.data;
    setIsLoading(false);
    if (isSuccess) {
      const { result } = res.data;
      setResResult(result.dashMain);
      setShowContent(true);
    } else {
      setErrorMsg('لم يتم تحميل البيانات المطلوبة، يرجى التواصل مع مدير النظام');
      setShowContent(false);
    }
  }, []);

  useEffect(() => {
    getData(defaultFilters.seasonId);
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
  function handleChangeSeason(event: SelectChangeEvent) {
    handleFilters('seasonId', Number(event.target.value));
  }
  function handleOnClick() {
    getData(filters.seasonId);
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
      <Grid xs={12} md={4}>
        <BookingWidgetSummary
          // sx={{ backgroundColor: '#009688', color: '#fff' }}
          title={t('عدد الرخص')}
          total={resResult?.cntLines!}
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
          total={resResult?.smCleanWeight!}
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
          total={resResult?.smProteinDeduction!}
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
          total={resResult?.smAmountToPay!}
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
          total={resResult?.smZakatPayToDate!}
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
          total={resResult?.smVAT!}
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
          total={resResult?.smPayToDate!}
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
          total={resResult?.smADFOperationDeducted!}
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
          total={resResult?.smADFDeducted!}
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
          total={resResult?.smREDFDeducted!}
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
          total={resResult?.smDeducted!}
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
          total={resResult?.smNetAmount!}
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
  );
  return (
    <>
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
                بيان مستحقات مزارعي القمح المحلي
              </Typography>
              <Box sx={{ mt: 3, mb: 1 }}>
                <Grid container spacing={1} alignItems="center">
                  <Grid xs={12} sm={3}>
                    <FormControl
                      sx={{
                        flexShrink: 0,
                      }}
                      fullWidth
                    >
                      <InputLabel>اختر الموسم</InputLabel>
                      <Select
                        value={filters.seasonId}
                        onChange={(e: any) => handleChangeSeason(e)}
                        input={<OutlinedInput label="الموسم" />}
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {SeasonLabels.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
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
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
          {!!errorMsg && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {errorMsg}
            </Alert>
          )}
          {isLoading ? renderLoading : showContent && renderDash}
        </Box>
      </Container>
    </>
  );
}
