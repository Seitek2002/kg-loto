import { DrawTicketManager } from "@/widgets/draw-ticket-manager";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DrawTicketsDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-rubik pb-20">
      <div className="max-w-360 mx-auto px-4 pt-6">
        {/* ХЛЕБНЫЕ КРОШКИ */}
        <nav className="flex items-center gap-2 text-[12px] md:text-[14px] font-medium text-[#737373] mb-6">
          <a href="/" className="hover:text-[#4B4B4B] transition-colors">
            Главная
          </a>
          <span>/</span>
          <a
            href="/draw-tickets"
            className="hover:text-[#4B4B4B] transition-colors"
          >
            Тиражные лотереи
          </a>
          <span>/</span>
          <span className="text-[#4B4B4B] font-bold">Детали лотереи</span>
        </nav>

        {/* Наш умный виджет, куда мы передаем полученный id */}
        <DrawTicketManager lotteryId={id} />
      </div>
    </div>
  );
}
