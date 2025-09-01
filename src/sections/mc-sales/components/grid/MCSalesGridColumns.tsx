// src/sections/mc-sales/components/grid/MCSalesGridColumns.tsx
import React from 'react';
import { GridColDef, GridRenderCellParams, GridPaginationModel } from '@mui/x-data-grid';
import { Box, Stack, Typography, Chip } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import Iconify from 'src/components/iconify';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ScaleTwoToneIcon from '@mui/icons-material/ScaleTwoTone';
import { MCSales } from 'src/types/mcSales';
import { getCompanyName, getBranchName } from '../../constants/companies';
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