import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  TextField,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { alpha, useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Iconify from 'src/components/iconify';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SearchIcon from '@mui/icons-material/Search';
import { MCSalesQueryParameters } from 'src/types/mcSales';
import { TIME_LABELS } from '../../constants/labels';
import { COMPANIES_LABELS } from '../../constants/companies';
import { BRANCHES_DATA } from '../../constants/branches';

interface MCSalesFilterInputsProps {
  filters: MCSalesQueryParameters;
  onFilterChange: (name: keyof MCSalesQueryParameters, value: any) => void;
  onSearch: () => void;
}

export const MCSalesFilterInputs: React.FC<MCSalesFilterInputsProps> = ({
  filters,
  onFilterChange,
  onSearch,
}) => {
  const theme = useTheme();

  const selectMenuProps = {
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
  };

  return (
    <Grid container spacing={2}>
      {/* Year */}
      <Grid xs={12} sm={6} md={2}>
        <FormControl fullWidth size="small">
          <InputLabel>السنة</InputLabel>
          <Select
            value={filters.year?.toString() || ''}
            onChange={(e) => onFilterChange('year', Number(e.target.value))}
            input={<OutlinedInput label="السنة" />}
            MenuProps={selectMenuProps}
          >
            {TIME_LABELS.year.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Month */}
      <Grid xs={12} sm={6} md={2}>
        <FormControl fullWidth size="small">
          <InputLabel>الشهر</InputLabel>
          <Select
            value={filters.month?.toString() || '0'}
            onChange={(e) => onFilterChange('month', Number(e.target.value))}
            input={<OutlinedInput label="الشهر" />}
            MenuProps={selectMenuProps}
          >
            {TIME_LABELS.month.map((month) => (
              <MenuItem key={month.id} value={month.id}>
                {month.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Company */}
      <Grid xs={12} sm={6} md={2}>
        <FormControl fullWidth size="small">
          <InputLabel>الشركة</InputLabel>
          <Select
            value={filters.companyId?.toString() || '0'}
            onChange={(e) => onFilterChange('companyId', Number(e.target.value))}
            input={<OutlinedInput label="الشركة" />}
            MenuProps={selectMenuProps}
          >
            <MenuItem value={0}>الكل</MenuItem>
            {COMPANIES_LABELS.map((company, index) => (
              <MenuItem key={index + 1} value={index + 1}>
                {company}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Branch */}
      <Grid xs={12} sm={6} md={2}>
        <FormControl fullWidth size="small">
          <InputLabel>الفرع</InputLabel>
          <Select
            value={filters.branchId?.toString() || '0'}
            onChange={(e) => onFilterChange('branchId', Number(e.target.value))}
            input={<OutlinedInput label="الفرع" />}
            disabled={filters.companyId === 0}
            MenuProps={selectMenuProps}
          >
            <MenuItem value={0}>الكل</MenuItem>
            {filters.companyId !== 0 &&
              filters.companyId &&
              BRANCHES_DATA[filters.companyId]?.map((branch) => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Start Date */}
      <Grid xs={12} sm={6} md={2}>
        <DatePicker
          label="من تاريخ"
          value={filters.startDate}
          onChange={(newValue) => onFilterChange('startDate', newValue)}
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

      {/* End Date */}
      <Grid xs={12} sm={6} md={2}>
        <DatePicker
          label="إلى تاريخ"
          value={filters.endDate}
          onChange={(newValue) => onFilterChange('endDate', newValue)}
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

      {/* Customer Name */}
      <Grid xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          size="small"
          value={filters.customerName}
          onChange={(e) => onFilterChange('customerName', e.target.value)}
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

      {/* Invoice No */}
      <Grid xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          size="small"
          value={filters.invoiceNo}
          onChange={(e) => onFilterChange('invoiceNo', e.target.value)}
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

      {/* Search Text */}
      <Grid xs={12} sm={12} md={6}>
        <TextField
          fullWidth
          size="small"
          value={filters.searchText}
          onChange={(e) => onFilterChange('searchText', e.target.value)}
          placeholder="بحث عام..."
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onSearch();
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
    </Grid>
  );
};
