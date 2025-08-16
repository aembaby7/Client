import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';
import { IFarm } from 'src/types/farm';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function useGetFarms() {
  // const { updateFarmCode, user } = useAuthContext();
  const URL = endpoints.farm.list; // + '?idNumber=' + user?.idNumber;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      farms: (data?.result as IFarm[]) || [],
      farmsLoading: isLoading,
      farmsError: error,
      farmsValidating: isValidating,
      farmsEmpty: !isLoading && !data?.result.length,
    }),
    [data?.farms, error, isLoading, isValidating]
  );

  return memoizedValue;
}
