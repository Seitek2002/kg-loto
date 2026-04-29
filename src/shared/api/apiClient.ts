import axios from "axios";
import Cookies from "js-cookie";

import { useAuthStore } from "@/entities/user/model/authStore";

// ==========================================
// УТИЛИТЫ ДЛЯ КОНВЕРТАЦИИ РЕГИСТРА (КЛЮЧЕЙ)
// ==========================================
const toCamelCase = (str: string) =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

const toSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const isPlainObject = (obj: any): boolean => {
  return (
    obj !== null &&
    typeof obj === "object" &&
    !Array.isArray(obj) &&
    !(obj instanceof FormData) &&
    !(obj instanceof File) &&
    !(obj instanceof Blob) &&
    !(obj instanceof Date)
  );
};

const keysToCamel = (obj: any): any => {
  if (isPlainObject(obj)) {
    const n: Record<string, any> = {};
    Object.keys(obj).forEach((k) => {
      n[toCamelCase(k)] = keysToCamel(obj[k]);
    });
    return n;
  } else if (Array.isArray(obj)) {
    return obj.map((i) => keysToCamel(i));
  }
  return obj;
};

const keysToSnake = (obj: any): any => {
  if (isPlainObject(obj)) {
    const n: Record<string, any> = {};
    Object.keys(obj).forEach((k) => {
      n[toSnakeCase(k)] = keysToSnake(obj[k]);
    });
    return n;
  } else if (Array.isArray(obj)) {
    return obj.map((i) => keysToSnake(i));
  }
  return obj;
};

// ==========================================
// НАСТРОЙКА AXIOS
// ==========================================
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://kgloto.com/api/v1",
});

// 1. ПЕРЕХВАТЧИК ЗАПРОСОВ
api.interceptors.request.use((config) => {
  // 🔥 Берем токен из кук, а не из стейта
  const token = Cookies.get("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Берем язык из кук (для SSR и клиента)
  const locale = Cookies.get("NEXT_LOCALE") || "ru";
  if (locale) {
    config.headers["Accept-Language"] = locale;
  }

  // Конвертируем camelCase в snake_case перед отправкой
  if (config.data) {
    config.data = keysToSnake(config.data);
  }

  return config;
});

// 2. ПЕРЕХВАТЧИК ОТВЕТОВ (Конвертация + Авто-обновление токена)
api.interceptors.response.use(
  (response) => {
    // Успешный ответ: конвертируем snake_case в camelCase
    if (response.data) {
      response.data = keysToCamel(response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 🔥 Логика обновления токена
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get("refreshToken");

        if (!refreshToken) {
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }

        // Чистый axios для рефреша, чтобы избежать зацикливания интерцепторов
        const refreshResponse = await axios.post(
          `${api.defaults.baseURL}/auth/token/refresh/`,
          {
            refresh: refreshToken,
          },
        );

        const newAccessToken =
          refreshResponse.data.data?.access || refreshResponse.data.access;
        const newRefreshToken =
          refreshResponse.data.data?.refresh || refreshResponse.data.refresh;

        // Записываем новые токены в куки через метод стора
        useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);

        // Повторяем оригинальный запрос с новым токеном
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Сессия истекла", refreshError);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    // Если это другая ошибка (не 401), конвертируем текст ошибки в camelCase
    if (error.response?.data) {
      error.response.data = keysToCamel(error.response.data);
    }

    return Promise.reject(error);
  },
);

export default api;
