import { WithdrawDetailsClient } from "@/features/scan-actions/ui/WithdrawDetailsClient";

import { PageHeader } from "@/shared/ui/PageHeader";

export default async function WithdrawDetailsPage({
  params,
}: {
  params: Promise<{ bankId: string }>;
}) {
  const { bankId } = await params; // В Next 15 params - это Promise
  const bankName = bankId.charAt(0).toUpperCase() + bankId.slice(1);

  return (
    <div className="min-h-screen bg-[#F9F9F9] px-4 pt-2 pb-10">
      <PageHeader title={bankName} />
      <WithdrawDetailsClient bankId={bankId} />
    </div>
  );
}
