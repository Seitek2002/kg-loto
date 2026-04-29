import { getFAQData } from "@/entities/faq/api/faqApi";
import { FAQAccordionItem } from "@/entities/faq/ui/FAQAccordionItem";

import { Description } from "@/shared/ui/Description";
import { Title } from "@/shared/ui/Title";

// import { getTranslations } from 'next-intl/server';

export const FAQ = async () => {
  const questions = await getFAQData();

  // Временная заглушка переводов (пока не настроишь next-intl)
  // const t = await getTranslations('faq');
  const t = (key: string) => {
    const dict: Record<string, string> = {
      title: "ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ",
      desc: "Мы собрали ответы на самые популярные вопросы, чтобы вам было проще разобраться в правилах и начать выигрывать.",
    };
    return dict[key] || key;
  };

  if (!questions || questions.length === 0) return null;

  return (
    <section className="my-12" id="faq">
      <div className="mb-8">
        {/* Заголовок с поддержкой <br />, как у тебя в коде */}
        <Title>{t("title")}</Title>
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
