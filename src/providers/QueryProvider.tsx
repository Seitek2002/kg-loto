'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Создаем клиент один раз при инициализации
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Данные считаются "свежими" 1 минуту (не будет повторных запросов при переключении вкладок)
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false, // Отключаем повторный запрос при фокусе окна (опционально)
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools будут видны только в режиме разработки */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
