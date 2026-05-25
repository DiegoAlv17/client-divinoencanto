import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useClientDebt } from './useClientDebt';
import type { SaleResponse, ClientResponse } from '../../../types';

const mockClient: ClientResponse = {
  id: 1, name: 'Ana', lastname: 'García', email: '', phone: '', address: '',
  type: 'client', grade: null, parent: null, parentPhone: null, parentEmail: null, area: null,
};

const mockSales: SaleResponse[] = [
  { id: 1, saleDate: '2025-01-01', totalAmount: 100, difference: 30, notes: '', clientId: 1, clientName: 'Ana García', items: [], createdAt: null },
  { id: 2, saleDate: '2025-01-02', totalAmount: 50, difference: 0, notes: '', clientId: 1, clientName: 'Ana García', items: [], createdAt: null },
];

vi.mock('swr', () => ({
  default: vi.fn(),
}));

import useSWR from 'swr';

describe('useClientDebt', () => {
  beforeEach(() => {
    vi.mocked(useSWR).mockReset();
  });

  it('returns null client and empty sales when clientId is null', () => {
    vi.mocked(useSWR).mockReturnValue({ data: undefined, isLoading: false, error: undefined, mutate: vi.fn() } as any);
    const { result } = renderHook(() => useClientDebt(null));
    expect(result.current.client).toBeUndefined();
    expect(result.current.sales).toHaveLength(0);
  });

  it('returns client data when loaded', () => {
    vi.mocked(useSWR)
      .mockReturnValueOnce({ data: mockClient, isLoading: false, error: undefined, mutate: vi.fn() } as any)
      .mockReturnValueOnce({ data: mockSales, isLoading: false, error: undefined, mutate: vi.fn() } as any);

    const { result } = renderHook(() => useClientDebt(1));
    expect(result.current.client).toEqual(mockClient);
  });

  it('returns all sales', () => {
    vi.mocked(useSWR)
      .mockReturnValueOnce({ data: mockClient, isLoading: false, error: undefined, mutate: vi.fn() } as any)
      .mockReturnValueOnce({ data: mockSales, isLoading: false, error: undefined, mutate: vi.fn() } as any);

    const { result } = renderHook(() => useClientDebt(1));
    expect(result.current.sales).toHaveLength(2);
  });

  it('filters salesWithDebt to only positive difference', () => {
    vi.mocked(useSWR)
      .mockReturnValueOnce({ data: mockClient, isLoading: false, error: undefined, mutate: vi.fn() } as any)
      .mockReturnValueOnce({ data: mockSales, isLoading: false, error: undefined, mutate: vi.fn() } as any);

    const { result } = renderHook(() => useClientDebt(1));
    expect(result.current.salesWithDebt).toHaveLength(1);
    expect(result.current.salesWithDebt[0].id).toBe(1);
  });

  it('calculates totalDebt as sum of positive differences', () => {
    vi.mocked(useSWR)
      .mockReturnValueOnce({ data: mockClient, isLoading: false, error: undefined, mutate: vi.fn() } as any)
      .mockReturnValueOnce({ data: mockSales, isLoading: false, error: undefined, mutate: vi.fn() } as any);

    const { result } = renderHook(() => useClientDebt(1));
    expect(result.current.totalDebt).toBe(30);
  });

  it('returns isLoading true when any request is loading', () => {
    vi.mocked(useSWR)
      .mockReturnValueOnce({ data: undefined, isLoading: true, error: undefined, mutate: vi.fn() } as any)
      .mockReturnValueOnce({ data: undefined, isLoading: false, error: undefined, mutate: vi.fn() } as any);

    const { result } = renderHook(() => useClientDebt(1));
    expect(result.current.isLoading).toBe(true);
  });

  it('returns zero totalDebt when no sales with debt', () => {
    const salesNoDept: SaleResponse[] = [
      { id: 3, saleDate: '2025-01-03', totalAmount: 50, difference: 0, notes: '', clientId: 1, clientName: 'Ana García', items: [], createdAt: null },
    ];
    vi.mocked(useSWR)
      .mockReturnValueOnce({ data: mockClient, isLoading: false, error: undefined, mutate: vi.fn() } as any)
      .mockReturnValueOnce({ data: salesNoDept, isLoading: false, error: undefined, mutate: vi.fn() } as any);

    const { result } = renderHook(() => useClientDebt(1));
    expect(result.current.totalDebt).toBe(0);
    expect(result.current.salesWithDebt).toHaveLength(0);
  });
});
