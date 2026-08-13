import type { Metadata } from "next";

import { AuthStoreHydrator } from "@/components/providers/AuthStoreHydrator";
import { DevelopmentCacheReset } from "@/components/providers/DevelopmentCacheReset";

import "./globals.css";

export const metadata: Metadata = {
  title: "입을래? | Place Match",
  description: "오늘의 룩과 어울리는 장소 추천",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <DevelopmentCacheReset />
        <AuthStoreHydrator />
        {children}
      </body>
    </html>
  );
}
