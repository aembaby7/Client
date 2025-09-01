export const BRANCHES_DATA: { [key: number]: { id: number; name: string }[] } = {
  1: [
    { id: 14, name: 'فرع جدة' },
    { id: 15, name: 'فرع القصيم' },
    { id: 19, name: 'فرع تبوك' },
    { id: 25, name: 'فرع الإحساء' },
  ],
  2: [
    { id: 12, name: 'فرع الرياض' },
    { id: 20, name: 'فرع حائل' },
    { id: 24, name: 'فرع جازان' },
  ],
  3: [
    { id: 16, name: 'فرع خميس مشيط' },
    { id: 18, name: 'فرع الجوف' },
    { id: 23, name: 'فرع الجموم' },
  ],
  4: [
    { id: 13, name: 'فرع الدمام' },
    { id: 17, name: 'فرع الخرج' },
    { id: 22, name: 'فرع المدينة المنورة' },
  ],
};

export const getBranchName = (companyId: number, branchId: number): string => {
  if (!branchId || branchId === 0) return '-';
  if (!companyId || companyId === 0) return '-';
  
  const branch = BRANCHES_DATA[companyId]?.find((b) => b.id === branchId);
  return branch?.name || '-';
};