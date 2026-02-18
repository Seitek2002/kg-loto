import { z } from 'zod';

// Валидация для Входа
export const loginSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, 'Введите номер телефона')
    // Простейшая проверка, можно усилить регуляркой
    .regex(/^\+996\d{9}$/, 'Формат: +996XXXXXXXXX')
    .or(z.string().regex(/^\d{9}$/, 'Введите 9 цифр номера (без +996)')), // Разрешаем ввод без +996
  password: z.string().min(1, 'Введите пароль'),
});

// Валидация для Регистрации
export const registerSchema = z
  .object({
    phoneNumber: z.string().min(1, 'Введите номер телефона'),
    // Здесь добавим логику приведения к формату в компоненте
    fullName: z.string().min(2, 'Слишком короткое имя'),
    inn: z
      .string()
      .length(14, 'ИНН должен содержать ровно 14 цифр')
      .optional()
      .or(z.literal('')),
    birthYear: z
      .string()
      .min(4, 'Введите 4 цифры (например, 1990)')
      .regex(/^\d{4}$/, 'Только цифры'),
    password: z.string().min(6, 'Минимум 6 символов'),
    passwordConfirm: z.string().min(6, 'Минимум 6 символов'),
    terms: z.boolean().refine((val) => val === true, {
      message: 'Вы должны принять условия',
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Пароли не совпадают',
    path: ['passwordConfirm'],
  });

// Валидация для Кода (OTP)
export const otpSchema = z.object({
  code: z.string().length(4, 'Код должен содержать 4 цифры'),
});

// Экспортируем типы для использования в компонентах
export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type OtpSchema = z.infer<typeof otpSchema>;
