import { beforeEach, describe, expect, it } from 'vitest';
import { useSidebarStore } from './sidebar.store';

beforeEach(() => {
  useSidebarStore.setState({ collapsed: false });
});

describe('sidebar.store', () => {
  it('starts not collapsed', () => {
    expect(useSidebarStore.getState().collapsed).toBe(false);
  });

  it('toggle sets collapsed to true', () => {
    useSidebarStore.getState().toggle();
    expect(useSidebarStore.getState().collapsed).toBe(true);
  });

  it('toggle twice returns to false', () => {
    useSidebarStore.getState().toggle();
    useSidebarStore.getState().toggle();
    expect(useSidebarStore.getState().collapsed).toBe(false);
  });
});
