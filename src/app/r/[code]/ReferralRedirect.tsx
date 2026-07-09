"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const REFERRAL_CODE_KEY = "referral_code";
const CODE_PATTERN = /^[-a-zA-Z0-9_]{1,64}$/;

interface ReferralRedirectProps {
  code: string;
}

export function ReferralRedirect({ code }: ReferralRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    if (CODE_PATTERN.test(code)) {
      localStorage.setItem(REFERRAL_CODE_KEY, code);
    }
    router.replace("/");
  }, [code, router]);

  return null;
}
