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
import { fTon } from 'src/utils/format-number';
import LocationsView from './locations-view';
import { DataArrayOutlined } from '@mui/icons-material';
const SPACING = 3;

type result = {
  customerLocations: customerLocations[];
};
type customerLocations = {
  customerId: number;
  customerName: string;
  companyName: string;
  branchName: string;
  tradeName: string;
  activityTypeTitle: string;
  ustomerTypeTitle: string;
  qtyInTons: number;
  baladyName: string;
  amanahName: string;
  baladiaName: string;
  activitiesISIC: string;
  shopArea: number;
  latitude: string;
  longitude: string;
  licenseStatus: string;
};
type MarkerData = Array<{
  id: string;
  position: google.maps.LatLngLiteral;
  type: 'pin' | 'html';
  zIndex: number;
  title: string;
}>;
let companiesLabels = [
  {
    id: 1,
    name: 'الشركة الأولى',
  },
  {
    id: 2,
    name: 'الشركة العربية',
  },
  {
    id: 3,
    name: 'الشركة الحديثة',
  },
  {
    id: 4,
    name: 'الشركة الرابعة',
  },
];

let amanahLabels = [
  {
    id: '0',
    name: 'الكل',
    position: {
      lat: '24.636715242703122',
      lng: '46.71011663587046',
    },
  },
  {
    id: '14',
    name: 'أمانة الحدود الشمالية',
    position: {
      lat: '30.9510830914088',
      lng: '41.03462454099582',
    },
  },
  {
    id: '2',
    name: 'أمانة العاصمة المقدسة',
    position: {
      lat: '21.424226709305636',
      lng: '39.81886483569553',
    },
  },
  {
    id: '5',
    name: 'أمانة المنطقة الشرقية',
    position: {
      lat: '26.422768721111808',
      lng: '50.08822973722821',
    },
  },
  {
    id: '17',
    name: 'أمانة حفر الباطن',
    position: {
      lat: '28.360038346311963',
      lng: '45.99747118325542',
    },
  },
  {
    id: '15',
    name: 'أمانة محافظة الطائف',
    position: {
      lat: '21.284756483693922',
      lng: '40.42554769509086',
    },
  },
  {
    id: '4',
    name: 'أمانة محافظة جدة',
    position: {
      lat: '21.53113108113935',
      lng: '39.16217180266294',
    },
  },
  {
    id: '16',
    name: 'أمانة منطقة الاحساء',
    position: {
      lat: '25.449718812792604',
      lng: '49.79772491038128',
    },
  },
  {
    id: '9',
    name: 'أمانة منطقة الباحة',
    position: {
      lat: '20.01376910620023',
      lng: '41.46888176538486',
    },
  },
  {
    id: '13',
    name: 'أمانة منطقة الجوف',
    position: {
      lat: '29.891002953893018',
      lng: '40.272550567079236',
    },
  },
  {
    id: '383',
    name: 'أمانة منطقة الجوف',
    position: {
      lat: '29.891002953893018',
      lng: '40.272550567079236',
    },
  },
  {
    id: '1',
    name: 'أمانة منطقة الرياض',
    position: {
      lat: '24.636715242703122',
      lng: '46.71011663587046',
    },
  },
  {
    id: '6',
    name: 'أمانة منطقة القصيم',
    position: {
      lat: '26.366079641141155',
      lng: '44.05935767619859',
    },
  },
  {
    id: '3',
    name: 'أمانة منطقة المدينة المنورة',
    position: {
      lat: '24.47660761735575',
      lng: '39.612737434957246',
    },
  },
  {
    id: '10',
    name: 'أمانة منطقة تبوك',
    position: {
      lat: '28.386895383203587',
      lng: '36.56452588404875',
    },
  },
  {
    id: '11',
    name: 'أمانة منطقة جازان',
    position: {
      lat: '16.89157798341067',
      lng: '42.56922845885426',
    },
  },
  {
    id: '8',
    name: 'أمانة منطقة حائل',
    position: {
      lat: '27.513595519913682',
      lng: '41.71739213955289',
    },
  },
  {
    id: '7',
    name: 'أمانة منطقة عسير',
    position: {
      lat: '18.28902355254102',
      lng: '42.59582653095056',
    },
  },
  {
    id: '12',
    name: 'أمانة منطقة نجران',
    position: {
      lat: '17.56404627288342',
      lng: '44.228909690712385',
    },
  },
  // {
  //   id: '5',
  //   name: 'القطيف',
  //   position: {
  //     lat: '26.576303360962463',
  //     lng: '50.00178249504035',
  //   },
  // },
];
const defaultFilters = {
  amanahCode: '1',
  customerTypeId: 0,
  branchId: 0,
  mcId: 0,
  itemCatId: 0,
};
export default function MainView() {
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
  defaultFilters.amanahCode,
    defaultFilters.mcId,
    defaultFilters.branchId,
    defaultFilters.customerTypeId,
    defaultFilters.itemCatId;
  const getData = useCallback(
    async (
      amanahCode: string,
      mcId: number,
      branchId: number,
      customerTypeId: number,
      itemCatId: number
    ) => {
      const filterData = {
        amanahCode,
        mcId,
        branchId,
        customerTypeId,
        itemCatId,
      };
      setErrorMsg('');
      setIsLoading(true);
      const res = await axios.post(endpoints.dashM.getCustomerLocations, filterData);
      // dashY: (data?.result as IDashYSales
      const { isSuccess, result, errorMessages, httpStatusCode } = res.data;
      setIsLoading(false);
      if (isSuccess) {
        const { result } = res.data.result;
        setResult(result);
        const data: MarkerData = [];
        result.customerLocations.map((item: customerLocations) => {
          data.push({
            id: `${item.customerId + ':' + item.customerName + ' | ' + item.tradeName + ' '}`,
            position: { lat: +item.latitude, lng: +item.longitude },
            zIndex: 1,
            title: `${
              item.companyName + ' | ' + item.branchName + ' | ' + fTon(item.qtyInTons) + ' '
            }`,
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
      defaultFilters.amanahCode,
      defaultFilters.mcId,
      defaultFilters.branchId,
      defaultFilters.customerTypeId,
      defaultFilters.itemCatId
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
  function handleChangeAmanah(event: SelectChangeEvent) {
    handleFiltersText('amanahCode', event.target.value);
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
      filters.amanahCode,
      filters.mcId,
      filters.branchId,
      filters.customerTypeId,
      filters.itemCatId
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
        position={amanahLabels.filter((item) => item.id == filters.amanahCode)[0].position}
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
      <Container maxWidth={false} id="fullPage">
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
                مواقع عملاء الدقيق وفق احداثيات الجهات الصادرة للرخص (بلدي | صناعي)
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
                      <InputLabel>اختر الأمانة</InputLabel>
                      <Select
                        value={filters.amanahCode.toString()}
                        onChange={(e: any) => handleChangeAmanah(e)}
                        input={<OutlinedInput label="الأمانة" />}
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {amanahLabels.map((item) => (
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
                            {option.name}
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
