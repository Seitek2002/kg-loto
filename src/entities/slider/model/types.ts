export type MediaType = "image" | "lottie";

export interface MediaField {
  url: string;
  type: MediaType;
}

export interface SliderItem {
  id: number;
  title: string;
  subtitle: string;
  prizeText: string;
  // В Swagger это URI, на фронте мы можем мапить или принимать как объект
  image: MediaField | string;
  imageMobile: MediaField | string | null;
  imageLayer: MediaField | string | null;
  imageMobileLayer: MediaField | string | null;
  backgroundImage: string | null;
  logo: string | null;
  hasAnimation: boolean;
  buttonText: string;
  buttonPrice: number | null;
  buttonLabel: string;
  buttonUrl: string;
}
