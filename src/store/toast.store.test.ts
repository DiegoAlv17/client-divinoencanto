import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useToastStore } from './toast.store';

beforeEach(() => {
  useToastStore.setState({ toasts: [] });
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('toast.store', () => {
  it('push adds a toast', () => {
    useToastStore.getState().push('Hello', 'success');
    expect(useToastStore.getState().toasts).toHaveLength(1);
    expect(useToastStore.getState().toasts[0]).toMatchObject({ message: 'Hello', type: 'success' });
  });

  it('dismiss removes a specific toast', () => {
    useToastStore.getState().push('A', 'success');
    useToastStore.getState().push('B', 'error');
    const id = useToastStore.getState().toasts[0].id;
    useToastStore.getState().dismiss(id);
    const remaining = useToastStore.getState().toasts;
    expect(remaining).toHaveLength(1);
    expect(remaining[0].message).toBe('B');
  });

  it('toast auto-dismisses after 4 seconds', () => {
    useToastStore.getState().push('Auto', 'warning');
    expect(useToastStore.getState().toasts).toHaveLength(1);
    vi.advanceTimersByTime(4000);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });
});
