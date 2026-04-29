export interface LotteryItem {
  id: number;
  billingLotteryId?: string | null;
  title: string;
  titleText?: string;
  subtitle?: string;
  logo?: string;
  drawLogo?: string;
  drawBackground?: string;
  imageLive?: string;
  mainPrize1?: string;
  mainPrize2?: string;
  mainPrize3?: string;
  prizeText?: string;
  lotteryType?: "instant" | "draw";
  buttonText?: string;
  buttonPrice?: number | null;
  buttonLabel?: string;
  buttonUrl?: string;
  drawTime?: string;
  theme?: "white" | "dark";
  backgroundImage?: string;
  font?: string;
}

export interface LotteryRule {
  id: number;
  image: string;
  text: string;
  order: number;
}

export interface LotteryTerm {
  id: number;
  text: string;
  order: number;
}

export interface LotteryPrizeTier {
  id: number;
  amount: string; // Измени на number, если бэкенд отдает число
  winners: string; // Измени на number, если бэкенд отдает число
}

// 🔥 Расширенный интерфейс для детальной страницы
export interface LotteryDetail extends LotteryItem {
  heroTitle: string | null;
  terms: LotteryTerm[];
  prizeTiers: LotteryPrizeTier[];
  rules: LotteryRule[];
  otherLotteries: LotteryItem[];
}
