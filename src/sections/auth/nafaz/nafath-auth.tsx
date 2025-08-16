import { Alert, Stack, Button, Typography, Box, CircularProgress } from '@mui/material';
import React, { useEffect, useReducer, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCountDown } from 'src/hooks/use-count-down';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';
import { useAuthContext } from 'src/auth/hooks';
import { enqueueSnackbar } from 'notistack';

function displayError(message: string) {
  enqueueSnackbar(message + ' .', {
    variant: 'error',
    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
  });
}

function NafathAuth(props: any) {
  const [errorMsg, setErrorMsg] = useState('');
  const [requestStatus, setRequestStatus] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  let time: number = 60;
  const initialTime = 60 * 1000;
  time = useCountDown(initialTime, () => {
    setErrorMsg('انتهت صلاحية محاولة الدخول');
    displayError('انتهت صلاحية محاولة الدخول');
  });
  const m = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((time % (1000 * 60)) / 1000);

  const { loginNafath } = useAuthContext();

  const { handleSubmit, reset } = useForm();
  const onSubmit = handleSubmit(async () => {
    try {
      const requestStatus_ = await loginNafath?.(props.idNumber, props.transId, props.random);
      setRequestStatus(requestStatus_);

      // router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
      displayError(typeof error === 'string' ? error : error.message);
    }
  });

  useEffect(() => {
    if (requestStatus == 'REJECTED') {
      setErrorMsg('تم استقبال رفض الدخول من قبل صاحب الهوية المُدخلة');
      displayError('تم استقبال رفض الدخول من قبل صاحب الهوية المُدخلة');
    }
    if (requestStatus == 'EXPIRED') {
      setErrorMsg('انتهت صلاحية عملية التحقق من قبل تطبيق نفاذ');
      displayError('انتهت صلاحية عملية التحقق من قبل تطبيق نفاذ');
    }
    if (
      requestStatus != 'COMPLETED' &&
      requestStatus != 'REJECTED' &&
      requestStatus != 'EXPIRED' &&
      time % 10000 == 0
    )
      onSubmit();
  }, [time]);

  return (
    <Stack spacing={2.5}>
      {errorMsg && (
        <>
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMsg}
          </Alert>
          <Button variant="text" color="primary" onClick={() => router.push(PATH_AFTER_LOGIN)}>
            إعادة المحاولة
          </Button>
        </>
      )}

      {!errorMsg && (
        <>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <CircularProgress
              variant="determinate"
              value={(time / initialTime) * 100} // This is the correct calculation to decrease over time
              size={100}
              thickness={1}
              color="primary"
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h6" component="div" color="textPrimary">
                {`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`}
              </Typography>
            </div>
          </div>
          <Box sx={{ fontSize: '12px', textAlign: 'center' }}>
            برجاء الذهاب الى تطبيق نفاذ، و اختيار الرقم الموضح أدناه
          </Box>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '5px',
              backgroundColor: 'teal',
              padding: '4px',
              color: 'white',
              fontSize: '22px',
              fontWeight: 700,
              marginTop: '-10px',
              // Adding the animation
              '@keyframes colorChange': {
                '0%': {
                  color: 'white',
                },
                '50%': {
                  color: 'black', // Intermediate color
                },
                '100%': {
                  color: 'white',
                },
              },
              animation: 'colorChange 1s infinite', // Adjust time as needed
            }}
          >
            {props.random}
          </Box>
          {/* <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '5px', 
              backgroundColor: 'teal', 
              padding: '4px', 
              color: 'white', 
              fontSize: '22px',
              fontWeight:700,
            }}
          >
            {props.random}
          </Box> */}
        </>
      )}
    </Stack>
  );
}

export default NafathAuth;
