export interface LoginData {
  phoneNumber: string;
  password?: string;
}

export interface RegisterData {
  phoneNumber: string;
  fullName: string;
  inn?: string;
  password?: string;
  passwordConfirm?: string;
  birth_year?: number;
}

export interface VerifyData {
  phoneNumber: string;
  code: string;
  purpose: 'register' | 'login' | 'reset';
}

export interface AuthResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface UserProfile {
  id: number;
  fullName: string;
  phoneNumber: string;
  balance?: number; // Если есть
  avatar?: string;
}
