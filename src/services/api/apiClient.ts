import axios from 'axios';
import { useAuthStore } from '@/store/auth';

// Создаем экземпляр с базовыми настройками
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://kgloto.com',
});

// 1. Централизованный перехватчик ЗАПРОСОВ
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Централизованный перехватчик ОТВЕТОВ (Refresh Token логика)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если ошибка 401 и мы еще не пробовали обновить токен для этого запроса
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;

        if (!refreshToken) {
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }

        // Запрос на обновление (используем чистый axios, чтобы не зациклиться)
        const refreshResponse = await axios.post(
          `${api.defaults.baseURL}/api/v1/auth/token/refresh/`,
          {
            refresh: refreshToken,
          },
        );

        // Извлекаем новые токены
        const newAccessToken =
          refreshResponse.data.data?.access || refreshResponse.data.access;
        const newRefreshToken =
          refreshResponse.data.data?.refresh || refreshResponse.data.refresh;

        // Сохраняем их в стор
        useAuthStore.getState().updateTokens(newAccessToken, newRefreshToken);

        // Обновляем заголовок и повторяем запрос
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Критическая ошибка авторизации (сессия истекла)');
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
