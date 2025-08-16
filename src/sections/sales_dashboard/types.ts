export interface Response {
  IsSuccess: boolean;
  StatusCode: string;
  ErrorMessages: [];
}
export interface DashboardFarmResponse extends Response {
  result: {
    trucksStatus: {
      status: string;
      quantity: number;
      value: number;
    }[];
    bookings: {
      status: string;
      quantity: number;
      value: number;
    }[];
    dsReceipts: {
      cntReceipts: number;
      smWeight: number;
      smDockageDeduction: number;
      smCleanWeight: number;
      smAmountToPay: number;
      smZakatPayToDate: number;
      smPayToDate: number;
      smProteinDeduction: number;
      smAccepted: number;
      smRejected: number;
      mnArrivalDate: Date;
      mxArrivalDate: Date;
    };
    receipts: {
      id: number;
      seasonId: number;
      branchId: number;
      branchLabel: string;
      ticketId: number;
      farmId: number;
      farmCode: number;
      farmerName: string;
      grainKindName: string;
      appointmentCode: number;
      rejectReasons: string;
      moisPrcnt: number;
      weight: number;
      dockageDeduction: number;
      cleanWeight: number;
      price: number;
      totalPay: number;
      proteinPrcnt: number;
      proteinDeduction: number;
      cleanTotalPay: number;
      amountToPay: number;
      zakat: number;
      payToDate: number;
      accepted: boolean;
      createdDate_: string;
      createdTime_: string;
      arrivalDate_: string;
      priceInTon: number;
    }[];
    farm: {
      farmCode: number;
      seasonId: number;
      branchId?: number;
      branchLabel?: string;
      certificateNumber?: string;
      name?: string;
      idNumber?: string;
      phone?: string;
      qty?: number;
      region?: string;
      cntTrucks?: number;
      cntTrucksProcessed?: number;
      cntTrucksDelivered?: number;
      cntTrucksAccepted?: number;
      cntTrucksRejected?: number;
      cntTrucksHold?: number;
      cntTrucksCanceled?: number;
      cntTrucksDateOvered?: number;
      cntTrucksDateWaiting?: number;
      cntTrucksReserved?: number;
      smMoisPrcnt?: number;
      smWeight?: number;
      dockage?: number;
      smDockage?: number;
      dockageAverage?: number;
      smCleanWeight?: number;
      smPrice?: number;
      smTotalPay?: number;
      smCleanTotalPay?: number;
      smProteinDeduction?: number;
      smAmountToPay?: number;
      smZakatPayToDate?: number;
      smPayToDatesmVAT?: number;
      smPayToDate?: number;
      deductionLimitAmount?: number;
      mnArrivalDate?: Date;
      mnCreatedDate?: Date;
      mxArrivalDate?: Date;
      mxCreatedDate?: Date;
    };
    dashFarm: {
      farmId: number;
      smQty?: number;
      branchId?: number;
      smWeight?: number;
      smCleanWeight?: number;
      smDockage?: number;
      dockageAverage?: number;
      qtyBalance?: number;
      qtyCleanBalance?: number;
      cntTrucks?: number;
      cntTrucksAccepted?: number;
      cntTrucksRejected?: number;
      smTotalPay?: number;
      smPayToDate?: number;
      smAmountToPay?: number;
      smZakatPayToDate?: number;
      smVAT?: number;
      mnArrivalDate?: Date;
      mxArrivalDate?: Date;
      totalFullAllowedTrucks?: number;
      totalAllowedTrucks?: number;
      cntUsed?: number;
      cntWaiting?: number;
      cntDateOver?: number;
      cntProcessed?: number;
      cntProcessing?: number;
      cntAccepted?: number;
      cntRejected?: number;
    };
  };
}
export interface DashboardBranchResponse extends Response {
  result: {
    trucksStatus: {
      status: string;
      quantity: number;
      value: number;
    }[];
    seasonFarmsCounter: {
      branchId: number;
      cntS6Farms: number;
      cntS5Farms: number;
    }[];
    seasonWeightTotal: {
      branchId: number;
      smS6Weight: number;
      smS5Weight: number;
    }[];
    seasonDateWeightTotal: {
      branchId: number;
      smS6Weight: number;
      smS5Weight: number;
    }[];

    bookings: {
      status: string;
      quantity: number;
      value: number;
    }[];
    dashMain: {
      branchId: number;
      branchLabel: string;
      smQty?: number;
      cntBranchSelected: number;
      smWeight?: number;
      smCleanWeight?: number;
      smDockage?: number;
      dockageAverage?: number;
      qtyBalance?: number;
      qtyCleanBalance?: number;
      cntTrucks?: number;
      cntTrucksAccepted?: number;
      cntTrucksRejected?: number;
      smTotalPay?: number;
      smPayToDate?: number;
      smAmountToPay?: number;
      smZakatPayToDate?: number;
      smVAT?: number;
      mnArrivalDate?: Date;
      mxArrivalDate?: Date;
      totalFullAllowedTrucks?: number;
      totalAllowedTrucks?: number;
      cntUsed?: number;
      cntWaiting?: number;
      cntDateOver?: number;
      cntProcessed?: number;
      cntProcessing?: number;
      cntAccepted?: number;
      cntRejected?: number;
      cntApps?: number;
    };
    dashBranch: {
      branchId: number;
      branchLabel: string;
      smQty?: number;
      cntBranchSelected: number;
      smWeight?: number;
      smCleanWeight?: number;
      smDockage?: number;
      dockageAverage?: number;
      qtyBalance?: number;
      qtyCleanBalance?: number;
      cntTrucks?: number;
      cntTrucksAccepted?: number;
      cntTrucksRejected?: number;
      smTotalPay?: number;
      smPayToDate?: number;
      smAmountToPay?: number;
      smZakatPayToDate?: number;
      smVAT?: number;
      mnArrivalDate?: Date;
      mxArrivalDate?: Date;
      totalFullAllowedTrucks?: number;
      totalAllowedTrucks?: number;
      cntUsed?: number;
      cntWaiting?: number;
      cntDateOver?: number;
      cntProcessed?: number;
      cntProcessing?: number;
      cntAccepted?: number;
      cntRejected?: number;
      cntApps?: number;
      acceptedSaudi1?: number;
      acceptedSaudi2?: number;
      rejectReason5?: number;
      rejectReason8?: number;
      rejectReason10?: number;
      rejectReason13?: number;
      rejectReason14?: number;
      rejectReason0?: number;
    }[];
    clientStats: {
      clientsNumber: number;
      qtyTotal: number;
      clientsNoBranch: number;
      clientsNoBranchTotalQty: number;
      clientsHasBranch: number;
      clientsHasBranchTotalQty: number;
      clientsHasDelivery: number;
    };
    trucksRejectReasons: {
      rejectReasonId: number;
      rejectReasons: string;
      counter: number;
    }[];
    branchesTrucksDockages: {
      branchId: number;
      branchName: string;
      trucksAccepted: number;
      smWeight: number;
      smDockageDeduction: number;
      dockageDeductionAverage: number;
    }[];

    branchesTrucks: {
      branchId: number;
      branchName: string;
      trucksNumber: number;
      trucksAccepted: number;
      trucksRejeced: number;
    }[];

    branchClientsActiveApps: {
      branchID: number;
      branchName: string;
      clientsHasActiveApps: number;
      trucksAccepted: number;
    }[];

    branchesTodayWaitingApps: {
      branchID: number;
      branchName: string;
      appsCounter: number;
    }[];
  };
}
 


export interface DashboardSalesAdminResponse extends Response {
  result: {
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
}

