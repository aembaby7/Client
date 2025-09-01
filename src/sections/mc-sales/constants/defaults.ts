import { MCSalesQueryParameters } from 'src/types/mcSales';

export const DEFAULT_FILTERS: MCSalesQueryParameters = {
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