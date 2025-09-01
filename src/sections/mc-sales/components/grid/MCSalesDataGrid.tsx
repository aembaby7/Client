import React from 'react';
import { Card, Box } from '@mui/material';
import { DataGrid, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { LoadingScreen } from 'src/components/loading-screen';
import EmptyContent from 'src/components/empty-content';
import { PagedResponse, MCSales } from 'src/types/mcSales';
import { getMCSalesColumns } from './MCSalesGridColumns';
import { dataGridLocaleText, dataGridStyles } from './MCSalesGridStyles';

interface MCSalesDataGridProps {
  data: PagedResponse<MCSales> | null;
  isLoading: boolean;
  paginationModel: GridPaginationModel;
  sortModel: GridSortModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  onSortModelChange: (model: GridSortModel) => void;
}

export const MCSalesDataGrid: React.FC<MCSalesDataGridProps> = ({
  data,
  isLoading,
  paginationModel,
  sortModel,
  onPaginationModelChange,
  onSortModelChange,
}) => {
  const columns = getMCSalesColumns(paginationModel);

  if (isLoading && !data) {
    return (
      <Card sx={{ borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <LoadingScreen sx={{ height: 400 }} />
      </Card>
    );
  }

  if (data?.data && data.data.length === 0) {
    return (
      <Card sx={{ borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <EmptyContent
          title="لا توجد بيانات"
          description="لم يتم العثور على نتائج تطابق معايير البحث"
          sx={{ height: 400 }}
        />
      </Card>
    );
  }

  return (
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
          rows={data?.data || []}
          columns={columns}
          rowCount={data?.totalRecords || 0}
          loading={isLoading}
          pageSizeOptions={[10, 25, 50, 100]}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          paginationMode="server"
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={onSortModelChange}
          disableRowSelectionOnClick
          getRowHeight={() => 72}
          sx={dataGridStyles}
          localeText={dataGridLocaleText}
        />
      </Box>
    </Card>
  );
};
