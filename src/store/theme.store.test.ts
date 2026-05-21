import { beforeEach, describe, expect, it } from 'vitest';
import { useThemeStore } from './theme.store';

beforeEach(() => {
  useThemeStore.setState({ theme: 'light' });
});

describe('theme.store', () => {
  it('starts in light mode', () => {
    expect(useThemeStore.getState().theme).toBe('light');
  });

  it('toggle switches to dark', () => {
    useThemeStore.getState().toggle();
    expect(useThemeStore.getState().theme).toBe('dark');
  });

  it('toggle switches back to light', () => {
    useThemeStore.getState().toggle();
    useThemeStore.getState().toggle();
    expect(useThemeStore.getState().theme).toBe('light');
  });
});
