import { useState, useCallback } from 'react';
import { MCSalesQueryParameters } from 'src/types/mcSales';
import { DEFAULT_FILTERS } from '../constants/defaults';

export const useMCSalesFilters = () => {
  const [filters, setFilters] = useState<MCSalesQueryParameters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = useCallback((name: keyof MCSalesQueryParameters, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  return {
    filters,
    showFilters,
    handleFilterChange,
    handleResetFilters,
    toggleFilters,
    setFilters,
  };
};