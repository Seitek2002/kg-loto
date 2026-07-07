export interface WinnerType {
  id: number;
  name: string;
  date: string;
  amount: string;
  currency: string;
  logo: string;
  isYellow: boolean;
  isTextPrize?: boolean;
}

export interface RecentWinnerApi {
  id: number;
  name: string;
  prize: string;
  lotteryLogo: string;
  date: string;
}

export interface Winner {
  id: number;
  name: string;
  city: string;
  prize: string;
  image: string; // Сваггер говорит, что это поле есть и оно обязательно
  lotteryLogo: string;
  buttonText: string;
  buttonPrice: string;
  buttonLabel: string;
  buttonUrl: string;
  lotteryBadge: string;
  lotteryId: string;
}

export interface PaginatedWinnerList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Winner[];
}

// GET /api/v1/winners/lotteries/ — лотереи, по которым есть отмеченные
// победители; используется для построения фильтра на экране /winners
export interface WinnerLotteryOption {
  id: number;
  title: string;
  billingLotteryId: string | null;
}
