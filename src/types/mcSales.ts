// src/types/mcSales.ts
export interface MCSales {
    id: number;
    companyId?: number;
    branchId?: number;
    invoiceNo?: string;
    invoiceDate?: Date;
    year?: number;
    month?: number;
    customerId?: number;
    customerName?: string;
    uCustomerName?: string;
    totalWeightInTons?: number;
    price?: number;
    productId?: number;
    productTypeId?: number;
    productCatId?: number;
    productCatName?: string;
    activityTypeId?: number;
    activityTypeName?: string;
    searchText?: string;
  }
  
  export interface MCSalesQueryParameters {
    pageNumber: number;
    pageSize: number;
    sortBy?: string;
    sortOrder?: string;
    companyId?: number;
    branchId?: number;
    startDate?: Date | null;
    endDate?: Date | null;
    year?: number;
    month?: number;
    customerId?: number;
    customerName?: string;
    productId?: number;
    productTypeId?: number;
    productCatId?: number;
    activityTypeId?: number;
    minPrice?: number;
    maxPrice?: number;
    minWeight?: number;
    maxWeight?: number;
    invoiceNo?: string;
    searchText?: string;
  }
  
  export interface PagedResponse<T> {
    data: T[];
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
  }
  
  export interface SalesSummary {
    totalRecords: number;
    totalWeight: number;
    totalPrice: number;
    averagePrice: number;
    averageWeight: number;
  }