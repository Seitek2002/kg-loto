import { create } from 'zustand';
import { LotteryData, LOTTERIES_DB } from '@/data/mock-lotteries';
import {
  Winner,
  Article,
  WINNERS_MOCK,
  MATERIALS_MOCK,
} from '@/data/mock-content';

interface ContentState {
  lotteries: LotteryData[];
  winners: Winner[];
  materials: Article[];

  isLoading: boolean;
  getLotteryById: (id: string | number) => LotteryData | undefined;
}

export const useContentStore = create<ContentState>((set, get) => ({
  lotteries: LOTTERIES_DB,
  winners: WINNERS_MOCK,
  materials: MATERIALS_MOCK,

  isLoading: false,

  getLotteryById: (id) => {
    const { lotteries } = get();
    return lotteries.find((l) => l.id === Number(id));
  },
}));
