'use client';

import * as Yup from 'yup';
import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Tabs from '@mui/material/Tabs';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import NafathLoginView from '../nafaz/nafath-login-view';
import JwtVerificationView from './jwt-verification-view';
import {
  Button,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import RHFRadioGroup from 'src/components/hook-form/rhf-radio-group';
import { enqueueSnackbar } from 'notistack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Image from 'next/image';
// ----------------------------------------------------------------------

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`login-tabpanel-${index}`}
      aria-labelledby={`login-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function tab(index: number) {
  return {
    id: `login-tab-${index}`,
    'aria-controls': `login-tabpanel-${index}`,
  };
}
function addMinutes(date: Date, minutes: number) {
  date.setMinutes(date.getMinutes() + minutes);
  return date;
}
function addSeconds(date: Date, seconds: number) {
  date.setSeconds(date.getSeconds() + seconds);
  return date;
}

function displayError(message: string) {
  enqueueSnackbar(message + ' .', {
    variant: 'error',
    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
  });
}
function displaySuccess(message: string) {
  enqueueSnackbar(message + ' .', {
    variant: 'success',
    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
  });
}
function displayWarning(message: string) {
  enqueueSnackbar(message + ' .', {
    variant: 'warning',
    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
  });
}
function displayInfo(message: string) {
  enqueueSnackbar(message + ' .', {
    variant: 'info',
    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
  });
}
export default function JwtLoginView() {
  const [action, setAction] = React.useState<number>(0);
  const [value, setValue] = React.useState(0);
  const [otp, setOTP] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const theme = useTheme();
  const matchesMD = useMediaQuery(theme.breakpoints.up('md'));

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (action != 1) setValue(newValue);
  };

  const { login, loginAuth } = useAuthContext();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('مطلوب اسم المستخدم'),
    password: Yup.string().required('مطلوب كلمة المرور'),
    otpWay: Yup.string().required('مطلوب اختيار طريقة استقبال رمز التحقق'),
  });

  const defaultValues = {
    username: '', //cm, test
    password: '', //W7835666
    otpWay: 'sms',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    setErrorMsg('');
    try {
      const res = await login?.(data.username, data.password, data.otpWay);
      setUserName(data.username);
      const { isSuccess, errorMessages, result } = res.data;
      const { otpAuth, otp } = result;
      if (isSuccess && !otpAuth) {
        const { accessToken, user } = result;
        router.push(returnTo || PATH_AFTER_LOGIN);
      }
      if (isSuccess && otpAuth) {
        setAction(1);
        setOTP(otp);
      }
    } catch (error) {
      displayError('خطأ. كود 1052.');
      reset();
      setErrorMsg('خطأ. كود 1052.');
    }
  });

  const parentFunction = async (action: string, enteredOTP?: number) => {
    setErrorMsg('');

    if (action == 'cancel') {
      setAction(0);
      setOTP('');
    }
    if (action == 'reset') {
      setAction(0);
      setOTP('');
    }
    if (action == 'submit') {
      if (enteredOTP!.toString() != otp) {
        setErrorMsg('رمز التحقق المدخل غير صحيح');
        displayError('رمز التحقق المدخل غير صحيح');
      } else {
        try {
          const res = await loginAuth?.(userName, enteredOTP!.toString());
          const { isSuccess, errorMessages, result } = res.data;
          if (isSuccess) {
            router.push(returnTo || PATH_AFTER_LOGIN);
          }
          if (!isSuccess) {
            setErrorMsg(errorMessages);
            displayError(errorMessages);
          }
        } catch (error) {
          reset();
          setErrorMsg('خطأ. كود 1051.');
          displayError('خطأ. كود 1051.');
        }
      }
    }
  };

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 3 }}>
      {matchesMD && (
        <Typography variant="h4" color="GrayText" align="center">
          منصة البيانات المركزية
        </Typography>
      )}
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <RHFTextField name="username" label="اسم المستخدم" />

      <RHFTextField
        name="password"
        label="كلمة المرور"
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <FormLabel>استقبال رمز التحقق:</FormLabel>
      <RHFRadioGroup
        row
        name="otpWay"
        options={[
          { label: 'رسالة نصية', value: 'sms' },
          { label: 'واتساب', value: 'whats' },
        ]}
      />

      <Link variant="body2" color="inherit" underline="always" sx={{ alignSelf: 'flex-end' }}>
        هل نسيت كلمة السر؟
      </Link>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{ backgroundColor: 'teal' }}
      >
        تسجيل الدخول
      </LoadingButton>
    </Stack>
  );

  const renderOTP = (
    <Stack spacing={2.5}>
      <JwtVerificationView
        parentFunction={parentFunction}
        errorFunction={(error: string) => {
          // setAction(0);
          setErrorMsg(error);
          displayError(error);
        }}
        otp={otp}
      />
    </Stack>
  );

  return (
    <>
      {renderHead}

      {/* <Alert severity="info" sx={{ mb: 3}}> */}
      {/* <Alert severity="info" sx={{ mb: 3, backgroundColor: '#aecfcd !important' }}>
        <Typography variant="body2" sx={{ textAlign: 'justify' }}>
          مرحباً بك بلوحة البيانات المركزية.
        </Typography>
      </Alert> */}

      <Box
        sx={{
          width: '100%',
          // backgroundColor: matchesMD ? 'rgb(255 255 255 / 100%)' : 'rgb(255 255 255 / 100%)',
          backgroundColor: matchesMD ? 'rgb(255 255 255 / 100%)' : 'rgb(255 255 255 / 30%)',
          padding: 2,
          borderRadius: 1,
          boxShadow: matchesMD
            ? 'rgb(38, 97, 97) -1px 2px 11px 0px, #00b8d9 0px 1px 20px 0px, rgb(38 97 97) 0px -2px 6px 0px inset'
            : // :'#106d6780 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px'
              'rgb(38, 97, 97) -1px 2px 11px 0px, #00b8d9 0px 1px 20px 0px, rgb(38 97 97) 0px -2px 6px 0px inset',
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="Logins">
            <Tab label="نفاذ" {...tab(0)} />
            <Tab label="الرقم الوظيفي" {...tab(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Typography
            variant="body2"
            color="grey"
            sx={{ maxWidth: 480, textAlign: 'center', pt: 3, pb: 2 }}
          >
            يرجى الدخول عبر خدمة النفاذ الوطني الموحد
          </Typography>
          <NafathLoginView />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          {action === 0 && (
            <FormProvider methods={methods} onSubmit={onSubmit}>
              {renderForm}
            </FormProvider>
          )}
          {action === 1 && renderOTP}
        </CustomTabPanel>
      </Box>
    </>
  );
}
