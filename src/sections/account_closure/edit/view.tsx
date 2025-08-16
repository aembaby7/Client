'use client';

import * as Yup from 'yup';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
} from '@mui/material';
import { t } from 'i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider from 'src/components/hook-form/form-provider';
import { useCallback, useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import Loading from 'src/app/dashboard/loading';
import { RHFUpload } from 'src/components/hook-form/rhf-upload';
import axios, { endpoints } from 'src/utils/axios';
import { HOST_API } from 'src/config-global';
import { RHFSwitch, RHFTextField } from 'src/components/hook-form';
import { RHFSelect } from 'src/components/hook-form/rhf-select';
import RHFAutocomplete from 'src/components/hook-form/rhf-autocomplete';
import { useAuthContext } from 'src/auth/hooks';
import { enqueueSnackbar } from 'src/components/snackbar';
import Upload from 'src/components/upload/upload';
import { fData } from 'src/utils/format-number';
import { fDate, fDateM } from 'src/utils/format-time';

const defaultValues = {
  name: '',
  idNumber: '',
  idType: '',
  dobG: '',
  idExpiryDateG: '',
  phone: '',
  bankId: '',
  iban: '',
  accountHolderName: '',
  hasTax: false,
  ibanFile: null,
  taxCertificate: null,
  taxInvoice: null,
  taxNumber: '',
  closureRequested: false,
  conditionApproved: false,
};
type BankType = {
  id: number;
  name: string;
  code: string;
  label: string;
};
export default function AccountClosureEditView() {
  const settings = useSettingsContext();
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [result, setResult] = useState<any>();
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [notes, setNotes] = useState('');
  const [banks, setBanks] = useState<BankType[]>([]);
  const [hasTax, setHasTax] = useState<boolean>(false);
  const [initialHasTax, setInitialHasTax] = useState<boolean>(false);
  // const [conditionApproved, setConditionApproved] = useState<boolean>(false);
  // const [closureRequested, setClosureRequested] = useState<boolean>(false);
  const [dobG, setDobG] = useState(null);
  const [isAllowed, setIsAllowed] = useState(false);
  useEffect(() => {
    async function getFarmAccountClosure() {
      let res = await axios
        .post(endpoints.transaction.getFarmAccountClosure, {
          farmCode: user?.farmCode,
        })
        .then((res) => {
          const { isSuccess, result, errorMessages, httpStatusCode } = res.data;
          console.log('res', result);
          if (result.status >= 0) {
            setIsLoading(false);
            setIsAllowed(false);

            enqueueSnackbar(
              'تم استقبال طلبكم لإغلاق الحساب في: ' + fDate(result.addDate, 'dd-MM-yyyy'),
              {
                variant: 'success',
                anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
              }
            );
            setSuccessMsg(
              'تم استقبال طلبكم لإغلاق الحساب في: ' + fDate(result.addDate, 'dd-MM-yyyy')
            );
          } else {
            setNotes(result.notes);
            setValue('bankId', result.bankId);
            setValue('iban', result.iBan);
            setValue('accountHolderName', result.holderName);

            const ibanFileFilePaths = result.documents.filter((f: any) => f.documentTypeId == 2);
            if (ibanFileFilePaths.length > 0) {
              setValue('ibanFile', HOST_API + ibanFileFilePaths[0].filePath);
            }

            if (result.vatRegistered) {
              setHasTax(true);
              setInitialHasTax(true);
              setValue('taxNumber', result.vatNumber);

              console.log(result.documents);
              console.log(HOST_API);

              const taxCertificateFilePaths = result.documents.filter(
                (f: any) => f.documentTypeId == 12
              );
              if (taxCertificateFilePaths.length > 0) {
                setValue('taxCertificate', HOST_API + taxCertificateFilePaths[0].filePath);
              }

              const taxInvoiceFilePaths = result.documents.filter(
                (f: any) => f.documentTypeId == 13
              );
              if (taxInvoiceFilePaths.length > 0) {
                setValue('taxInvoice', HOST_API + taxInvoiceFilePaths[0].filePath);
              }
            }

            getFarm();
          }
        });
    }
    getFarmAccountClosure();
  }, []);

  async function getFarm() {
    let res = await axios
      .post(endpoints.farmer.getFarmInfo, {
        farmCode: user?.farmCode,
      })
      .then((res) => {
        const { isSuccess, result, errorMessages, httpStatusCode } = res.data;
        console.log('farm', result);
        setResult(res);
        setBanks(result.banks);
        setValue('name', result.displayName);
        setValue('idNumber', result.idNumber);
        setValue('idType', result.idType);
        setValue('idExpiryDateG', result.idExpiryDateG);
        setValue('dobG', result.dobG);
        setDobG(result.dobG);
        setValue('phone', result.mobileNumber);
        setIsLoading(false);
        setIsAllowed(true);
      });
  }

  const branchSelectionSchema = Yup.object().shape({
    name: Yup.string().required('مطلوب ادخال الإسم'),
    idNumber: Yup.string().required('مطلوب ادخال رقم الهوية'),
    idType: Yup.string().required('مطلوب ادخال نوع الهوية'),
    idExpiryDateG: Yup.string().nullable(),
    dobG: Yup.string().nullable(),
    phone: Yup.string().required('مطلوب ادخال رقم الجوال'),
    bankId: Yup.string().required('مطلوب اختيار البنك'),
    accountHolderName: Yup.string().required('مطلوب ادخال الإسم المذكور بشهادة الحساب البنكي'),
    iban: Yup.string()
      .required('مطلوب ادخال رقم الآيبان')
      .min(22, 'الحد الأدني لرقم الآيبان 24 خانة')
      .max(22, 'الحد الأقصى لرقم الآيبان 24 خانة'),

    closureRequested: Yup.mixed<boolean>().required('يجب طلب الإقفال').nullable(),
    conditionApproved: Yup.mixed<boolean>().required('يجب الموافقة على التعهد').nullable(),
    taxNumber: Yup.string()
      .nullable()
      .when('hasTax', {
        is: true,
        then: (schema) =>
          schema
            .required('مطلوب ادخال الرقم الضريبي')
            .min(8, 'تأكد من ادخال الرقم الضريبي بشكل صحيح'),
      }),

    ibanFile: Yup.mixed<any>().nullable().required('مطلوب رفع صورة الحساب البنكي'),

    taxCertificate: Yup.mixed<any>()
      .nullable()
      .when('hasTax', {
        is: true,
        then: (schema) => {
          return schema.required('مطلوب رفع صورة الشهادة الضريبية');
        },
      }),
    taxInvoice: Yup.mixed<any>()
      .nullable()
      .when('hasTax', {
        is: true,
        then: (schema) => {
          return schema.required('مطلوب رفع صورة الفاتورة الضريبية');
        },
      }),
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
    if (!data.closureRequested) {
      enqueueSnackbar('يلزم تأكيد طلب إقفال الحساب', {
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      });
      return;
    }

    if (!data.conditionApproved) {
      enqueueSnackbar('يلزم الموافقة على التعهد', {
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      });
      return;
    }

    if (!data.ibanFile) {
      enqueueSnackbar('يلزم رفع صورة الحساب البنكي', {
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      });
      return;
    }

    if (hasTax && !data.taxCertificate) {
      enqueueSnackbar('يلزم رفع صورة الشهادة الضريبية', {
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      });
      return;
    }
    if (hasTax && !data.taxInvoice) {
      enqueueSnackbar('يلزم رفع صورة الفاتورة الضريبية', {
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      });
      return;
    }
    setSuccessMsg('');
    setErrorMsg('');
    let res = await axios.post(
      endpoints.document.updateClosureInfo,
      {
        recordId: user?.farmCode,
        bankId: data.bankId,
        iban: data.iban,
        accountHolderName: data.accountHolderName,
        taxNumber: data.taxNumber,
        ibanFile: data.ibanFile,
        taxCertificate: data.taxCertificate,
        taxInvoice: data.taxInvoice,
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    const { isSuccess, result, errorMessages, httpStatusCode } = res.data;

    if (isSuccess) {
      setNotes('');
      enqueueSnackbar('تم حفظ الطلب بنجاح', {
        variant: 'success',
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      });
      setSuccessMsg('تم حفظ الطلب بنجاح');
      // setIsLoading(false);
      setIsAllowed(false);
    } else {
      enqueueSnackbar(errorMessages[0], {
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      });
      setErrorMsg(errorMessages);
    }
  });

  const handleIbanFileFileDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('ibanFile', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleIbanFileFileRemove = useCallback(() => {
    setValue('ibanFile', null);
  }, [setValue]);

  const handleTaxCertificateFileDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('taxCertificate', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleTaxCertificateFileRemove = useCallback(() => {
    setValue('taxCertificate', null);
  }, [setValue]);

  const handleTaxInvoiceFileDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('taxInvoice', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleTaxInvoiceFileRemove = useCallback(() => {
    setValue('taxInvoice', null);
  }, [setValue]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        links={[
          {
            name: t('إقفال الحساب'),
            href: paths.home.root,
          },
          {
            name: t('BasicRequirements'),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Container
        component="main"
        maxWidth="xl"
        sx={{
          width: 1,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
          padding: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            padding: (theme) => theme.spacing(3),
            boxShadow: 'rgba(0, 0, 0, 0.09) 0px 3px 12px',
            borderRadius: '10px',
            backgroundColor: '#fff',
          }}
        >
          <Alert severity="info" sx={{ mt: 3 }}>
            رقم التسجيل الضريبي للهيئة العامة للأمن الغذائي 300000807800003
          </Alert>
          <Alert severity="info" sx={{ mt: 3 }}>
            لا يحق للمزارع المطالبة بإعادة فتح الحساب في حال صرف المستحقات ييي المالية.
          </Alert>

          {!!notes && (
            <Alert severity="warning" sx={{ mt: 3 }}>
              {notes}
            </Alert>
          )}

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
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  marginTop: 3,
                  backgroundColor: '#f5f5f5',
                  padding: 2,
                  borderRadius: 1,
                }}
              >
                <Typography component="span" variant="body1" sx={{ textAlign: 'left' }}>
                  البيانات الأساسية
                </Typography>
              </Box>
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField label="الإسم" disabled name="name" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField label="رقم الهوية" disabled name="idNumber" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField label="نوع الهوية" disabled name="idType" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField label="رقم الجوال" disabled name="phone" />
                  </Grid>
                  {dobG != null && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <RHFTextField label="تاريخ الميلاد" disabled name="dobG" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <RHFTextField label="تاريخ إنتهاء الهوية" disabled name="idExpiryDateG" />
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12} sm={6}></Grid>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100%',
                      marginTop: 3,
                      backgroundColor: '#f5f5f5',
                      padding: 2,
                      borderRadius: 1,
                    }}
                  >
                    <Typography component="span" variant="body1" sx={{ textAlign: 'left' }}>
                      بيانات الحساب البنكي
                    </Typography>
                  </Box>
                  <Grid item xs={12} sm={6}>
                    <RHFSelect
                      fullWidth
                      defaultValue={''}
                      name="bankId"
                      label="يرجى اختيار البنك"
                      InputLabelProps={{ shrink: true }}
                      PaperPropsSx={{ textTransform: 'capitalize' }}
                    >
                      {banks != null &&
                        banks.map((item: any) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.label}
                          </MenuItem>
                        ))}
                    </RHFSelect>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <RHFTextField
                      label="رقم الآبيان"
                      name="iban"
                      type="tel"
                      inputProps={{
                        maxLength: 22,
                      }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">SA</InputAdornment>,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">صورة من الحساب البنكي</Typography>
                    <RHFUpload
                      name="ibanFile"
                      maxSize={3145728}
                      onDrop={handleIbanFileFileDrop}
                      onDelete={handleIbanFileFileRemove}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField label="الإسم المذكور بالحساب البنكي" name="accountHolderName" />
                  </Grid>
                  <Grid item xs={12} sm={6}></Grid>
                  <Box
                    sx={{
                      justifyContent: 'space-between',
                      width: '100%',
                      marginTop: 5,
                      backgroundColor: '#f5f5f5',
                      padding: 2,
                      borderRadius: 1,
                    }}
                  >
                    <Typography component="span" variant="body1" sx={{ textAlign: 'left' }}>
                      طلب إقفال الحساب
                    </Typography>
                  </Box>
                  <Grid item xs={12} sm={12}>
                    <RHFSwitch
                      name="closureRequested"
                      onClick={() => {
                        setSuccessMsg('');
                        setErrorMsg('');
                        // setClosureRequested(!closureRequested);
                      }}
                      label="أؤكد قيامي بتوريد كامل كمية القمح لدي، ورغبتي فى طلب إقفال حساب الرخصة"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}></Grid>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100%',
                      marginTop: 5,
                      backgroundColor: '#f5f5f5',
                      padding: 2,
                      borderRadius: 1,
                    }}
                  >
                    <Typography component="span" variant="body1" sx={{ textAlign: 'left' }}>
                      التسجيل لدى هيئة الزكاة والضريبة والجمارك
                    </Typography>
                  </Box>
                  {!initialHasTax && (
                    <>
                      <Grid item xs={12} sm={12}>
                        <RHFSwitch
                          name="hasTax"
                          onClick={() => {
                            setSuccessMsg('');
                            setErrorMsg('');
                            setHasTax(!hasTax);
                          }}
                          label="هل يوجد رقم ضريبي"
                        />
                      </Grid>
                    </>
                  )}

                  {hasTax && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <RHFTextField name="taxNumber" label="الرقم الضريبي" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">صورة من الشهادة الضريبية</Typography>
                        <RHFUpload
                          name="taxCertificate"
                          maxSize={3145728}
                          onDrop={handleTaxCertificateFileDrop}
                          onDelete={handleTaxCertificateFileRemove}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">صورة من الفاتورة الضريبية</Typography>
                        <RHFUpload
                          name="taxInvoice"
                          maxSize={3145728}
                          onDrop={handleTaxInvoiceFileDrop}
                          onDelete={handleTaxInvoiceFileRemove}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}></Grid>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginTop: 5,
                    backgroundColor: '#f5f5f5',
                    padding: 2,
                    borderRadius: 1,
                  }}
                >
                  <Typography component="span" variant="body1" sx={{ textAlign: 'left' }}>
                    التعهد
                  </Typography>
                </Box>
                <Grid item xs={12} sm={12}>
                  <RHFSwitch
                    name="conditionApproved"
                    onClick={() => {
                      setSuccessMsg('');
                      setErrorMsg('');
                      // setConditionApproved(!conditionApproved);
                    }}
                    label="أوافق وأصادق على صحة البيانات المدخلة واتحمل الآثار النظامية والإجرائية المترتبة على ذلك"
                  />
                </Grid>
              </Box>
              <LoadingButton //LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
              >
                حفظ البيانات
              </LoadingButton>
            </FormProvider>
          )}
        </Box>
      </Container>
    </Container>
  );
}
