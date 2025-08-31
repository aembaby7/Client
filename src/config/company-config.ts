// src/config/company-config.ts

export const COMPANY_COLORS: { [key: string]: string } = {
  'الأولى': '#64B5F6',
  'العربية': '#81C784',
  'الحديثة': '#FFB74D',
  'الرابعة': '#BA68C8',
};

export const COMPANY_IDS: { [key: string]: number } = {
  'الأولى': 1,
  'العربية': 2,
  'الحديثة': 3,
  'الرابعة': 4,
};

// Reverse mapping for getting company name by ID
export const COMPANY_NAMES_BY_ID: { [key: number]: string } = {
  1: 'الأولى',
  2: 'العربية',
  3: 'الحديثة',
  4: 'الرابعة',
};

// Order by ID (1, 2, 3, 4)
export const COMPANY_ORDER = ['الأولى', 'العربية', 'الحديثة', 'الرابعة'];

// Helper function to get company color
export const getCompanyColor = (companyName: string): string => {
  return COMPANY_COLORS[companyName] || '#9E9E9E'; // Default gray if not found
};

// Helper function to get company ID
export const getCompanyId = (companyName: string): number => {
  return COMPANY_IDS[companyName] || 0;
};

// Helper function to get company name by ID
export const getCompanyNameById = (companyId: number): string => {
  return COMPANY_NAMES_BY_ID[companyId] || '';
};

// Helper function to sort companies by predefined order (by ID)
export const sortCompaniesByOrder = <T extends { name: string }>(companies: T[]): T[] => {
  return companies.sort((a, b) => {
    const idA = getCompanyId(a.name);
    const idB = getCompanyId(b.name);
    return idA - idB;
  });
};

// Helper function to get ordered company list
export const getOrderedCompanies = () => {
  return COMPANY_ORDER.map(name => ({
    id: COMPANY_IDS[name],
    name: name,
    color: COMPANY_COLORS[name]
  }));
};