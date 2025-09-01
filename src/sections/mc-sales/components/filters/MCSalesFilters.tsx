// src/sections/mc-sales/components/filters/MCSalesFilters.tsx
import React from 'react';
import {
  Card,
  CardContent,
  Stack,
  Button,
  IconButton,
  Tooltip,
  Typography,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { MCSalesQueryParameters } from 'src/types/mcSales';
import { MCSalesFilterInputs } from './MCSalesFilterInputs';

interface MCSalesFiltersProps {
  filters: MCSalesQueryParameters;
  showFilters: boolean;
  isLoading: boolean;
  onFilterChange: (name: keyof MCSalesQueryParameters, value: any) => void;
  onSearch: () => void;
  onReset: () => void;
  onExport: () => void;
}

export const MCSalesFilters: React.FC<MCSalesFiltersProps> = ({
  filters,
  showFilters,
  isLoading,
  onFilterChange,
  onSearch,
  onReset,
  onExport,
}) => {
  if (!showFilters) return null;

  return (
    <Card
      sx={{
        mb: 3,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderRadius: 2,
        border: '1px solid #E8ECF1',
        bgcolor: 'white',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <FilterListIcon sx={{ color: '#6366F1', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1A2B3D' }}>
              مفردات البحث
            </Typography>
          </Stack>

          <Divider sx={{ borderColor: '#E8ECF1' }} />

          {/* Filter Inputs */}
          <MCSalesFilterInputs
            filters={filters}
            onFilterChange={onFilterChange}
            onSearch={onSearch}
          />

          {/* Action Buttons */}
          <Grid container spacing={2}>
            <Grid xs={12} md={2} mdOffset={10}>
              <Stack direction="row" spacing={1} height="100%">
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={onSearch}
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
                    onClick={onReset}
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
                    onClick={onExport}
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
};
