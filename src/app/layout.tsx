import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Hackathon",
  description: "Hackathon frontend application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
