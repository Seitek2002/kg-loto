"use client";

import { useMemo, useState } from "react";

import { Loader2, Plus } from "lucide-react";

import { CreateRequestModal } from "@/features/support-request-create/ui/CreateRequestModal";

import { useSupportRequests } from "@/entities/support-request/api/supportApi";
import { EmptySupport } from "@/entities/support-request/ui/EmptySupport";
import { SupportCard } from "@/entities/support-request/ui/SupportCard";
import { SupportTable } from "@/entities/support-request/ui/SupportTable";

import { Pagination } from "@/shared/ui/Pagination";
import { ProfileSubTabs } from "@/shared/ui/ProfileSubTabs";

const SUB_TABS = ["Все", "Открытые", "Закрытые"];
const OPEN_STATUSES = ["new", "in_progress", "waiting_client", "escalated"];
const CLOSED_STATUSES = ["resolved", "closed"];

export const SupportList = () => {
  const [activeSubTab, setActiveSubTab] = useState("Все");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Получаем данные
  const { data: requests = [], isLoading } = useSupportRequests();

  const filteredRequests = useMemo(() => {
    // В реальном проекте, если API отдает пустой массив, мы должны страховаться от undefined
    const safeRequests = Array.isArray(requests) ? requests : [];

    return safeRequests
      .filter((req: any) => {
        if (activeSubTab === "Открытые")
          return OPEN_STATUSES.includes(req.status);
        if (activeSubTab === "Закрытые")
          return CLOSED_STATUSES.includes(req.status);
        return true;
      })
      .map((req: any) => ({
        id: req.ticketNumber || String(req.id),
        date:
          req.createdAtDisplay || new Date(req.createdAt).toLocaleDateString(),
        message: req.description,
        reply: req.answer || "Дождитесь ответа",
        status: req.status,
      }));
  }, [activeSubTab, requests]);

  const hasRequests = filteredRequests.length > 0;

  const newRequestButton = (
    <button
      onClick={() => setIsModalOpen(true)}
      className="flex items-center gap-2 text-[12px] sm:text-sm font-bold text-[#FF7600] hover:opacity-80 transition-opacity whitespace-nowrap cursor-pointer"
    >
      <span className="hidden sm:inline">Новое обращение</span>
      <div className="w-6 h-6 sm:w-5 sm:h-5 rounded-full bg-[#FF7600] text-white flex items-center justify-center shrink-0">
        <Plus size={14} strokeWidth={3} />
      </div>
    </button>
  );

  return (
    <div className="bg-white rounded-3xl sm:rounded-[40px] shadow-sm p-4 sm:p-8 lg:p-10 min-h-100">
      <ProfileSubTabs
        tabs={SUB_TABS}
        activeTab={activeSubTab}
        onTabChange={setActiveSubTab}
        rightElement={newRequestButton}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64 text-[#FF7600]">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      ) : hasRequests ? (
        <>
          <div className="flex flex-col gap-4 lg:hidden">
            {filteredRequests.map((req) => (
              <SupportCard key={req.id} request={req} />
            ))}
          </div>
          <SupportTable requests={filteredRequests} />
          <Pagination />
        </>
      ) : (
        <EmptySupport />
      )}

      {/* Модалка вынесена отдельно и контролируется стейтом */}
      <CreateRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
