import { NextResponse } from 'next/server';

export function GET(request: Request) {
  // Вытаскиваем информацию об устройстве пользователя
  const userAgent = request.headers.get('user-agent') || '';

  const APP_STORE_LINK =
    'https://apps.apple.com/kg/app/kgloto-checker/id6757925326';
  const GOOGLE_PLAY_LINK =
    'https://play.google.com/store/apps/details?id=kg.loto.app';

  // Если это Android
  if (/android/i.test(userAgent)) {
    return NextResponse.redirect(GOOGLE_PLAY_LINK);
  }

  // Если это iOS (iPhone, iPad, iPod)
  if (/ipad|iphone|ipod/i.test(userAgent)) {
    return NextResponse.redirect(APP_STORE_LINK);
  }

  // Если это десктоп или неизвестное устройство, кидаем просто на главную
  // (или можешь сделать отдельную страницу с двумя кнопками)
  return NextResponse.redirect('https://kgloto.com');
}
