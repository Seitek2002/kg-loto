"use client";

import { useState } from "react";

import { clsx } from "clsx";
import { Loader2, Minus, Plus } from "lucide-react";

import { useFAQ } from "@/entities/faq/api/faqClientApi";

export const FaqSettings = () => {
  const [openId, setOpenId] = useState<number | null>(null);
  // Раньше здесь лежали три вопроса с ответами-заглушками
  // («Организатором лотереи является государственная компания...»),
  // хотя реальные вопросы уже ведутся в админке и отдаются на /qa/
  const { data: faqItems, isLoading } = useFAQ();

  if (isLoading) {
    return (
      <div className="flex justify-center py-10 text-[#FF7600]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!faqItems || faqItems.length === 0) {
    return (
      <p className="text-[14px] text-[#6E6E6E] py-6">
        Вопросы и ответы пока не добавлены.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-5 overflow-y-auto max-h-screen">
      {faqItems.map((item, index) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="bg-[#F9F9F9] rounded-[20px] overflow-hidden"
          >
            <button
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <span className="text-[20px] text-[#4B4B4B] pr-4">
                {index + 1}. {item.question}
              </span>
              {isOpen ? (
                <Minus size={20} className="text-[#4B4B4B] shrink-0" />
              ) : (
                <Plus size={20} className="text-[#4B4B4B] shrink-0" />
              )}
            </button>
            <div
              className={clsx(
                "grid transition-all duration-300 ease-in-out",
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-[13px] text-[#6E6E6E] leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
