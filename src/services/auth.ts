// src/services/auth.ts
import { api } from '@/lib/api';
import {
  LoginData,
  AuthResponse,
  RegisterData,
  VerifyData,
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

  // 4. Получение профиля (если есть такой эндпоинт, добавь сюда)
  // async getProfile() { ... }
};
