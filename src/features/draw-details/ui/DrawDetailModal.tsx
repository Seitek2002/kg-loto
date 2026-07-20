"use client";

import { useEffect } from "react";

import { useMounted } from "@/hooks/useMounted";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { formatPrizeAmount, getDrawPrizeLabel } from "@/entities/draw/api";
import type { ArchiveDraw } from "@/entities/draw/api";

import { NumberedBall } from "@/shared/ui/NumberedBall";

interface DrawDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  draw: ArchiveDraw | null;
}

export const DrawDetailsModal = ({
  isOpen,
  onClose,
  draw,
}: DrawDetailsModalProps) => {
  const mounted = useMounted();

  // Блокируем скролл фона
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !draw) return null;

  const dateLabel =
    draw.drawDateHuman ||
    new Date(draw.drawDate).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const prizeResults = draw.prizeResults || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 lg:p-0">
          {/* Темный фон (Overlay) с анимацией */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Контейнер модального окна с анимацией появления */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-200 max-h-[90vh] overflow-y-auto bg-[#F5F5F7] rounded-3xl lg:rounded-4xl p-4 lg:p-8 shadow-2xl z-10 custom-scrollbar"
          >
            {/* Кнопка закрытия (Крестик) */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 lg:top-8 lg:right-8 text-gray-400 hover:text-[#4B4B4B] transition-colors z-60 active:scale-90"
            >
              <X className="w-8 h-8 lg:w-10 lg:h-10" strokeWidth={2} />
            </button>

            {/* Заголовок */}
            <h2 className="text-[20px] lg:text-[24px] font-black text-[#4B4B4B] mb-4 lg:mb-6 pr-10">
              Тираж №{draw.drawNumberDisplay || draw.drawNumber}
            </h2>

            {/* Верхний блок: Итоги тиража и Комбинация */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-2xl lg:rounded-[20px] p-5 shadow-sm">
                <h3 className="text-[#4B4B4B] text-[16px] lg:text-[18px] font-bold mb-4">
                  Итоги тиража
                </h3>
                <div className="flex flex-col gap-2 text-[13px] lg:text-[14px]">
                  <div className="flex justify-between lg:justify-start lg:gap-2">
                    <span className="text-[#737373]">Дата тиража:</span>
                    <span className="text-[#4B4B4B] font-bold">
                      {dateLabel}
                    </span>
                  </div>
                  <div className="flex justify-between lg:justify-start lg:gap-2">
                    <span className="text-[#737373]">Время розыгрыша:</span>
                    <span className="text-[#4B4B4B] font-bold">
                      {draw.drawTime?.slice(0, 5) || "-"}
                    </span>
                  </div>
                  {draw.tvBroadcast && (
                    <div className="flex justify-between lg:justify-start lg:gap-2">
                      <span className="text-[#737373]">Телетрансляция:</span>
                      <span className="text-[#4B4B4B] font-bold">
                        {draw.tvBroadcast}
                      </span>
                    </div>
                  )}
                  {(draw.onlineBroadcastUrl || draw.onlineBroadcastLabel) && (
                    <div className="flex justify-between lg:justify-start lg:gap-2">
                      <span className="text-[#737373]">Онлайн трансляция:</span>
                      <span className="text-[#4B4B4B] font-bold">
                        {draw.onlineBroadcastUrl ? (
                          <a
                            href={draw.onlineBroadcastUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#FF7600] transition-colors"
                          >
                            {draw.onlineBroadcastLabel ||
                              draw.onlineBroadcastUrl}
                          </a>
                        ) : (
                          draw.onlineBroadcastLabel
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl lg:rounded-[20px] p-5 shadow-sm">
                <h3 className="text-[#4B4B4B] text-[16px] lg:text-[18px] font-bold mb-4">
                  Выигрышная комбинация
                </h3>
                {draw.winningCombination &&
                draw.winningCombination.length > 0 ? (
                  <div className="flex gap-2 flex-wrap">
                    {draw.winningCombination.map((num, i) => (
                      <div
                        key={i}
                        className="transform scale-[0.9] lg:scale-100 origin-left"
                      >
                        <NumberedBall number={num} size={44} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400 text-[14px]">
                    Результаты тиража ещё не опубликованы
                  </span>
                )}
              </div>
            </div>

            {/* Суперприз и число победителей */}
            <div className="bg-white rounded-2xl lg:rounded-[20px] p-5 shadow-sm mb-4">
              <div className="flex flex-col gap-2 text-[13px] lg:text-[14px]">
                <div className="flex justify-between lg:justify-start lg:gap-2">
                  <span className="text-[#737373]">Суперприз:</span>
                  <span className="text-[#4B4B4B] font-bold">
                    {getDrawPrizeLabel(draw)}
                  </span>
                </div>
                {draw.totalWinningTickets != null && (
                  <div className="flex justify-between lg:justify-start lg:gap-2">
                    <span className="text-[#737373]">Выигрышных билетов:</span>
                    <span className="text-[#4B4B4B] font-bold">
                      {draw.totalWinningTickets.toLocaleString("ru-RU")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Разбивка призов по категориям. Бэк может прислать пустой массив,
                если призы по тиражу ещё не заведены — тогда блок не показываем */}
            {prizeResults.length > 0 && (
              <div className="bg-white rounded-2xl lg:rounded-[20px] p-5 shadow-sm">
                <h3 className="text-[#4B4B4B] text-[18px] font-bold mb-4">
                  Итоги розыгрыша
                </h3>

                <div className="overflow-x-auto pb-2">
                  <table className="w-full text-center text-[13px] lg:text-[14px] min-w-125">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="font-bold text-[#4B4B4B] py-3 text-left">
                          Категория
                        </th>
                        <th className="font-bold text-[#4B4B4B] py-3">
                          Угаданных чисел
                        </th>
                        <th className="font-bold text-[#4B4B4B] py-3">
                          Победителей
                        </th>
                        <th className="font-bold text-[#4B4B4B] py-3 text-right">
                          Выигрыш
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {prizeResults.map((row, i) => (
                        <tr
                          key={i}
                          className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
                        >
                          <td className="py-3 text-[#4B4B4B] text-left">
                            {row.categoryName}
                          </td>
                          <td className="py-3 text-[#4B4B4B]">
                            {row.matchCount}
                          </td>
                          <td className="py-3 text-[#4B4B4B]">
                            {row.winnersCount?.toLocaleString("ru-RU") ?? "—"}
                          </td>
                          <td className="py-3 text-[#4B4B4B] text-right">
                            {formatPrizeAmount(row.prizeAmount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <style
              dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
              `,
              }}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
