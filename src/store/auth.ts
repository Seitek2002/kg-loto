// src/store/auth.ts
import { AuthService } from '@/services/auth';
import { UserProfile } from '@/types/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuth: boolean;

  user: UserProfile | null; // Обновим тип
  fetchUser: () => Promise<void>; // Действие для загрузки

  // Действия
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: UserProfile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      isAuth: false,
      user: null,

      fetchUser: async () => {
        try {
          const { data } = await AuthService.getMe();
          set({ user: data.data });
        } catch (error) {
          console.error('Failed to fetch user', error);
        }
      },

      setTokens: (access, refresh) =>
        set({ accessToken: access, refreshToken: refresh, isAuth: true }),

      setUser: (user) => set({ user }),

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          isAuth: false,
          user: null,
        }),
    }),
    {
      name: 'auth-storage', // Имя ключа в localStorage
    },
  ),
);
