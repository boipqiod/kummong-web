import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "꾸몽 - AI 해몽 서비스",
  description: "조선의 지관이 풀어주는 전통 해몽. 오늘 밤 꿈의 의미를 알아보세요.",
  keywords: ["해몽", "꿈해몽", "AI해몽", "꿈풀이", "지관", "전통해몽"],
  openGraph: {
    title: "꾸몽 - AI 해몽 서비스",
    description: "조선의 지관이 풀어주는 전통 해몽",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#f7f5ef",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Noto+Serif+KR:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
