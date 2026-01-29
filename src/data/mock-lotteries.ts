// src/data/mock-lotteries.ts

export interface PrizeTier {
  category: string;
  amount: string;
  winners: number;
  description?: string;
  gradientFrom: string;
  gradientTo: string;
}

export interface LotteryData {
  id: number;
  title: string;
  description: string;
  prize: string;
  price: number;
  time: string;
  gradientFrom: string;
  gradientTo: string;
  theme?: 'dark' | 'white';
  imageSrc?: string; // Добавил поддержку картинок на фоне

  // Детальные данные
  heroTitle: string;
  prizeTiers: PrizeTier[];
}

export const LOTTERIES_DB: LotteryData[] = [
  {
    id: 1,
    title: 'Космический Старт',
    description: 'Классическая денежная лотерея. Крупные выигрыши каждый день.',
    prize: '1 000 000 KGS',
    price: 100,
    time: '20:00',
    gradientFrom: 'from-blue-600',
    gradientTo: 'to-indigo-900',
    theme: 'white',

    heroTitle: 'ВЫИГРЫВАЕТ КАЖДЫЙ ВТОРОЙ БИЛЕТ',
    prizeTiers: [
      {
        category: 'Суперприз',
        amount: '1 000 000 KGS',
        winners: 1,
        gradientFrom: 'from-blue-500',
        gradientTo: 'to-indigo-600',
      },
      {
        category: '2 место',
        amount: '100 000 KGS',
        winners: 5,
        gradientFrom: 'from-blue-400',
        gradientTo: 'to-blue-500',
      },
      {
        category: '3 место',
        amount: '10 000 KGS',
        winners: 50,
        gradientFrom: 'from-indigo-300',
        gradientTo: 'to-purple-300',
      },
    ],
  },
  {
    id: 2,
    title: 'Техно-Бум',
    description:
      'Выиграй топовую технику Apple! iPhone 16 Pro, MacBook и iPad.',
    prize: 'IPHONE 16 PRO',
    price: 150,
    time: '12:30',
    gradientFrom: 'from-gray-900',
    gradientTo: 'to-gray-700', // Темный стиль для техники
    theme: 'white',

    heroTitle: 'ОБНОВИСЬ ДО ПОСЛЕДНЕЙ МОДЕЛИ',
    prizeTiers: [
      {
        category: 'Главный приз',
        amount: 'iPhone 16 Pro Max',
        description: 'Titanium Black, 512GB',
        winners: 1,
        gradientFrom: 'from-gray-800',
        gradientTo: 'to-gray-600',
      },
      {
        category: 'Для работы',
        amount: 'MacBook Air M3',
        description: '13-inch, Midnight',
        winners: 2,
        gradientFrom: 'from-gray-700',
        gradientTo: 'to-slate-600',
      },
      {
        category: 'Звук',
        amount: 'AirPods Max 2',
        winners: 5,
        gradientFrom: 'from-slate-500',
        gradientTo: 'to-slate-400',
      },
    ],
  },
  {
    id: 3,
    title: 'Лаймовый Фреш',
    description: 'Легкая лотерея с множеством мелких и средних призов.',
    prize: '50 000 KGS',
    price: 50,
    time: '15:00',
    gradientFrom: 'from-lime-400',
    gradientTo: 'to-green-500',
    theme: 'dark',

    heroTitle: 'СВЕЖИЙ ВЗГЛЯД НА УДАЧУ',
    prizeTiers: [
      {
        category: 'Главный приз',
        amount: '50 000 KGS',
        winners: 3,
        gradientFrom: 'from-lime-300',
        gradientTo: 'to-green-400',
      },
      {
        category: 'Утешительный',
        amount: '5 000 KGS',
        winners: 100,
        gradientFrom: 'from-lime-200',
        gradientTo: 'to-green-300',
      },
    ],
  },
  {
    id: 4,
    title: 'Квартирный Вопрос',
    description: 'Твой шанс выиграть недвижимость в центре Бишкека!',
    prize: '1-К КВАРТИРА',
    price: 500,
    time: '21:00',
    gradientFrom: 'from-orange-400',
    gradientTo: 'to-red-500',
    theme: 'white',

    heroTitle: 'КЛЮЧИ ОТ НОВОЙ ЖИЗНИ',
    prizeTiers: [
      {
        category: 'Мечта',
        amount: 'Квартира в Бишкеке',
        description: 'ЖК "Elite House", 45 м²',
        winners: 1,
        gradientFrom: 'from-red-500',
        gradientTo: 'to-orange-500',
      },
      {
        category: 'Ремонт',
        amount: 'Сертификат 500к',
        description: 'В строймаркет "2 Прораба"',
        winners: 3,
        gradientFrom: 'from-orange-400',
        gradientTo: 'to-yellow-400',
      },
    ],
  },
  {
    id: 5,
    title: 'Авто-Драйв',
    description: 'Заряженная лотерея для автолюбителей.',
    prize: 'ZEEKR 001',
    price: 300,
    time: '18:00',
    gradientFrom: 'from-purple-600',
    gradientTo: 'to-pink-600',
    theme: 'white',

    heroTitle: 'ПОЧУВСТВУЙ СКОРОСТЬ',
    prizeTiers: [
      {
        category: 'Суперкар',
        amount: 'Zeekr 001',
        description: 'You Version, Z-Sport',
        winners: 1,
        gradientFrom: 'from-purple-500',
        gradientTo: 'to-pink-500',
      },
      {
        category: 'Топпливо',
        amount: '1000 литров',
        description: 'Талоны АЗС Газпром',
        winners: 10,
        gradientFrom: 'from-purple-400',
        gradientTo: 'to-purple-300',
      },
    ],
  },
];

// Хелпер для поиска
export const getLotteryById = (id: string | number) => {
  return LOTTERIES_DB.find((l) => l.id === Number(id));
};
