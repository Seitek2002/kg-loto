declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

interface PurchaseTrackingItem {
  id: string | number;
  name: string;
  price: number;
}

interface TrackPurchaseParams {
  transactionId: string;
  value: number;
  items: PurchaseTrackingItem[];
}

// Рекомендованное GA4-событие успешной покупки:
// https://developers.google.com/analytics/devguides/collection/ga4/reference/events#purchase
export const trackPurchase = ({
  transactionId,
  value,
  items,
}: TrackPurchaseParams) => {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", "purchase", {
    transaction_id: transactionId,
    value,
    currency: "KGS",
    items: items.map((item) => ({
      item_id: String(item.id),
      item_name: item.name,
      price: item.price,
      quantity: 1,
    })),
  });
};

// Клик по номеру телефона (tel:-ссылка). Вешается централизованно через
// AnalyticsClickTracker, поэтому дублировать onClick на каждый <a> не нужно.
export const trackPhoneClick = (phoneNumber: string) => {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", "phone_click", {
    phone_number: phoneNumber,
  });
};

// Клик по ссылке WhatsApp (wa.me / whatsapp).
export const trackWhatsappClick = (link: string) => {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", "whatsapp_click", {
    link,
  });
};
