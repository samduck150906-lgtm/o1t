import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://owneronetool.com";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ETERNAL SIX",
  url: SITE_URL,
};

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "원툴러",
  applicationCategory: "BusinessApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
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
    default: "원툴러 | 자영업자 올인원 원툴 SaaS",
    template: "%s | 원툴러",
  },
  description:
    "사장님을 위한 단 하나의 운영툴. 예약·고객·일정을 하나로 통합하고, 카톡 복붙만으로 고객 명단을 자동 정리합니다. 엑셀·카톡·예약앱 따로 쓰지 마세요.",
  alternates: { canonical: SITE_URL },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ?? "",
    other: {
      "naver-site-verification": process.env.NEXT_PUBLIC_NAVER_VERIFICATION ?? "",
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: "원툴러",
    title: "원툴러 | 자영업자 올인원 원툴 SaaS",
    description:
      "사장님을 위한 단 하나의 운영툴. 예약·고객·일정을 하나로 통합하고, 카톡 복붙만으로 고객 명단을 자동 정리합니다.",
    images: [{ url: `${SITE_URL}/logo.png`, width: 1200, height: 630, alt: "원툴러" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "원툴러 | 자영업자 올인원 원툴 SaaS",
    description:
      "사장님을 위한 단 하나의 운영툴. 예약·고객·일정을 하나로 통합하고, 카톡 복붙만으로 고객 명단을 자동 정리합니다.",
    images: [`${SITE_URL}/logo.png`],
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
      <body className={`antialiased ${notoSansKR.variable} font-sans`}>
        <SessionProvider>
        <Header />
        <main className="min-h-[50vh] w-full px-3 pb-6 sm:px-4 md:pb-10">{children}</main>
        <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
