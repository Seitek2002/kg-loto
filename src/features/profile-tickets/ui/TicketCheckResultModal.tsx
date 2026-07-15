"use client";

import { Clock, Frown, Loader2, Trophy } from "lucide-react";

import { TicketCheckResultResponse } from "@/entities/ticket/api";

import { cn } from "@/shared/lib/utils";
import { Modal } from "@/shared/ui/Modal";
import { NumberedBall } from "@/shared/ui/NumberedBall";

interface TicketCheckResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  result: TicketCheckResultResponse | null;
  errorMessage: string | null;
  // Бэк отвечает 409 draw_not_completed, если тираж ещё не прошёл — это не
  // ошибка по сути, поэтому показываем отдельный нейтральный экран, а не "Не удалось"
  isDrawPending: boolean;
}

export const TicketCheckResultModal = ({
  isOpen,
  onClose,
  isLoading,
  result,
  errorMessage,
  isDrawPending,
}: TicketCheckResultModalProps) => {
  const isDrawFinalized = result?.draw.resultState === "finalized";

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="p-8">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 className="w-12 h-12 text-[#FFD600] animate-spin mb-4" />
          <p className="text-[#4B4B4B] font-bold font-rubik">
            Проверяем билет...
          </p>
        </div>
      ) : isDrawPending ? (
        <div className="flex flex-col items-center text-center pt-4">
          <div className="w-20 h-20 bg-[#FFF0D4] rounded-full flex items-center justify-center mb-4 shadow-sm">
            <Clock className="w-10 h-10 text-[#F58220]" />
          </div>
          <h2 className="text-2xl font-black text-[#4B4B4B] uppercase font-benzin mb-2">
            Тираж ещё не завершён
          </h2>
          <p className="text-[#737373] font-medium">
            Результаты появятся после розыгрыша — попробуйте проверить позже
          </p>
        </div>
      ) : errorMessage ? (
        <div className="flex flex-col items-center text-center pt-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <Frown className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-black text-[#4B4B4B] uppercase font-benzin mb-2">
            Не удалось проверить
          </h2>
          <p className="text-[#737373] font-medium">{errorMessage}</p>
        </div>
      ) : result ? (
        <div className="flex flex-col items-center text-center pt-4">
          {result.result.isWinning ? (
            <>
              <div className="w-20 h-20 bg-[#D1F5D3] rounded-full flex items-center justify-center mb-4 shadow-sm">
                <Trophy className="w-10 h-10 text-[#1FAF38]" />
              </div>
              <h2 className="text-2xl font-black text-[#4B4B4B] uppercase font-benzin mb-2">
                Победа!
              </h2>
              <div className="bg-[#FFF0D4] px-6 py-3 rounded-2xl border border-[#F58220]/20 mb-6">
                <span className="block text-[#F58220] text-xs font-bold uppercase mb-1">
                  Ваш выигрыш
                </span>
                <span className="text-2xl font-black text-[#F58220]">
                  {result.result.totalPrizeAmount} {result.result.currency}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <Frown className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-black text-[#4B4B4B] uppercase font-benzin mb-2">
                {isDrawFinalized ? "Увы..." : "Тираж ещё не завершён"}
              </h2>
              <p className="text-[#737373] font-medium mb-6">
                {isDrawFinalized
                  ? "Этот билет не выиграл"
                  : "Результаты появятся после розыгрыша — попробуйте проверить позже"}
              </p>
            </>
          )}

          {result.draw.winningNumbers.length > 0 && (
            <div className="mb-6 w-full">
              <span className="block text-[13px] font-bold text-[#4B4B4B] mb-2">
                Выигрышные числа
              </span>
              <div className="flex justify-center flex-wrap gap-2">
                {result.draw.winningNumbers.map((num, idx) => (
                  <NumberedBall key={idx} number={num} size={32} />
                ))}
              </div>
            </div>
          )}

          {result.result.grids.map((grid) => (
            <div key={grid.position} className="mb-4 w-full">
              <span className="block text-[13px] font-bold text-[#4B4B4B] mb-2">
                Сетка {grid.position}
                {grid.isWinning && grid.prizeAmount && (
                  <span className="text-[#1FAF38]">
                    {" "}
                    — {grid.prizeAmount} {result.result.currency}
                  </span>
                )}
              </span>
              <div className="flex justify-center flex-wrap gap-2">
                {grid.numbers.map((num, idx) => {
                  const isMatched = grid.matchedNumbers.includes(num);
                  return (
                    <NumberedBall
                      key={idx}
                      number={num}
                      size={32}
                      className={cn(!isMatched && "bg-gray-300 shadow-none")}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </Modal>
  );
};
