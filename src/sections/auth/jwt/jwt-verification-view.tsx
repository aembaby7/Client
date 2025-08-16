'use client';
import * as Yup from 'yup';

import React, { useRef, useState, useEffect, ChangeEvent } from 'react';

import { Grid, Button, Divider, TextField, Typography, Box } from '@mui/material';
import JwtTimerView from './jwt-timer-view';
import { number } from 'yup';
import { useRouter } from 'src/routes/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';
import { grey } from '@mui/material/colors';
import RHFCode from 'src/components/hook-form/rhf-code';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider from 'src/components/hook-form/form-provider';
import { LoadingButton } from '@mui/lab';

interface ChildProps {
  parentFunction: Function;
  errorFunction: Function;
  otp: string;
}
const JwtVerificationView = (props: ChildProps) => {
  const [timerCompleted, setTimerCompleted] = useState(false);

  React.useEffect(() => {}, []);

  const router = useRouter();
  // useEffect(() => {
  //   // Focus on the last input box when the component mounts
  //   const lastInputIndex = inputRefs.current.length - 1;
  //   inputRefs.current[lastInputIndex]?.focus();
  // }, []);

  const OTPSchema = Yup.object().shape({
    otp: Yup.number().required('مطلوب ادخال رمز التحقق').min(1111, 'يلزم ادخال رمز التحقق المطلوب'),
  });

  const methods = useForm({
    resolver: yupResolver(OTPSchema),
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    props.parentFunction('submit', data.otp);
  });

  // useEffect(() => {
  //   if (otp?.toString().length == 4) {
  //     props.parentFunction(otp);
  //   }
  // }, [otp]);

  const handleOTPActions = (action: string) => {
    switch (action) {
      case 'completed':
        setTimerCompleted(true);
        props.errorFunction('انتهت صلاحية رمز التحقق');
        break;
      case 'cancel':
      case 'reset':
        props.parentFunction(action);
        break;
    }
  };

  const handleResendCode = () => {
    router.push(PATH_AFTER_LOGIN);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '16px',
          // border: '1px solid #e0e0e0',
          borderRadius: '4px',
          backgroundColor: '#fff',
        }}
      >
        {!timerCompleted && (
          <>
            <Typography variant="h5" gutterBottom align="center" sx={{ color: grey[700] }}>
              رمز التحقق
            </Typography>
            <Typography gutterBottom align="center">
              تم ارسال رمز التحقق الى الجوال
            </Typography>
            <FormProvider methods={methods} onSubmit={onSubmit}>
              <RHFCode name="otp" length={4} dir="ltr" itemType="submit" />

              <LoadingButton
                style={{ marginTop: '20px' }}
                fullWidth
                color="inherit"
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                onSubmit={onSubmit}
                sx={{ backgroundColor: 'teal' }}
              >
                استمرار
              </LoadingButton>
            </FormProvider>
          </>
        )}

        <Box sx={{ m: 5 }}>
          <JwtTimerView handleOTPActions={handleOTPActions} />
        </Box>
        {!timerCompleted && (
          <Button
            color="primary"
            style={{ width: '100%', justifyContent: 'center', padding: '8px 0' }}
            onClick={() => handleOTPActions('cancel')}
          >
            الغاء
          </Button>
        )}
        {timerCompleted && (
          <Button
            color="primary"
            style={{ width: '100%', justifyContent: 'center', padding: '8px 0' }}
            onClick={() => handleOTPActions('reset')}
          >
            إعادة المحاولة
          </Button>
        )}
      </div>
    </div>
  );
};

export default JwtVerificationView;
