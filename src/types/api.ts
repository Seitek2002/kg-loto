// src/types/api.ts

// ==========================================
// 1. БАЗОВЫЕ ТИПЫ (ОТВЕТЫ API)
// ==========================================

export interface ApiResponse<T> {
  data: T;
  meta: Record<string, unknown>;
  errors?: unknown[]; // Сделал опциональным, так как при 200 OK его может не быть
}

export interface PaginatedResult<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ==========================================
// 2. ПОЛЬЗОВАТЕЛЬ, АВТОРИЗАЦИЯ И ПРОФИЛЬ
// ==========================================

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface KGLotteryProfile {
  email?: string;
  username?: string;
  deviceId?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  avatar?: string;
  passportNumber?: string;
  sex?: boolean;
  citizenship?: string;
  dateOfBirth?: string; // Формат YYYY-MM-DD
  issuedBy?: string;
  issueDate?: string; // Формат YYYY-MM-DD
  validUntil?: string; // Формат YYYY-MM-DD
  address?: string;
  passportFrontScan?: string;
  passportBackScan?: string;
  confirmedAge18?: boolean;
}

export interface User {
  id: number;
  phoneNumber: string;
  fullName: string;
  inn: string;
  isActive: boolean;
  isPhoneVerified: boolean;
  // Бэкенд может отдавать профиль строкой (JSON), либо объектом.
  // Мы будем парсить его в объект, поэтому ставим тип интерфейса.
  kglotteryProfile: KGLotteryProfile | null;
}

// ==========================================
// 3. OTP КОДЫ (СМС)
// ==========================================

export interface OtpSendResponse {
  transactionId: string;
  message: string;
  status: string;
}

export interface OtpVerifyResponse {
  verified: boolean;
  message: string;
  status: string;
  // Если purpose === 'register', бэкенд возвращает токены
  accessToken?: string;
  refreshToken?: string;
}

// ==========================================
// 4. ЛОТЕРЕИ И БИЛЕТЫ
// ==========================================

export interface LotteryItem {
  id: number;
  title: string;
  subtitle?: string;
  prizeText: string;
  buttonPrice: number | null;
  drawTime: string;
  theme: 'white' | 'dark';
  backgroundImage: string;
  fontFile?: string | null;
  lottieSrc?: string;
}

export interface PrizeTier {
  id: number;
  category: string;
  amount: string;
  winners: number;
  description: string | null;
  backgroundImage?: string;
}

export interface LotteryDetail {
  id: number;
  title: string;
  subtitle: string;
  prizeText: string;
  buttonText: string;
  buttonPrice: number | null;
  buttonLabel: string;
  drawTime: string;
  theme: 'white' | 'dark';
  backgroundImage: string;
  font: string;
  heroTitle: string | null;
  prizeTiers: PrizeTier[];
}

export interface CombinationCheckResult {
  isWinning: boolean;
  combinationId: number;
  message: string;
  prizeType?: string;
  prizeAmount?: string;
  prizeProduct?: string | null;
}

// ==========================================
// 5. ВЫВОД СРЕДСТВ
// ==========================================

export type WithdrawalMethod = 'mbank' | 'visa' | 'elcart';
export type WithdrawalStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'rejected';

export interface Withdrawal {
  id: string; // UUID
  ticketId: number;
  ticketShortId: string;
  method: WithdrawalMethod;
  accountNumber: string;
  amount: string; // Строка формата decimal ("1000.00")
  status: WithdrawalStatus;
  rejectionReason: string | null;
  createdAt: string;
}

export interface WithdrawalCreateRequest {
  ticketId: string; // UUID внешнего билета
  method: WithdrawalMethod;
  accountNumber: string;
  amount: string;
}

// ==========================================
// 6. КОНТЕНТ (СЛАЙДЕРЫ, НОВОСТИ, FAQ)
// ==========================================

export interface SliderItem {
  id: number;
  title: string;
  subtitle: string;
  prizeText: string;
  image: string;
  imageMobile: string | null;
  imageLayer: string | null;
  imageMobileLayer: string | null;
  hasAnimation: boolean;
  buttonText: string;
  buttonPrice: number | null;
  buttonLabel: string;
  buttonUrl: string;
}

export interface NewsItem {
  id: number;
  title: string;
  slug: string;
  shortText: string;
  content?: string;
  image: string | null;
  publishedAt: string | null;
  theme: 'dark' | 'light';
  descriptionPosition: 'none' | 'top' | 'bottom';
}

export interface Winner {
  id: number;
  name: string;
  city: string;
  prize: string;
  image: string | null;
  lotteryBadge: string;
  lotteryPhoto?: string;
}

export interface RecentWinner {
  id: number;
  lotteryPhoto: string;
  lotteryLogo: string;
  winnerName: string;
  winAmount: string;
  winDate: string;
  category: string;
}

export interface QAItem {
  id: number;
  question: string;
  answer: string;
}

export interface BranchItem {
  id: number;
  name: string;
  address: string;
  lat: string;
  lng: string;
}
