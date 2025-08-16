'use client';

import * as Yup from 'yup';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';

import { useSettingsContext } from 'src/components/settings';
import { Alert, Grid, InputAdornment, MenuItem, Stack } from '@mui/material';
import { t } from 'i18next';
import { RHFSelect } from 'src/components/hook-form/rhf-select';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider from 'src/components/hook-form/form-provider';
import { useState } from 'react';
import axios, { endpoints } from 'src/utils/axios';
import { LoadingButton } from '@mui/lab';
import Loading from 'src/app/dashboard/loading';
import { RHFTextField } from 'src/components/hook-form';
import { useAuthContext } from 'src/auth/hooks';
import RHFRadioGroup from '../hook-form/rhf-radio-group';

export default function ContactUs() {
  const settings = useSettingsContext();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>();
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isAllowed, setIsAllowed] = useState<boolean>(true);

  const defaultValues = {
    service: '',
    type: '',
    body: '',
  };
  const branchSelectionSchema = Yup.object().shape({
    service: Yup.string().required('مطلوب اختيار الخدمة'),
    type: Yup.string().required('مطلوب اختيار نوع الرسالة'),
    body: Yup.string().required('مطلوب ادخال محتوى الرسالة'),
  });
  const methods = useForm({
    resolver: yupResolver(branchSelectionSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = handleSubmit(async (data) => {
    setSuccessMsg('');
    setErrorMsg('');
    let res = await axios.post(endpoints.farmer.contact, {
      service: data.service,
      type: data.type,
      body: data.body,
      ownerId: user?.idNumber.toString(),
    });
    const { isSuccess, result, errorMessages, httpStatusCode } = res.data;
    if (isSuccess) {
      setSuccessMsg(result);
      enqueueSnackbar(result, {
        variant: 'success',
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      });
      setIsAllowed(false);
    } else {
      setErrorMsg(errorMessages);
    }
  });

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'left',
          padding: (theme) => theme.spacing(2),
          borderRadius: '10px',
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
          backgroundColor: 'rgb(4 131 122 / 3%)',
          marginBottom: '30px',
        }}
      >
        {!!errorMsg && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {errorMsg}
          </Alert>
        )}
        {!!successMsg && <Alert sx={{ mt: 3 }}>{successMsg}</Alert>}
        {isLoading && (
          <Stack style={{ margin: '20px' }}>
            <Loading />
          </Stack>
        )}
        {!isLoading && isAllowed && (
          <FormProvider methods={methods} onSubmit={onSubmit}>
            <Stack spacing={1.5}></Stack>

            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <RHFSelect
                    fullWidth
                    name="service"
                    label="اختر الخدمة"
                    InputLabelProps={{ shrink: true }}
                    PaperPropsSx={{ textTransform: 'capitalize' }}
                  >
                    <MenuItem key={1} value="1">
                      عرض لوحة البيانات
                    </MenuItem>
                    <MenuItem key={2} value="2">
                      تحديث البيانات الأساسية
                    </MenuItem>
                    <MenuItem key={3} value="3">
                      حجز المقر
                    </MenuItem>
                    <MenuItem key={4} value="4">
                      حجز موعد
                    </MenuItem>
                    <MenuItem key={5} value="5">
                      الغاء المقر
                    </MenuItem>
                    <MenuItem key={6} value="6">
                      الغاء موعد
                    </MenuItem>
                    <MenuItem key={7} value="7">
                      الغاء موعد
                    </MenuItem>
                    <MenuItem key={8} value="8">
                      عرض المواعيد المحجوزة
                    </MenuItem>
                    <MenuItem key={9} value="9">
                      اقفال حساب المزارع
                    </MenuItem>
                    <MenuItem key={10} value="10">
                      عرض المستحقات المالية
                    </MenuItem>
                    <MenuItem key={11} value="11">
                      اخرى
                    </MenuItem>
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <RHFRadioGroup
                    row
                    name="type"
                    label="نوع الرسالة"
                    spacing={4}
                    options={[
                      { value: '1', label: 'شكوى' },
                      { value: '2', label: 'اقتراح' },
                      { value: '3', label: 'مشكلة فنية' },
                    ]}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <RHFTextField name="body" label="محتوى الرسالة" multiline rows={3} />
                </Grid>
              </Grid>
            </Box>
            <LoadingButton
              fullWidth
              color="primary"
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
              sx={{ mt: 3, mb: 2 }}
            >
              ارسال
            </LoadingButton>
          </FormProvider>
        )}
      </Box>
    </Container>
  );
}
