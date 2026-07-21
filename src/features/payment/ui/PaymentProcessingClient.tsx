"use client";

import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { Check, Clock, Loader2 } from "lucide-react";

import {
  PENDING_PURCHASE_KEY,
  type PendingPurchase,
  useMyTickets,
} from "@/entities/ticket/api";

import { Button } from "@/shared/ui/Button";

// Продажа после оплаты на PayLink подтверждается вебхуком асинхронно, поэтому
// после возврата опрашиваем /me/balance/tickets/ несколько раз, пока билеты не
// станут "sold" либо не выйдет таймаут (~20 сек).
const MAX_ATTEMPTS = 8;
const INTERVAL_MS = 2500;
const MAX_INTENT_AGE_MS = 30 * 60 * 1000;

type Phase = "polling" | "success" | "timeout";

export const PaymentProcessingClient = () => {
  const router = useRouter();
  // enabled: false — автозапрос не нужен, дёргаем refetch вручную в цикле
  const { refetch } = useMyTickets(false);
  const [phase, setPhase] = useState<Phase>("polling");
  const startedRef = useRef(false);

  useEffect(() => {
    // StrictMode в dev монтирует эффект дважды — защищаемся от второго цикла
    if (startedRef.current) return;
    startedRef.current = true;

    let intent: PendingPurchase | null = null;
    try {
      const raw = localStorage.getItem(PENDING_PURCHASE_KEY);
      intent = raw ? (JSON.parse(raw) as PendingPurchase) : null;
    } catch {
      intent = null;
    }

    // Нет валидного намерения (зашли напрямую / протухло) — в «Мои билеты»
    if (
      !intent ||
      !intent.ticketIds?.length ||
      Date.now() - intent.ts > MAX_INTENT_AGE_MS
    ) {
      localStorage.removeItem(PENDING_PURCHASE_KEY);
      router.replace("/profile");
      return;
    }

    const pendingIds = intent.ticketIds;
    let attempts = 0;
    let cancelled = false;

    const finish = (next: Phase) => {
      localStorage.removeItem(PENDING_PURCHASE_KEY);
      if (!cancelled) setPhase(next);
    };

    const poll = async () => {
      attempts += 1;
      let soldCount = 0;
      try {
        const res = await refetch();
        const list = res.data ?? [];
        soldCount = list.filter(
          (t) => pendingIds.includes(t.ticketId) && t.status === "sold",
        ).length;
      } catch {
        // сеть моргнула — не считаем это финалом, просто попробуем ещё раз
      }

      if (cancelled) return;

      if (soldCount >= pendingIds.length) {
        finish("success");
        return;
      }
      if (attempts >= MAX_ATTEMPTS) {
        finish("timeout");
        return;
      }
      setTimeout(poll, INTERVAL_MS);
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [refetch, router]);

  if (phase === "polling") {
    return (
      <div className="flex flex-col items-center justify-center mt-20 md:mt-32 text-center">
        <Loader2 className="animate-spin text-[#F58220] w-12 h-12 mb-6" />
        <h1 className="text-[20px] md:text-[28px] font-black font-benzin uppercase text-[#4B4B4B] mb-3 leading-tight">
          Проверяем оплату…
        </h1>
        <p className="text-gray-500 max-w-sm font-medium">
          Это займёт несколько секунд. Не закрывайте страницу.
        </p>
      </div>
    );
  }

  if (phase === "success") {
    return (
      <div className="flex flex-col items-center mt-10 md:mt-16 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#1FAF38] flex items-center justify-center mb-6 md:mb-8 shadow-sm">
          <Check
            className="text-[#1FAF38] w-12 h-12 md:w-16 md:h-16"
            strokeWidth={3}
          />
        </div>
        <h1 className="text-[20px] md:text-[32px] font-black font-benzin uppercase text-[#4B4B4B] mb-4 text-center leading-tight">
          Оплата прошла! <br className="md:hidden" /> Билеты у вас
        </h1>
        <p className="text-gray-500 mb-8 max-w-sm text-center font-medium">
          Билеты уже в разделе «Мои билеты».
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-125">
          <Button
            onClick={() => router.push("/profile")}
            className="flex-1 bg-[#F58220] hover:bg-[#E57210] text-white py-4 sm:py-5 rounded-full font-bold text-[15px] md:text-[16px] shadow-md"
          >
            Мои билеты
          </Button>
          <Button
            onClick={() => router.push("/")}
            className="flex-1 bg-[#4B4B4B] hover:bg-[#3A3A3A] text-white py-4 sm:py-5 rounded-full font-bold text-[15px] md:text-[16px] shadow-md"
          >
            На главную
          </Button>
        </div>
      </div>
    );
  }

  // timeout — оплата, скорее всего, ещё обрабатывается
  return (
    <div className="flex flex-col items-center mt-10 md:mt-16 text-center">
      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-[#FFF0D4] flex items-center justify-center mb-6 shadow-sm">
        <Clock className="text-[#F58220] w-12 h-12" strokeWidth={2} />
      </div>
      <h1 className="text-[20px] md:text-[28px] font-black font-benzin uppercase text-[#4B4B4B] mb-4 leading-tight">
        Оплата обрабатывается
      </h1>
      <p className="text-gray-500 mb-8 max-w-md font-medium leading-relaxed">
        Если оплата прошла, билеты появятся в разделе «Мои билеты» в течение
        пары минут. Обновите страницу чуть позже.
      </p>
      <Button
        onClick={() => router.push("/profile")}
        className="w-full max-w-62.5 bg-[#4B4B4B] hover:bg-[#3A3A3A] text-white py-4 rounded-full font-bold"
      >
        Мои билеты
      </Button>
    </div>
  );
};
