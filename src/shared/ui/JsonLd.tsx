// Рендерит JSON-LD скрипт для структурированных данных schema.org.
// Server-компонент: разметка попадает в HTML сразу, без JS на клиенте.
export const JsonLd = ({ data }: { data: object }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);
