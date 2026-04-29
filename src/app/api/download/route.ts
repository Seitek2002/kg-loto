import { NextResponse } from "next/server";

export function GET(request: Request) {
  const userAgent = request.headers.get("user-agent") || "";

  const APP_STORE_LINK =
    "https://apps.apple.com/kg/app/kgloto-checker/id6757925326";
  const GOOGLE_PLAY_LINK =
    "https://play.google.com/store/apps/details?id=kg.loto.app";

  if (/android/i.test(userAgent)) {
    return NextResponse.redirect(GOOGLE_PLAY_LINK);
  }

  if (/ipad|iphone|ipod/i.test(userAgent)) {
    return NextResponse.redirect(APP_STORE_LINK);
  }

  // Если десктоп, кидаем на главную
  const url = new URL("/", request.url);
  return NextResponse.redirect(url);
}
