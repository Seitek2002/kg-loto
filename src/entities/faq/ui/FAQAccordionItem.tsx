"use client";

import { useState } from "react";

import { clsx } from "clsx";
import { Plus } from "lucide-react";

interface FAQAccordionItemProps {
  question: string;
  answer: string;
}

export const FAQAccordionItem = ({
  question,
  answer,
}: FAQAccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-3xl overflow-hidden transition-shadow hover:shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 px-6 md:px-8 flex items-center justify-between gap-4 text-left group cursor-pointer"
      >
        <span className="font-benzin font-bold text-xs md:text-sm text-[#4B4B4B] uppercase leading-tight">
          {question}
        </span>
        <span
          className={clsx(
            "transition-transform duration-300 ease-in-out shrink-0 text-gray-800",
            isOpen ? "rotate-45" : "rotate-0",
          )}
        >
          <Plus size={20} strokeWidth={2} />
        </span>
      </button>

      <div
        className={clsx(
          "grid transition-[grid-template-rows] duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          {answer && (
            <div
              className="pb-6 px-6 md:px-8 text-sm text-[#6E6E6E] font-rubik leading-relaxed max-w-[95%]"
              dangerouslySetInnerHTML={{ __html: answer }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
