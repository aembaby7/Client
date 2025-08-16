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
  TextField,
  InputAdornment,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { LoadingScreen } from 'src/components/loading-screen';
import EmptyContent from 'src/components/empty-content';
import Grid from '@mui/material/Unstable_Grid2';
import { fTon } from 'src/utils/format-number';
import LocationsView from './locations-view';
import { DataArrayOutlined } from '@mui/icons-material';
import Iconify from 'src/components/iconify';
const SPACING = 3;
type farmLocationFilter = {
  seasonId?: number;
  idNumber?: string;
  certificateNumber?: string;
  farmCode?: number;
  farmName?: string;
  clientName?: string;
  branchId?: number;
  regionId?: number;
  cityId?: number;
  qtyLevelType?: string;
  text: string;
};
type result = {
  farmLocations: farmLocations[];
};
type farmLocations = {
  farmId: number;
  seasonId?: number | null;
  moiId?: number | null;
  certificateNumber?: string | null;
  farmCode?: number | null;
  ownerId?: number | null;
  farmDisplayName?: string | null;
  displayName?: string | null;
  nafathName?: string | null;
  idNumber?: string | null;
  qty?: number | null;
  isFarmEnabled?: boolean | null;
  branchID?: number | null;
  branchConfirmedDate?: Date | null;
  branchEndDate?: Date | null;
  regionId?: number | null;
  cityId?: number | null;
  lat?: string | null;
  long?: string | null;
  branchName?: string | null;
  branchSName?: string | null;
  region?: string | null;
  city?: string | null;
  qtyLevelType?: string | null;
};
type MarkerData = Array<{
  id: string;
  position: google.maps.LatLngLiteral;
  type: 'pin' | 'html';
  zIndex: number;
  title: string;
}>;
let seasonLabels = [
  { id: 8, name: 'موسم 2025' },
  { id: 7, name: 'موسم 2024/ الكميات الإضافية' },
  { id: 6, name: 'موسم 2024' },
];
let branchLabels = [
  { id: 25, name: 'فرع الأحساء' },
  { id: 18, name: 'فرع الجوف' },
  { id: 17, name: 'فرع الخرج' },
  { id: 12, name: 'فرع الرياض' },
  { id: 15, name: 'فرع القصيم' },
  { id: 19, name: 'فرع تبوك' },
  { id: 20, name: 'فرع حائل' },
  { id: 21, name: 'فرع وادي الدواسر' },
];
let regionsLabels = [
  {
    id: -1,
    name: 'الكل',
    position: {
      lat: '24.636715242703122',
      lng: '46.71011663587046',
    },
  },
  {
    id: 4,
    name: 'الجوف',
    position: {
      lat: '29.891002953893018',
      lng: '40.272550567079236',
    },
  },
  {
    id: 2,
    name: 'الرياض',
    position: {
      lat: '24.636715242703122',
      lng: '46.71011663587046',
    },
  },
  {
    id: 3,
    name: 'القصيم',
    position: {
      lat: '26.366079641141155',
      lng: '44.05935767619859',
    },
  },
  {
    id: 0,
    name: 'المنطقة الشرقية',
    position: {
      lat: '26.422768721111808',
      lng: '50.08822973722821',
    },
  },
  {
    id: 5,
    name: 'تبوك',
    position: {
      lat: '28.386895383203587',
      lng: '36.56452588404875',
    },
  },
  {
    id: 1,
    name: 'حائل',
    position: {
      lat: '27.513595519913682',
      lng: '41.71739213955289',
    },
  },
];
let citiesList = [
  { id: 33, name: 'الأسياح', regionId: 3 },
  { id: 15, name: 'الأفلاج', regionId: 2 },
  { id: 34, name: 'البدائع', regionId: 3 },
  { id: 35, name: 'البطين', regionId: 3 },
  { id: 36, name: 'البكيرية', regionId: 3 },
  { id: 17, name: 'الخرج', regionId: 2 },
  { id: 11, name: 'الخطة', regionId: 1 },
  { id: 18, name: 'الدوادمي', regionId: 2 },
  { id: 19, name: 'الرياض', regionId: 2 },
  { id: 20, name: 'الزلفي', regionId: 2 },
  { id: 21, name: 'السليل', regionId: 2 },
  { id: 12, name: 'الشنان', regionId: 1 },
  { id: 6, name: 'الصرار', regionId: 0 },
  { id: 22, name: 'الغاط', regionId: 2 },
  { id: 23, name: 'الفيضة', regionId: 2 },
  { id: 42, name: 'القريات', regionId: 4 },
  { id: 24, name: 'القويعية', regionId: 2 },
  { id: 25, name: 'المجمعة', regionId: 2 },
  { id: 37, name: 'المذنب', regionId: 3 },
  { id: 26, name: 'المزاحمية', regionId: 2 },
  { id: 50, name: 'النعيرية', regionId: 0 },
  { id: 7, name: 'الهفوف', regionId: 0 },
  { id: 38, name: 'بريدة', regionId: 3 },
  { id: 13, name: 'بقعاء', regionId: 1 },
  { id: 46, name: 'تبوك', regionId: 5 },
  { id: 47, name: 'تيماء', regionId: 5 },
  { id: 14, name: 'حائل', regionId: 1 },
  { id: 8, name: 'حفر الباطن', regionId: 0 },
  { id: 27, name: 'حوطة بني تميم', regionId: 2 },
  { id: 28, name: 'خف', regionId: 2 },
  { id: 43, name: 'دومة الجندل', regionId: 4 },
  { id: 39, name: 'رياض الخبراء', regionId: 3 },
  { id: 29, name: 'ساجر', regionId: 2 },
  { id: 44, name: 'سكاكا', regionId: 4 },
  { id: 30, name: 'شقراء', regionId: 2 },
  { id: 45, name: 'طبرجل', regionId: 4 },
  { id: 40, name: 'عنيزة', regionId: 3 },
  { id: 41, name: 'عيون الجواء', regionId: 3 },
  { id: 9, name: 'قرية العليا', regionId: 0 },
  { id: 31, name: 'مرات', regionId: 2 },
  { id: 10, name: 'مليجة', regionId: 0 },
  { id: 32, name: 'وادي الدواسر', regionId: 2 },
];

const defaultFilters = {
  seasonId: 8,
  idNumber: '',
  certificateNumber: '',
  farmName: '',
  clientName: '',
  farmCode: 0,
  branchId: 0,
  regionId: -1,
  cityId: 0,
  qtyLevelType: 'A',
  text: '',
};
export default function MahsoliLocationsMainView() {
  let isAdmin: boolean = true;
  const [result, setResult] = useState<result>();
  const [markers, setMarkers] = useState<MarkerData>([]);

  const [showContent, setShowContent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState('');

  const theme = useTheme();
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const [filters, setFilters] = useState(defaultFilters);

  const getData = useCallback(
    async (
      seasonId: number,
      farmCode: number,
      farmName: string,
      idNumber: string,
      certificateNumber: string,
      branchId: number,
      regionId: number,
      cityId: number,
      qtyLevelType: string,
      text: string
    ) => {
      const filterData = {
        seasonId,
        farmCode,
        farmName,
        idNumber,
        certificateNumber,
        branchId,
        regionId,
        cityId,
        qtyLevelType,
        text,
      };
      setErrorMsg('');
      setIsLoading(true);
      const res = await axios.post(endpoints.dashboard.getFarmLocations, filterData);
      // dashY: (data?.result as IDashYSales
      const { isSuccess, result, errorMessages, httpStatusCode } = res.data;
      setIsLoading(false);
      if (isSuccess) {
        const { result } = res.data.result;
        setResult(result);
        const data: MarkerData = [];
        result.farmLocations.map((item: farmLocations) => {
          data.push({
            id: `${item.farmCode + ':' + item.farmDisplayName + ' '}`,
            position: { lat: +item.lat!, lng: +item.long! },
            zIndex: 1,
            title: `${item.branchName + ' | منطقة ' + item.region + ' | ' + fTon(item.qty!) + ' '}`,
            type: 'pin', //'pin html'
          });
        });
        setMarkers(data);
        // result.map((item: customerLocations) => {
        //   data.push({
        //     id: item.customerName,
        //     position: { lat: +item.latitude, lng: +item.longitude },
        //     zIndex: 1,
        //     title: `${'الشركة العربية' + ' | ' + fTon(item.qtyInTons) + ' '}`,
        //     type: 'pin', //'pin html'
        //   });
        // });
        // setMarkers(getMarkers());
        setShowContent(true);
      } else {
        setErrorMsg('لم يتم تحميل البيانات المطلوبة، يرجى التواصل مع مدير النظام');
        setShowContent(false);
      }
    },
    []
  );

  useEffect(() => {
    getData(
      defaultFilters.seasonId,
      defaultFilters.farmCode,
      defaultFilters.farmName,
      defaultFilters.idNumber,
      defaultFilters.certificateNumber,
      defaultFilters.branchId,
      defaultFilters.regionId,
      defaultFilters.cityId,
      defaultFilters.qtyLevelType,
      defaultFilters.text
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
  function handleChangeIdNumber(event: SelectChangeEvent) {
    handleFiltersText('idNumber', event.target.value);
  }
  function handleChangeSeason(event: SelectChangeEvent) {
    handleFilters('seasonId', Number(event.target.value));
  }
  function handleChangeRegion(event: SelectChangeEvent) {
    handleFilters('regionId', Number(event.target.value));
    handleFilters('cityId', -1);
  }
  function handleChangeCity(event: SelectChangeEvent) {
    handleFilters('cityId', Number(event.target.value));
  }
  function handleChangeBranch(event: SelectChangeEvent) {
    handleFilters('branchId', Number(event.target.value));
  }
  function handleChangeqtyLevelType(event: SelectChangeEvent) {
    handleFiltersText('qtyLevelType', event.target.value);
  }
  function handleChangeText(event: React.ChangeEvent<HTMLInputElement>) {
    handleFiltersText('text', (event.target as HTMLInputElement).value);
  }
  function handleOnClick() {
    getData(
      filters.seasonId,
      filters.farmCode,
      filters.farmName,
      filters.idNumber,
      filters.certificateNumber,
      filters.branchId,
      filters.regionId,
      filters.cityId,
      filters.qtyLevelType,
      filters.text
    );
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
      <LocationsView
        data1={markers}
        position={regionsLabels.filter((item) => item.id == filters.regionId)[0].position}
      />

      <Grid container spacing={SPACING} disableEqualOverflow>
        <Grid xs={12} md={12}>
          {/*  { props }: { props: MarkerData } */}
        </Grid>
      </Grid>
    </>
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
                مواقع الرخص الزراعية وفق الإحداثيات المعرفة من قبل الوزارة
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
                      <InputLabel>الموسم</InputLabel>
                      <Select
                        value={filters.seasonId.toString()}
                        onChange={(e: any) => handleChangeSeason(e)}
                        input={<OutlinedInput label="الموسم" />}
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {seasonLabels.map((option, index) => (
                          <MenuItem key={index + 1} value={option.id}>
                            {option.name}
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
                        {branchLabels.map((option, index) => (
                          <MenuItem key={index + 1} value={option.id}>
                            {option.name}
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
                      <InputLabel>المنطقة</InputLabel>
                      <Select
                        value={filters.regionId.toString()}
                        onChange={(e: any) => handleChangeRegion(e)}
                        input={<OutlinedInput label="المنطقة" />}
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {regionsLabels.map((option, index) => (
                          <MenuItem key={index + 1} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid xs={12} sm={3}>
                    <FormControl fullWidth>
                      <InputLabel>المدينة</InputLabel>
                      <Select
                        value={filters.cityId.toString()}
                        onChange={(e: any) => handleChangeCity(e)}
                        input={<OutlinedInput label="المحطة" />}
                        sx={{ textTransform: 'capitalize' }}
                      >
                        <MenuItem key={0} value={0}>
                          الكل
                        </MenuItem>
                        {citiesList
                          .filter((obj) => {
                            if (filters.regionId === -1) return obj;
                            if (filters.regionId !== -1 && obj.regionId === filters.regionId)
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
                  <Grid xs={12} sm={3}>
                    <FormControl
                      sx={{
                        flexShrink: 0,
                      }}
                      fullWidth
                    >
                      <InputLabel>الفئة</InputLabel>
                      <Select
                        value={filters.qtyLevelType}
                        onChange={(e: any) => handleChangeqtyLevelType(e)}
                        input={<OutlinedInput label="الفئة" />}
                        sx={{ textTransform: 'capitalize' }}
                      >
                        <MenuItem key={'A'} value={'A'}>
                          الكل
                        </MenuItem>
                        <MenuItem key={'B'} value={'B'}>
                          كبار العملاء
                        </MenuItem>
                        <MenuItem key={'S'} value={'S'}>
                          صغار ومتوسطي العملاء
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <TextField
                      fullWidth
                      value={filters.text}
                      onChange={handleChangeText}
                      placeholder="الإسم/ الهوية / رقم الشهادة / رقم المزرعة..."
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
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
        </Box>
      </Container>
      {isLoading ? renderLoading : showContent && renderDash}
    </>
  );
}
