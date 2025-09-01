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
  GridRenderCellParams,
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
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { LoadingScreen } from 'src/components/loading-screen';
import EmptyContent from 'src/components/empty-content';
import Iconify from 'src/components/iconify';
import { fDate } from 'src/utils/format-time';
import { fNumber, fCurrency, fShortenNumber } from 'src/utils/format-number';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MCSales, MCSalesQueryParameters, PagedResponse, SalesSummary } from 'src/types/mcSales';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocalShippingTwoToneIcon from '@mui/icons-material/LocalShippingTwoTone';
import ScaleTwoToneIcon from '@mui/icons-material/ScaleTwoTone';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import NumbersIcon from '@mui/icons-material/Numbers';
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import AnalyticsTwoToneIcon from '@mui/icons-material/AnalyticsTwoTone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// Saudi Riyal Icon Component
const SARIcon = ({
  size = 20,
  color = 'currentColor',
  ...props
}: {
  size?: number;
  color?: string;
  [key: string]: any;
}) => (
  <svg
    viewBox="0 0 1124.14 1256.39"
    width={size}
    height={size}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
    {...props}
  >
    <path
      fill={color}
      d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"
    />
    <path
      fill={color}
      d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"
    />
  </svg>
);

// Saudi Riyal formatter with English numbers
const formatSAR = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined) return '0.00';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '0.00';

  // Format number with English numbers and thousands separator
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue);

  return formatted;
};

const defaultFilters: MCSalesQueryParameters = {
  pageNumber: 1,
  pageSize: 10,
  sortBy: 'id',
  sortOrder: 'desc',
  year: new Date().getFullYear() - 1,
  month: 0,
  companyId: 0,
  branchId: 0,
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
  year: ['2024'],
};

const companiesLabels = ['الشركة الأولى', 'الشركة العربية', 'الشركة الحديثة', 'الشركة الرابعة'];

const branchesData: { [key: number]: { id: number; name: string }[] } = {
  1: [
    { id: 14, name: 'فرع جدة' },
    { id: 15, name: 'فرع القصيم' },
    { id: 19, name: 'فرع تبوك' },
    { id: 25, name: 'فرع الإحساء' },
  ],
  2: [
    { id: 12, name: 'فرع الرياض' },
    { id: 20, name: 'فرع حائل' },
    { id: 24, name: 'فرع جازان' },
  ],
  3: [
    { id: 16, name: 'فرع خميس مشيط' },
    { id: 18, name: 'فرع الجوف' },
    { id: 23, name: 'فرع الجموم' },
  ],
  4: [
    { id: 13, name: 'فرع الدمام' },
    { id: 17, name: 'فرع الخرج' },
    { id: 22, name: 'فرع المدينة المنورة' },
  ],
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
  const [showFilters, setShowFilters] = useState(false);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'id', sort: 'desc' }]);

  // Helper functions to get company and branch names
  const getCompanyName = (companyId: number): string => {
    if (!companyId || companyId === 0) return '-';
    return companiesLabels[companyId - 1] || '-';
  };

  const getBranchName = (companyId: number, branchId: number): string => {
    if (!branchId || branchId === 0) return '-';
    if (!companyId || companyId === 0) return '-';

    const branch = branchesData[companyId]?.find((b) => b.id === branchId);
    return branch?.name || '-';
  };

  // Define columns for DataGrid with enhanced design
  const columns: GridColDef[] = [
    {
      field: 'serial',
      headerName: '#',
      width: 70,
      minWidth: 50,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => {
        const rowIndex =
          paginationModel.page * paginationModel.pageSize +
          params.api.getRowIndexRelativeToVisibleRows(params.row.id) +
          1;
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '8px',
              bgcolor: '#F1F5F9',
              color: '#475569',
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          >
            {rowIndex}
          </Box>
        );
      },
    },
    {
      field: 'companyName',
      headerName: 'الشركة',
      minWidth: 140,
      flex: 0.8,
      renderCell: (params: GridRenderCellParams<MCSales>) => {
        const companyName = getCompanyName(params.row.companyId || 0);
        return (
          <Chip
            label={companyName}
            size="small"
            variant="outlined"
            sx={{
              bgcolor: alpha(theme.palette.info.main, 0.08),
              borderColor: alpha(theme.palette.info.main, 0.24),
              color: 'info.dark',
              fontWeight: 500,
            }}
          />
        );
      },
    },
    {
      field: 'branchName',
      headerName: 'الفرع',
      minWidth: 130,
      flex: 0.7,
      renderCell: (params: GridRenderCellParams<MCSales>) => {
        const branchName = getBranchName(params.row.companyId || 0, params.row.branchId || 0);
        return (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="eva:pin-fill" sx={{ color: 'warning.main', width: 16, height: 16 }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {branchName}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: 'year',
      headerName: 'السنة',
      minWidth: 80,
      flex: 0.5,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            bgcolor: alpha(theme.palette.info.main, 0.08),
            color: 'info.dark',
            fontWeight: 600,
          }}
        />
      ),
    },
    {
      field: 'month',
      headerName: 'الشهر',
      minWidth: 90,
      flex: 0.6,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const monthName = params.value ? TIME_LABELS.month[params.value]?.name : '-';
        return (
          <Chip
            label={monthName}
            size="small"
            variant="soft"
            sx={{
              bgcolor: alpha(theme.palette.warning.main, 0.08),
              color: 'warning.dark',
              fontWeight: 500,
            }}
          />
        );
      },
    },
    {
      field: 'invoiceNo',
      headerName: 'رقم الفاتورة',
      minWidth: 140,
      flex: 0.8,
      renderCell: (params) => (
        <Chip
          icon={<ReceiptLongIcon sx={{ fontSize: 16 }} />}
          label={params.value || '-'}
          size="small"
          variant="outlined"
          color="primary"
          sx={{
            fontWeight: 600,
            borderStyle: 'dashed',
            borderWidth: 1.5,
            background: `linear-gradient(45deg, ${alpha(
              theme.palette.primary.main,
              0.05
            )} 0%, transparent 100%)`,
            transition: 'all 0.3s ease',
            '& .MuiChip-icon': {
              color: 'primary.main',
              transition: 'transform 0.3s ease',
            },
            '&:hover': {
              borderStyle: 'solid',
              background: alpha(theme.palette.primary.main, 0.1),
              transform: 'translateX(-2px)',
              '& .MuiChip-icon': {
                transform: 'rotate(-10deg)',
              },
            },
          }}
        />
      ),
    },

    {
      field: 'customerName',
      headerName: 'العميل',
      minWidth: 220,
      flex: 1.5,
      renderCell: (params: GridRenderCellParams<MCSales>) => (
        <Stack spacing={0.5} sx={{ py: 0.5 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                bgcolor: '#EEF2FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify icon="eva:person-fill" sx={{ color: '#6366F1', width: 20, height: 20 }} />
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: '#1A2B3D',
                }}
              >
                {params.value || 'غير محدد'}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#94A3B8',
                  fontSize: '0.75rem',
                }}
              >
                كود: {params.row.customerId || 'N/A'}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      ),
    },

    {
      field: 'productCatName',
      headerName: 'فئة المنتج',
      minWidth: 140,
      flex: 0.8,
      renderCell: (params) => (
        <Chip
          label={params.value || '-'}
          size="small"
          color="primary"
          variant="filled"
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.12),
            color: 'primary.dark',
            fontWeight: 500,
            borderRadius: 1,
          }}
        />
      ),
    },
    {
      field: 'productName',
      headerName: 'اسم المنتج',
      minWidth: 180,
      flex: 1.2,
      renderCell: (params) => (
        <Stack spacing={0.5}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {params.value || '-'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {params.row.productCode ? `كود: ${params.row.productCode}` : ''}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'qty',
      headerName: 'الكمية',
      minWidth: 100,
      flex: 0.6,
      align: 'right',
      headerAlign: 'center',
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {params.value ? new Intl.NumberFormat('en-US').format(params.value) : '0'}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'uom',
      headerName: 'الوحدة',
      minWidth: 90,
      flex: 0.5,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip
          label={params.value || '-'}
          size="small"
          variant="soft"
          sx={{
            bgcolor: alpha(theme.palette.secondary.main, 0.08),
            color: 'secondary.dark',
            fontWeight: 500,
            minWidth: 60,
          }}
        />
      ),
    },
    {
      field: 'totalWeightInTons',
      headerName: 'الوزن (طن)',
      minWidth: 120,
      flex: 0.7,
      align: 'right',
      headerAlign: 'center',
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <ScaleTwoToneIcon sx={{ fontSize: 18, color: 'info.main' }} />
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'info.dark' }}>
            {params.value ? new Intl.NumberFormat('en-US').format(params.value) : '0'}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'price',
      headerName: 'السعر',
      minWidth: 150,
      flex: 0.9,
      align: 'right',
      headerAlign: 'center',
      renderCell: (params) => (
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.8}
          sx={{
            px: 1.2,
            py: 0.6,
            borderRadius: 1.5,
            bgcolor: '#F0FDF4',
            border: '1px solid #BBF7D0',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: '#15803D',
              fontSize: '0.9rem',
            }}
          >
            {formatSAR(params.value)}
          </Typography>
          <SARIcon size={16} color="#15803D" />
        </Stack>
      ),
    },
    {
      field: 'activityTypeName',
      headerName: 'نوع النشاط',
      minWidth: 140,
      flex: 0.8,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: 'secondary.main',
            }}
          />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {params.value || '-'}
          </Typography>
        </Stack>
      ),
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
      console.log('dataRes:', dataRes);
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
    // Force re-fetch with default filters
    setTimeout(() => {
      getData();
    }, 100);
  };

  // Export data
  const handleExport = async () => {
    try {
      setIsLoading(true);

      // Prepare export request matching backend structure
      const exportRequest = {
        parameters: {
          ...filters,
          pageNumber: 1,
          pageSize: 10000,
        },
        format: 'csv',
        maxRecords: 10000,
      };

      const response = await axios.post(endpoints.mcSales.export, exportRequest, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Create blob with BOM for proper Excel UTF-8 encoding (important for Arabic text)
      const BOM = '\uFEFF';
      const blob = new Blob([BOM, response.data], {
        type: 'text/csv;charset=utf-8',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Generate filename with current date
      const fileName = `تقرير_المبيعات_${fDate(new Date(), 'dd-MM-yyyy_HH-mm')}.csv`;
      link.setAttribute('download', fileName);

      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
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

  // Render filters section with enhanced design
  const renderFilters = (
    <Card
      sx={{
        mb: 3,
        display: showFilters ? 'block' : 'none',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderRadius: 2,
        border: '1px solid #E8ECF1',
        bgcolor: 'white',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <FilterListIcon sx={{ color: '#6366F1', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1A2B3D' }}>
              مفردات البحث
            </Typography>
          </Stack>

          <Divider sx={{ borderColor: '#E8ECF1' }} />

          <Grid container spacing={2}>
            {/* First Row */}
            <Grid xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel
                  sx={{
                    '&.Mui-focused': {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  السنة
                </InputLabel>
                <Select
                  value={filters.year?.toString() || ''}
                  onChange={(e) => handleFilterChange('year', Number(e.target.value))}
                  input={
                    <OutlinedInput
                      label="السنة"
                      sx={{
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(theme.palette.divider, 0.2),
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.primary.main,
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.primary.main,
                          borderWidth: 2,
                        },
                      }}
                    />
                  }
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        borderRadius: 2,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        mt: 1,
                        '& .MuiMenuItem-root': {
                          borderRadius: 1,
                          mx: 1,
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            transform: 'translateX(-4px)',
                          },
                          '&.Mui-selected': {
                            bgcolor: alpha(theme.palette.primary.main, 0.12),
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.16),
                            },
                          },
                        },
                      },
                    },
                  }}
                >
                  {TIME_LABELS.year.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
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
            </Grid>

            <Grid xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>الشركة</InputLabel>
                <Select
                  value={filters.companyId?.toString() || '0'}
                  onChange={(e) => {
                    handleFilterChange('companyId', Number(e.target.value));
                  }}
                  input={<OutlinedInput label="الشركة" />}
                >
                  <MenuItem value={0}>الكل</MenuItem>
                  {companiesLabels.map((company, index) => (
                    <MenuItem key={index + 1} value={index + 1}>
                      {company}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>الفرع</InputLabel>
                <Select
                  value={filters.branchId?.toString() || '0'}
                  onChange={(e) => handleFilterChange('branchId', Number(e.target.value))}
                  input={<OutlinedInput label="الفرع" />}
                  disabled={filters.companyId === 0}
                >
                  <MenuItem value={0}>الكل</MenuItem>
                  {filters.companyId !== 0 &&
                    filters.companyId &&
                    branchesData[filters.companyId]?.map((branch: { id: number; name: string }) => (
                      <MenuItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </MenuItem>
                    ))}
                  {filters.companyId === 0 && (
                    <MenuItem value={0} disabled>
                      اختر الشركة أولاً
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid xs={12} sm={6} md={2}>
              <DatePicker
                label="من تاريخ"
                value={filters.startDate}
                onChange={(newValue) => handleFilterChange('startDate', newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                  },
                  actionBar: {
                    actions: ['clear', 'today', 'accept'],
                  },
                }}
                localeText={{
                  clearButtonLabel: 'مسح',
                  todayButtonLabel: 'اليوم',
                  okButtonLabel: 'موافق',
                  cancelButtonLabel: 'إلغاء',
                }}
              />
            </Grid>

            <Grid xs={12} sm={6} md={2}>
              <DatePicker
                label="إلى تاريخ"
                value={filters.endDate}
                onChange={(newValue) => handleFilterChange('endDate', newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                  },
                  actionBar: {
                    actions: ['clear', 'today', 'accept'],
                  },
                }}
                localeText={{
                  clearButtonLabel: 'مسح',
                  todayButtonLabel: 'اليوم',
                  okButtonLabel: 'موافق',
                  cancelButtonLabel: 'إلغاء',
                }}
              />
            </Grid>

            {/* Second Row */}
            <Grid xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                value={filters.customerName}
                onChange={(e) => handleFilterChange('customerName', e.target.value)}
                placeholder="اسم العميل"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:person-outline" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                value={filters.invoiceNo}
                onChange={(e) => handleFilterChange('invoiceNo', e.target.value)}
                placeholder="رقم الفاتورة"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ReceiptLongIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                value={filters.searchText}
                onChange={(e) => handleFilterChange('searchText', e.target.value)}
                placeholder="بحث عام..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid xs={12} sm={6} md={2}>
              <Stack direction="row" spacing={1} height="100%">
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={handleSearch}
                  size="medium"
                  sx={{
                    bgcolor: '#6B7280',
                    borderRadius: 1,
                    fontWeight: 500,
                    boxShadow: 'none',
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: '#4B5563',
                      boxShadow: 'none',
                    },
                    '&:active': {
                      bgcolor: '#374151',
                    },
                  }}
                >
                  بحث
                </Button>
                <Tooltip title="إعادة تعيين" placement="top">
                  <IconButton
                    onClick={handleResetFilters}
                    sx={{
                      bgcolor: '#F9FAFB',
                      borderRadius: 1,
                      color: '#9CA3AF',
                      border: '1px solid #E5E7EB',
                      '&:hover': {
                        bgcolor: '#F3F4F6',
                        color: '#6B7280',
                      },
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="تصدير" placement="top">
                  <IconButton
                    onClick={handleExport}
                    disabled={isLoading}
                    sx={{
                      bgcolor: '#F9FAFB',
                      color: '#9CA3AF',
                      borderRadius: 1,
                      border: '1px solid #E5E7EB',
                      '&:hover': {
                        bgcolor: '#F3F4F6',
                        color: '#6B7280',
                      },
                      '&.Mui-disabled': {
                        bgcolor: '#F9FAFB',
                        color: '#E5E7EB',
                        borderColor: '#F3F4F6',
                      },
                    }}
                  >
                    <FileDownloadIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );

  // Render summary cards
  const renderSummary = summary && (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid xs={12} md={4}>
        <Card
          sx={{
            bgcolor: 'white',
            borderRadius: 3,
            boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.04)',
            border: 'none',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 12px 24px rgba(0,0,0,0.08)',
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#6B7280',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      mb: 1,
                    }}
                  >
                    إجمالي المبيعات
                  </Typography>
                  <Stack direction="row" alignItems="baseline" spacing={1}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: '#111827',
                        fontSize: '2.5rem',
                        lineHeight: 1,
                      }}
                    >
                      {summary.totalWeight
                        ? new Intl.NumberFormat('en-US').format(summary.totalWeight)
                        : '0'}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#9CA3AF',
                        fontSize: '1.125rem',
                        fontWeight: 500,
                      }}
                    >
                      طن
                    </Typography>
                  </Stack>
                </Box>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: '#F3F4F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ScaleTwoToneIcon sx={{ color: '#6B7280', fontSize: 24 }} />
                </Box>
              </Stack>
              <Box sx={{ pt: 2, borderTop: '1px solid #F3F4F6' }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Box sx={{ width: 16, height: 16 }}>
                      <LocalShippingTwoToneIcon sx={{ fontSize: 16, color: '#3B82F6' }} />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.875rem' }}>
                      اجمالي الكميات المباعة لكافة الأصناف
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid xs={12} md={4}>
        <Card
          sx={{
            bgcolor: 'white',
            borderRadius: 3,
            boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.04)',
            border: 'none',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 12px 24px rgba(0,0,0,0.08)',
            },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
            }}
          />
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#6B7280',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      mb: 1,
                    }}
                  >
                    إجمالي السعر
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: '#111827',
                        fontSize: '2.5rem',
                        lineHeight: 1,
                      }}
                    >
                      {formatSAR(summary.totalPrice)}
                    </Typography>
                    <SARIcon size={28} color="#10B981" />
                  </Stack>
                </Box>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: '#F0FDF4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LocalShippingTwoToneIcon sx={{ color: '#10B981', fontSize: 24 }} />
                </Box>
              </Stack>
              <Box sx={{ pt: 2, borderTop: '1px solid #F3F4F6' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.875rem' }}>
                    وفق شركات المطاحن
                  </Typography>
                  {/* <Stack direction="row" alignItems="center" spacing={0.5}>
                    <TrendingUpIcon sx={{ fontSize: 16, color: '#10B981' }} />
                    <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600 }}>
                      +12.5%
                    </Typography>
                  </Stack> */}
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid xs={12} md={4}>
        <Card
          sx={{
            bgcolor: 'white',
            borderRadius: 3,
            boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.04)',
            border: 'none',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 12px 24px rgba(0,0,0,0.08)',
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#6B7280',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      mb: 1,
                    }}
                  >
                    إجمالي السجلات
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: '#111827',
                      fontSize: '2.5rem',
                      lineHeight: 1,
                    }}
                  >
                    {summary.totalRecords
                      ? new Intl.NumberFormat('en-US').format(summary.totalRecords)
                      : '0'}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: '#F3F4F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ReceiptLongIcon sx={{ color: '#6B7280', fontSize: 24 }} />
                </Box>
              </Stack>
              <Box sx={{ pt: 2, borderTop: '1px solid #F3F4F6' }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: '#10B981',
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 1 },
                        '50%': { opacity: 0.5 },
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.875rem' }}>
                    نشط
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // Render data grid
  const renderDataGrid = (
    <Card
      sx={{
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid #E5E7EB',
        bgcolor: 'white',
      }}
    >
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
          getRowHeight={() => 72}
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #F3F4F6',
              py: 1,
              '&:focus': {
                outline: 'none',
              },
              '&:focus-within': {
                outline: 'none',
              },
            },
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: '#F9FAFB',
              borderRadius: 0,
              borderBottom: '2px solid #E5E7EB',
              '& .MuiDataGrid-columnHeader': {
                '&:hover': {
                  backgroundColor: '#F3F4F6',
                },
                '&:focus': {
                  outline: 'none',
                },
                '&:focus-within': {
                  outline: 'none',
                },
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 600,
                fontSize: '0.875rem',
                color: '#374151',
              },
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '2px solid #E5E7EB',
              bgcolor: '#F9FAFB',
            },
            '& .MuiDataGrid-row': {
              '&:hover': {
                backgroundColor: '#F9FAFB',
              },
              '&:nth-of-type(even)': {
                backgroundColor: '#FAFBFC',
              },
            },
            '& .MuiDataGrid-virtualScroller': {
              overflowX: 'auto',
              overflowY: 'auto',
              // Custom scrollbar styles for both vertical and horizontal
              '&::-webkit-scrollbar': {
                width: 12,
                height: 12,
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#F3F4F6',
                borderRadius: 6,
                border: '1px solid #E5E7EB',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#9CA3AF',
                borderRadius: 6,
                border: '2px solid #F3F4F6',
                '&:hover': {
                  backgroundColor: '#6B7280',
                },
                '&:active': {
                  backgroundColor: '#4B5563',
                },
              },
              '&::-webkit-scrollbar-corner': {
                backgroundColor: '#F3F4F6',
              },
              // Firefox scrollbar
              scrollbarWidth: 'auto',
              scrollbarColor: '#9CA3AF #F3F4F6',
            },
            '& .MuiDataGrid-scrollbar': {
              '&::-webkit-scrollbar': {
                width: 12,
                height: 12,
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#F3F4F6',
                borderRadius: 6,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#9CA3AF',
                borderRadius: 6,
                '&:hover': {
                  backgroundColor: '#6B7280',
                },
              },
            },
            '& .MuiDataGrid-columnSeparator': {
              color: '#E5E7EB',
            },
            '& .MuiTablePagination-root': {
              '& .MuiTablePagination-selectLabel': {
                fontWeight: 500,
                color: '#6B7280',
              },
              '& .MuiTablePagination-displayedRows': {
                fontWeight: 500,
                color: '#6B7280',
              },
            },
          }}
          localeText={{
            // Root text
            noRowsLabel: 'لا توجد بيانات',
            noResultsOverlayLabel: 'لا توجد نتائج',

            // Density selector
            toolbarDensity: 'الكثافة',
            toolbarDensityLabel: 'الكثافة',
            toolbarDensityCompact: 'مضغوط',
            toolbarDensityStandard: 'قياسي',
            toolbarDensityComfortable: 'مريح',

            // Columns selector
            toolbarColumns: 'الأعمدة',
            toolbarColumnsLabel: 'اختر الأعمدة',

            // Filters
            toolbarFilters: 'مفردات البحث',
            toolbarFiltersLabel: 'إظهار مفردات البحث',
            toolbarFiltersTooltipHide: 'إخفاء مفردات البحث',
            toolbarFiltersTooltipShow: 'إظهار مفردات البحث',
            toolbarFiltersTooltipActive: (count) =>
              count !== 1 ? `${count} فلاتر نشطة` : `فلتر واحد نشط`,

            // Export
            toolbarExport: 'تصدير',
            toolbarExportLabel: 'تصدير',
            toolbarExportCSV: 'تنزيل كـ CSV',
            toolbarExportPrint: 'طباعة',

            // Columns panel
            columnsPanelTextFieldLabel: 'البحث عن عمود',
            columnsPanelTextFieldPlaceholder: 'عنوان العمود',
            columnsPanelDragIconLabel: 'إعادة ترتيب العمود',
            columnsPanelShowAllButton: 'إظهار الكل',
            columnsPanelHideAllButton: 'إخفاء الكل',

            // Filter panel
            filterPanelAddFilter: 'إضافة فلتر',
            filterPanelDeleteIconLabel: 'حذف',
            filterPanelOperatorAnd: 'و',
            filterPanelOperatorOr: 'أو',
            filterPanelColumns: 'الأعمدة',
            filterPanelInputLabel: 'القيمة',
            filterPanelInputPlaceholder: 'قيمة الفلتر',

            // Filter operators
            filterOperatorContains: 'يحتوي على',
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

            // Column menu
            columnMenuLabel: 'القائمة',
            columnMenuShowColumns: 'إظهار الأعمدة',
            columnMenuFilter: 'فلتر',
            columnMenuHideColumn: 'إخفاء العمود',
            columnMenuUnsort: 'إلغاء الترتيب',
            columnMenuSortAsc: 'ترتيب تصاعدي',
            columnMenuSortDesc: 'ترتيب تنازلي',
            columnMenuManageColumns: 'إدارة الأعمدة',

            // Column header
            columnHeaderFiltersTooltipActive: (count) =>
              count !== 1 ? `${count} فلاتر نشطة` : `فلتر واحد نشط`,
            columnHeaderFiltersLabel: 'إظهار مفردات البحث',
            columnHeaderSortIconLabel: 'ترتيب',

            // Pagination
            MuiTablePagination: {
              labelRowsPerPage: 'عدد الصفوف:',
              labelDisplayedRows: ({ from, to, count }) =>
                `${from}-${to} من ${count !== -1 ? count : `أكثر من ${to}`}`,
            },

            // Footer
            footerRowSelected: (count) =>
              count !== 1 ? `${count.toLocaleString()} صفوف محددة` : `صف واحد محدد`,
            footerTotalRows: 'إجمالي الصفوف:',
            footerTotalVisibleRows: (visibleCount, totalCount) =>
              `${visibleCount.toLocaleString()} من ${totalCount.toLocaleString()}`,

            // Actions
            actionsCellMore: 'المزيد',
            pinToLeft: 'تثبيت على اليسار',
            pinToRight: 'تثبيت على اليمين',
            unpin: 'إلغاء التثبيت',

            // Boolean cell
            booleanCellTrueLabel: 'نعم',
            booleanCellFalseLabel: 'لا',
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
            onClick={() => setShowFilters(!showFilters)}
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
        {renderFilters}

        {/* Error Alert */}
        {!!errorMsg && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: theme.shadows[2],
            }}
            onClose={() => setErrorMsg('')}
          >
            {errorMsg}
          </Alert>
        )}

        {/* Summary Cards */}
        {renderSummary}

        {/* Data Grid */}
        {isLoading && !salesData ? (
          <Card sx={{ borderRadius: 2, boxShadow: theme.shadows[2] }}>
            <LoadingScreen sx={{ height: 400 }} />
          </Card>
        ) : salesData?.data && salesData.data.length === 0 ? (
          <Card sx={{ borderRadius: 2, boxShadow: theme.shadows[2] }}>
            <EmptyContent
              title="لا توجد بيانات"
              description="لم يتم العثور على نتائج تطابق معايير البحث"
              sx={{ height: 400 }}
            />
          </Card>
        ) : (
          renderDataGrid
        )}
      </Box>
    </Container>
  );
}
