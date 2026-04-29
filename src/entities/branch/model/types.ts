// Это то, что реально приходит с бэкенда
export interface BranchResponseItem {
  id: number;
  name: string;
  address: string;
  lat: string;
  lng: string;
}

// Это то, с чем удобно работать нашему фронтенду и карте
export interface Branch {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}
