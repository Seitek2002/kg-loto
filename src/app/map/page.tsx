import { Suspense } from "react";

import { Metadata } from "next";
import Link from "next/link";

import { Loader2 } from "lucide-react";

import { MapBlock } from "@/widgets/map-block/ui/MapBlock";

import { getBranchesData } from "@/entities/branch/api/branchServerApi";

import { Title } from "@/shared/ui/Title";

export const metadata: Metadata = {
  title: "Карта точек продаж | KGLOTO",
  description: "Найдите ближайшую точку продаж лотерей Кыргыз Лото",
};

export default async function MapPage() {
  const branches = await getBranchesData();

  return (
    <div className="min-h-screen bg-[#F9F9F9] font-rubik pb-20">
      <div className="max-w-350 mx-auto px-4 pt-6 lg:pt-10">
        <div className="hidden lg:block mb-8">
          <nav className="flex items-center gap-2 text-[14px] font-medium text-[#737373] mb-6">
            <Link href="/" className="hover:text-[#4B4B4B] transition-colors">
              Главная
            </Link>
            <span>/</span>
            <span className="text-[#4B4B4B] font-bold">
              Моментальные лотереи
            </span>
            <span>/</span>
            <span className="text-[#4B4B4B] font-bold">Карта</span>
          </nav>
          <Title>КАРТА</Title>
        </div>

        {/* Если данные загрузились, отдаем их в карту */}
        {branches && branches.length > 0 ? (
          <Suspense
            fallback={
              <div className="w-full h-175 bg-gray-200 rounded-[40px] flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-400" size={48} />
              </div>
            }
          >
            <MapBlock branches={branches} />
          </Suspense>
        ) : (
          <div className="w-full h-75 bg-white rounded-3xl flex items-center justify-center text-gray-500 font-medium">
            Точки продаж не найдены
          </div>
        )}
      </div>
    </div>
  );
}
