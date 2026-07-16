"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { clsx } from "clsx";
import { FileText } from "lucide-react";

import { ImageModal } from "@/shared/ui/ImageModal";

export interface ArticleCardProps {
  id?: number | string;
  title: string;
  description?: string;
  buttonText: string;
  imageSrc?: string | null;
  theme: "dark" | "light" | "blue";
  buttonAlign?: "center" | "left";
  descriptionPosition?: "top" | "bottom";
  href?: string;
}

export const ArticleCard = ({
  title,
  description,
  buttonText,
  imageSrc,
  theme,
  buttonAlign = "left",
  descriptionPosition = "bottom",
  href = "#",
}: ArticleCardProps) => {
  const [isImageOpen, setIsImageOpen] = useState(false);

  const isDarkText = theme === "dark";
  const titleColor = isDarkText ? "text-[#1F1F1F]" : "text-white";
  const descColor = isDarkText ? "text-[#4B4B4B]" : "text-white/90";

  const btnClass = isDarkText
    ? "bg-[#F0F0F0] text-black hover:bg-[#E5E5E5]"
    : "bg-white text-black hover:bg-white/90";

  const hasImage = imageSrc && imageSrc.length > 0;

  return (
    <div
      className={clsx(
        "relative w-full h-115 rounded-4xl overflow-hidden border border-gray-100/50 shadow-sm transition-transform hover:scale-[1.01] group",
        !hasImage && theme === "dark" && "bg-white",
        !hasImage && theme === "light" && "bg-[#4B4B4B]",
        !hasImage && theme === "blue" && "bg-[#6F51FF]",
      )}
    >
      {/* 1. ФОН (Картинка ИЛИ Плейсхолдер). Картинка кликабельна — открывает
          её в полном виде, без обрезки object-cover */}
      {hasImage ? (
        <button
          type="button"
          onClick={() => setIsImageOpen(true)}
          className="absolute inset-0 z-0 w-full h-full cursor-zoom-in"
          aria-label="Смотреть изображение полностью"
        >
          <Image
            src={imageSrc!}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {theme !== "dark" && <div className="absolute inset-0 bg-black/20" />}
        </button>
      ) : (
        <div
          className={clsx(
            "absolute inset-0 z-0 w-full h-full flex items-center justify-center",
            theme === "dark" && "bg-linear-to-br from-gray-50 to-gray-100",
            theme === "light" && "bg-linear-to-br from-[#4B4B4B] to-[#1F1F1F]",
            theme === "blue" && "bg-linear-to-br from-[#6F51FF] to-[#5842CC]",
          )}
        >
          <FileText
            size={80}
            strokeWidth={1}
            className={clsx(
              "opacity-20",
              theme === "dark" ? "text-black" : "text-white",
            )}
          />
        </div>
      )}

      {/* 2. КОНТЕНТ (ссылка на статью). pointer-events-none на самой ссылке
          и pointer-events-auto только на блоках с текстом/кнопкой — иначе
          она перекрыла бы всю картинку и клик по ней никогда бы не доходил
          до кнопки-картинки выше */}
      <Link
        href={href}
        className="absolute inset-0 z-10 p-8 flex flex-col justify-between pointer-events-none"
      >
        <div className="flex flex-col gap-4 pointer-events-auto">
          <h3
            className={clsx(
              "text-xl font-black font-benzin uppercase leading-tight",
              titleColor,
            )}
          >
            {title}
          </h3>

          {description && descriptionPosition === "top" && (
            <p
              className={clsx(
                "text-sm font-medium font-rubik leading-relaxed max-w-[90%]",
                descColor,
              )}
            >
              {description}
            </p>
          )}
        </div>

        <div
          className={clsx(
            "flex flex-col gap-6 pointer-events-auto",
            buttonAlign === "center" ? "items-center" : "items-start",
          )}
        >
          {description && descriptionPosition === "bottom" && (
            <p
              className={clsx(
                "text-sm font-medium font-rubik leading-relaxed",
                descColor,
              )}
            >
              {description}
            </p>
          )}

          {/* 🔥 ИМИТАЦИЯ КНОПКИ (Так как внешняя обертка уже является ссылкой <a>) */}
          {/* Обрати внимание на group-active:scale-95, она сжимается при клике на ЛЮБОЕ место карточки */}
          <div
            className={clsx(
              "px-8 py-4 rounded-full font-benzin font-bold text-xs uppercase tracking-wider shadow-lg transition-all group-active:scale-95 text-center",
              btnClass,
              "w-full sm:w-auto",
            )}
          >
            {buttonText}
          </div>
        </div>
      </Link>

      {hasImage && (
        <ImageModal
          isOpen={isImageOpen}
          onClose={() => setIsImageOpen(false)}
          src={imageSrc!}
          alt={title}
        />
      )}
    </div>
  );
};
