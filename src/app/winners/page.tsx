import { Metadata } from "next";

import { WinnersList } from "@/widgets/winners-list";

export const metadata: Metadata = {
  title: "Зал славы | KGLOTO",
  description: "История победителей наших лотерей.",
};

export default function WinnersPage() {
  return <WinnersList />;
}
