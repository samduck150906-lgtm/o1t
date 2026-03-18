import { ImageResponse } from "next/og";
import { getLandingDataByParams } from "@/lib/seo-keywords";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://원툴러.kr").replace(
  /\/$/,
  ""
);

export const alt = "원툴러 랜딩 Open Graph 이미지";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
  params: Promise<{ location: string; industryType: string; painType: string }>;
};

export default async function OgImage({ params }: Props) {
  const { location, industryType, painType } = await params;
  const data = getLandingDataByParams(location, industryType, painType);
  if (!data) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            color: "#fff",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          원툴러
        </div>
      ),
      { ...size }
    );
  }

  const title = `${data.location} ${data.industry} ${data.title}`;
  const subtitle = `${data.location} ${data.industry} 사장님을 위한 예약 자동화`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
          padding: 60,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            maxWidth: 1000,
          }}
        >
          <div
            style={{
              fontSize: 28,
              color: "#94a3b8",
              marginBottom: 16,
              fontWeight: 600,
            }}
          >
            {subtitle}
          </div>
          <h1
            style={{
              fontSize: 48,
              fontWeight: 800,
              lineHeight: 1.2,
              margin: 0,
              background: "linear-gradient(90deg, #fff 0%, #e2e8f0 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {title}
          </h1>
          <div
            style={{
              marginTop: 32,
              fontSize: 24,
              color: "#cbd5e1",
            }}
          >
            ETERNAL SIX · 지금 무료 진단받기
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
