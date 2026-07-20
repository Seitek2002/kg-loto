import api from "@/shared/api/apiClient";

export interface AboutCompanyData {
  id: number;
  title: string;
  shortText: string;
  content: string;
  image: string | null;
  createdAt: string;
}

export const getAboutCompanyData = async (
  locale: string = "ru",
): Promise<AboutCompanyData | null> => {
  try {
    const { data } = await api.get("/about-company/", {
      headers: { "Accept-Language": locale },
    });
    // Если бэкенд возвращает сразу объект, берем data.data
    // Если массив, берем data.data[0]
    return Array.isArray(data.data) ? data.data[0] : data.data;
  } catch (error) {
    console.error("About Company Error:", error);

    // Раньше здесь отдавался сочинённый текст (включая утверждение про
    // государственную лицензию) со стоковой картинкой с Unsplash. Показывать
    // выдуманные заявления от лица компании нельзя — при недоступности бэка
    // честнее не отрисовать блок вовсе.
    return null;
  }
};
