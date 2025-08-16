'use client';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { LoginSchema, TLoginSchema } from 'src/lib/types';
import NafathConrigmation from './nafath-auth';
import { useAuthContext } from 'src/auth/hooks';
import axios, { endpoints } from 'src/utils/axios';
import { enqueueSnackbar } from 'notistack';

const tData = {
  idNumber: '1111111111',
};

type AuthData = {
  idNumber?: number;
  transId?: string;
  random?: number;
};
function displayError(message: string) {
  enqueueSnackbar(message + ' .', {
    variant: 'error',
    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
  });
}

function NafathLoginView() {
  const [errorMsg, setErrorMsg] = useState('');
  const [isNafazRequested, setIsNafazRequested] = useState(false);
  const [authData, setAuthData] = useState<AuthData>({});

  const defaultValues = {
    idNumber: '',
  };

  const methods = useForm<TLoginSchema>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = methods;

  const { loginNafath } = useAuthContext();
  const onSubmit = handleSubmit(async (data: FieldValues) => {
    // const response = await fetch('https://localhost:7065/api/Nafath/SendRequest', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     idNumber: data.idNumber,
    //   }),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });
    // errorMessages.length > 0
    try {
      setErrorMsg('');
      const data0 = {
        idNumber: data.idNumber,
      };
      const res = await axios.post(endpoints.auth.NafathSendRequest, data);
      const { isSuccess, errorMessages, result } = res.data;

      // if (!res.errorMessages) {
      //   const errors = res.errors;
      //   if (errors.idNumber) {
      //     setError('idNumber', {
      //       type: 'server',
      //       message: errors.idNumber,
      //     });
      //   }
      // }

      if (isSuccess) {
        setAuthData({
          idNumber: result.idNumber,
          transId: result.transId,
          random: result.random,
        });
        setIsNafazRequested(true);
      } else {
        setErrorMsg(errorMessages);
        displayError(errorMessages);
      }
    } catch (error) {
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.errorMessages);
      displayError(typeof error === 'string' ? error : error.errorMessages);
    }
  });

  const renderHead = <Stack spacing={2} sx={{ mb: 0 }}></Stack>;
  const renderForm = (
    <Stack spacing={2.5}>
      <RHFTextField
        margin="normal"
        fullWidth
        label="رقم الهوية الوطنية"
        name="idNumber"
        autoComplete="off"
        // autoFocus
        inputProps={{
          inputMode: 'numeric',
          pattern: '[0-9]*',
          maxLength: 10, // Limit input to 10 digits
        }}
      />
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
  return (
    <>
      {renderHead}
      <Box
        sx={{
          marginY: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          padding: 0,
        }}
      >
        <Box
          component="img"
          alt="auth"
          src={'/logo/nefazlogo.png'}
          sx={{
            maxWidth: {
              xs: 75,
              lg: 100,
              xl: 150,
            },
          }}
        />
      </Box>

      {/* {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )} */}
      {!isNafazRequested && (
        <FormProvider methods={methods} onSubmit={onSubmit}>
          {renderForm}
        </FormProvider>
      )}
      {isNafazRequested && <NafathConrigmation {...authData} />}
    </>
  );
}

export default NafathLoginView;
