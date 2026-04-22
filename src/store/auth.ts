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
  updateTokens: (newAccessToken: string, newRefreshToken?: string) => void;
  setUser: (user: User) => void;
  // 🔥 ДОБАВЛЯЕМ МЕТОД updateUser в интерфейс
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      isAuth: false,
      user: null,

      updateTokens: (newAccessToken: string, newRefreshToken?: string) =>
        set((state) => ({
          ...state,
          accessToken: newAccessToken,
          ...(newRefreshToken && { refreshToken: newRefreshToken }),
        })),

      fetchUser: async () => {
        try {
          const { data } = await AuthService.getMe();
          const userData = data.data;

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

      // 🔥 РЕАЛИЗАЦИЯ МЕТОДА updateUser: обновляем только переданные поля у текущего юзера
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          isAuth: false,
          user: null,
        }),
    }),
    {
      name: 'auth-storage',
    },
  ),
);
