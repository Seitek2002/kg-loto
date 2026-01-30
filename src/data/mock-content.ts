// src/data/mock-content.ts

export interface Winner {
  id: number;
  name: string;
  city: string;
  prize: string;
  image: string;
  lotteryBadge: string; // Новое поле для бейджа (например "ОНОЙ", "LUCKY DROP")
}

export interface Article {
  id: number;
  title: string;
  description?: string;
  buttonText: string;
  imageSrc?: string;
  theme: 'dark' | 'light';
  buttonAlign: 'left' | 'center';
  descriptionPosition?: 'top' | 'bottom';
}

// --- РАЗНООБРАЗНЫЕ ПОБЕДИТЕЛИ ---
export const WINNERS_MOCK: Winner[] = [
  {
    id: 1,
    name: 'Александр',
    city: 'Бишкек',
    prize: '1 000 000 KGS',
    image:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=600&auto=format&fit=crop',
    lotteryBadge: 'ОНОЙ', // Как на скрине
  },
  {
    id: 2,
    name: 'Айпери',
    city: 'Ош',
    prize: 'IPHONE 16 PRO', // Техника
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop',
    lotteryBadge: 'TECHNO',
  },
  {
    id: 3,
    name: 'Максим',
    city: 'Каракол',
    prize: 'ZEEKR 001', // Машина
    image:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop',
    lotteryBadge: 'АВТО-ДРАЙВ',
  },
  {
    id: 4,
    name: 'Елена',
    city: 'Бишкек',
    prize: '500 000 KGS',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&auto=format&fit=crop',
    lotteryBadge: 'LUCKY DROP',
  },
];

export const MATERIALS_MOCK: Article[] = [
  {
    id: 1,
    title: '80+ ЧЕЛОВЕК С БОЛЬШИМ ОПЫТОМ В FOODTECH И HORECA',
    buttonText: 'ПОДРОБНЕЕ',
    imageSrc:
      'https://images.unsplash.com/photo-1491147334573-44cbb4602074?q=80&w=800&auto=format&fit=crop',
    theme: 'dark',
    buttonAlign: 'center',
  },
  {
    id: 2,
    title: 'ПОКАЗЫВАЕМ ГДЕ ПРИОБРЕСТИ БИЛЕТ',
    description:
      'Создавал проекты для лидеров фудтех-рынка: Yami Yami, Даниловский рынок, Marketplace и др.',
    buttonText: 'ЧИТАТЬ ПОЛНОСТЬЮ',
    theme: 'dark',
    buttonAlign: 'left',
    descriptionPosition: 'bottom',
  },
  {
    id: 3,
    title: 'НОВОГОДНИЕ ПОДАРКИ',
    description:
      'Популярные лотереи привлекают внимание благодаря крупным джекпотам и частым тиражам.',
    buttonText: 'ЧИТАТЬ ПОЛНОСТЬЮ',
    imageSrc:
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
    theme: 'light',
    buttonAlign: 'center',
    descriptionPosition: 'top',
  },
  {
    id: 4,
    title: 'СЕКРЕТЫ УСПЕХА',
    description:
      'Тысячи игроков ежедневно выбирают именно эти розыгрыши, чтобы испытать удачу.',
    buttonText: 'ЧИТАТЬ ПОЛНОСТЬЮ',
    imageSrc:
      'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=800&auto=format&fit=crop',
    theme: 'dark',
    buttonAlign: 'left',
    descriptionPosition: 'bottom',
  },
];
