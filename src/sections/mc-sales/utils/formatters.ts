export const formatSAR = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined) return '0.00';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '0.00';

  // Format number with English numbers and thousands separator
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue);

  return formatted;
};