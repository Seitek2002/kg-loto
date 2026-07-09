import { ReferralRedirect } from "./ReferralRedirect";

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function ReferralPage({ params }: PageProps) {
  const { code } = await params;
  return <ReferralRedirect code={code} />;
}
