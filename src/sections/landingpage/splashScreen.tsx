import React from 'react';
import { Box } from '@mui/material';

const SplashScreen = () => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: {
        xs: '#fff',
        sm: '#fff',
      },
      zIndex: 1300,
      overflow: 'hidden',
    }}
  >
    <Box
      component="video"
      autoPlay
      muted
      loop={false}
      playsInline
      src="assets/video/gfsa-anim13.mp4"
      sx={{
        width: '100%',
        height: '100%',
        objectFit: {
          xs: 'contain',
          sm: 'cover',
        },
        minWidth: {
          xs: '200%',
          sm: '100%',
        },
        minHeight: {
          xs: '200%',
          sm: '100%',
        },
        maxHeight: '100vh',
      }}
    />
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'absolute',
        zIndex: 1,
        animation: 'fadeInZoom 1.5s ease-out forwards',
        direction: 'ltr',
        '@keyframes fadeInZoom': {
          '0%': { opacity: 0, transform: 'scale(0)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      }}
    >
      {/* Your centered content here */}
    </Box>
  </Box>
);

export default SplashScreen;
