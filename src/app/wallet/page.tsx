"use client";

import { useState } from "react";

import Link from "next/link";

import { clsx } from "clsx";
import { ArrowDownLeft, ArrowUpRight, Loader2 } from "lucide-react";

import { TopUpModal } from "@/features/top-up/ui/TopUpModal";

import { useBalance, useTransactions } from "@/entities/finance/api/financeApi";
import { useAuthStore } from "@/entities/user/model/authStore";

const getStatusProps = (status: string) => {
  const s = status?.toLowerCase() || "";
  if (s.includes("оплачено") || s === "completed" || s === "success") {
    return {
      text: status || "Успешно",
      classes: "bg-[#D1F5D3] text-[#1FAF38]",
    };
  }
  if (s.includes("ожидает") || s === "pending" || s === "processing") {
    return {
      text: status || "В обработке",
      classes: "bg-[#F3F4F6] text-[#4B4B4B]",
    };
  }
  if (
    s.includes("отклонено") ||
    s === "rejected" ||
    s === "failed" ||
    s === "error"
  ) {
    return { text: status || "Ошибка", classes: "bg-[#FFD7D7] text-[#FF4B4B]" };
  }
  return {
    text: status || "Неизвестно",
    classes: "bg-[#FFF0D4] text-[#F58220]",
  };
};

const getMethodName = (method: string) => {
  if (!method) return "Внутренний счет";
  const knownMethods: Record<string, string> = {
    mbank: "MBank",
    visa: "VISA",
    elcart: "Элкарт",
    баланс: "С баланса",
  };
  return knownMethods[method.toLowerCase()] || method;
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function WalletPage() {
  const user = useAuthStore((state) => state.user);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);

  // 🔥 Достаем состояние загрузки из хука баланса
  const { isLoading: isBalanceLoading } = useBalance();
  const { data: transactions = [], isLoading } = useTransactions();

  // 🔥 Удобная переменная: если баланс пустой и идет загрузка, показываем лоадер
  const showBalanceLoader = isBalanceLoading && user?.balance === undefined;

  return (
    <div className="min-h-screen bg-[#F9F9F9] font-rubik pb-20">
      <div className="max-w-250 mx-auto px-4 pt-6 lg:pt-10">
        {/* ХЛЕБНЫЕ КРОШКИ */}
        <nav className="flex items-center gap-2 text-[12px] lg:text-[14px] font-medium text-[#737373] mb-6 lg:mb-8">
          <Link href="/" className="hover:text-[#4B4B4B] transition-colors">
            Главная
          </Link>
          <span>/</span>
          <Link
            href="/profile"
            className="hover:text-[#4B4B4B] transition-colors"
          >
            Профиль
          </Link>
          <span>/</span>
          <span className="text-[#4B4B4B] font-bold">Кошелек</span>
        </nav>

        {/* КАРТОЧКА БАЛАНСА */}
        <div className="bg-white rounded-3xl lg:rounded-[40px] p-6 lg:p-10 shadow-sm border border-gray-100 mb-8 lg:mb-12">
          <h2 className="text-[14px] lg:text-[16px] font-bold text-[#4B4B4B] uppercase tracking-wide mb-2 lg:mb-4">
            Баланс
          </h2>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* 🔥 ЕСЛИ ИДЕТ ПЕРВАЯ ЗАГРУЗКА, ПОКАЗЫВАЕМ СПИННЕР */}
            <div className="text-[48px] lg:text-[64px] font-black text-[#4B4B4B] leading-none flex items-center h-[48px] lg:h-[64px]">
              {showBalanceLoader ? (
                <Loader2 className="animate-spin text-[#F58220] w-10 h-10 lg:w-14 lg:h-14" />
              ) : (
                <>
                  {user?.balance || "0"}{" "}
                  <span className="underline text-[36px] lg:text-[48px] ml-2">
                    с
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button
                onClick={() => setIsTopUpModalOpen(true)}
                className="bg-[#F58220] hover:bg-[#E57210] active:scale-95 text-white py-4 px-8 rounded-full font-bold text-[14px] lg:text-[16px] transition-all w-full sm:w-auto shadow-sm"
              >
                Пополнить
              </button>
              <button className="bg-white hidden border-2 border-[#F58220] text-[#F58220] hover:bg-orange-50 active:scale-95 py-4 px-8 rounded-full font-bold text-[14px] lg:text-[16px] transition-all w-full sm:w-auto shadow-sm">
                Вывести
              </button>
            </div>
          </div>
        </div>

        {/* ИСТОРИЯ ТРАНЗАКЦИЙ */}
        <h3 className="text-[18px] lg:text-[24px] font-bold text-[#4B4B4B] mb-4 lg:mb-6">
          История операций
        </h3>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#F58220]" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-white rounded-3xl lg:rounded-[40px] p-10 text-center text-gray-400 font-medium shadow-sm">
            История операций пуста
          </div>
        ) : (
          <>
            {/* 🔥 ДЕСКТОПНАЯ ТАБЛИЦА */}
            <div className="hidden lg:block bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
              <div className="grid grid-cols-4 pb-4 text-[#737373] font-bold text-[14px] uppercase text-center border-b border-gray-50">
                <div className="text-left pl-4">Операция</div>
                <div>Дата</div>
                <div>Сумма</div>
                <div>Статус</div>
              </div>
              <div className="flex flex-col">
                {transactions.map((tx, idx) => {
                  const status = getStatusProps(tx.paymentStatus);
                  const isNegative = tx.amount.toString().startsWith("-");
                  const absAmount = tx.amount.toString().replace("-", "");

                  return (
                    <div
                      key={`${tx.date}-${idx}`}
                      className="grid grid-cols-4 py-5 border-b border-gray-50 last:border-0 text-center items-center hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 pl-4">
                        <div
                          className={clsx(
                            "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                            isNegative
                              ? "bg-red-50 text-red-500"
                              : "bg-green-50 text-green-500",
                          )}
                        >
                          {isNegative ? (
                            <ArrowUpRight size={24} />
                          ) : (
                            <ArrowDownLeft size={24} />
                          )}
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[#4B4B4B] text-[16px] font-bold">
                            {isNegative ? "Списание" : "Пополнение"}
                          </span>
                          <span className="text-[#737373] text-[13px]">
                            {getMethodName(tx.paymentMethod)}
                          </span>
                        </div>
                      </div>

                      <div className="text-[#4B4B4B] text-[15px] font-medium">
                        {formatDate(tx.date)}
                      </div>

                      <div
                        className={clsx(
                          "text-[18px] font-black",
                          isNegative ? "text-[#4B4B4B]" : "text-[#1FAF38]",
                        )}
                      >
                        {isNegative ? "-" : "+"}
                        {absAmount}{" "}
                        <span className="underline text-sm font-bold">с</span>
                      </div>

                      <div className="flex justify-center">
                        <span
                          className={clsx(
                            "px-4 py-2 rounded-full text-[13px] font-bold",
                            status.classes,
                          )}
                        >
                          {status.text}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 🔥 МОБИЛЬНЫЙ СПИСОК */}
            <div className="flex lg:hidden flex-col gap-4">
              {transactions.map((tx, idx) => {
                const status = getStatusProps(tx.paymentStatus);
                const isNegative = tx.amount.toString().startsWith("-");
                const absAmount = tx.amount.toString().replace("-", "");

                return (
                  <div
                    key={`${tx.date}-${idx}`}
                    className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4 active:scale-[0.98] transition-transform"
                  >
                    <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={clsx(
                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                            isNegative
                              ? "bg-red-50 text-red-500"
                              : "bg-green-50 text-green-500",
                          )}
                        >
                          {isNegative ? (
                            <ArrowUpRight size={20} />
                          ) : (
                            <ArrowDownLeft size={20} />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[#4B4B4B] text-[15px] font-bold">
                            {isNegative ? "Списание" : "Пополнение"}
                          </span>
                          <span className="text-[#737373] text-[12px]">
                            {getMethodName(tx.paymentMethod)}
                          </span>
                        </div>
                      </div>
                      <div
                        className={clsx(
                          "text-[16px] font-black",
                          isNegative ? "text-[#4B4B4B]" : "text-[#1FAF38]",
                        )}
                      >
                        {isNegative ? "-" : "+"}
                        {absAmount}{" "}
                        <span className="underline text-[12px] font-bold">
                          с
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[#737373] font-medium text-[13px]">
                        Дата
                      </span>
                      <span className="text-[#4B4B4B] font-bold text-[14px]">
                        {formatDate(tx.date)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[#737373] font-medium text-[13px]">
                        Статус
                      </span>
                      <span
                        className={clsx(
                          "px-3 py-1 rounded-full text-[12px] font-bold",
                          status.classes,
                        )}
                      >
                        {status.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <TopUpModal
        isOpen={isTopUpModalOpen}
        onClose={() => setIsTopUpModalOpen(false)}
      />
    </div>
  );
}
