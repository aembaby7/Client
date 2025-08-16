'use client';
import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography } from '@mui/material';

export default function NifazLoginView() {
  const [idNumber, setIdNumber] = useState('');

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Implement your login logic here with idNumber
  };

  return (
    <Container component="main" maxWidth={false}>
      <Box
        sx={{
          marginTop: 2,
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
              xs: 100,
              lg: 150,
              xl: 200,
            },
          }}
        />
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="idNumber"
            label="رقم بطاقة الأحوال/الاقامة"
            name="idNumber"
            autoComplete="off"
            // autoFocus
            type="tel"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
              maxLength: 10, // Limit input to 10 digits
            }}
          />
          <Button
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            sx={{ backgroundColor: 'teal' }}
          >
            تسجيل الدخول
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
