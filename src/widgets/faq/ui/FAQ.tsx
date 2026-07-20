import { getTranslations } from "next-intl/server";

import { getFAQData } from "@/entities/faq/api/faqApi";
import { FAQAccordionItem } from "@/entities/faq/ui/FAQAccordionItem";

import { Description } from "@/shared/ui/Description";
import { Title } from "@/shared/ui/Title";

export const FAQ = async () => {
  const questions = await getFAQData();

  const t = await getTranslations("faq");

  if (!questions || questions.length === 0) return null;

  return (
    <section className="my-12" id="faq">
      <div className="mb-8">
        {/* t.rich, а не t: в заголовке из админки есть перенос строки, и
            i18n/request.ts приводит его к парному <br></br> для next-intl */}
        <Title>{t.rich("title", { br: () => <br /> })}</Title>
        <Description>{t("desc")}</Description>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {questions.map((item) => (
          <FAQAccordionItem
            key={item.id}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </div>
    </section>
  );
};
