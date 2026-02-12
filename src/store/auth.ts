// src/store/auth.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuth: boolean;
  user: {
    fullName: string | null;
    phone: string | null;
  };

  // Действия
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: { fullName: string; phone: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      isAuth: false,
      user: {
        fullName: null,
        phone: null,
      },

      setTokens: (access, refresh) =>
        set({ accessToken: access, refreshToken: refresh, isAuth: true }),

      setUser: (user) => set({ user }),

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          isAuth: false,
          user: { fullName: null, phone: null },
        }),
    }),
    {
      name: 'auth-storage', // Имя ключа в localStorage
    },
  ),
);
