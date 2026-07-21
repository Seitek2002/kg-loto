"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useMounted } from "@/hooks/useMounted";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2 } from "lucide-react";

import { type CartItem, useCartStore } from "@/entities/cart/model/cartStore";
import { useBalance } from "@/entities/finance/api/financeApi";
import {
  PENDING_PURCHASE_KEY,
  type PendingPurchase,
  TicketDto,
  getSoldTicketErrorMessage,
  getTicketNumbers,
  isTicketAvailable,
  useDownloadTicketPdf,
  useLttPurchase,
  useLttPurchasePaylink,
  useTickets,
} from "@/entities/ticket/api";
import { useAuthStore } from "@/entities/user/model/authStore";

import { trackPurchase } from "@/shared/lib/analytics";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/Button";
import { ErrorModal } from "@/shared/ui/ErrorModal";
import { NumberedBall } from "@/shared/ui/NumberedBall";
import {
  SuccessPurchaseModal,
  TicketDetails,
} from "@/shared/ui/SuccessPurchaseModal";
import { useToastStore } from "@/shared/ui/Toast/toastStore";

const getTicketPlural = (count: number) => {
  const lastDigit = count % 10;
  const lastTwo = count % 100;
  if (lastTwo >= 11 && lastTwo <= 19) return "билетов";
  if (lastDigit === 1) return "билет";
  if (lastDigit >= 2 && lastDigit <= 4) return "билета";
  return "билетов";
};

// drawId теперь число (ltt_id); поддерживаем и старые строковые id вида "draw-...-NNN"
const getDrawLabel = (drawId: number | string) =>
  String(drawId).split("-").pop();

const RealQuickAddTicket = ({
  ticket,
  lotteryId,
  drawId,
  maxNumber = 36,
  gridCols = 6,
}: {
  ticket: TicketDto;
  lotteryId: string;
  drawId: number | string;
  maxNumber?: number;
  gridCols?: number;
}) => {
  const { toggleItem, items } = useCartStore();
  const numbers = Array.from({ length: maxNumber }, (_, i) => i + 1);
  const isInCart = items.some((i) => i.id === ticket.ticketId);
  const ticketNumbers = getTicketNumbers(ticket);

  const handleAdd = () => {
    toggleItem({
      id: ticket.shortId || ticket.ticketId,
      price: ticket.price,
      type: "other",
      ticketNumber: ticket.ticketNumber,
      combinations:
        ticket.combinations && ticket.combinations.length > 0
          ? ticket.combinations
          : [ticketNumbers],
      lotteryId: lotteryId,
      drawId: drawId,
      name: `Тираж №${getDrawLabel(drawId)}`,
    });
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col relative mb-4">
      <div className="absolute -left-2 top-7.5 w-4 h-4 bg-[#F5F5F5] rounded-full border-r border-gray-100" />
      <div className="absolute -right-2 top-7.5 w-4 h-4 bg-[#F5F5F5] rounded-full border-l border-gray-100" />

      <div className="flex justify-between items-center border-b border-dashed border-gray-300 pb-4 mb-4">
        <span className="text-[#737373] font-medium text-sm">
          Билет №{ticket.ticketNumber}
        </span>
        <span className="font-bold text-[#4B4B4B] text-[16px]">
          {ticket.price} <span className="underline">с</span>
        </span>
      </div>

      <div
        className="grid gap-2 mb-6"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {numbers.map((num) => {
          const isSelected = ticketNumbers.includes(num);
          return (
            <div
              key={num}
              className={`flex items-center justify-center aspect-square rounded-md text-[13px] font-bold transition-colors ${
                isSelected
                  ? "bg-[#FF7600] text-white shadow-sm"
                  : "bg-[#F9F9F9] text-[#4B4B4B]"
              }`}
            >
              {num}
            </div>
          );
        })}
      </div>

      <Button
        onClick={handleAdd}
        className={cn(
          "w-full py-3.5 rounded-2xl text-[13px] shadow-sm",
          isInCart
            ? "bg-[#4B4B4B] text-white hover:bg-gray-800"
            : "bg-[#FF7600] text-white hover:bg-[#E56A00]",
        )}
      >
        {isInCart ? "Убрать из корзины" : `Добавить • ${ticket.price} с`}
      </Button>
    </div>
  );
};

export const CartClient = () => {
  const { items, toggleItem, clearCart } = useCartStore();
  const mounted = useMounted();
  const router = useRouter();

  // 🔥 ДОБАВИЛИ openAuthModal из глобального стора
  const { user, openAuthModal } = useAuthStore();

  const { mutate: purchase, isPending: isPurchasing } = useLttPurchase();
  const { mutate: purchaseViaPaylink, isPending: isPaylinkPending } =
    useLttPurchasePaylink();
  const { mutate: downloadPdf, isPending: isDownloading } =
    useDownloadTicketPdf();
  const { refetch: refetchBalance } = useBalance();
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.showToast);

  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>(
    "Возможно, выбранные билеты уже выкуплены. Пожалуйста, попробуйте еще раз.",
  );
  const [successDetails, setSuccessDetails] = useState<TicketDetails | null>(
    null,
  );

  const firstItem = items[0];
  const { data: ticketsData, isLoading: isTicketsLoading } = useTickets(
    {
      lotteryId: firstItem?.lotteryId || "",
      drawId: firstItem?.drawId || "",
      limit: 10,
    },
    items.length > 0,
  );

  const availableTickets =
    ticketsData?.tickets?.filter((t) => isTicketAvailable(t)) || [];
  const quickAddTickets = availableTickets.slice(0, 2);

  const removeItem = (item: CartItem) => toggleItem(item);

  const totalPrice = items.reduce((acc, item) => acc + item.price, 0);
  const totalTickets = items.length;

  // Авторизован, но баланса не хватает — оплата пойдёт через пополнение,
  // поэтому кнопка честно называется «Пополнить и оплатить»
  const needsTopUp = !!user && Number(user?.balance || 0) < totalPrice;
  const checkoutLabel = needsTopUp ? "Пополнить и оплатить" : "Оплатить";

  // Путь Г: когда баланса не хватает — платим и покупаем одним редиректом на
  // PayLink. Билеты бронируются сразу; продажа подтвердится вебхуком после оплаты.
  const startPaylinkCheckout = () => {
    const referralCode = localStorage.getItem("referral_code") ?? "";
    const orderId = `ORD-${Date.now()}`;
    const ticketIds = items.map((t) => t.id);
    purchaseViaPaylink(
      {
        orderId,
        tickets: ticketIds,
        note: "",
        referralCode,
        redirectUrl: `${window.location.origin}/payment/processing`,
      },
      {
        onSuccess: (res) => {
          if (res?.paylinkUrl) {
            // Сохраняем намерение, чтобы после возврата опросить статус билетов
            const pending: PendingPurchase = {
              orderId,
              ticketIds: res.tickets?.map((t) => t.shortId) ?? ticketIds,
              ts: Date.now(),
            };
            try {
              localStorage.setItem(
                PENDING_PURCHASE_KEY,
                JSON.stringify(pending),
              );
            } catch {}
            // Корзину чистим: билеты забронированы, результат появится в «Моих билетах»
            clearCart();
            window.location.href = res.paylinkUrl;
            return;
          }
          setErrorMessage(
            "Не удалось создать ссылку на оплату. Попробуйте ещё раз.",
          );
          setIsErrorOpen(true);
        },
        onError: (error) => {
          const status = (error as { response?: { status?: number } })?.response
            ?.status;
          const soldMessage = getSoldTicketErrorMessage(error);
          if (status === 409) {
            setErrorMessage(
              "Заказ уже обрабатывается. Подождите несколько секунд и попробуйте снова.",
            );
          } else if (soldMessage) {
            setErrorMessage(soldMessage);
          } else if (status === 400) {
            setErrorMessage(
              "Билет уже занят или продажи тиража закрыты. Обновите список и выберите билет заново.",
            );
          } else {
            setErrorMessage(
              "Не удалось оформить покупку. Возможно, в профиле не заполнена дата рождения. Попробуйте ещё раз.",
            );
          }
          setIsErrorOpen(true);
          queryClient.invalidateQueries({ queryKey: ["tickets"] });
        },
      },
    );
  };

  const handleCheckout = () => {
    if (items.length === 0) return;

    // 🔥 ПРОВЕРКА НА АВТОРИЗАЦИЮ
    if (!user) {
      openAuthModal("login"); // Открываем модалку входа
      return; // Останавливаем выполнение функции
    }

    const currentBalance = Number(user?.balance || 0);

    // 1. Денег не хватает -> Путь Г: оплата + покупка одним запросом через PayLink
    if (currentBalance < totalPrice) {
      startPaylinkCheckout();
      return;
    }

    // 2. Денег хватает -> Путь B: покупка реального LTT-билета за баланс
    const payload = {
      orderId: `ORD-${Date.now()}`,
      tickets: items.map((t) => t.id), // short_id билетов
      note: "",
    };

    purchase(payload, {
      onSuccess: (res) => {
        // Бэк мог отклонить транзакцию уже после списания (баланс вернётся автоматически)
        if (res?.status && res.status !== "confirmed") {
          setErrorMessage(
            "Покупка отклонена. Средства возвращены на баланс. Попробуйте ещё раз.",
          );
          setIsErrorOpen(true);
          refetchBalance();
          return;
        }

        const purchasedTickets = res?.tickets ?? [];
        const ticketCount = purchasedTickets.length || items.length;

        setSuccessDetails({
          drawNumber: `№${getDrawLabel(items[0].drawId)}`,
          price: res?.amount ? Number(res.amount) : totalPrice,
          balance: res?.balance ?? String(user?.balance ?? "0"),
          date: new Date().toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          combinations: items[0].combinations ?? [],
          ticketIds: purchasedTickets.map((t) => t.shortId),
        });
        clearCart();
        refetchBalance();
        showToast(
          `Куплено ${ticketCount} ${getTicketPlural(ticketCount)}! Списано ${res?.amount ?? totalPrice} с`,
        );
        trackPurchase({
          transactionId: res?.orderId || payload.orderId,
          value: res?.amount ? Number(res.amount) : totalPrice,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
          })),
        });
        // Купленные билеты не должны продолжать висеть в сетке как доступные
        queryClient.invalidateQueries({ queryKey: ["tickets"] });
        // Сразу после успешного ltt-purchase переводим в "Мои билеты" —
        // не дожидаясь, пока пользователь закроет модалку успеха
        router.push("/profile");
      },
      onError: (error) => {
        console.error("Ошибка покупки:", error);
        const status = (error as { response?: { status?: number } })?.response
          ?.status;

        if (status === 402) {
          // Недостаточно средств (баланс не тронут) -> оплата через PayLink (путь Г)
          startPaylinkCheckout();
          return;
        }

        const soldMessage = getSoldTicketErrorMessage(error);
        if (soldMessage) {
          // Билет успели купить раньше нас — освежаем список, чтобы он пропал из сетки
          setErrorMessage(soldMessage);
          setIsErrorOpen(true);
          queryClient.invalidateQueries({ queryKey: ["tickets"] });
          return;
        }

        if (status === 400) {
          setErrorMessage(
            "Не удалось оформить покупку: билет уже продан или не заполнен профиль (дата рождения).",
          );
        } else if (status === 409) {
          setErrorMessage(
            "Заказ ещё обрабатывается. Подождите пару секунд и попробуйте снова.",
          );
        } else {
          setErrorMessage(
            "Возможно, выбранные билеты уже выкуплены. Пожалуйста, попробуйте еще раз.",
          );
        }
        setIsErrorOpen(true);
      },
    });
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center shadow-sm max-w-2xl mx-auto mt-10 border border-gray-100">
        <p className="text-[#4B4B4B] font-bold text-lg mb-4">
          Ваша корзина пуста
        </p>
        <Link href="/" className="text-[#FF7600] font-bold hover:underline">
          Перейти к выбору билетов
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* ЛЕВАЯ КОЛОНКА */}
        <div className="hidden lg:flex w-[320px] flex-col shrink-0">
          <h3 className="text-[16px] font-bold text-[#4B4B4B] mb-4">
            Попробуйте также
          </h3>
          {isTicketsLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-[#FF7600] w-8 h-8" />
            </div>
          ) : quickAddTickets.length > 0 ? (
            quickAddTickets.map((ticket) => (
              <RealQuickAddTicket
                key={ticket.ticketId}
                ticket={ticket}
                lotteryId={ticketsData!.lotteryId}
                drawId={ticketsData!.drawId}
                maxNumber={ticketsData?.game?.maxNumber}
                gridCols={ticketsData?.game?.gridCols}
              />
            ))
          ) : (
            <div className="text-sm text-gray-400">
              Дополнительных билетов пока нет
            </div>
          )}
        </div>

        {/* ЦЕНТРАЛЬНАЯ КОЛОНКА */}
        <div className="flex-1 w-full flex flex-col gap-3 md:gap-4 pb-32 lg:pb-0">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[20px] p-4 md:p-5 flex flex-row items-center justify-between shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shrink-0 bg-[#F58220]/20">
                  <Image
                    src="/images/draw-tickets/big-block-bg.png"
                    alt={item.name}
                    fill
                    unoptimized
                    className="object-cover opacity-90"
                  />
                </div>
                <div className="flex flex-col justify-center gap-1.5 md:gap-2">
                  <h3 className="text-[14px] md:text-[16px] font-medium text-[#4B4B4B] leading-tight">
                    {item.name}
                  </h3>
                  <div className="flex flex-col gap-1">
                    {item.combinations?.map((numbers, gridIdx) => (
                      <div
                        key={gridIdx}
                        className="flex flex-wrap gap-1 items-center"
                      >
                        {(item.combinations?.length ?? 0) > 1 && (
                          <span className="text-[10px] font-bold text-[#A3A3A3] uppercase mr-1">
                            Сетка {gridIdx + 1}:
                          </span>
                        )}
                        {numbers.map((num, i) => (
                          <NumberedBall key={i} number={num} size={28} />
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="text-[15px] md:text-[18px] font-black text-[#4B4B4B]">
                    {item.price} сом
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeItem(item)}
                className="w-11 h-11 border border-gray-200 rounded-full flex items-center justify-center text-[#A3A3A3] hover:bg-gray-50 hover:text-[#DC2626] transition-colors active:scale-95 shrink-0 ml-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          <Link href="/" className="block w-full mt-2">
            <Button
              variant="outline"
              className="w-full py-4 rounded-2xl gap-2 border-gray-200"
            >
              <Plus size={18} /> Добавить еще билет
            </Button>
          </Link>
        </div>

        {/* ПРАВАЯ КОЛОНКА (Десктоп) */}
        <div className="hidden lg:flex w-[320px] flex-col bg-white rounded-3xl p-6 shadow-sm border border-gray-100 shrink-0 sticky top-24">
          <h3 className="text-[18px] font-bold text-[#4B4B4B] mb-5">
            Детали заказа
          </h3>
          <div className="border-t border-gray-100 pt-4 mb-6 flex justify-between items-center">
            <span className="text-[#4B4B4B] font-medium">Итого</span>
            <span className="text-[20px] font-black text-[#4B4B4B]">
              {totalPrice} <span className="underline">с</span>
            </span>
          </div>
          <Button
            onClick={handleCheckout}
            isLoading={isPurchasing || isPaylinkPending}
            className="w-full py-4 rounded-xl text-[16px] bg-[#FF7600] hover:bg-[#E56A00] text-white"
          >
            {checkoutLabel}
          </Button>
        </div>

        {/* МОБИЛЬНАЯ ПАНЕЛЬ ОПЛАТЫ */}
        <div className="lg:hidden fixed bottom-0 left-4 right-4 bg-white rounded-3xl p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-100 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-[13px] text-[#737373] font-medium mb-1">
                Итого:
              </span>
              <span className="text-[16px] font-bold text-[#4B4B4B] leading-none">
                {totalTickets} {getTicketPlural(totalTickets)}
              </span>
            </div>
            <div className="text-[24px] font-black text-[#4B4B4B]">
              {totalPrice}{" "}
              <span className="underline decoration-2 underline-offset-2 text-[18px]">
                с
              </span>
            </div>
          </div>
          <Button
            onClick={handleCheckout}
            isLoading={isPurchasing || isPaylinkPending}
            className="w-full bg-[#FF7600] hover:bg-[#E56A00] text-white py-4 rounded-2xl text-[16px]"
          >
            {checkoutLabel}
          </Button>
        </div>
      </div>

      {/* 🔥 Модалки поверх всего */}
      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        title="Оплата не прошла"
        message={errorMessage}
      />

      <SuccessPurchaseModal
        isOpen={!!successDetails}
        onClose={() => {
          setSuccessDetails(null);
          router.push("/profile");
        }}
        details={successDetails!}
        isDownloading={isDownloading}
        onDownload={() => {
          successDetails?.ticketIds.forEach((id) => downloadPdf(id));
        }}
      />
    </>
  );
};
