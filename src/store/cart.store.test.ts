import { beforeEach, describe, expect, it } from 'vitest';
import { useCartStore } from './cart.store';
import type { ProductResponse } from '../types';

const makeProduct = (id: number, price = 10): ProductResponse => ({
  id,
  name: `Product ${id}`,
  description: '',
  price,
  stock: 10,
  imageUrl: '',
  active: true,
  categoryId: 1,
});

beforeEach(() => {
  useCartStore.setState({ items: [] });
});

describe('cart.store', () => {
  it('starts empty', () => {
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('addItem adds a new product with quantity 1', () => {
    useCartStore.getState().addItem(makeProduct(1));
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(1);
  });

  it('addItem increments quantity for existing product', () => {
    useCartStore.getState().addItem(makeProduct(1));
    useCartStore.getState().addItem(makeProduct(1));
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it('removeItem removes the product', () => {
    useCartStore.getState().addItem(makeProduct(1));
    useCartStore.getState().removeItem(1);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('updateQty sets quantity', () => {
    useCartStore.getState().addItem(makeProduct(1));
    useCartStore.getState().updateQty(1, 5);
    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it('updateQty with 0 removes item', () => {
    useCartStore.getState().addItem(makeProduct(1));
    useCartStore.getState().updateQty(1, 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('clear empties the cart', () => {
    useCartStore.getState().addItem(makeProduct(1));
    useCartStore.getState().addItem(makeProduct(2));
    useCartStore.getState().clear();
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('total calculates price × quantity sum', () => {
    useCartStore.getState().addItem(makeProduct(1, 10));
    useCartStore.getState().addItem(makeProduct(1, 10)); // qty 2
    useCartStore.getState().addItem(makeProduct(2, 5));  // qty 1
    expect(useCartStore.getState().total()).toBe(25);
  });
});
