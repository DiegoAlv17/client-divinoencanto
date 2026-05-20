import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: { username: string; role: string } | null;
  setAuth: (token: string, username: string, role: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, username, role) =>
        set({ token, user: { username, role } }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    { name: 'divino-auth' }
  )
);
