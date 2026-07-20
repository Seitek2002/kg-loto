"use client";

import { useState } from "react";

import { X } from "lucide-react";

import { formatPrizeAmount, getDrawPrizeLabel } from "@/entities/draw/api";
import type { ArchiveDraw } from "@/entities/draw/api";

import { Modal } from "@/shared/ui/Modal";
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
  // Держим последний непустой draw, пока модалка закрывается: родитель обнуляет
  // draw в тот же момент, что и isOpen, а без этого анимация закрытия не успевала
  // бы отыграть — контент исчезал мгновенно
  const [lastDraw, setLastDraw] = useState(draw);
  if (draw && draw !== lastDraw) setLastDraw(draw);
  const activeDraw = draw ?? lastDraw;

  if (!activeDraw) return null;

  const dateLabel =
    activeDraw.drawDateHuman ||
    new Date(activeDraw.drawDate).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const prizeResults = activeDraw.prizeResults || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hideCloseButton
      className="bg-[#F5F5F7]! max-w-200 rounded-3xl! lg:rounded-4xl! p-4 lg:p-8"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 lg:top-8 lg:right-8 text-gray-400 hover:text-[#4B4B4B] transition-colors z-60 active:scale-90"
        aria-label="Закрыть"
      >
        <X className="w-8 h-8 lg:w-10 lg:h-10" strokeWidth={2} />
      </button>

      <h2 className="text-[20px] lg:text-[24px] font-black text-[#4B4B4B] mb-4 lg:mb-6 pr-10">
        Тираж №{activeDraw.drawNumberDisplay || activeDraw.drawNumber}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-2xl lg:rounded-[20px] p-5 shadow-sm">
          <h3 className="text-[#4B4B4B] text-[16px] lg:text-[18px] font-bold mb-4">
            Итоги тиража
          </h3>
          <div className="flex flex-col gap-2 text-[13px] lg:text-[14px]">
            <div className="flex justify-between lg:justify-start lg:gap-2">
              <span className="text-[#737373]">Дата тиража:</span>
              <span className="text-[#4B4B4B] font-bold">{dateLabel}</span>
            </div>
            <div className="flex justify-between lg:justify-start lg:gap-2">
              <span className="text-[#737373]">Время розыгрыша:</span>
              <span className="text-[#4B4B4B] font-bold">
                {activeDraw.drawTime?.slice(0, 5) || "-"}
              </span>
            </div>
            {activeDraw.tvBroadcast && (
              <div className="flex justify-between lg:justify-start lg:gap-2">
                <span className="text-[#737373]">Телетрансляция:</span>
                <span className="text-[#4B4B4B] font-bold">
                  {activeDraw.tvBroadcast}
                </span>
              </div>
            )}
            {(activeDraw.onlineBroadcastUrl ||
              activeDraw.onlineBroadcastLabel) && (
              <div className="flex justify-between lg:justify-start lg:gap-2">
                <span className="text-[#737373]">Онлайн трансляция:</span>
                <span className="text-[#4B4B4B] font-bold">
                  {activeDraw.onlineBroadcastUrl ? (
                    <a
                      href={activeDraw.onlineBroadcastUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#FF7600] transition-colors"
                    >
                      {activeDraw.onlineBroadcastLabel ||
                        activeDraw.onlineBroadcastUrl}
                    </a>
                  ) : (
                    activeDraw.onlineBroadcastLabel
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
          {activeDraw.winningCombination &&
          activeDraw.winningCombination.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {activeDraw.winningCombination.map((num, i) => (
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

      <div className="bg-white rounded-2xl lg:rounded-[20px] p-5 shadow-sm mb-4">
        <div className="flex flex-col gap-2 text-[13px] lg:text-[14px]">
          <div className="flex justify-between lg:justify-start lg:gap-2">
            <span className="text-[#737373]">Суперприз:</span>
            <span className="text-[#4B4B4B] font-bold">
              {getDrawPrizeLabel(activeDraw)}
            </span>
          </div>
          {activeDraw.totalWinningTickets != null && (
            <div className="flex justify-between lg:justify-start lg:gap-2">
              <span className="text-[#737373]">Выигрышных билетов:</span>
              <span className="text-[#4B4B4B] font-bold">
                {activeDraw.totalWinningTickets.toLocaleString("ru-RU")}
              </span>
            </div>
          )}
        </div>
      </div>

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
                    <td className="py-3 text-[#4B4B4B]">{row.matchCount}</td>
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
    </Modal>
  );
};
