'use client';
import React from 'react';
import { Container, Box, Stack, Typography, Button, Alert } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuthContext } from 'src/auth/hooks';
import { useSettingsContext } from 'src/components/settings';

// Import custom hooks
import { useMCSalesFilters } from '../hooks/useMCSalesFilters';
import { useMCSalesData } from '../hooks/useMCSalesData';

// Import components
import { MCSalesFilters } from '../components/filters/MCSalesFilters';
import { MCSalesSummaryCards } from '../components/summary/MCSalesSummaryCards';
import { MCSalesDataGrid } from '../components/grid/MCSalesDataGrid';

export default function MCSalesGridView() {
  const settings = useSettingsContext();
  const { user } = useAuthContext();

  // Use custom hooks
  const { filters, showFilters, handleFilterChange, handleResetFilters, toggleFilters } =
    useMCSalesFilters();

  const {
    isLoading,
    errorMsg,
    salesData,
    summary,
    paginationModel,
    sortModel,
    setPaginationModel,
    setSortModel,
    getData,
    handleExport,
    setErrorMsg,
  } = useMCSalesData({ filters });

  const handleSearch = () => {
    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize });
    getData();
  };

  const handleReset = () => {
    handleResetFilters();
    setPaginationModel({ page: 0, pageSize: 10 });
    setSortModel([{ field: 'id', sort: 'desc' }]);
    // Force re-fetch with default filters
    setTimeout(() => {
      getData();
    }, 100);
  };

  return (
    <Container maxWidth={false}>
      <Box
        sx={{
          width: 1,
          minHeight: '100vh',
          borderRadius: 2,
          bgcolor: '#FAFBFC',
          padding: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            mb: 4,
            pb: 2.5,
            borderBottom: '2px solid #E8ECF1',
          }}
        >
          <Stack spacing={0.5}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#1A2B3D',
                fontSize: '2rem',
              }}
            >
              المبيعات التفصيلية للدقيق
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#64748B',
                fontSize: '0.95rem',
              }}
            >
              شركات المطاحن
            </Typography>
          </Stack>
          <Button
            variant="outlined"
            startIcon={showFilters ? <VisibilityOffIcon /> : <VisibilityIcon />}
            onClick={toggleFilters}
            sx={{
              borderRadius: 1,
              px: 2,
              py: 0.8,
              fontWeight: 500,
              textTransform: 'none',
              bgcolor: '#FFFFFF',
              borderColor: '#E5E7EB',
              color: '#6B7280',
              boxShadow: 'none',
              fontSize: '0.875rem',
              '&:hover': {
                bgcolor: '#F9FAFB',
                borderColor: '#D1D5DB',
                boxShadow: 'none',
              },
            }}
          >
            {showFilters ? 'إخفاء مفردات البحث' : 'إظهار مفردات البحث'}
          </Button>
        </Stack>

        {/* Filters */}
        <MCSalesFilters
          filters={filters}
          showFilters={showFilters}
          isLoading={isLoading}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onReset={handleReset}
          onExport={handleExport}
        />

        {/* Error Alert */}
        {!!errorMsg && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
            onClose={() => setErrorMsg('')}
          >
            {errorMsg}
          </Alert>
        )}

        {/* Summary Cards */}
        <MCSalesSummaryCards summary={summary} />

        {/* Data Grid */}
        <MCSalesDataGrid
          data={salesData}
          isLoading={isLoading}
          paginationModel={paginationModel}
          sortModel={sortModel}
          onPaginationModelChange={setPaginationModel}
          onSortModelChange={setSortModel}
        />
      </Box>
    </Container>
  );
}
