// Shared type definitions for all KPI components

export interface BranchMonthlySales {
  name: string;
  monthlySalesCYear: number[];
  monthlySalesPYear: number[];
}

export interface CompanyMonthlySales {
  name: string;
  branches: BranchMonthlySales[];
}

export interface MonthlySalesData {
  companies: CompanyMonthlySales[];
}

// Simplified mainInfo interface for KPI components
// Only includes the data structure that KPI components actually use
export interface mainInfo {
  monthlySales: {
    companies: CompanyMonthlySales[];
  };
  [key: string]: any; // For other properties that components don't directly use
}