import type { Metadata } from "next";
import { Noto_Sans_KR, Nanum_Gothic } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SessionProvider } from "@/components/SessionProvider";

const notoSansKR = Noto_Sans_KR({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: false,
});

const nanumGothic = Nanum_Gothic({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-footer",
  display: "swap",
});

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://원툴러.kr").replace(
  /\/$/,
  ""
);

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "이터널식스",
  legalName: "이터널식스",
  url: SITE_URL,
  address: {
    "@type": "PostalAddress",
    streetAddress: "삼성로 186 4층",
    addressLocality: "수원시 영통구",
    addressRegion: "경기도",
    addressCountry: "KR",
  },
};

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "원툴러",
  alternateName: "ONETOOLER",
  applicationCategory: "BusinessApplication",
  url: SITE_URL,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
    description: "무료 진단 제공",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "원툴러 | 사장님을 위한 단 하나의 예약·고객 관리 자동화 툴",
    template: "%s | 원툴러",
  },
  description:
    "카톡, 전화, 예약앱, 엑셀을 하나로. 예약 확정부터 노쇼 방지 리마인드, CRM 자동 정리까지 원툴러로 매장 운영을 100% 자동화하세요.",
  keywords: [
    "예약관리프로그램",
    "고객관리프로그램",
    "CRM",
    "노쇼방지",
    "카톡예약자동화",
    "원툴러",
  ],
  alternates: { canonical: SITE_URL },
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION }
      : {}),
    /** 네이버 서치어드바이저 — Metadata API로 출력(수동 head만으로는 누락될 수 있음) */
    other: {
      "naver-site-verification": "8a16afbe7fa4a4754a3d8b95a130d7cdf4cd811a",
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: "원툴러",
    title: "엑셀·카톡 따로 쓰지 마세요. 매장 운영은 원툴러 하나면 끝.",
    description:
      "카톡, 전화, 예약앱, 엑셀을 하나로. 예약 확정부터 노쇼 방지 리마인드, CRM 자동 정리까지.",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "원툴러" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "원툴러 | 예약·고객 관리 자동화",
    description:
      "카톡, 전화, 예약앱, 엑셀을 하나로. 예약·CRM 자동화.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareApplicationJsonLd),
          }}
        />
        </head>
      <body className={`antialiased ${notoSansKR.variable} ${nanumGothic.variable} font-sans`}>
        <SessionProvider>
        <Header />
        <main className="min-h-[50vh] w-full px-3 pb-6 sm:px-4 md:pb-10">{children}</main>
        <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
