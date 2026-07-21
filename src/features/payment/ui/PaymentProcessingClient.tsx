"use client";

import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { AlertCircle, Check, Clock, Loader2 } from "lucide-react";

import {
  PENDING_PURCHASE_KEY,
  type PendingPurchase,
  ticketApi,
} from "@/entities/ticket/api";

import { Button } from "@/shared/ui/Button";

// Продажа после оплаты на PayLink подтверждается вебхуком асинхронно, поэтому
// после возврата опрашиваем прямой статус покупки по orderId несколько раз, пока
// он не станет confirmed/rejected либо не выйдет таймаут (~20 сек).
const MAX_ATTEMPTS = 8;
const INTERVAL_MS = 2500;
const MAX_INTENT_AGE_MS = 30 * 60 * 1000;

type Phase = "polling" | "success" | "rejected" | "timeout";

export const PaymentProcessingClient = () => {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("polling");
  // orderId нужен только для показа в экране rejected. Выставляем его не в теле
  // эффекта, а в асинхронном колбэке опроса (после await) — иначе линтер ругается
  // на синхронный setState внутри эффекта.
  const [orderId, setOrderId] = useState<string>("");
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
      !intent.orderId ||
      Date.now() - intent.ts > MAX_INTENT_AGE_MS
    ) {
      localStorage.removeItem(PENDING_PURCHASE_KEY);
      router.replace("/profile");
      return;
    }

    const currentOrderId = intent.orderId;
    let attempts = 0;
    let cancelled = false;

    const finish = (next: Phase) => {
      localStorage.removeItem(PENDING_PURCHASE_KEY);
      if (!cancelled) setPhase(next);
    };

    const poll = async () => {
      attempts += 1;
      try {
        const res = await ticketApi.getLttPurchasePaylinkStatus(currentOrderId);
        if (res.status === "confirmed") {
          finish("success");
          return;
        }
        if (res.status === "rejected") {
          setOrderId(currentOrderId);
          finish("rejected");
          return;
        }
        // "processing" — продолжаем опрашивать
      } catch {
        // 404 / сеть моргнула — не финал, пробуем ещё раз до таймаута
      }

      if (cancelled) return;

      if (attempts >= MAX_ATTEMPTS) {
        // Оплата ещё не подтверждена (или пользователь не оплатил) —
        // намерение НЕ удаляем: даём шанс повторно опросить при перезаходе
        if (!cancelled) setPhase("timeout");
        return;
      }
      setTimeout(poll, INTERVAL_MS);
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [router]);

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

  if (phase === "rejected") {
    return (
      <div className="flex flex-col items-center mt-10 md:mt-16 text-center">
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-red-50 flex items-center justify-center mb-6 text-red-500 shadow-sm">
          <AlertCircle className="w-12 h-12" strokeWidth={2} />
        </div>
        <h1 className="text-[20px] md:text-[28px] font-black font-benzin uppercase text-[#4B4B4B] mb-4 leading-tight">
          Не удалось оформить билеты
        </h1>
        <p className="text-gray-500 mb-4 max-w-md font-medium leading-relaxed">
          Оплата прошла, но билеты не удалось передать — возможно, их успели
          купить в другом месте. Средства могли быть списаны. Пожалуйста,
          свяжитесь с поддержкой
          {orderId ? ` и укажите номер заказа ${orderId}` : ""}.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-125">
          <Button
            onClick={() => router.push("/profile/support")}
            className="flex-1 bg-[#F58220] hover:bg-[#E57210] text-white py-4 rounded-full font-bold"
          >
            Поддержка
          </Button>
          <Button
            onClick={() => router.push("/profile")}
            className="flex-1 bg-[#4B4B4B] hover:bg-[#3A3A3A] text-white py-4 rounded-full font-bold"
          >
            Мои билеты
          </Button>
        </div>
      </div>
    );
  }

  // timeout — оплата ещё обрабатывается (или не была завершена)
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
