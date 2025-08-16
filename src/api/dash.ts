import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher, endpoints } from 'src/utils/axios';
import { IDashMainSales, IDashYSales } from 'src/types/dashSales';

export function useGetMainDashboard() {
  const URL = endpoints.dashSales.getMainDashboard;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      dash: (data?.result as IDashMainSales) || [],
      dashLoading: isLoading,
      dashError: error,
      dashValidating: isValidating,
      dashEmpty: !isLoading && !data?.dash ,
    }),
    [data?.result, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetYearlyDashboard() {
  const URL = endpoints.dashSales.getYearlyDashboard;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      dashY: (data?.result as IDashYSales) || [],
      dashLoading: isLoading,
      dashError: error,
      dashValidating: isValidating,
      dashEmpty: !isLoading && !data?.dash ,
    }),
    [data?.result, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

// export function useGetProduct(productId: string) {
//   const URL = productId ? [endpoints.product.details, { params: { productId } }] : '';

//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

//   const memoizedValue = useMemo(
//     () => ({
//       product: data?.product as IProductItem,
//       productLoading: isLoading,
//       productError: error,
//       productValidating: isValidating,
//     }),
//     [data?.product, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }

// // ----------------------------------------------------------------------

// export function useSearchProducts(query: string) {
//   const URL = query ? [endpoints.product.search, { params: { query } }] : '';

//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
//     keepPreviousData: true,
//   });

//   const memoizedValue = useMemo(
//     () => ({
//       searchResults: (data?.results as IProductItem[]) || [],
//       searchLoading: isLoading,
//       searchError: error,
//       searchValidating: isValidating,
//       searchEmpty: !isLoading && !data?.results.length,
//     }),
//     [data?.results, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }
