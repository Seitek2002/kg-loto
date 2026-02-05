// src/data/mock-content.ts

export interface Winner {
  id: number;
  name: string;
  city: string;
  prize: string;
  image: string;
  lotteryBadge: 'оной' | 'мен миллионер' | 'уйго белек'; // Ключи для фильтрации
}

export interface Article {
  id: number;
  title: string;
  description?: string;
  buttonText: string;
  imageSrc?: string;
  theme: 'dark' | 'light' | 'blue'; // Добавил 'blue' для разнообразия как на скрине
  buttonAlign: 'left' | 'center';
  descriptionPosition?: 'top' | 'bottom';
}

// --- РАЗНООБРАЗНЫЕ ПОБЕДИТЕЛИ ---
export const WINNERS_MOCK: Winner[] = [
  {
    id: 1,
    name: 'АЛЕКСАНДР',
    city: 'Бишкек',
    prize: '1 000 000 KGS',
    image:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop',
    lotteryBadge: 'оной',
  },
  {
    id: 2,
    name: 'МАРСЕЛЬ',
    city: 'Бишкек',
    prize: '60 000 KGS',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
    lotteryBadge: 'мен миллионер',
  },
  {
    id: 3,
    name: 'АЙГЕРИМ',
    city: 'Бишкек',
    prize: '150 000 KGS',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
    lotteryBadge: 'уйго белек',
  },
  {
    id: 4,
    name: 'ДЖАСМИН',
    city: 'Бишкек',
    prize: '1 000 000 KGS',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop',
    lotteryBadge: 'оной',
  },
  {
    id: 5,
    name: 'ЭРМЕК',
    city: 'Ош',
    prize: '200 000 KGS',
    image:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    lotteryBadge: 'мен миллионер',
  },
  {
    id: 6,
    name: 'СВЕТЛАНА',
    city: 'Кант',
    prize: 'iPhone 15',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    lotteryBadge: 'уйго белек',
  },
  {
    id: 7,
    name: 'БАКЫТ',
    city: 'Нарын',
    prize: '500 000 KGS',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    lotteryBadge: 'оной',
  },
  {
    id: 8,
    name: 'ГУЛЬЗАТ',
    city: 'Бишкек',
    prize: '100 000 KGS',
    image:
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop',
    lotteryBadge: 'мен миллионер',
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
    theme: 'light', // Белый фон
    buttonAlign: 'left',
    descriptionPosition: 'bottom',
  },
  {
    id: 3,
    title: 'ПОКАЗЫВАЕМ ГДЕ ПРИОБРЕСТИ БИЛЕТ',
    description:
      'Популярные лотереи привлекают внимание благодаря крупным джекпотам, частым тиражам и удобным условиям участия.',
    buttonText: 'ЧИТАТЬ ПОЛНОСТЬЮ',
    imageSrc:
      'https://images.unsplash.com/photo-1512358958014-b651a7ee1773?q=80&w=800&auto=format&fit=crop', // Подарки/коробки
    theme: 'blue', // Голубой фон (как на скрине справа)
    buttonAlign: 'center',
    descriptionPosition: 'top',
  },
  {
    id: 4,
    title: '80+ ЧЕЛОВЕК С БОЛЬШИМ ОПЫТОМ',
    buttonText: 'ПОДРОБНЕЕ',
    imageSrc:
      'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=800&auto=format&fit=crop',
    theme: 'dark',
    buttonAlign: 'center',
  },
  {
    id: 5,
    title: 'КАК ПОЛУЧИТЬ ВЫИГРЫШ?',
    description:
      'Создавал проекты для лидеров фудтех-рынка: Yami Yami, Даниловский рынок, Marketplace и др.',
    buttonText: 'ЧИТАТЬ ПОЛНОСТЬЮ',
    theme: 'light',
    buttonAlign: 'left',
    descriptionPosition: 'bottom',
  },
  {
    id: 6,
    title: 'ПОКАЗЫВАЕМ ГДЕ ПРИОБРЕСТИ БИЛЕТ',
    description:
      'Тысячи игроков ежедневно выбирают именно эти розыгрыши, чтобы испытать удачу.',
    buttonText: 'ЧИТАТЬ ПОЛНОСТЬЮ',
    imageSrc:
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
    theme: 'blue',
    buttonAlign: 'center',
    descriptionPosition: 'top',
  },
];
