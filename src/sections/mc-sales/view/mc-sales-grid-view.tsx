'use client';

import { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Alert, Paper } from '@mui/material';
import axios from 'src/utils/axios';
import { endpoints } from 'src/utils/axios';
import { MCSales, MCSalesQueryParameters, PagedResponse, SalesSummary } from 'src/types/mcSales';
import { useSettingsContext } from 'src/components/settings';

// Import the new components
import SummarySection from '../components/summary-section';
import FilterSection from '../components/filter-section';
import DataTable from '../components/data-table';

export default function MCSalesGridView() {
  const settings = useSettingsContext();

  // State management
  const [data, setData] = useState<MCSales[]>([]);
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);

  // Filters state
  const [filters, setFilters] = useState<MCSalesQueryParameters>({
    pageNumber: 1,
    pageSize: 25,
    sortBy: 'invoiceDate',
    sortOrder: 'desc',
  });

  // Fetch data function
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Clean up filters - remove empty values
      const cleanFilters: Partial<MCSalesQueryParameters> = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          cleanFilters[key as keyof MCSalesQueryParameters] = value as any;
        }
      });

      // Fetch both data and summary
      const [dataResponse, summaryResponse] = await Promise.all([
        axios.post<PagedResponse<MCSales>>(endpoints.mcSales.query, cleanFilters),
        axios.post<SalesSummary>(endpoints.mcSales.summary, cleanFilters),
      ]);

      if (dataResponse.data) {
        setData(dataResponse.data.data || []);
        setTotalRecords(dataResponse.data.totalRecords || 0);
      }

      if (summaryResponse.data) {
        setSummary(summaryResponse.data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('حدث خطأ في جلب البيانات');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Load data on mount and filter changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handlers
  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, pageNumber: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      pageNumber: 1,
      pageSize: 25,
      sortBy: 'invoiceDate',
      sortOrder: 'desc',
    });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, pageNumber: page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilters((prev) => ({ ...prev, pageSize, pageNumber: 1 }));
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        بيانات المبيعات
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <SummarySection summary={summary} loading={loading} />

      <FilterSection
        filters={filters}
        onFilterChange={setFilters}
        onSearch={handleSearch}
        onClear={handleClearFilters}
      />

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <DataTable
          data={data}
          loading={loading}
          pageNumber={filters.pageNumber}
          pageSize={filters.pageSize}
          totalRecords={totalRecords}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </Paper>
    </Container>
  );
}
