import { useMemo } from 'react';
import useSWR from 'swr';
import { salesApi } from '../../../api/sales.api';
import { clientsApi } from '../../../api/clients.api';
import type { SaleResponse } from '../../../types';

type Filter = 'all' | 'debt' | 'paid';

export function useClientDebt(clientId: number | null) {
  const { data: client, isLoading: clientLoading, error: clientError } = useSWR(
    clientId ? ['clients', clientId] : null,
    ([, cid]) => clientsApi.findById(cid)
  );

  const { data: sales = [], isLoading: salesLoading, error: salesError, mutate } = useSWR(
    clientId ? ['sales/client', clientId] : null,
    ([, cid]) => salesApi.findByClientId(cid)
  );

  const salesWithDebt = useMemo(
    () => sales.filter((sale) => sale.items.some((item) => item.difference > 0)),
    [sales]
  );

  const totalDebt = useMemo(
    () => salesWithDebt.reduce(
      (sum, sale) => sum + sale.items.reduce((s, item) => s + (item.difference > 0 ? item.difference : 0), 0),
      0
    ),
    [salesWithDebt]
  );

  return {
    client,
    sales,
    salesWithDebt,
    totalDebt,
    isLoading: clientLoading || salesLoading,
    error: clientError || salesError,
    mutate,
  };
}

export function filterSales(sales: SaleResponse[], salesWithDebt: SaleResponse[], filter: Filter): SaleResponse[] {
  switch (filter) {
    case 'debt': return salesWithDebt;
    case 'paid': return sales.filter((sale) => sale.items.every((item) => item.difference === 0));
    default: return sales;
  }
}
