// src/services/auth.ts
import { api } from '@/lib/api';
import { ApiResponse, Tokens, User, KGLotteryProfile } from '@/types/api';

// --- ИНТЕРФЕЙСЫ ЗАПРОСОВ ---
export interface LoginData {
  phoneNumber: string;
  password: string;
}

export interface RegisterData {
  phoneNumber: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  inn: string; // Ровно 14 символов
  birthYear: number;
  password: string;
  passwordConfirm: string;
}

export interface VerifyData {
  phoneNumber: string;
  code: string;
  purpose: 'register' | 'reset' | 'login';
}

export interface UpdateProfileData {
  fullName?: string;
  kglotteryProfile?: KGLotteryProfile;
}

// --- СЕРВИС ---
export const AuthService = {
  // 1. Вход
  async login(data: LoginData) {
    return api.post<ApiResponse<Tokens>>('/auth/login/', data);
  },

  // 2. Регистрация (возвращает просто success и message)
  async register(data: RegisterData) {
    return api.post<ApiResponse<{ success: boolean; message: string }>>(
      '/auth/register/',
      data,
    );
  },

  // 3. Подтверждение кода (при purpose: 'register' возвращает токены)
  async verify(data: VerifyData) {
    return api.post<
      ApiResponse<{
        accessToken?: string;
        refreshToken?: string;
        success: boolean;
      }>
    >('/auth/verify/', data);
  },

  // 4. Получение профиля
  async getMe() {
    return api.get<ApiResponse<User>>('/users/me/');
  },

  // 5. Обновление профиля (НОВЫЙ МЕТОД)
  async updateMe(data: UpdateProfileData) {
    return api.patch<ApiResponse<User>>('/users/me/', data);
  },
};
