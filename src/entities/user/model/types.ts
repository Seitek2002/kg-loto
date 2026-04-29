// entities/user/model/types.ts

export interface Phone {
  dialCode: string;
  number: string;
}

export interface User {
  id: string | number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: Phone | string; // На бэке объект или строка? Оставил оба варианта на всякий
  avatar?: string | null;
  balance?: number;
  kglotteryProfile?: any;
}
