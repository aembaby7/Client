export const dataGridStyles = {
  border: 'none',
  '& .MuiDataGrid-cell': {
    borderBottom: '1px solid #F3F4F6',
    py: 1,
    '&:focus': {
      outline: 'none',
    },
    '&:focus-within': {
      outline: 'none',
    },
  },
  '& .MuiDataGrid-columnHeaders': {
    bgcolor: '#F9FAFB',
    borderRadius: 0,
    borderBottom: '2px solid #E5E7EB',
    '& .MuiDataGrid-columnHeader': {
      '&:hover': {
        backgroundColor: '#F3F4F6',
      },
      '&:focus': {
        outline: 'none',
      },
      '&:focus-within': {
        outline: 'none',
      },
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 600,
      fontSize: '0.875rem',
      color: '#374151',
    },
  },
  '& .MuiDataGrid-footerContainer': {
    borderTop: '2px solid #E5E7EB',
    bgcolor: '#F9FAFB',
  },
  '& .MuiDataGrid-row': {
    '&:hover': {
      backgroundColor: '#F9FAFB',
    },
    '&:nth-of-type(even)': {
      backgroundColor: '#FAFBFC',
    },
  },
  '& .MuiDataGrid-virtualScroller': {
    overflowX: 'auto',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: 12,
      height: 12,
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#F3F4F6',
      borderRadius: 6,
      border: '1px solid #E5E7EB',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#9CA3AF',
      borderRadius: 6,
      border: '2px solid #F3F4F6',
      '&:hover': {
        backgroundColor: '#6B7280',
      },
      '&:active': {
        backgroundColor: '#4B5563',
      },
    },
    '&::-webkit-scrollbar-corner': {
      backgroundColor: '#F3F4F6',
    },
    scrollbarWidth: 'auto',
    scrollbarColor: '#9CA3AF #F3F4F6',
  },
  '& .MuiDataGrid-columnSeparator': {
    color: '#E5E7EB',
  },
  '& .MuiTablePagination-root': {
    '& .MuiTablePagination-selectLabel': {
      fontWeight: 500,
      color: '#6B7280',
    },
    '& .MuiTablePagination-displayedRows': {
      fontWeight: 500,
      color: '#6B7280',
    },
  },
};

export const dataGridLocaleText = {
  noRowsLabel: 'لا توجد بيانات',
  noResultsOverlayLabel: 'لا توجد نتائج',
  toolbarDensity: 'الكثافة',
  toolbarDensityLabel: 'الكثافة',
  toolbarDensityCompact: 'مضغوط',
  toolbarDensityStandard: 'قياسي',
  toolbarDensityComfortable: 'مريح',
  toolbarColumns: 'الأعمدة',
  toolbarColumnsLabel: 'اختر الأعمدة',
  toolbarFilters: 'مفردات البحث',
  toolbarFiltersLabel: 'إظهار مفردات البحث',
  toolbarFiltersTooltipHide: 'إخفاء مفردات البحث',
  toolbarFiltersTooltipShow: 'إظهار مفردات البحث',
  toolbarFiltersTooltipActive: (count: number) =>
    count !== 1 ? `${count} فلاتر نشطة` : `فلتر واحد نشط`,
  toolbarExport: 'تصدير',
  toolbarExportLabel: 'تصدير',
  toolbarExportCSV: 'تنزيل كـ CSV',
  toolbarExportPrint: 'طباعة',
  columnsPanelTextFieldLabel: 'البحث عن عمود',
  columnsPanelTextFieldPlaceholder: 'عنوان العمود',
  columnsPanelDragIconLabel: 'إعادة ترتيب العمود',
  columnsPanelShowAllButton: 'إظهار الكل',
  columnsPanelHideAllButton: 'إخفاء الكل',
  filterPanelAddFilter: 'إضافة فلتر',
  filterPanelDeleteIconLabel: 'حذف',
  filterPanelOperatorAnd: 'و',
  filterPanelOperatorOr: 'أو',
  filterPanelColumns: 'الأعمدة',
  filterPanelInputLabel: 'القيمة',
  filterPanelInputPlaceholder: 'قيمة الفلتر',
  filterOperatorContains: 'يحتوي على',
  filterOperatorEquals: 'يساوي',
  filterOperatorStartsWith: 'يبدأ بـ',
  filterOperatorEndsWith: 'ينتهي بـ',
  filterOperatorIs: 'هو',
  filterOperatorNot: 'ليس',
  filterOperatorAfter: 'بعد',
  filterOperatorOnOrAfter: 'في أو بعد',
  filterOperatorBefore: 'قبل',
  filterOperatorOnOrBefore: 'في أو قبل',
  filterOperatorIsEmpty: 'فارغ',
  filterOperatorIsNotEmpty: 'غير فارغ',
  filterOperatorIsAnyOf: 'أي من',
  columnMenuLabel: 'القائمة',
  columnMenuShowColumns: 'إظهار الأعمدة',
  columnMenuFilter: 'فلتر',
  columnMenuHideColumn: 'إخفاء العمود',
  columnMenuUnsort: 'إلغاء الترتيب',
  columnMenuSortAsc: 'ترتيب تصاعدي',
  columnMenuSortDesc: 'ترتيب تنازلي',
  columnMenuManageColumns: 'إدارة الأعمدة',
  columnHeaderFiltersTooltipActive: (count: number) =>
    count !== 1 ? `${count} فلاتر نشطة` : `فلتر واحد نشط`,
  columnHeaderFiltersLabel: 'إظهار مفردات البحث',
  columnHeaderSortIconLabel: 'ترتيب',
  MuiTablePagination: {
    labelRowsPerPage: 'عدد الصفوف:',
    labelDisplayedRows: ({ from, to, count }: any) =>
      `${from}-${to} من ${count !== -1 ? count : `أكثر من ${to}`}`,
  },
  footerRowSelected: (count: number) =>
    count !== 1 ? `${count.toLocaleString()} صفوف محددة` : `صف واحد محدد`,
  footerTotalRows: 'إجمالي الصفوف:',
  footerTotalVisibleRows: (visibleCount: number, totalCount: number) =>
    `${visibleCount.toLocaleString()} من ${totalCount.toLocaleString()}`,
  actionsCellMore: 'المزيد',
  pinToLeft: 'تثبيت على اليسار',
  pinToRight: 'تثبيت على اليمين',
  unpin: 'إلغاء التثبيت',
  booleanCellTrueLabel: 'نعم',
  booleanCellFalseLabel: 'لا',
};