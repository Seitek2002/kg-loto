import { api } from '@/lib/api';

export const AuthService = {
  // Логин
  loginPhone: (data: { phone_number: string }) =>
    api.post('/auth/login/phone/', data),
  loginVerify: (data: { phone_number: string; code: string }) =>
    api.post('/auth/login/verify/', data),

  // Регистрация
  registerPhone: (data: { phone_number: string }) =>
    api.post('/auth/register/phone/', data),
  registerVerify: (data: {
    phone_number: string;
    code: string;
    purpose: string;
  }) => api.post('/auth/verify/', data),
  registerComplete: (data: {
    phone_number: string;
    full_name: string;
    inn: string;
  }) => api.post('/auth/register/complete/', data),

  // 🔥 ВОТ ЭТО МЫ СЛУЧАЙНО УДАЛИЛИ. ВОЗВРАЩАЕМ:
  // Убедись, что URL '/auth/me/' совпадает с тем, что дает бэкендер (иногда это '/users/me/')
  getMe: () => api.get('/users/me/'),
};
