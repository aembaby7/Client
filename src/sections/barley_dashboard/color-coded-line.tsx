import * as React from 'react';
import { Box } from '@mui/material';

export default function ColorCodedLine() {
  return (
    <Box
      sx={{
        display: 'flex',
        // flexDirection: 'row-reverse',
        flexDirection: { xs: 'column', md: 'row' },
        border: '1px solid #6a65652b',
        borderRadius: '10px',
        backgroundColor: '#27a69a0a',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          width: { xs: '100%', sm: '15%' },
          padding: '10px',
        }}
      >
        <Box>مستويات كفاية المخزون</Box>
      </Box>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          width: { xs: '100%', sm: '15%' },
          padding: '10px',
        }}
      >
        <Box
          sx={{
            width: 15,
            height: 15,
            backgroundColor: '#a02500',
            borderRadius: '4px',
            marginRight: '5px',
          }}
        />
        <Box> (أقل من 50 يوم)</Box>
      </Box>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          width: { xs: '100%', sm: '15%' },
          padding: '10px',
        }}
      >
        <Box
          sx={{
            width: 15,
            height: 15,
            backgroundColor: '#B76E00',
            borderRadius: '4px',
            marginRight: '5px',
          }}
        />
        <Box> (أقل من 90 يوم)</Box>
      </Box>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          width: { xs: '100%', sm: '15%' },
          padding: '10px',
        }}
      >
        <Box
          sx={{
            width: 15,
            height: 15,
            backgroundColor: '#007867',
            borderRadius: '4px',
            marginRight: '5px',
          }}
        />
        <Box> (90 يوم أو أكثر)</Box>
      </Box>
    </Box>
  );
}
