import { useState, useCallback, useEffect } from 'react';
import axios from 'src/utils/axios';
import { endpoints } from 'src/utils/axios';
import { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { MCSalesQueryParameters, PagedResponse, MCSales, SalesSummary } from 'src/types/mcSales';

interface UseMCSalesDataProps {
  filters: MCSalesQueryParameters;
}

export const useMCSalesData = ({ filters }: UseMCSalesDataProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [salesData, setSalesData] = useState<PagedResponse<MCSales> | null>(null);
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'id', sort: 'desc' }
  ]);

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

  const handleExport = useCallback(async () => {
    try {
      setIsLoading(true);

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

      // Create blob with BOM for proper Excel UTF-8 encoding
      const BOM = '\uFEFF';
      const blob = new Blob([BOM, response.data], {
        type: 'text/csv;charset=utf-8',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Generate filename with current date
      const fileName = `تقرير_المبيعات_${new Date().toISOString().split('T')[0]}.csv`;
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
  }, [filters]);

  // Load data on mount and when pagination/sort changes
  useEffect(() => {
    getData();
  }, [paginationModel, sortModel]);

  return {
    isLoading,
    errorMsg,
    salesData,
    summary,
    paginationModel,
    sortModel,
    setPaginationModel,
    setSortModel,
    getData,
    handleExport,
    setErrorMsg,
  };
};