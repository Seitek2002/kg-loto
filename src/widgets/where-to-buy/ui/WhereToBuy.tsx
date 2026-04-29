import { getBranchesData } from "@/entities/branch/api/branchServerApi";

import { WhereToBuyClient } from "./WhereToBuyClient";

export const WhereToBuy = async ({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) => {
  // Получаем данные на сервере
  const branches = await getBranchesData();

  // Если точек нет, блок просто не отрендерится
  if (!branches || branches.length === 0) return null;

  return (
    <WhereToBuyClient
      branches={branches}
      title={title}
      description={description}
    />
  );
};
