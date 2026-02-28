import { TicketDetailContent } from './TicketDetailContent'; // Убедись, что путь правильный
import { PopularTickets } from '@/widgets/PopularTickets';

export default function TicketPage({ params }: { params: { id: string } }) {
  return (
    <TicketDetailContent
      id={params.id}
      // 🔥 Передаем серверный компонент внутрь клиентского как пропс!
      popularTicketsNode={<PopularTickets />}
    />
  );
}
