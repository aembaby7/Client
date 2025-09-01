// src/sections/mc-sales/components/grid/MCSalesGridColumns.tsx
import React from 'react';
import { GridColDef, GridRenderCellParams, GridPaginationModel } from '@mui/x-data-grid';
import { Box, Stack, Typography, Chip } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import Iconify from 'src/components/iconify';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ScaleTwoToneIcon from '@mui/icons-material/ScaleTwoTone';
import { MCSales } from 'src/types/mcSales';
import { getCompanyName } from '../../constants/companies';
import { getBranchName } from '../../constants/branches';
import { TIME_LABELS } from '../../constants/labels';
import { SARFormatter } from '../common/SARFormatter';

export const getMCSalesColumns = (paginationModel: GridPaginationModel): GridColDef[] => {
  const theme = useTheme();

  return [
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
      renderCell: (params) => <SARFormatter value={params.value} variant="highlighted" />,
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
};
