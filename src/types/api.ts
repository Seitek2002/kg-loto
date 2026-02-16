// src/types/api.ts

export interface ApiResponse<T> {
  data: T;
  meta: Record<string, any>;
  errors: any[];
}

// 🔥 НОВЫЙ ТИП ДЛЯ ПАГИНАЦИИ
export interface PaginatedResult<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// --- ОСТАЛЬНЫЕ ТИПЫ ---

export interface NewsItem {
  id: number;
  title: string;
  slug: string;
  shortText: string;
  content?: string; // На случай если на детальной странице приходит content
  image: string | null;
  publishedAt: string;
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
}

export interface Lottery {
  id: number;
  title: string;
  description: string;
  prize: string;
  price: string;
  drawTime: string;
  theme: 'white' | 'dark';
  backgroundId: string;
  prizeFontId: string;
  time?: string;
}

export interface LotteryItem {
  id: number;
  title: string;
  description: string; // В Swagger этого поля нет в списке, но оно нужно для карточки. Возможно оно называется `subtitle` или его нет.
  // Если в API списка нет описания, придется или убрать его, или использовать заглушку.
  // Судя по твоему скриншоту Swagger, там есть: title, subtitle, prizeText, drawTime и т.д.
  // Давай ориентироваться на скриншот:
  subtitle?: string;
  prizeText: string;
  buttonPrice: number;
  drawTime: string;
  theme: 'white' | 'dark';
  backgroundImage: string;
  fontFile: string | null;
  lottieSrc: string;
}

export interface Winner {
  id: number;
  name: string;
  city: string;
  prize: string;
  image: string | null; // В схеме nullable: true
  lotteryBadge: string; // "ОНОЙ", "LUCKY DROP" и т.д.
}

export interface SliderItem {
  id: number;
  title: string; // "СТАНЬ МИЛЛИОНЕРОМ"
  subtitle: string; // "Призовой фонд 10 000 000 сом"
  prizeText: string; // "1 000 000 СОМ"
  image: string; // URL картинки
  buttonText: string; // "Играть"
  buttonPrice: number; // 100
  buttonLabel: string; // "ИГРАТЬ • 100 СОМ"
  buttonUrl: string; // Ссылка (может быть пустой)
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
  lat: string; // API отдает координаты строками! "42.8755"
  lng: string;
}

export interface PrizeTier {
  id: number;
  category: string; // например "ДЖЕКПОТ"
  amount: string; // например "1 000 000 с"
  winners: number; // количество победителей
  description: string; // описание
  gradientFrom: string; // цвет градиента
  gradientTo: string; // цвет градиента
}

export interface LotteryDetail {
  id: number;
  title: string;
  subtitle: string;
  prizeText: string;
  buttonText: string;
  buttonPrice: number;
  buttonLabel: string;
  drawTime: string;
  theme: 'white' | 'dark';
  backgroundImage: string; // Полный URL картинки
  font: string; // "benzin"
  heroTitle: string; // Заголовок для баннера
  prizeTiers: PrizeTier[]; // 🔥 Массив призов
}
