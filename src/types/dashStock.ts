
export type IDashMainStock = {
  dsYearInfo: {
      year: number;
      cntCustomers: number;
      smtotalWeightInTons: number;
      smPrice: number;
      cntProductId: number;
      cntInvoices: number;
    }[];
  dsYearMonthInfo: {
      year: number;
      month: number;
      cntCustomers: number;
      smtotalWeightInTons: number;
      smPrice: number;
      cntProductId: number;
      cntInvoices: number;
    }[];


    dashMain: {
      cntCustomers: number;
      cntCompanies: number;
      cntBranches: number;
      cntProducts: number;
      totalWeightInTons: number;
      totalPrice: number;
      cntInvoices: number;
      actvBakeriesQty: number;
      actv113Qty: number;
      actvOthersQty: number;
      actvOthersQtyReal: number;
      qY2023: number;
      qY2024: number;
    };
     salesTotalPerPeriods: {
      period: number;
      qtyY2023: number;
      qtyY2024: number;
      priceY2023: number;
      priceY2024: number;
    }[];
    salesTotalPerMonth: {
      month: number;
      qtyY2023: number;
      qtyY2024: number;
      priceY2023: number;
      priceY2024: number;
    }[];
    salesTotalPerProductType: {
      productType: number;
      qty: number;
      price: number;
    }[];
    salesTotalPerProductTypeYear: {
      productType: number;
      qtyY2023: number;
      qtyY2024: number;
      priceY2023: number;
      priceY2024: number;
    }[];
    salesTop10: {
      groupName: string;
      cntAccounts: number;
      totalQty: number;
      totalPerc: number;
    }[];
    salesTop10List: {
      status: string;
      quantity: number;
      value: number;
    }[];
    salesTotalPerCompany: {
      companyId: number;
      qtyY2023: number;
      qtyY2024: number;
    }[];
    salesTotalPerBranch: {
      branchId: number;
      branchName:string;
      qtyY2023: number;
      qtyY2024: number;
    }[];
    salesAllYears: {
      companyName:string;
      years :number[],
      all :number[],
      restricted :number[],
      houseRefill :number[],
      wheatDerivatives :number[],
    }[];
};

export type IDashYSales = {
  dsYearInfo: {
      year: number;
      companyId:number,
      branchId:number,
      cntCustomers: number;
      smtotalWeightInTons: number;
      smPrice: number;
      cntProductId: number;
      cntInvoices: number;
    }[];
  dsYearMonthInfo: {
      companyId: number;
      branchId: number;
      year: number;
      month: number;
      cntCustomers: number;
      smtotalWeightInTons: number;
      smPrice: number;
      cntProductId: number;
      cntInvoices: number;
    }[];


    dashMain: {
      cntCustomers: number;
      cntCompanies: number;
      cntBranches: number;
      cntProducts: number;
      totalWeightInTons: number;
      totalPrice: number;
      cntInvoices: number;
      actvBakeriesQty: number;
      actv113Qty: number;
      actvOthersQty: number;
      actvOthersQtyReal: number;
      qY2023: number;
      qY2024: number;
    };
     salesTotalPerPeriods: {
      period: number;
      qtyY2023: number;
      qtyY2024: number;
      priceY2023: number;
      priceY2024: number;
    }[];
    salesTotalPerMonth: {
      month: number;
      qtyY2023: number;
      qtyY2024: number;
      priceY2023: number;
      priceY2024: number;
    }[];
    salesTotalPerProductType: {
      productType: number;
      qty: number;
      price: number;
    }[];
    salesTotalPerProductTypeYear: {
      productType: number;
      qtyY2023: number;
      qtyY2024: number;
      priceY2023: number;
      priceY2024: number;
    }[];
    salesTop10: {
      groupName: string;
      cntAccounts: number;
      totalQty: number;
      totalPerc: number;
    }[];
    salesTop10List: {
      status: string;
      quantity: number;
      value: number;
    }[];
    salesTotalPerCompany: {
      companyId: number;
      qtyY2023: number;
      qtyY2024: number;
    }[];
    salesTotalPerBranch: {
      branchId: number;
      branchName:string;
      qtyY2023: number;
      qtyY2024: number;
    }[];
    salesAllYears: {
      companyName:string;
      years :number[],
      all :number[],
      restricted :number[],
      houseRefill :number[],
      wheatDerivatives :number[],
    }[];
};

export type IDashStockFilters = {
  companyId: number;
  stationId: number;
  portId: number;
  year: number;
  month: number;
  fromDate: Date;
  toDate: Date;
  text: string;
};
export type IDashMonthlyReportsFilters = {
  companyId: number;
  branchId: number;
  year: number;
  fromMonth: number;
  toMonth: number;
};

export type IDashMFilters = {
};

