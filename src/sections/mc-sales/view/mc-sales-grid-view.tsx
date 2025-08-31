'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'src/utils/axios';
import { endpoints } from 'src/utils/axios';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import {
  DataGrid,
  GridColDef,
  GridSortModel,
  GridPaginationModel,
  GridToolbar,
} from '@mui/x-data-grid';
import { useSettingsContext } from 'src/components/settings';
import { useAuthContext } from 'src/auth/hooks';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import {
  Alert,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Select,
  MenuItem,
  Stack,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Paper,
  Divider,
  Badge,
  Collapse,
  Avatar,
  AvatarGroup,
  LinearProgress,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { LoadingScreen } from 'src/components/loading-screen';
import EmptyContent from 'src/components/empty-content';
import Iconify from 'src/components/iconify';
import { fDate } from 'src/utils/format-time';
import { fNumber, fCurrency, fShortenNumber, fPercent } from 'src/utils/format-number';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MCSales, MCSalesQueryParameters, PagedResponse, SalesSummary } from 'src/types/mcSales';

// Icons
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocalShippingTwoToneIcon from '@mui/icons-material/LocalShippingTwoTone';
import ScaleTwoToneIcon from '@mui/icons-material/ScaleTwoTone';
import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import BusinessIcon from '@mui/icons-material/Business';
import StoreIcon from '@mui/icons-material/Store';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ClearIcon from '@mui/icons-material/Clear';
import PrintIcon from '@mui/icons-material/Print';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';

const defaultFilters: MCSalesQueryParameters = {
  pageNumber: 1,
  pageSize: 10,
  sortBy: 'id',
  sortOrder: 'desc',
  year: new Date().getFullYear(),
  month: 0,
  companyId: 0,
  branchId: 0,
  customerId: 0,
  startDate: null,
  endDate: null,
  customerName: '',
  invoiceNo: '',
  searchText: '',
};

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
    { id: 8, name: 'اغسطس' },
    { id: 9, name: 'سبتمبر' },
    { id: 10, name: 'اكتوبر' },
    { id: 11, name: 'نوفمبر' },
    { id: 12, name: 'ديسمبر' },
  ],
  year: ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017'],
};

const companiesLabels = [
  { id: 1, name: 'الشركة الأولى', color: '#1976d2' },
  { id: 2, name: 'الشركة العربية', color: '#388e3c' },
  { id: 3, name: 'الشركة الحديثة', color: '#f57c00' },
  { id: 4, name: 'الشركة الرابعة', color: '#7b1fa2' },
];

const branchesData: { [key: number]: { id: number; name: string; icon?: string }[] } = {
  1: [
    { id: 14, name: 'فرع جدة', icon: '🏢' },
    { id: 15, name: 'فرع القصيم', icon: '🏪' },
    { id: 19, name: 'فرع تبوك', icon: '🏬' },
    { id: 25, name: 'فرع الإحساء', icon: '🏭' },
  ],
  2: [
    { id: 12, name: 'فرع الرياض', icon: '🏢' },
    { id: 20, name: 'فرع حائل', icon: '🏪' },
    { id: 24, name: 'فرع جازان', icon: '🏬' },
  ],
  3: [
    { id: 16, name: 'فرع خميس مشيط', icon: '🏢' },
    { id: 18, name: 'فرع الجوف', icon: '🏪' },
    { id: 23, name: 'فرع الجموم', icon: '🏬' },
  ],
  4: [
    { id: 13, name: 'فرع الدمام', icon: '🏢' },
    { id: 17, name: 'فرع الخرج', icon: '🏪' },
    { id: 22, name: 'فرع المدينة المنورة', icon: '🏬' },
  ],
};

// Product categories with colors
const productCategories: { [key: string]: { color: string; icon: string } } = {
  'دقيق فاخر': { color: 'primary', icon: '🌾' },
  'دقيق مخابز': { color: 'secondary', icon: '🍞' },
  'دقيق بر': { color: 'success', icon: '🌾' },
  'طحين الحبة الكاملة': { color: 'warning', icon: '🌾' },
  'عبوات منزلية': { color: 'info', icon: '📦' },
  'مشتقات قمح': { color: 'error', icon: '🌾' },
};

export default function MCSalesGridView() {
  const theme = useTheme();
  const settings = useSettingsContext();
  const { user } = useAuthContext();

  const [filters, setFilters] = useState(defaultFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [salesData, setSalesData] = useState<PagedResponse<MCSales> | null>(null);
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'id', sort: 'desc' }]);

  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    if (filters.year !== new Date().getFullYear()) count++;
    if (filters.month !== 0) count++;
    if (filters.companyId !== 0) count++;
    if (filters.branchId !== 0) count++;
    if (filters.customerId !== 0) count++;
    if (filters.customerName) count++;
    if (filters.invoiceNo) count++;
    if (filters.searchText) count++;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    setActiveFiltersCount(count);
  }, [filters]);

  // Define columns for DataGrid with enhanced design
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: '#',
      width: 70,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'invoiceNo',
      headerName: 'رقم الفاتورة',
      width: 160,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <ReceiptLongIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Chip
            label={params.value || '-'}
            size="small"
            variant="outlined"
            sx={{
              fontWeight: 600,
              borderStyle: 'dashed',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                borderColor: 'primary.main',
              },
            }}
          />
        </Stack>
      ),
    },
    {
      field: 'invoiceDate',
      headerName: 'التاريخ',
      width: 120,
      renderCell: (params) => (
        <Stack>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {params.value ? fDate(params.value, 'dd/MM/yyyy') : '-'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.value ? fDate(params.value, 'HH:mm') : ''}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'companyBranch',
      headerName: 'الشركة/الفرع',
      width: 200,
      renderCell: (params) => {
        const company = companiesLabels.find((c) => c.id === params.row.companyId);
        const branch = params.row.branchId
          ? branchesData[params.row.companyId]?.find((b) => b.id === params.row.branchId)
          : null;

        return (
          <Stack spacing={0.5}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <BusinessIcon sx={{ fontSize: 14, color: company?.color || 'text.secondary' }} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: company?.color }}>
                {company?.name || 'غير محدد'}
              </Typography>
            </Stack>
            {branch && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <StoreIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {branch.name}
                </Typography>
              </Stack>
            )}
          </Stack>
        );
      },
    },
    {
      field: 'customerName',
      headerName: 'العميل',
      width: 220,
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: 14,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            }}
          >
            {params.value?.charAt(0) || '?'}
          </Avatar>
          <Stack>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {params.value || 'غير محدد'}
            </Typography>
            {params.row.customerId && (
              <Typography variant="caption" color="text.secondary">
                كود: {params.row.customerId}
              </Typography>
            )}
          </Stack>
        </Stack>
      ),
    },
    {
      field: 'productCatName',
      headerName: 'فئة المنتج',
      width: 160,
      renderCell: (params) => {
        const category = productCategories[params.value] || { color: 'default', icon: '📦' };
        return (
          <Chip
            label={
              <Stack direction="row" spacing={0.5} alignItems="center">
                <span>{category.icon}</span>
                <span>{params.value || '-'}</span>
              </Stack>
            }
            size="small"
            color={category.color as any}
            variant="soft"
            sx={{ fontWeight: 500 }}
          />
        );
      },
    },
    {
      field: 'totalWeightInTons',
      headerName: 'الوزن (طن)',
      width: 130,
      align: 'right',
      headerAlign: 'center',
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5} alignItems="center">
          <ScaleTwoToneIcon sx={{ fontSize: 16, color: 'info.main' }} />
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'info.dark' }}>
            {params.value ? fNumber(params.value) : '0'}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'price',
      headerName: 'المبلغ',
      width: 150,
      align: 'right',
      headerAlign: 'center',
      renderCell: (params) => (
        <Stack alignItems="flex-end">
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>
            {params.value ? fCurrency(params.value) : '0'}
          </Typography>
          {params.row.totalWeightInTons && (
            <Typography variant="caption" color="text.secondary">
              {fCurrency((params.value || 0) / params.row.totalWeightInTons)}/طن
            </Typography>
          )}
        </Stack>
      ),
    },
    {
      field: 'activityTypeName',
      headerName: 'نوع النشاط',
      width: 140,
      renderCell: (params) => (
        <Chip
          label={params.value || 'غير محدد'}
          size="small"
          variant="soft"
          sx={{
            bgcolor: alpha(theme.palette.grey[500], 0.08),
            fontSize: 11,
          }}
        />
      ),
    },
    {
      field: 'status',
      headerName: 'الحالة',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        // Mock status based on price
        const status =
          params.row.price > 50000 ? 'paid' : params.row.price > 20000 ? 'pending' : 'draft';
        const statusConfig = {
          paid: { label: 'مدفوع', color: 'success' },
          pending: { label: 'معلق', color: 'warning' },
          draft: { label: 'مسودة', color: 'default' },
        };

        return (
          <Chip
            label={statusConfig[status].label}
            size="small"
            color={statusConfig[status].color as any}
            variant="filled"
            sx={{ fontSize: 11 }}
          />
        );
      },
    },
  ];

  // Fetch data function
  const getData = useCallback(async () => {
    setErrorMsg('');
    setIsLoading(true);

    try {
      // Prepare query parameters
      const queryParams = {
        ...filters,
        pageNumber: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
        sortBy: sortModel[0]?.field || 'id',
        sortOrder: sortModel[0]?.sort || 'desc',
      };

      // Get data
      const [dataRes, summaryRes] = await Promise.all([
        axios.post(endpoints.mcSales.query, queryParams),
        axios.post(endpoints.mcSales.summary, filters),
      ]);

      if (dataRes.data) {
        setSalesData(dataRes.data);
      }

      if (summaryRes.data) {
        setSummary(summaryRes.data);
      }
    } catch (error) {
      setErrorMsg('حدث خطأ في تحميل البيانات');
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters, paginationModel, sortModel]);

  // Load data on mount and when pagination/sort changes
  useEffect(() => {
    getData();
  }, [paginationModel, sortModel]);

  // Handle search button click
  const handleSearch = () => {
    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize });
    getData();
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters(defaultFilters);
    setPaginationModel({ page: 0, pageSize: 10 });
    setSortModel([{ field: 'id', sort: 'desc' }]);
  };

  // Export data
  const handleExport = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        endpoints.mcSales.export,
        {
          ...filters,
          format: 'csv',
          maxRecords: 10000,
        },
        {
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sales_export_${fDate(new Date(), 'dd-MM-yyyy')}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export error:', error);
      setErrorMsg('حدث خطأ في تصدير البيانات');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (name: keyof MCSalesQueryParameters, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Render enhanced filters section
  const renderFilters = (
    <Collapse in={showFilters}>
      <Card
        sx={{
          mb: 3,
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.02
          )} 0%, ${alpha(theme.palette.info.main, 0.02)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
        }}
      >
        <CardContent>
          <Stack spacing={3}>
            {/* Filters Header */}
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" spacing={2} alignItems="center">
                <FilterListIcon sx={{ color: 'primary.main' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  فلترة البيانات
                </Typography>
                {activeFiltersCount > 0 && (
                  <Chip
                    label={`${activeFiltersCount} فلاتر نشطة`}
                    size="small"
                    color="primary"
                    onDelete={handleResetFilters}
                    deleteIcon={<ClearIcon />}
                  />
                )}
              </Stack>

              <Stack direction="row" spacing={1}>
                <Tooltip title="إعادة تعيين">
                  <IconButton size="small" onClick={handleResetFilters} color="default">
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="طباعة">
                  <IconButton size="small" color="default">
                    <PrintIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="تصدير Excel">
                  <IconButton size="small" onClick={handleExport} color="primary">
                    <FileDownloadIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>

            <Divider />

            {/* Filter Fields */}
            <Grid container spacing={2}>
              {/* Time Filters Row */}
              <Grid xs={12}>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', mb: 1, display: 'block' }}
                >
                  الفترة الزمنية
                </Typography>
                <Stack direction="row" spacing={2}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>السنة</InputLabel>
                    <Select
                      value={filters.year?.toString() || ''}
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

                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>الشهر</InputLabel>
                    <Select
                      value={filters.month?.toString() || '0'}
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

                  <DatePicker
                    label="من تاريخ"
                    value={filters.startDate}
                    onChange={(newValue) => handleFilterChange('startDate', newValue)}
                    slotProps={{
                      textField: {
                        size: 'small',
                        sx: { minWidth: 150 },
                      },
                    }}
                  />

                  <DatePicker
                    label="إلى تاريخ"
                    value={filters.endDate}
                    onChange={(newValue) => handleFilterChange('endDate', newValue)}
                    slotProps={{
                      textField: {
                        size: 'small',
                        sx: { minWidth: 150 },
                      },
                    }}
                  />
                </Stack>
              </Grid>

              {/* Company & Branch Row */}
              <Grid xs={12}>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', mb: 1, display: 'block' }}
                >
                  الشركة والفرع
                </Typography>
                <Stack direction="row" spacing={2}>
                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>الشركة</InputLabel>
                    <Select
                      value={filters.companyId?.toString() || '0'}
                      onChange={(e) => {
                        handleFilterChange('companyId', Number(e.target.value));
                        handleFilterChange('branchId', 0);
                      }}
                      input={<OutlinedInput label="الشركة" />}
                      startAdornment={
                        filters.companyId ? (
                          <InputAdornment position="start">
                            <BusinessIcon
                              sx={{
                                fontSize: 18,
                                color: companiesLabels.find((c) => c.id === filters.companyId)
                                  ?.color,
                              }}
                            />
                          </InputAdornment>
                        ) : null
                      }
                    >
                      <MenuItem value={0}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <BusinessIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <span>جميع الشركات</span>
                        </Stack>
                      </MenuItem>
                      {companiesLabels.map((company) => (
                        <MenuItem key={company.id} value={company.id}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <BusinessIcon sx={{ fontSize: 18, color: company.color }} />
                            <span>{company.name}</span>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {filters.companyId !== 0 && (
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                      <InputLabel>الفرع</InputLabel>
                      <Select
                        value={filters.branchId?.toString() || '0'}
                        onChange={(e) => handleFilterChange('branchId', Number(e.target.value))}
                        input={<OutlinedInput label="الفرع" />}
                        startAdornment={
                          filters.branchId ? (
                            <InputAdornment position="start">
                              <StoreIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            </InputAdornment>
                          ) : null
                        }
                      >
                        <MenuItem value={0}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <StoreIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <span>جميع الفروع</span>
                          </Stack>
                        </MenuItem>
                        {branchesData[filters.companyId]?.map((branch) => (
                          <MenuItem key={branch.id} value={branch.id}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <span>{branch.icon}</span>
                              <span>{branch.name}</span>
                            </Stack>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Stack>
              </Grid>

              {/* Search Fields Row */}
              <Grid xs={12}>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', mb: 1, display: 'block' }}
                >
                  البحث
                </Typography>
                <Stack direction="row" spacing={2}>
                  <TextField
                    size="small"
                    value={filters.customerId || ''}
                    onChange={(e) =>
                      handleFilterChange('customerId', e.target.value ? Number(e.target.value) : 0)
                    }
                    placeholder="كود العميل"
                    type="number"
                    sx={{ minWidth: 150 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Badge color="info" variant="dot" invisible={!filters.customerId}>
                            <PersonOutlineIcon sx={{ fontSize: 20 }} />
                          </Badge>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    size="small"
                    value={filters.customerName}
                    onChange={(e) => handleFilterChange('customerName', e.target.value)}
                    placeholder="اسم العميل"
                    sx={{ minWidth: 200 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlineIcon sx={{ fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    size="small"
                    value={filters.invoiceNo}
                    onChange={(e) => handleFilterChange('invoiceNo', e.target.value)}
                    placeholder="رقم الفاتورة"
                    sx={{ minWidth: 180 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ReceiptLongIcon sx={{ fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    size="small"
                    value={filters.searchText}
                    onChange={(e) => handleFilterChange('searchText', e.target.value)}
                    placeholder="بحث عام..."
                    sx={{ flex: 1 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    variant="contained"
                    startIcon={<SearchIcon />}
                    onClick={handleSearch}
                    size="large"
                    sx={{
                      minWidth: 120,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      boxShadow: theme.customShadows.primary,
                      '&:hover': {
                        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.24)}`,
                      },
                    }}
                  >
                    بحث
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>
    </Collapse>
  );

  // Render enhanced summary cards
  const renderSummary = summary && (
    <Grid container spacing={2.5} sx={{ mb: 3 }}>
      <Grid xs={6} sm={4} md={2.4}>
        <Card
          sx={{
            position: 'relative',
            overflow: 'visible',
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.1
            )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            '&:hover': {
              boxShadow: theme.customShadows.primary,
              transform: 'translateY(-2px)',
              transition: 'all 0.3s ease',
            },
          }}
        >
          <CardContent sx={{ pb: 2 }}>
            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                  <ReceiptLongIcon sx={{ fontSize: 20 }} />
                </Avatar>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  إجمالي
                </Typography>
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {fNumber(summary.totalRecords)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                سجل
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid xs={6} sm={4} md={2.4}>
        <Card
          sx={{
            position: 'relative',
            overflow: 'visible',
            background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(
              theme.palette.info.main,
              0.05
            )} 100%)`,
            border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
            '&:hover': {
              boxShadow: theme.customShadows.info,
              transform: 'translateY(-2px)',
              transition: 'all 0.3s ease',
            },
          }}
        >
          <CardContent sx={{ pb: 2 }}>
            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Avatar sx={{ bgcolor: 'info.main', width: 36, height: 36 }}>
                  <ScaleTwoToneIcon sx={{ fontSize: 20 }} />
                </Avatar>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                  <Typography variant="caption" sx={{ color: 'success.main' }}>
                    +12%
                  </Typography>
                </Stack>
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {fShortenNumber(summary.totalWeight)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                طن
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid xs={6} sm={4} md={2.4}>
        <Card
          sx={{
            position: 'relative',
            overflow: 'visible',
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.success.main,
              0.1
            )} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
            '&:hover': {
              boxShadow: theme.customShadows.success,
              transform: 'translateY(-2px)',
              transition: 'all 0.3s ease',
            },
          }}
        >
          <CardContent sx={{ pb: 2 }}>
            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Avatar sx={{ bgcolor: 'success.main', width: 36, height: 36 }}>
                  <MonetizationOnTwoToneIcon sx={{ fontSize: 20 }} />
                </Avatar>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                  <Typography variant="caption" sx={{ color: 'success.main' }}>
                    +8%
                  </Typography>
                </Stack>
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.dark' }}>
                {fCurrency(summary.totalPrice)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                إجمالي المبيعات
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid xs={6} sm={4} md={2.4}>
        <Card
          sx={{
            position: 'relative',
            overflow: 'visible',
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.warning.main,
              0.1
            )} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
            '&:hover': {
              boxShadow: theme.customShadows.warning,
              transform: 'translateY(-2px)',
              transition: 'all 0.3s ease',
            },
          }}
        >
          <CardContent sx={{ pb: 2 }}>
            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Avatar sx={{ bgcolor: 'warning.main', width: 36, height: 36 }}>
                  <PriceCheckIcon sx={{ fontSize: 20 }} />
                </Avatar>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  متوسط
                </Typography>
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {fCurrency(summary.averagePrice)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                السعر
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid xs={6} sm={4} md={2.4}>
        <Card
          sx={{
            position: 'relative',
            overflow: 'visible',
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.secondary.main,
              0.1
            )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
            '&:hover': {
              boxShadow: theme.customShadows.secondary,
              transform: 'translateY(-2px)',
              transition: 'all 0.3s ease',
            },
          }}
        >
          <CardContent sx={{ pb: 2 }}>
            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36 }}>
                  <LocalShippingTwoToneIcon sx={{ fontSize: 20 }} />
                </Avatar>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
                  <Typography variant="caption" sx={{ color: 'error.main' }}>
                    -3%
                  </Typography>
                </Stack>
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {fNumber(summary.averageWeight)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                طن (متوسط)
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // Render enhanced data grid
  const renderDataGrid = (
    <Card
      sx={{
        overflow: 'hidden',
        '& .MuiDataGrid-root': {
          border: 'none',
        },
      }}
    >
      {isLoading && <LinearProgress />}
      <Box sx={{ height: 650, width: '100%' }}>
        <DataGrid
          rows={salesData?.data || []}
          columns={columns}
          rowCount={salesData?.totalRecords || 0}
          loading={isLoading}
          pageSizeOptions={[10, 25, 50, 100]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          paginationMode="server"
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          disableRowSelectionOnClick
          slots={{
            toolbar: () => (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  p: 2,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  bgcolor: 'background.neutral',
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  نتائج البحث
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={`${salesData?.data?.length || 0} من ${salesData?.totalRecords || 0}`}
                    size="small"
                    variant="outlined"
                  />
                  <IconButton size="small">
                    <ViewColumnIcon />
                  </IconButton>
                </Stack>
              </Stack>
            ),
          }}
          sx={{
            '& .MuiDataGrid-cell': {
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              py: 1.5,
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'background.neutral',
              borderBottom: `2px solid ${theme.palette.divider}`,
              '& .MuiDataGrid-columnHeader': {
                fontWeight: 600,
              },
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: `2px solid ${theme.palette.divider}`,
              backgroundColor: 'background.neutral',
            },
            '& .MuiDataGrid-row': {
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                cursor: 'pointer',
              },
              '&:nth-of-type(even)': {
                backgroundColor: alpha(theme.palette.grey[500], 0.02),
              },
            },
            '& .MuiDataGrid-virtualScroller': {
              overflowX: 'auto',
            },
          }}
          localeText={{
            noRowsLabel: 'لا توجد بيانات',
            MuiTablePagination: {
              labelRowsPerPage: 'عدد الصفوف:',
              labelDisplayedRows: ({ from, to, count }) =>
                `${from}-${to} من ${count !== -1 ? count : `أكثر من ${to}`}`,
            },
          }}
        />
      </Box>
    </Card>
  );

  return (
    <Container maxWidth={false}>
      <Box
        sx={{
          width: 1,
          minHeight: '100vh',
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
          padding: 4,
        }}
      >
        {/* Enhanced Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Stack spacing={1}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              بيانات المبيعات
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                آخر تحديث: {fDate(new Date())} • {fDate(new Date(), 'HH:mm')}
              </Typography>
              {activeFiltersCount > 0 && (
                <Chip
                  label={`${activeFiltersCount} فلاتر نشطة`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Stack>
          </Stack>

          <Button
            variant={showFilters ? 'contained' : 'outlined'}
            startIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{
              minWidth: 140,
              height: 40,
            }}
          >
            {showFilters ? 'إخفاء الفلاتر' : 'إظهار الفلاتر'}
          </Button>
        </Stack>

        {/* Filters */}
        {renderFilters}

        {/* Error Alert */}
        {!!errorMsg && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              border: `1px solid ${theme.palette.error.main}`,
            }}
            onClose={() => setErrorMsg('')}
          >
            {errorMsg}
          </Alert>
        )}

        {/* Summary Cards */}
        {renderSummary}

        {/* Data Grid */}
        {salesData?.data && salesData.data.length === 0 && !isLoading ? (
          <EmptyContent
            title="لا توجد بيانات"
            description="لم يتم العثور على نتائج تطابق معايير البحث"
            sx={{
              height: 400,
              bgcolor: 'background.paper',
              borderRadius: 2,
            }}
          />
        ) : (
          renderDataGrid
        )}
      </Box>
    </Container>
  );
}
