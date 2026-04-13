import api from './api/apiClient';

// 🔥 Создаем строгий тип для обновления профиля.
// Все поля делаем опциональными (с вопросительным знаком), так как это PATCH запрос.
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  birthDate?: string;
  email?: string;
  avatar?: string; // URL загруженной картинки (на будущее)
  passportFront?: string; // URL (на будущее)
  passportBack?: string; // URL (на будущее)
}

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
    passportFront?: string;
    passportBack?: string;
  }) => api.post('/auth/register/complete/', data),

  // Получение данных текущего пользователя
  getMe: () => api.get('/profile/me/'),

  // 🔥 Заменяем any на наш новый интерфейс
  updateProfile: (data: UpdateProfileRequest) =>
    api.patch('/profile/me/', data),
};
