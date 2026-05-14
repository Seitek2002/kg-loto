import { notFound } from "next/navigation";

// Раздел "Тиражные лотереи" временно скрыт. Оригинальный код ниже сохранён.
export default function DrawLotteryPage() {
  notFound();
}

// --- ОРИГИНАЛЬНЫЙ КОД (СКРЫТ) ---
// import Link from "next/link";
//
// import { DrawLotteryList } from "@/widgets/draw-lottery-list/ui/DrawLotteryList";
//
// export default function DrawLotteryPage() {
//   return (
//     <div className="min-h-screen bg-[#F5F5F5] font-rubik pb-32 md:pb-12 select-none">
//       <div className="max-w-261.25 mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-10">
//         {/* Хлебные крошки */}
//         <div className="flex items-center gap-2 text-[13px] md:text-base text-[#4B4B4B] font-medium mb-6 md:mb-8">
//           <Link href="/" className="hover:opacity-80 transition-opacity">
//             Главная
//           </Link>
//           <span className="text-gray-400">/</span>
//           <span className="font-bold text-[#2D2D2D]">Тиражные лотереи</span>
//         </div>
//
//         {/* Сетка лотерей */}
//         <DrawLotteryList />
//       </div>
//     </div>
//   );
// }
