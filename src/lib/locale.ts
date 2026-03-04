// src/lib/locale.ts
import { cookies } from 'next/headers';

/**
 * Reads the NEXT_LOCALE cookie (server-side) and returns an object
 * ready to be spread into axios request headers.
 *
 * Usage:
 *   const { data } = await api.get('/lotteries/', {
 *     headers: await getLocaleHeader(),
 *   });
 */
export async function getLocaleHeader(): Promise<{ 'Accept-Language': string }> {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'ru';
  return { 'Accept-Language': locale };
}
