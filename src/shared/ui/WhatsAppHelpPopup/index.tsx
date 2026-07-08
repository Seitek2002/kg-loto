"use client";

import { useEffect, useState } from "react";

// Всплывающая подсказка "Не получается купить? Пишите в WhatsApp" — двуязычная
// (кыргызский + русский показываются одновременно, это не переключение локали
// сайта, а осознанное решение — так просили показывать в макете).
const START_HOUR = 9; // показывать с 9:00 (по времени Кыргызстана, UTC+6)
const END_HOUR = 22; // скрывать в 22:00
const SNOOZE_MS = 3 * 60 * 1000; // после закрытия молчать 3 минуты
const CLOSE_COUNT_KEY = "waHelpCloseCount";
const NEVER_SHOW_KEY = "waHelpNeverShow";
const SNOOZED_AT_KEY = "waHelpClosedAt";

const WHATSAPP_LINK =
  "https://wa.me/996998777377?text=" +
  encodeURIComponent(
    "Салам! Лотерея билеттерин сатып алгым келет. / Здравствуйте! Хочу купить лотерейные билеты.",
  );

const isWithinHours = () => {
  const h = (new Date().getUTCHours() + 6) % 24;
  return h >= START_HOUR && h < END_HOUR;
};

const isSnoozed = () => {
  const t = parseInt(sessionStorage.getItem(SNOOZED_AT_KEY) || "0", 10);
  return !!t && Date.now() - t < SNOOZE_MS;
};

export const WhatsAppHelpPopup = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      if (localStorage.getItem(NEVER_SHOW_KEY) === "1" || isSnoozed()) {
        setVisible(false);
        return;
      }
      setVisible(isWithinHours());
    };

    update();
    const interval = setInterval(update, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    setVisible(false);
    const count = parseInt(localStorage.getItem(CLOSE_COUNT_KEY) || "0", 10) + 1;
    localStorage.setItem(CLOSE_COUNT_KEY, String(count));
    if (count >= 2) {
      // Закрыли второй раз — больше не показываем никогда
      localStorage.setItem(NEVER_SHOW_KEY, "1");
    } else {
      sessionStorage.setItem(SNOOZED_AT_KEY, String(Date.now()));
    }
  };

  if (!visible) return null;

  return (
    <div
      // bottom-24 на мобильном — чтобы не перекрывать BottomNav; z-40 — ниже
      // корзины (z-100), чтобы при оформлении заказа попап не мешал
      className="fixed left-3 right-3 bottom-24 lg:left-5 lg:right-auto lg:bottom-5 z-40 lg:max-w-85 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
      role="dialog"
      aria-live="polite"
    >
      <button
        onClick={handleClose}
        type="button"
        aria-label="Закрыть"
        className="absolute top-1.5 right-2.5 text-gray-400 hover:text-[#333] text-2xl leading-none px-1.5 py-0.5 cursor-pointer"
      >
        &times;
      </button>
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3.5 px-4.5 py-4"
      >
        <span className="shrink-0 w-13 h-13 bg-[#25D366] rounded-full flex items-center justify-center">
          <svg viewBox="0 0 32 32" width="30" height="30" fill="#fff">
            <path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.6 6L4 29l8.2-1.6c1.7.9 3.7 1.4 5.8 1.4h.1c6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.9c-1.9 0-3.7-.5-5.3-1.4l-.4-.2-4.9 1 1-4.8-.3-.4c-1-1.6-1.5-3.5-1.5-5.5C4.9 9.5 9.7 4.9 16 4.9c5.6 0 10.1 4.5 10.1 10.1S21.6 24.9 16 24.9zm5.5-7.6c-.3-.2-1.8-.9-2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0c-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1s0-.5.1-.7c.1-.1.3-.4.5-.5.1-.2.2-.3.3-.5s0-.4 0-.5c-.1-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.4z" />
          </svg>
        </span>
        <span className="flex flex-col gap-0.5 min-w-0">
          <span className="font-bold text-[15px] text-[#111] leading-tight">
            Сатып ала албай жатасызбы?
          </span>
          <span className="font-bold text-[15px] text-[#111] leading-tight opacity-85">
            Не получается купить?
          </span>
          <span className="text-[12.5px] text-[#555] leading-tight mt-0.5">
            WhatsApp&apos;ка жазыңыз — жардам беребиз
          </span>
          <span className="text-[12.5px] text-[#555] leading-tight opacity-85">
            Напишите нам в WhatsApp — поможем
          </span>
        </span>
      </a>
    </div>
  );
};
