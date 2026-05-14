import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Раздел "Тиражные лотереи" временно скрыт. Оригинальный код ниже сохранён.
export default async function DrawTicketsDetailPage(_props: PageProps) {
  notFound();
}

// --- ОРИГИНАЛЬНЫЙ КОД (СКРЫТ) ---
// import Link from "next/link";
//
// import { DrawTicketManager } from "@/widgets/draw-ticket-manager";
//
// export default async function DrawTicketsDetailPage({ params }: PageProps) {
//   const { id } = await params;
//
//   return (
//     <div className="min-h-screen bg-[#F5F5F5] font-rubik pb-20">
//       <div className="max-w-360 mx-auto px-4 pt-6">
//         {" "}
//         {/* max-w-360 заменен на валидный класс Tailwind */}
//         <nav className="flex items-center gap-2 text-[12px] md:text-[14px] font-medium text-[#737373] mb-6">
//           {/* 🔥 Меняем <a> на <Link> */}
//           <Link href="/" className="hover:text-[#4B4B4B] transition-colors">
//             Главная
//           </Link>
//           <span>/</span>
//           <Link
//             href="/draw-tickets"
//             className="hover:text-[#4B4B4B] transition-colors"
//           >
//             Тиражные лотереи
//           </Link>
//           <span>/</span>
//           <span className="text-[#4B4B4B] font-bold">Детали лотереи</span>
//         </nav>
//         {/* Наш умный виджет, куда мы передаем полученный id */}
//         <DrawTicketManager lotteryId={id} />
//       </div>
//     </div>
//   );
// }
