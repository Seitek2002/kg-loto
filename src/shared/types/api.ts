export interface MenuItem {
  id: number;
  title: string;
  link: string;
  file: string | null;
  order: number;
  isActive: boolean;
}

export interface MenuData {
  "footer.info": MenuItem[];
  "footer.lotteries": MenuItem[];
  "header.menu": MenuItem[];
  "header.uppermenu": MenuItem[];
  "footer.company": MenuItem[];
  "footer.purchases": MenuItem[];
}

export interface MenuApiResponse {
  data: MenuData;
  meta: any;
}
