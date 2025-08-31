// src/sections/mc-sales/view/mc-sales-grid-view.tsx
'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Box,
  Stack,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Button,
  InputAdornment,
  Alert,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { DataGrid, GridColDef, GridToolbar, GridRenderCellParams } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers';
import { alpha, useTheme } from '@mui/material/styles';
import { enqueueSnackbar } from 'notistack';

import axios, { endpoints } from 'src/utils/axios';
import { fNumber, fCurrency } from 'src/utils/format-number';
import { fDate } from 'src/utils/format-time';
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSettingsContext } from 'src/components/settings';

import { MCSales, MCSalesQueryParameters, PagedResponse, SalesSummary } from 'src/types/mcSales';

// ----------------------------------------------------------------------

const defaultFilters: MCSalesQueryParameters = {
  pageNumber: 1,
  pageSize: 10,
  sortBy: 'id',
  sortOrder: 'desc',
  year: new Date().getFullYear(),
  month: 0,
  companyId: 0,
  branchId: 0,
  startDate: null,
  endDate: null,
  customerName: '',
  invoiceNo: '',
  searchText: '',
};

// Sample dropdown data - replace with your actual data
const companiesList = [
  { id: 0, name: 'الكل' },
  { id: 1, name: 'الشركة الأولى' },
  { id: 2, name: 'الشركة الثانية' },
];

const branchesList = [
  { id: 0, name: 'الكل' },
  { id: 1, name: 'الفرع الرئيسي' },
  { id: 2, name: 'الفرع الثاني' },
];

const TIME_LABELS = {
  month: [
    { id: 0, name: 'الكل' },
    { id: 1, name: 'يناير' },
    { id: 2, name: 'فبراير' },
    { id: 3, name: 'مارس' },
    { id: 4, name: 'ابريل' },
    { id: 5, name: 'مايو' },
    { id: 6, name: 'يونيو' },
    { id: 7, name: 'يوليو' },
    { id: 8, name: 'أغسطس' },
    { id: 9, name: 'سبتمبر' },
    { id: 10, name: 'اكتوبر' },
    { id: 11, name: 'نوفمبر' },
    { id: 12, name: 'ديسمبر' },
  ],
  year: [2022, 2023, 2024],
};

// ----------------------------------------------------------------------

export default function MCSalesGridView() {
  const theme = useTheme();
  const settings = useSettingsContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [salesData, setSalesData] = useState<MCSales[]>([]);
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [filters, setFilters] = useState<MCSalesQueryParameters>(defaultFilters);

  // Fetch data function
  const fetchSalesData = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await axios.post(endpoints.mcSales.query, filters);
      console.log('response:', response);
      if (response.data) {
        const pagedData: PagedResponse<MCSales> = response.data;
        setSalesData(pagedData.data);
        setTotalRecords(pagedData.totalRecords);
      }
    } catch (error) {
      console.error('Error fetching sales data:', error);
      setErrorMsg('حدث خطأ في تحميل البيانات');
      enqueueSnackbar('فشل في تحميل البيانات', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Fetch summary data
  const fetchSummary = useCallback(async () => {
    try {
      const response = await axios.post(endpoints.mcSales.summary, filters);
      if (response.data) {
        setSummary(response.data);
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  }, [filters]);

  // Initial load
  useEffect(() => {
    fetchSalesData();
    fetchSummary();
  }, []);

  // Handle filter changes
  const handleFilterChange = (name: keyof MCSalesQueryParameters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle search
  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      pageNumber: 1, // Reset to first page on new search
    }));
    fetchSalesData();
    fetchSummary();
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  // Handle export
  const handleExport = async (format: 'csv' | 'json') => {
    try {
      const response = await axios.post(
        endpoints.mcSales.export,
        {
          parameters: filters,
          format: format,
        },
        {
          responseType: format === 'csv' ? 'blob' : 'json',
        }
      );

      if (format === 'csv') {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `sales_export_${new Date().getTime()}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        // Handle JSON export
        console.log('Export data:', response.data);
      }

      enqueueSnackbar('تم التصدير بنجاح', { variant: 'success' });
    } catch (error) {
      console.error('Export error:', error);
      enqueueSnackbar('فشل في تصدير البيانات', { variant: 'error' });
    }
  };

  // DataGrid columns definition
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'invoiceNo',
      headerName: 'رقم الفاتورة',
      width: 130,
      renderCell: (params) => <Chip label={params.value || '-'} size="small" variant="soft" />,
    },
    {
      field: 'invoiceDate',
      headerName: 'تاريخ الفاتورة',
      width: 120,
      valueFormatter: (params) => (params.value ? fDate(params.value) : '-'),
    },
    {
      field: 'customerName',
      headerName: 'اسم العميل',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">{params.value || '-'}</Typography>
          {params.row.customerId && (
            <Typography variant="caption" color="text.secondary">
              ID: {params.row.customerId}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: 'productCatName',
      headerName: 'فئة المنتج',
      width: 150,
    },
    {
      field: 'totalWeightInTons',
      headerName: 'الوزن (طن)',
      width: 120,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (params) => (params.value ? fNumber(params.value) : '0'),
    },
    {
      field: 'price',
      headerName: 'السعر',
      width: 120,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (params) => (params.value ? fCurrency(params.value) : '0'),
      renderCell: (params) => (
        <Typography variant="body2" color={params.value > 0 ? 'success.main' : 'text.secondary'}>
          {fCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'activityTypeName',
      headerName: 'نوع النشاط',
      width: 130,
    },
    {
      field: 'year',
      headerName: 'السنة',
      width: 80,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'month',
      headerName: 'الشهر',
      width: 80,
      align: 'center',
      headerAlign: 'center',
      valueFormatter: (params) => (params.value ? TIME_LABELS.month[params.value]?.name : '-'),
    },
  ];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack spacing={3}>
        {/* Header */}
        <Typography variant="h4">بيانات المبيعات</Typography>

        {/* Summary Cards */}
        {summary && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="caption" color="text.secondary">
                      إجمالي السجلات
                    </Typography>
                    <Typography variant="h4">{fNumber(summary.totalRecords)}</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="caption" color="text.secondary">
                      إجمالي الوزن (طن)
                    </Typography>
                    <Typography variant="h4">{fNumber(summary.totalWeight)}</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="caption" color="text.secondary">
                      إجمالي السعر
                    </Typography>
                    <Typography variant="h4">{fCurrency(summary.totalPrice)}</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="caption" color="text.secondary">
                      متوسط السعر
                    </Typography>
                    <Typography variant="h4">{fCurrency(summary.averagePrice)}</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="caption" color="text.secondary">
                      متوسط الوزن (طن)
                    </Typography>
                    <Typography variant="h4">{fNumber(summary.averageWeight)}</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Filters */}
        <Card>
          <CardHeader title="البحث والتصفية" />
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              {/* Year Filter */}
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>السنة</InputLabel>
                  <Select
                    value={filters.year || ''}
                    onChange={(e) => handleFilterChange('year', Number(e.target.value))}
                    input={<OutlinedInput label="السنة" />}
                  >
                    {TIME_LABELS.year.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Month Filter */}
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>الشهر</InputLabel>
                  <Select
                    value={filters.month || 0}
                    onChange={(e) => handleFilterChange('month', Number(e.target.value))}
                    input={<OutlinedInput label="الشهر" />}
                  >
                    {TIME_LABELS.month.map((month) => (
                      <MenuItem key={month.id} value={month.id}>
                        {month.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Company Filter */}
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>الشركة</InputLabel>
                  <Select
                    value={filters.companyId || 0}
                    onChange={(e) => handleFilterChange('companyId', Number(e.target.value))}
                    input={<OutlinedInput label="الشركة" />}
                  >
                    {companiesList.map((company) => (
                      <MenuItem key={company.id} value={company.id}>
                        {company.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Branch Filter */}
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>الفرع</InputLabel>
                  <Select
                    value={filters.branchId || 0}
                    onChange={(e) => handleFilterChange('branchId', Number(e.target.value))}
                    input={<OutlinedInput label="الفرع" />}
                  >
                    {branchesList.map((branch) => (
                      <MenuItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Date Range */}
              <Grid item xs={12} sm={6} md={2}>
                <DatePicker
                  label="من تاريخ"
                  value={filters.startDate}
                  onChange={(date) => handleFilterChange('startDate', date)}
                  format="yyyy/MM/dd"
                  slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <DatePicker
                  label="إلى تاريخ"
                  value={filters.endDate}
                  onChange={(date) => handleFilterChange('endDate', date)}
                  format="yyyy/MM/dd"
                  slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                />
              </Grid>

              {/* Search Field */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  value={filters.searchText || ''}
                  onChange={(e) => handleFilterChange('searchText', e.target.value)}
                  placeholder="بحث عن عميل، فاتورة..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Invoice Number */}
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="رقم الفاتورة"
                  value={filters.invoiceNo || ''}
                  onChange={(e) => handleFilterChange('invoiceNo', e.target.value)}
                />
              </Grid>

              {/* Customer Name */}
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="اسم العميل"
                  value={filters.customerName || ''}
                  onChange={(e) => handleFilterChange('customerName', e.target.value)}
                />
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12} sm={6} md={3}>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSearch}
                    startIcon={<Iconify icon="eva:search-fill" />}
                  >
                    بحث
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleResetFilters}
                    startIcon={<Iconify icon="solar:restart-bold" />}
                  >
                    إعادة تعيين
                  </Button>
                  <Tooltip title="تصدير CSV">
                    <IconButton onClick={() => handleExport('csv')}>
                      <Iconify icon="solar:export-bold" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Error Message */}
        {errorMsg && (
          <Alert severity="error" onClose={() => setErrorMsg('')}>
            {errorMsg}
          </Alert>
        )}

        {/* Data Grid */}
        <Card>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={salesData}
              columns={columns}
              loading={isLoading}
              rowCount={totalRecords}
              pageSizeOptions={[10, 25, 50, 100]}
              paginationModel={{
                page: filters.pageNumber - 1,
                pageSize: filters.pageSize,
              }}
              onPaginationModelChange={(model) => {
                handleFilterChange('pageNumber', model.page + 1);
                handleFilterChange('pageSize', model.pageSize);
                fetchSalesData();
              }}
              onSortModelChange={(model) => {
                if (model.length > 0) {
                  handleFilterChange('sortBy', model[0].field);
                  handleFilterChange('sortOrder', model[0].sort);
                  fetchSalesData();
                }
              }}
              paginationMode="server"
              sortingMode="server"
              disableRowSelectionOnClick
              slots={{
                toolbar: GridToolbar,
                noRowsOverlay: () => <EmptyContent title="لا توجد بيانات" />,
                noResultsOverlay: () => <EmptyContent title="لا توجد نتائج" />,
              }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              sx={{
                '& .MuiDataGrid-cell': {
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  borderBottom: `2px solid ${theme.palette.divider}`,
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                },
              }}
              localeText={{
                // Arabic localization
                noRowsLabel: 'لا توجد بيانات',
                noResultsOverlayLabel: 'لا توجد نتائج',
                errorOverlayDefaultLabel: 'حدث خطأ',
                toolbarDensity: 'الكثافة',
                toolbarDensityLabel: 'الكثافة',
                toolbarDensityCompact: 'مضغوط',
                toolbarDensityStandard: 'قياسي',
                toolbarDensityComfortable: 'مريح',
                toolbarColumns: 'الأعمدة',
                toolbarColumnsLabel: 'اختر الأعمدة',
                toolbarFilters: 'الفلاتر',
                toolbarFiltersLabel: 'إظهار الفلاتر',
                toolbarFiltersTooltipHide: 'إخفاء الفلاتر',
                toolbarFiltersTooltipShow: 'إظهار الفلاتر',
                toolbarFiltersTooltipActive: (count) =>
                  count !== 1 ? `${count} فلاتر نشطة` : `فلتر واحد نشط`,
                toolbarQuickFilterPlaceholder: 'بحث...',
                toolbarQuickFilterLabel: 'بحث',
                toolbarQuickFilterDeleteIconLabel: 'مسح',
                toolbarExport: 'تصدير',
                toolbarExportLabel: 'تصدير',
                toolbarExportCSV: 'تحميل كـ CSV',
                toolbarExportPrint: 'طباعة',
                columnsPanelTextFieldLabel: 'بحث عن عمود',
                columnsPanelTextFieldPlaceholder: 'عنوان العمود',
                columnsPanelDragIconLabel: 'إعادة ترتيب العمود',
                columnsPanelShowAllButton: 'إظهار الكل',
                columnsPanelHideAllButton: 'إخفاء الكل',
                filterPanelAddFilter: 'إضافة فلتر',
                filterPanelRemoveAll: 'إزالة الكل',
                filterPanelDeleteIconLabel: 'حذف',
                filterPanelOperator: 'المعامل',
                filterPanelOperatorAnd: 'و',
                filterPanelOperatorOr: 'أو',
                filterPanelColumns: 'الأعمدة',
                filterPanelInputLabel: 'القيمة',
                filterPanelInputPlaceholder: 'قيمة الفلتر',
                filterOperatorContains: 'يحتوي',
                filterOperatorEquals: 'يساوي',
                filterOperatorStartsWith: 'يبدأ بـ',
                filterOperatorEndsWith: 'ينتهي بـ',
                filterOperatorIs: 'هو',
                filterOperatorNot: 'ليس',
                filterOperatorAfter: 'بعد',
                filterOperatorOnOrAfter: 'في أو بعد',
                filterOperatorBefore: 'قبل',
                filterOperatorOnOrBefore: 'في أو قبل',
                filterOperatorIsEmpty: 'فارغ',
                filterOperatorIsNotEmpty: 'غير فارغ',
                filterOperatorIsAnyOf: 'أي من',
                columnMenuLabel: 'القائمة',
                columnMenuShowColumns: 'إظهار الأعمدة',
                columnMenuManageColumns: 'إدارة الأعمدة',
                columnMenuFilter: 'فلتر',
                columnMenuHideColumn: 'إخفاء',
                columnMenuUnsort: 'إلغاء الترتيب',
                columnMenuSortAsc: 'ترتيب تصاعدي',
                columnMenuSortDesc: 'ترتيب تنازلي',
                footerRowSelected: (count) =>
                  count !== 1 ? `${count.toLocaleString()} صفوف محددة` : `صف واحد محدد`,
                footerTotalRows: 'إجمالي الصفوف:',
                footerTotalVisibleRows: (visibleCount, totalCount) =>
                  `${visibleCount.toLocaleString()} من ${totalCount.toLocaleString()}`,
                MuiTablePagination: {
                  labelRowsPerPage: 'عدد الصفوف في الصفحة:',
                  labelDisplayedRows: ({ from, to, count }) =>
                    `${from}–${to} من ${count !== -1 ? count : `أكثر من ${to}`}`,
                },
              }}
            />
          </Box>
        </Card>
      </Stack>
    </Container>
  );
}
