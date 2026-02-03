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
  theme: 'white' | 'dark';

  // Поля для дизайна
  backgroundId: string;
  prizeFontId: string;

  // Поля для детальной страницы (делаем их опциональными ?, чтобы не ругалось, если где-то забыл)
  heroTitle?: string;
  prizeTiers?: PrizeTier[];
}

export const LOTTERIES_DB: LotteryData[] = [
  // --- 1. КЛАССИКА ---
  {
    id: 1,
    title: 'Космический Старт',
    description: 'Классическая лотерея. Главный приз ждет тебя!',
    prize: '1 000 000 ⃀',
    price: 100,
    time: '20:00',
    theme: 'white',

    // 🔥 МЕНЯЕМ НА ЦИФРУ ИЗ ТВОЕГО СПИСКА
    backgroundId: '18',
    prizeFontId: 'benzin',

    heroTitle: 'ВЫИГРЫВАЕТ КАЖДЫЙ ВТОРОЙ БИЛЕТ',
    prizeTiers: [
      {
        category: 'Джекпот',
        amount: '1 000 000 ⃀',
        winners: 1,
        gradientFrom: 'from-blue-500',
        gradientTo: 'to-indigo-600',
      },
      {
        category: '2 место',
        amount: '100 000 ⃀',
        winners: 5,
        gradientFrom: 'from-blue-400',
        gradientTo: 'to-blue-500',
      },
    ],
  },

  // --- 2. ДЕНЬГИ ---
  {
    id: 2,
    title: 'Золотая Лихорадка',
    description: 'Максимальный денежный выигрыш этой недели.',
    prize: '500 000 ⃀',
    price: 200,
    time: '12:30',
    theme: 'dark',

    backgroundId: '2', // Ставим другую картинку
    prizeFontId: 'rubik',

    heroTitle: 'ЗОЛОТОЙ ДОЖДЬ ПРИЗОВ',
    prizeTiers: [
      {
        category: 'Золото',
        amount: '500 000 ⃀',
        winners: 1,
        gradientFrom: 'from-yellow-400',
        gradientTo: 'to-orange-500',
      },
      {
        category: 'Серебро',
        amount: '50 000 ⃀',
        winners: 10,
        gradientFrom: 'from-yellow-200',
        gradientTo: 'to-yellow-400',
      },
    ],
  },

  // --- 3. ГАДЖЕТЫ ---
  {
    id: 3,
    title: 'Лаймовый Фреш',
    description: 'Выиграй новый смартфон за 50 сом.',
    prize: 'IPHONE 17 PRO',
    price: 50,
    time: '15:00',
    theme: 'dark',

    backgroundId: '3',
    prizeFontId: 'benzin',

    heroTitle: 'СВЕЖИЙ ВЗГЛЯД НА ТЕХНИКУ',
    prizeTiers: [
      {
        category: 'Смартфон',
        amount: 'iPhone 17 Pro',
        winners: 1,
        gradientFrom: 'from-lime-400',
        gradientTo: 'to-green-500',
      },
      {
        category: 'Утешительный',
        amount: '5 000 ⃀',
        winners: 50,
        gradientFrom: 'from-lime-200',
        gradientTo: 'to-green-300',
      },
    ],
  },

  // --- 4. АВТОМОБИЛЬ ---
  {
    id: 4,
    title: 'Авто-Драйв',
    description: 'Твой шанс пересесть на электрокар!',
    prize: 'ZEEKR 001',
    price: 500,
    time: '18:00',
    theme: 'white',

    backgroundId: '4',
    prizeFontId: 'benzin',

    heroTitle: 'СКОРОСТЬ И КОМФОРТ',
    prizeTiers: [
      {
        category: 'Автомобиль',
        amount: 'ZEEKR 001',
        winners: 1,
        gradientFrom: 'from-purple-500',
        gradientTo: 'to-pink-600',
      },
      {
        category: 'Топливо',
        amount: '1000 Литров',
        winners: 10,
        gradientFrom: 'from-purple-300',
        gradientTo: 'to-purple-400',
      },
    ],
  },

  // --- 5. НЕДВИЖИМОСТЬ ---
  {
    id: 5,
    title: 'Квартирный Вопрос',
    description: 'Собственная квартира в центре столицы.',
    prize: '1-К КВАРТИРА',
    price: 1000,
    time: '21:00',
    theme: 'white',

    backgroundId: '5',
    prizeFontId: 'rubik',

    heroTitle: 'КЛЮЧИ ОТ НОВОЙ ЖИЗНИ',
    prizeTiers: [
      {
        category: 'Квартира',
        amount: 'ЖК "Elite House"',
        winners: 1,
        gradientFrom: 'from-red-500',
        gradientTo: 'to-orange-500',
      },
      {
        category: 'Ремонт',
        amount: 'Сертификат 200к',
        winners: 5,
        gradientFrom: 'from-orange-400',
        gradientTo: 'to-yellow-400',
      },
    ],
  },

  // --- 6. ПРЕМИУМ ТЕХНИКА ---
  {
    id: 6,
    title: 'Black Star',
    description: 'Премиальная техника Apple.',
    prize: 'MACBOOK PRO M3',
    price: 300,
    time: '23:00',
    theme: 'white',

    backgroundId: '6',
    prizeFontId: 'inter',

    heroTitle: 'МОЩЬ В ЧЕРНОМ ЦВЕТЕ',
    prizeTiers: [
      {
        category: 'Ноутбук',
        amount: 'MacBook Pro 16"',
        winners: 1,
        gradientFrom: 'from-gray-800',
        gradientTo: 'to-black',
      },
      {
        category: 'Планшет',
        amount: 'iPad Pro',
        winners: 3,
        gradientFrom: 'from-gray-700',
        gradientTo: 'to-gray-900',
      },
    ],
  },

  // --- 7. ПУТЕШЕСТВИЕ ---
  {
    id: 7,
    title: 'Морской Бриз',
    description: 'Отдых на двоих на лучших пляжах мира.',
    prize: 'ТУР НА МАЛЬДИВЫ',
    price: 150,
    time: '10:00',
    theme: 'dark',

    backgroundId: '7',
    prizeFontId: 'benzin',

    heroTitle: 'ОТПУСК ТВОЕЙ МЕЧТЫ',
    prizeTiers: [
      {
        category: 'Путевка',
        amount: 'Мальдивы (All Inc)',
        winners: 1,
        gradientFrom: 'from-cyan-400',
        gradientTo: 'to-blue-400',
      },
      {
        category: 'Чемодан',
        amount: 'Samsonite',
        winners: 10,
        gradientFrom: 'from-cyan-200',
        gradientTo: 'to-cyan-300',
      },
    ],
  },

  // --- 8. БЫСТРАЯ ---
  {
    id: 8,
    title: 'Розовая Пантера',
    description: 'Мгновенные розыгрыши каждый час.',
    prize: '50 000 ⃀',
    price: 40,
    time: '14:45',
    theme: 'white',

    backgroundId: '8',
    prizeFontId: 'rubik',

    heroTitle: 'УДАЧА ЛЮБИТ СМЕЛЫХ',
    prizeTiers: [
      {
        category: 'Главный приз',
        amount: '50 000 ⃀',
        winners: 1,
        gradientFrom: 'from-pink-500',
        gradientTo: 'to-rose-500',
      },
    ],
  },
];

export const getLotteryById = (id: string | number) => {
  return LOTTERIES_DB.find((l) => l.id === Number(id));
};
