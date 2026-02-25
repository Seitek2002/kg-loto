// src/store/auth.ts
import { AuthService } from '@/services/auth';
import { User } from '@/types/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuth: boolean;

  user: User | null;
  fetchUser: () => Promise<void>;

  setTokens: (access: string, refresh: string) => void;
  setUser: (user: User) => void;
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
          const userData = data.data;

          // 🔥 ХАК: Если бэкенд прислал профиль строкой (JSON), парсим его в объект
          if (
            userData.kglotteryProfile &&
            typeof userData.kglotteryProfile === 'string'
          ) {
            try {
              userData.kglotteryProfile = JSON.parse(userData.kglotteryProfile);
            } catch (parseError) {
              console.error('Ошибка парсинга kglotteryProfile:', parseError);
              userData.kglotteryProfile = null;
            }
          }

          set({ user: userData });
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
