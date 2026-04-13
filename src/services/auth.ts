import api from "./api/apiClient";

export const AuthService = {
  // Логин
  loginPhone: (data: { phoneNumber: string }) =>
    api.post('/auth/login/phone/', data),

  loginVerify: (data: { phoneNumber: string; code: string }) =>
    api.post('/auth/login/verify/', data),

  // Регистрация
  registerPhone: (data: { phoneNumber: string }) =>
    api.post('/auth/register/phone/', data),

  registerVerify: (data: {
    phoneNumber: string;
    code: string;
    purpose: string; // 'register' | 'reset' | 'login'
  }) => api.post('/auth/verify/', data),

  // Завершение регистрации (Флоу с паспортами)
  registerComplete: (data: {
    phoneNumber: string;
    fullName: string;
    inn: string;
    passportFront?: string; // Абсолютный URL до фото
    passportBack?: string; // Абсолютный URL до фото
  }) => api.post('/auth/register/complete/', data),

  // Получение данных текущего пользователя
  getMe: () => api.get('/profile/me/'),
};
