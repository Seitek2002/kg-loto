// src/services/auth.ts
import { api } from '@/lib/api';
import { ApiResponse } from '@/types/api';
import {
  LoginData,
  AuthResponse,
  RegisterData,
  VerifyData,
  UserProfile,
} from '@/types/auth';

export const AuthService = {
  // 1. Вход
  async login(data: LoginData) {
    return api.post<AuthResponse>('/auth/login/', data);
  },

  // 2. Регистрация
  async register(data: RegisterData) {
    return api.post('/auth/register/', data);
  },

  // 3. Подтверждение кода
  async verify(data: VerifyData) {
    return api.post('/auth/verify/', data);
  },

  async getMe() {
    return api.get<ApiResponse<UserProfile>>('/users/me/'); // Проверь URL в Swagger!
  },
};
