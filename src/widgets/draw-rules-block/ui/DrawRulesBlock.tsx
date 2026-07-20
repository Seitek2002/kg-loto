"use client";

import { useMemo } from "react";

import type { LotteryPrizeTier } from "@/entities/lottery/api/lotteryClientApi";
import { LotteryRuleDto } from "@/entities/ticket/api";

import { cn } from "@/shared/lib/utils";
import { Description } from "@/shared/ui/Description";
import { SafeImage } from "@/shared/ui/SafeImage";
import { Title } from "@/shared/ui/Title";

interface DrawRulesBlockProps {
  rules: LotteryRuleDto[];
  // Параметры игры: сколько чисел в комбинации и верхняя граница диапазона.
  // Раньше «5 (пяти) чисел ... от 1 до 36» было зашито строкой, из-за чего на
  // странице 5/42 писало про 36 чисел.
  pickCount?: number;
  maxNumber?: number;
  // Категории выигрышей с бэка. Пусто — блок не показываем вовсе (лучше ничего,
  // чем выдуманные суммы, как было с моком)
  prizeTiers?: LotteryPrizeTier[];
}

const PICK_COUNT_WORDS: Record<number, string> = {
  2: "двух",
  3: "трёх",
  4: "четырёх",
  5: "пяти",
  6: "шести",
  7: "семи",
};

// Число совпадений вытаскиваем ТОЛЬКО для сортировки: собственный order с бэка
// сейчас непригоден (у 5/42 он у всех 0, у 5/36 суперприз идёт вторым). Если
// формулировка в админке изменится и разбор не сработает — максимум съедет
// порядок строк, но ни одна сумма не будет искажена.
const getMatchCount = (tier: LotteryPrizeTier): number => {
  const match = tier.amount?.match(/(\d+)\s*из\s*\d+/);
  return match ? Number(match[1]) : -1;
};

// Подсветка суперприза — чисто косметика, на цифры не влияет
const isJackpotTier = (tier: LotteryPrizeTier): boolean =>
  /супер\s*приз|джекпот/i.test(tier.amount || "");

export const DrawRulesBlock = ({
  rules,
  pickCount,
  maxNumber,
  prizeTiers,
}: DrawRulesBlockProps) => {
  // Уточняющую часть показываем, только если реально знаем параметры игры —
  // иначе лучше общая формулировка, чем неверные числа
  const hasGameParams = !!pickCount && !!maxNumber;
  const pickCountWord = pickCount ? PICK_COUNT_WORDS[pickCount] : undefined;

  // Сверху крупнейшая категория (5 из 5). Неразобранные строки уходят в конец,
  // сохраняя исходный порядок с бэка.
  const sortedTiers = useMemo(() => {
    return [...(prizeTiers || [])].sort(
      (a, b) => getMatchCount(b) - getMatchCount(a),
    );
  }, [prizeTiers]);

  return (
    <section className="font-rubik text-[#4B4B4B] text-left">
      <Title>ПРАВИЛА ТИРАЖНОЙ ЛОТЕРЕИ</Title>

      <div className="flex flex-col gap-4 lg:gap-6 mt-6">
        {/* 🔥 НОВЫЙ БЛОК: Динамические правила "Как играть" из API */}
        {rules && rules.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 bg-white shadow-sm border border-gray-100 p-6 rounded-3xl md:rounded-4xl mb-2">
            {rules.map((step) => (
              <div key={step.id} className="flex flex-col gap-4">
                {step.image && (
                  <div className="w-full relative overflow-hidden aspect-square">
                    <SafeImage
                      src={step.image}
                      alt={`Шаг ${step.order + 1}`}
                      fill
                      className="object-contain p-2 rounded-[10px]"
                      fallbackText="Изображение шага"
                    />
                  </div>
                )}
                <p className="text-sm md:text-base font-medium text-[#4b4b4b] leading-relaxed">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* КАРТОЧКА 1: Определение выигрыша */}
        <div className="bg-white rounded-3xl lg:rounded-4xl p-6 lg:p-8 shadow-sm border border-gray-100">
          <h3 className="font-bold text-[14px] lg:text-[16px] mb-3">
            Определение выигрыша:
          </h3>
          <Description className="lg:max-w-none">
            Победитель определяется в ходе трансляции тиража. Выигрышная
            комбинация{" "}
            {hasGameParams && (
              <>
                из {pickCount}
                {pickCountWord ? ` (${pickCountWord})` : ""} чисел в диапазоне
                от 1 до {maxNumber}{" "}
              </>
            )}
            определяется случайным образом с использованием лототрона. Билет
            считается выигрышным, если указанные в нем числа (в соответствии с
            выбранными игровыми комбинациями) совпадают с выпавшими номерами в
            ходе розыгрыша по следующим категориям:
          </Description>
        </div>

        {/* КАРТОЧКА 2: Категории выигрышей.
            Раньше здесь была таблица «Категория / Совпадение / Приз» с
            захардкоженными суммами, из-за чего на проде висели неверные цифры
            (10 000 вместо 20 000, 500 вместо 1 000), а на 5/42 — вообще чужие.
            Бэк отдаёт категорию одной строкой свободного формата, причём разной
            у разных лотерей, поэтому выводим её как есть: разбирать текст на
            колонки — значит снова рисковать неверными суммами. Вернём таблицу,
            когда бэк начнёт отдавать категории структурно. */}
        {sortedTiers.length > 0 && (
          <div className="bg-white rounded-3xl lg:rounded-4xl p-6 lg:p-8 shadow-sm border border-gray-100">
            <h3 className="font-bold text-[14px] lg:text-[16px] mb-4">
              Категории выигрышей:
            </h3>
            <ul className="flex flex-col gap-3 lg:gap-4">
              {sortedTiers.map((tier) => (
                <li
                  key={tier.id}
                  className={cn(
                    "flex items-start gap-3 text-[14px] lg:text-[20px] font-bold leading-snug",
                    isJackpotTier(tier) ? "text-[#F58220]" : "text-[#4B4B4B]",
                  )}
                >
                  <span
                    className={cn(
                      "mt-2 lg:mt-2.5 w-2 h-2 rounded-full shrink-0",
                      isJackpotTier(tier) ? "bg-[#F58220]" : "bg-[#F6C635]",
                    )}
                  />
                  <span>{tier.amount}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* КАРТОЧКА 3: Дополнительные правила */}
        <div className="bg-white rounded-3xl lg:rounded-4xl p-6 lg:p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
          <Description className="lg:max-w-none">
            Если в 1-й категории отсутствуют победители, сумма джекпота
            переносится на следующий тираж.
          </Description>
          <div>
            <h3 className="font-bold text-[14px] lg:text-[16px] mb-2">
              Правила округления выигрышей:
            </h3>
            <Description className="lg:max-w-none">
              В меньшую сторону до целых 100 сом. Расчет выигрышей
              осуществляется автоматически системой без вмешательства человека.
            </Description>
          </div>
          <div>
            <h3 className="font-bold text-[14px] lg:text-[16px] mb-2">
              Порядок получения выигрыша:
            </h3>
            <Description className="lg:max-w-none">
              Свяжитесь с нами в течение 3 (трех) месяцев с даты тиража по
              указанным телефонам. Для получения приза Участнику необходимо в
              головном офисе Оператора, предоставить оригинал билета, а также
              оригинал и копию паспорта.
            </Description>
          </div>
        </div>
      </div>
    </section>
  );
};
