import { Suspense } from "react";

import { ManualCheckClient } from "@/features/scan-actions/ui/ManualCheckClient";

import { PageHeader } from "@/shared/ui/PageHeader";

export default function ManualCheckPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F9] px-4 pt-2">
      <PageHeader title="ПРОВЕРКА БИЛЕТА" />
      <Suspense
        fallback={
          <div className="mt-10 text-center text-gray-400">
            Загрузка формы...
          </div>
        }
      >
        <ManualCheckClient />
      </Suspense>
    </div>
  );
}
