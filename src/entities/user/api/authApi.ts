import api from "@/shared/api/apiClient";

// Оставляем этот интерфейс для типизации внутри приложения
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  birthDate?: string;
  email?: string;
  avatar?: File; // 🔥 Теперь это File, а не string
  passportFront?: File;
  passportBack?: File;
}

export const authApi = {
  loginPhone: (data: { phoneNumber: string }) =>
    api.post("/auth/login/phone/", data),
  loginVerify: (data: { phoneNumber: string; code: string }) =>
    api.post("/auth/login/verify/", data),
  registerPhone: (data: { phoneNumber: string }) =>
    api.post("/auth/register/phone/", data),
  registerVerify: (data: {
    phoneNumber: string;
    code: string;
    purpose: string;
  }) => api.post("/auth/verify/", data),
  registerComplete: (data: {
    phoneNumber: string;
    fullName: string;
    inn: string;
    passportFront?: string;
    passportBack?: string;
  }) => api.post("/auth/register/complete/", data),
  getMe: () => api.get("/profile/me/"),

  // 🔥 Умный метод обновления профиля
  updateProfile: (data: UpdateProfileRequest) => {
    const hasFiles = data.avatar || data.passportFront || data.passportBack;

    if (hasFiles) {
      // Если есть файлы, собираем FormData.
      // Ключи пишем сразу в snake_case, так как интерцептор не конвертирует FormData
      const formData = new FormData();
      if (data.firstName) formData.append("first_name", data.firstName);
      if (data.lastName) formData.append("last_name", data.lastName);
      if (data.middleName) formData.append("middle_name", data.middleName);
      if (data.birthDate) formData.append("birth_date", data.birthDate);
      if (data.email) formData.append("email", data.email);

      if (data.avatar) formData.append("avatar", data.avatar);
      if (data.passportFront)
        formData.append("passport_front", data.passportFront);
      if (data.passportBack)
        formData.append("passport_back", data.passportBack);

      return api.patch("/profile/me/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    // Если файлов нет, отправляем обычный JSON (интерцептор сам переведет ключи в snake_case)
    return api.patch("/profile/me/", data);
  },
};
