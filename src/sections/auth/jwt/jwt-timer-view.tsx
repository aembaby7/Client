// =====================================with resend button=============================================
import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Button, Alert } from '@mui/material';
import { useCountdownDate } from 'src/hooks/use-countdown';
import { useCountDown } from 'src/hooks/use-count-down';

interface ChildProps {
  handleOTPActions: Function;
}
const JwtTimerView = (props: ChildProps) => {
  const [timerCompleted, setTimerCompleted] = useState(false);
  const totalSeconds = 120;

  let time = useCountDown(totalSeconds * 1000, () => {
    props.handleOTPActions('completed');
    setTimerCompleted(true);
  });
  const m = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((time % (1000 * 60)) / 1000);
  const progressValue = (time / 1000 / totalSeconds) * 100;

  const resetTimer = () => {
    props.handleOTPActions('reset');
  };
  const cancelOTP = () => {
    props.handleOTPActions('cancel');
  };
  const goBack = () => {
    props.handleOTPActions('back');
  };

  return (
    <Box
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      padding="10px"
    >
      {!timerCompleted && (
        <>
          <CircularProgress
            variant="determinate"
            value={progressValue}
            size={100}
            thickness={1}
            color="primary"
            style={{ position: 'absolute' }}
          />
          <Typography variant="h6" color="textPrimary">
            {`${Math.floor(m < 0 ? 0 : m)}:${`0${s < 0 ? 0 : s}`.slice(-2)}`}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default JwtTimerView;
