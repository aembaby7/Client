import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export default function UnderDevelopment() {
  return (
    <Box
      sx={{
        width: '100%',
        backgroundImage: {
          xs: 'none',
          md: ` linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url("/assets/background/pbg90.png")`,
        },
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Log at the top right corner */}
        <Box sx={{ position: 'absolute', top: 30, left: 30 }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'grey.800' }}>
            <Box
              component="img"
              src="/logo/gfsaLogoB.png"
              alt="Logo"
              sx={{
                height: { xs: '55px', sm: '55px', md: '70px' },
                marginRight: 'auto',
                animation: 'slideInTop 0.8s ease-out forwards',
                '@keyframes slideInTop': {
                  '0%': {
                    transform: 'translateY(-100%)',
                    opacity: 0,
                  },
                  '100%': {
                    transform: 'translateY(0)',
                    opacity: 1,
                  },
                },
              }}
            />
          </Typography>
        </Box>

        <Box
          sx={{
            textAlign: 'center',
            color: 'grey.600',
            backgroundColor: 'grey.100',
            padding: { xs: 2, md: 6 },
            borderRadius: 2,
            // Define the zoom in animation
            animation: 'zoomIn 0.8s ease-out forwards',
            '@keyframes zoomIn': {
              '0%': {
                transform: 'scale(0)',
                opacity: 0,
              },
              '100%': {
                transform: 'scale(1)',
                opacity: 1,
              },
            },
          }}
        >
          <Typography variant="h4" gutterBottom>
            تحت التطوير
          </Typography>
          <Typography variant="h5" gutterBottom>
            الوقت المتوقع للإنتهاء: 5 أيام عمل من تاريخه
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
