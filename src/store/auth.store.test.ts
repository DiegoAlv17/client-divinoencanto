import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from './auth.store';

beforeEach(() => {
  useAuthStore.setState({ token: null, user: null });
});

describe('auth.store', () => {
  it('starts with no auth', () => {
    const { token, user } = useAuthStore.getState();
    expect(token).toBeNull();
    expect(user).toBeNull();
  });

  it('setAuth stores token and user', () => {
    useAuthStore.getState().setAuth('abc123', 'maria', 'ADMIN');
    const { token, user } = useAuthStore.getState();
    expect(token).toBe('abc123');
    expect(user).toEqual({ username: 'maria', role: 'ADMIN' });
  });

  it('clearAuth removes token and user', () => {
    useAuthStore.getState().setAuth('abc123', 'maria', 'ADMIN');
    useAuthStore.getState().clearAuth();
    const { token, user } = useAuthStore.getState();
    expect(token).toBeNull();
    expect(user).toBeNull();
  });
});
