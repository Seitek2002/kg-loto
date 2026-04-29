export interface NewsItem {
  id: number;
  title: string;
  slug: string;
  shortText: string;
  content?: string;
  image: string | null;
  publishedAt: string | null;
  theme: "dark" | "light" | "blue"; // Добавил 'blue', так как он есть у тебя в ArticleCard
  descriptionPosition: "none" | "top" | "bottom";
}
