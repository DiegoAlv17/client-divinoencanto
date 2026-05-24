import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProductResponse } from '../types';

export interface CartItem {
  product: ProductResponse;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: ProductResponse) => void;
  removeItem: (productId: number) => void;
  updateQty: (productId: number, quantity: number) => void;
  clear: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(persist((set, get) => ({
  items: [],
  addItem: (product) =>
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { items: [...state.items, { product, quantity: 1 }] };
    }),
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.product.id !== productId),
    })),
  updateQty: (productId, quantity) =>
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((i) => i.product.id !== productId)
          : state.items.map((i) =>
              i.product.id === productId ? { ...i, quantity } : i
            ),
    })),
  clear: () => set({ items: [] }),
  total: () =>
    get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
}), { name: 'cart-storage' }));
