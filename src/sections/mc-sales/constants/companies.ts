export const COMPANIES_LABELS = [
  'الشركة الأولى', 
  'الشركة العربية', 
  'الشركة الحديثة', 
  'الشركة الرابعة'
];

export const getCompanyName = (companyId: number): string => {
  if (!companyId || companyId === 0) return '-';
  return COMPANIES_LABELS[companyId - 1] || '-';
};