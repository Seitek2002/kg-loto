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