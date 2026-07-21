import Link from "next/link";

import { PaymentProcessingClient } from "@/features/payment/ui/PaymentProcessingClient";

export default function PaymentProcessingPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F9] font-rubik pb-20">
      <div className="max-w-250 mx-auto px-4 pt-6 md:pt-10">
        <nav className="flex items-center gap-2 text-[12px] md:text-[14px] font-medium text-[#737373] mb-6">
          <Link href="/" className="hover:text-[#4B4B4B] transition-colors">
            Главная
          </Link>
          <span>/</span>
          <Link
            href="/profile"
            className="hover:text-[#4B4B4B] transition-colors"
          >
            Мои билеты
          </Link>
        </nav>

        <PaymentProcessingClient />
      </div>
    </div>
  );
}
