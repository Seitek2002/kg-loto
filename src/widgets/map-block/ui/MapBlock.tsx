"use client";

import { useMemo, useState } from "react";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";

import { clsx } from "clsx";
import { ArrowLeft, Check, Copy, Loader2, Search, X } from "lucide-react";

import { Branch } from "@/entities/branch/model/types";

const MapComponent = dynamic(() => import("@/shared/ui/Map/LeafletMap"), {
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
      <Loader2 className="animate-spin" size={32} />
    </div>
  ),
  ssr: false,
});

interface MapBlockProps {
  branches: Branch[];
}

export const MapBlock = ({ branches }: MapBlockProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetBranchId = searchParams.get("branch");

  const [search, setSearch] = useState("");

  // 🔥 Стейт для отслеживания скопированного элемента
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredBranches = useMemo(() => {
    return branches.filter(
      (b) =>
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.address.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, branches]);

  const handleSelectBranch = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("branch", id);
    router.replace(`?${params.toString()}`);
  };

  // 🔥 Функция копирования с таймером
  const handleCopy = (e: React.MouseEvent, address: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopiedId(id);

    // Убираем галочку через 2 секунды
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="relative w-full h-[calc(100vh-120px)] min-h-125 lg:h-175 bg-gray-200 rounded-3xl lg:rounded-[40px] overflow-hidden shadow-sm">
      {/* --- КАРТА (На фоне) --- */}
      <div className="absolute inset-0 z-0">
        <MapComponent
          branches={branches}
          activeId={targetBranchId}
          onMarkerClick={handleSelectBranch}
        />
      </div>

      {/* --- ГРАДИЕНТНАЯ ПОДЛОЖКА ДЛЯ СПИСКА --- */}
      <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-linear-to-t from-[#F5F5F5] via-[#F5F5F5]/90 to-transparent pointer-events-none z-10 lg:hidden" />
      <div className="hidden lg:block absolute top-0 bottom-0 left-0 w-125 bg-linear-to-r from-[#F5F5F5] via-[#F5F5F5]/90 to-transparent pointer-events-none z-10" />

      {/* --- МОБИЛЬНАЯ ШАПКА (Стрелка назад и заголовок) --- */}
      <div className="lg:hidden absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <button
          onClick={() => router.back()}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md text-[#4B4B4B] active:scale-95 pointer-events-auto hover:bg-gray-50"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-2xl shadow-sm pointer-events-auto">
          <span className="text-[16px] font-black font-benzin uppercase text-[#4B4B4B]">
            Карта
          </span>
        </div>
      </div>

      {/* --- ПАНЕЛЬ СПИСКА И ПОИСКА --- */}
      <div className="absolute bottom-0 left-0 right-0 lg:top-0 lg:bottom-0 lg:right-auto lg:w-112.5 p-4 lg:p-8 flex flex-col gap-4 z-20 pointer-events-none">
        {/* Поиск */}
        <div className="mt-auto lg:mt-0 pointer-events-auto shadow-xl lg:shadow-none">
          <div className="relative">
            <input
              type="text"
              placeholder="Найти адрес..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-14 pl-6 pr-12 rounded-full bg-white text-sm font-bold text-[#4B4B4B] placeholder:text-gray-400 font-rubik outline-none border-2 border-transparent focus:border-[#FFD600] transition-colors shadow-sm"
            />
            {search ? (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 p-1 hover:text-[#4B4B4B]"
              >
                <X size={20} />
              </button>
            ) : (
              <Search
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
            )}
          </div>
        </div>

        {/* Список карточек */}
        <div className="flex flex-col gap-3 max-h-[35vh] lg:max-h-none lg:flex-1 overflow-y-auto pb-safe pointer-events-auto custom-scrollbar pr-2">
          {filteredBranches.length > 0 ? (
            filteredBranches.map((branch) => {
              const isActive = branch.id === targetBranchId;
              const isCopied = copiedId === branch.id; // Проверяем, скопирован ли этот элемент

              return (
                <div
                  key={branch.id}
                  onClick={() => handleSelectBranch(branch.id)}
                  className={clsx(
                    "bg-white p-5 rounded-3xl flex items-center justify-between shadow-sm border-2 transition-all cursor-pointer active:scale-[0.98]",
                    isActive
                      ? "border-[#4B4B4B]"
                      : "border-transparent hover:border-gray-200",
                  )}
                >
                  <div className="flex flex-col gap-1 pr-4">
                    <h3 className="text-[14px] font-black font-benzin uppercase text-[#4B4B4B] leading-tight">
                      {branch.name}
                    </h3>
                    <p className="text-[13px] text-[#737373] font-medium font-rubik">
                      {branch.address}
                    </p>
                  </div>

                  {/* 🔥 Обновленная кнопка копирования с анимацией */}
                  <button
                    onClick={(e) => handleCopy(e, branch.address, branch.id)}
                    className="relative w-12 h-12 shrink-0 rounded-full bg-gray-50 flex items-center justify-center transition-colors group hover:bg-[#FFD600]"
                  >
                    {isCopied ? (
                      <Check
                        size={20}
                        className="text-[#1FAF38] group-hover:text-white"
                      />
                    ) : (
                      <Copy
                        size={20}
                        className="text-gray-400 group-hover:text-white"
                      />
                    )}

                    {/* 🔥 Всплывающая подсказка (Tooltip) */}
                    <span
                      className={clsx(
                        "absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#4B4B4B] text-white text-[11px] font-bold rounded-lg pointer-events-none transition-all duration-200 shadow-md",
                        isCopied
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-1",
                      )}
                    >
                      Скопировано!
                      {/* Маленький треугольник (хвостик тултипа) */}
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#4B4B4B] rotate-45"></span>
                    </span>
                  </button>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-3xl p-6 text-center text-gray-400 font-medium text-sm">
              По вашему запросу ничего не найдено
            </div>
          )}
        </div>
      </div>

      {/* Стили для скроллбара на ПК */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
      `,
        }}
      />
    </div>
  );
};
