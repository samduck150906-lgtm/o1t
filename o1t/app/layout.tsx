import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SessionProvider } from "@/components/SessionProvider";

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
  name: "OWNER ONE-TOOL",
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
    default: "OWNER ONE-TOOL | 자영업자 올인원 원툴 SaaS",
    template: "%s | OWNER ONE-TOOL",
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
    siteName: "OWNER ONE-TOOL",
    title: "OWNER ONE-TOOL | 자영업자 올인원 원툴 SaaS",
    description:
      "사장님을 위한 단 하나의 운영툴. 예약·고객·일정을 하나로 통합하고, 카톡 복붙만으로 고객 명단을 자동 정리합니다.",
    images: [{ url: `${SITE_URL}/logo.png`, width: 1200, height: 630, alt: "OWNER ONE-TOOL" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "OWNER ONE-TOOL | 자영업자 올인원 원툴 SaaS",
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
  const headersList = headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isProposalPage = pathname.startsWith("/proposal");

  return (
    <html lang="ko">
      <head>
        {!isProposalPage && (
          <>
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
          </>
        )}
      </head>
      <body className="antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k='owneronetool-senior-mode';if(localStorage.getItem(k)==='1')document.body.classList.add('senior-mode');}catch(e){}})();`,
          }}
        />
        {isProposalPage ? (
          <>{children}</>
        ) : (
          <SessionProvider>
            <Header />
            <main className="min-h-[50vh] w-full px-0 pb-0">{children}</main>
            <Footer />
          </SessionProvider>
        )}
      </body>
    </html>
  );
}
