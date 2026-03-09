import { getTranslations } from 'next-intl/server';
import { WinnersListContent } from './WinnersListContent';

// 🔥 Серверная генерация заголовка
export async function generateMetadata() {
  const tSeo = await getTranslations('seo');
  const siteName =
    tSeo('site_name') === 'site_name' ? 'KGLOTO' : tSeo('site_name');

  return {
    title: `Победители | ${siteName}`,
  };
}

// 🔥 Серверная страница, которая просто рендерит твой клиентский компонент
export default function WinnersPage() {
  return <WinnersListContent />;
}
