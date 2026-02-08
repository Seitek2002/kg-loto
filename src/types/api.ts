// src/types/api.ts

export interface ApiResponse<T> {
  data: T;
  meta: Record<string, any>;
  errors: any[];
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

export interface NewsItem {
  id: number;
  title: string;
  slug: string;
  shortText: string;
  image: string | null;
  publishedAt: string;
  theme: 'dark' | 'light';
  descriptionPosition: 'none' | 'top' | 'bottom';
}
