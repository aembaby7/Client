'use client';

import * as Yup from 'yup';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import {
  Alert,
  Card,
  CardHeader,
  CardProps,
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
} from '@mui/material';
import { t } from 'i18next';
import { RHFSelect } from 'src/components/hook-form/rhf-select';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider from 'src/components/hook-form/form-provider';
import { useCallback, useEffect, useState } from 'react';
import axios, { endpoints } from 'src/utils/axios';
import { LoadingButton } from '@mui/lab';
import Loading from 'src/app/dashboard/loading';
import { RHFUpload } from 'src/components/hook-form/rhf-upload';
import { RHFTextField } from 'src/components/hook-form';
import { useAuthContext } from 'src/auth/hooks';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { useResponsive } from 'src/hooks/use-responsive';
import { IFarm } from 'src/types/farm';
import EmptyContent from 'src/components/empty-content';
import { DashboardFarmResponse } from './types';

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  total?: number;
  gridData: {
    branchLabel: string;
  }[];
}
export default function BranchesSTS({ gridData, ...other }: Props) {
  const smUp = useResponsive('up', 'sm');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const settings = useSettingsContext();
  const { user } = useAuthContext();

  const columns: GridColDef[] = [
    {
      field: 'branchLabel',
      headerName: 'كود الرخصة',
      filterable: false,
    },
  ];

  return (
    <Card>
      <CardHeader title="احصائي الفروع" subheader="" sx={{ mb: 3 }} />
      <>
        <DataGrid
          slotProps={{
            pagination: {
              labelRowsPerPage: 'عدد السجلات بالصفحة',
            },
          }}
          style={{ paddingRight: 10, paddingLeft: 10 }}
          localeText={{
            columnHeaderFiltersLabel: 'عرض التنقية',
            columnHeaderSortIconLabel: 'ترتيب',

            noRowsLabel: 'لا توجد نتائج',
            noResultsOverlayLabel: 'لا توجد نتائج.',

            // Density selector toolbar button text
            toolbarDensity: 'Size',
            toolbarDensityLabel: 'Size',
            toolbarDensityCompact: 'Small',
            toolbarDensityStandard: 'Medium',
            toolbarDensityComfortable: 'Large',

            // Columns selector toolbar button text
            toolbarColumns: 'الحقول',
            toolbarColumnsLabel: 'اختر الحقول',

            // Filters toolbar button text
            toolbarFilters: 'Filters',
            toolbarFiltersLabel: 'Show filters',
            toolbarFiltersTooltipHide: 'Hide filters',
            toolbarFiltersTooltipShow: 'Show filters',
            toolbarFiltersTooltipActive: (count) =>
              count !== 1 ? `${count} active filters` : `${count} active filter`,

            // Quick filter toolbar field
            toolbarQuickFilterPlaceholder: 'بحث…',
            toolbarQuickFilterLabel: 'بحث',
            toolbarQuickFilterDeleteIconLabel: 'مسح',

            // Export selector toolbar button text
            toolbarExport: 'Export',
            toolbarExportLabel: 'Export',
            toolbarExportCSV: 'Download as CSV',
            toolbarExportPrint: 'Print',
            toolbarExportExcel: 'Download as Excel',

            // Columns management text
            // columnsManagementSearchTitle: 'بحث',
            // columnsManagementNoColumns: 'لا توجد حقول',
            // columnsManagementShowHideAllText: 'عرض/اخفاء الكل',

            // Filter panel text
            filterPanelAddFilter: 'اضافة تنقية',
            filterPanelRemoveAll: 'ازالة',
            filterPanelDeleteIconLabel: 'حذف',
            filterPanelLogicOperator: 'Logic operator',
            filterPanelOperator: 'المعامل',
            filterPanelOperatorAnd: 'و',
            filterPanelOperatorOr: 'أو',
            filterPanelColumns: 'الحقول',
            filterPanelInputLabel: 'القيمة',
            filterPanelInputPlaceholder: 'فلترة',

            // Filter operators text
            filterOperatorContains: 'يتضمن',
            filterOperatorEquals: 'يساوي',
            filterOperatorStartsWith: 'يبدأ بـ',
            filterOperatorEndsWith: 'ينتهي بـ',
            filterOperatorIs: 'هو',
            filterOperatorNot: 'هو ليس',
            filterOperatorAfter: 'بعد',
            filterOperatorOnOrAfter: 'هو أو بعد',
            filterOperatorBefore: 'قبل',
            filterOperatorOnOrBefore: 'هو أو قبل',
            filterOperatorIsEmpty: 'فارغ',
            filterOperatorIsNotEmpty: 'ليس أي من',
            filterOperatorIsAnyOf: 'أي من',
            'filterOperator=': '=',
            'filterOperator!=': '!=',
            'filterOperator>': '>',
            'filterOperator>=': '>=',
            'filterOperator<': '<',
            'filterOperator<=': '<=',

            // Header filter operators text
            headerFilterOperatorContains: 'Contains',
            headerFilterOperatorEquals: 'Equals',
            headerFilterOperatorStartsWith: 'Starts with',
            headerFilterOperatorEndsWith: 'Ends with',
            headerFilterOperatorIs: 'Is',
            headerFilterOperatorNot: 'Is not',
            headerFilterOperatorAfter: 'Is after',
            headerFilterOperatorOnOrAfter: 'Is on or after',
            headerFilterOperatorBefore: 'Is before',
            headerFilterOperatorOnOrBefore: 'Is on or before',
            headerFilterOperatorIsEmpty: 'Is empty',
            headerFilterOperatorIsNotEmpty: 'Is not empty',
            headerFilterOperatorIsAnyOf: 'Is any of',
            'headerFilterOperator=': 'Equals',
            'headerFilterOperator!=': 'Not equals',
            'headerFilterOperator>': 'Greater than',
            'headerFilterOperator>=': 'Greater than or equal to',
            'headerFilterOperator<': 'Less than',
            'headerFilterOperator<=': 'Less than or equal to',

            // Filter values text
            filterValueAny: 'any',
            filterValueTrue: 'true',
            filterValueFalse: 'false',

            // Column menu text
            columnMenuLabel: 'القائمة',
            columnMenuShowColumns: 'عرض الحقول',
            columnMenuManageColumns: 'التحكم في الحقول',
            columnMenuFilter: 'تنقية',
            columnMenuHideColumn: 'اخفاء حقل',
            columnMenuUnsort: 'غير مُرتب',
            columnMenuSortAsc: 'ترتيب تصاعدي',
            columnMenuSortDesc: 'ترتيب تنازلي',
          }}
          rows={gridData}
          columns={columns}
          // getRowHeight={() => 'auto'}
          pageSizeOptions={[5, 10, 25, 100, 250]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          slots={{
            noRowsOverlay: () => <EmptyContent title="لا توجد سجلات" />,
            noResultsOverlay: () => <EmptyContent title="لا توجد نتائج للبحث" />,
          }}
        />
      </>
    </Card>
  );
}
