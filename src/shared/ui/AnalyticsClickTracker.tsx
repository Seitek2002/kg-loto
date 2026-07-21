"use client";

import { useEffect } from "react";

import { trackPhoneClick, trackWhatsappClick } from "@/shared/lib/analytics";

// Единая точка отправки GA4-событий по клику на телефон/WhatsApp. Делегированный
// слушатель на document ловит клики по любым <a href="tel:..."> и WhatsApp-ссылкам
// (wa.me / whatsapp), включая ссылки из серверных компонентов вроде Footer, где
// повесить onClick напрямую нельзя. Новые такие ссылки трекаются автоматически,
// без правок в каждом месте.
export const AnalyticsClickTracker = () => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest("a");
      if (!link) return;

      const href = link.getAttribute("href") || "";

      if (href.startsWith("tel:")) {
        // repeat на случай "tel:tel:+996..." (в CMS-ссылке иногда уже есть tel:)
        trackPhoneClick(href.replace(/^(?:tel:)+/, ""));
      } else if (/(?:wa\.me|whatsapp)/i.test(href)) {
        trackWhatsappClick(href);
      }
    };

    // capture, чтобы поймать клик даже если обработчик ссылки вызовет
    // stopPropagation на фазе всплытия
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
};
