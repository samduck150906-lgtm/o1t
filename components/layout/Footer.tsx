import Link from "next/link";
import { landingKeywords } from "@/lib/seo-keywords";

const industryOrder = [
  "파티룸",
  "렌탈 스튜디오",
  "학원·교육",
  "뷰티·헤어샵",
  "무인매장",
  "카페·음식점",
  "네일·속눈썹",
  "피트니스·PT",
  "병원·의원",
  "숙박·펜션",
  "공유오피스",
  "반려동물",
  "세차·차량관리",
  "꽃집·플로리스트",
  "사진관·스튜디오",
  "세탁소·수선",
  "부동산",
  "키즈카페",
  "골프연습장",
  "필라테스·요가",
];

function getIndustryGroupedKeywords() {
  const map = new Map<string, typeof landingKeywords>();
  for (const kw of landingKeywords) {
    const list = map.get(kw.industry) ?? [];
    list.push(kw);
    map.set(kw.industry, list);
  }
  const result: { industry: string; keywords: typeof landingKeywords }[] = [];
  for (const industry of industryOrder) {
    const keywords = map.get(industry);
    if (keywords?.length) result.push({ industry, keywords });
  }
  const remaining = Array.from(map.entries()).filter(([ind]) => !industryOrder.includes(ind));
  for (const [industry, keywords] of remaining) result.push({ industry, keywords });
  return result;
}

const grouped = getIndustryGroupedKeywords();

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-auto" role="contentinfo" aria-label="사이트 하단 정보">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-base font-semibold uppercase tracking-wider text-foreground">서비스</h2>
            <ul className="mt-4 space-y-1 sm:space-y-2" role="list">
              <li>
                <Link href="/solution" className="min-touch inline-flex py-2 text-base text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                  솔루션 소개
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="min-touch inline-flex py-2 text-base text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                  가격
                </Link>
              </li>
              <li>
                <Link href="/o1t" className="min-touch inline-flex py-2 text-base text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                  제품 상세
                </Link>
              </li>
              <li>
                <Link href="/diagnosis" className="min-touch inline-flex py-2 text-base text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                  무료 진단
                </Link>
              </li>
              <li>
                <Link href="/faq" className="min-touch inline-flex py-2 text-base text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-base font-semibold uppercase tracking-wider text-foreground">고객지원</h2>
            <ul className="mt-4 space-y-1 sm:space-y-2" role="list">
              <li>
                <Link href="/faq" className="min-touch inline-flex py-2 text-base text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/diagnosis" className="min-touch inline-flex py-2 text-base text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                  도입 문의
                </Link>
              </li>
              <li>
                <Link href="/terms" className="min-touch inline-flex py-2 text-base text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="min-touch inline-flex py-2 text-base text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                  개인정보 처리방침
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h2 className="text-base font-semibold uppercase tracking-wider text-foreground">업종별 솔루션</h2>
            <p className="mt-1 text-base text-gray-700">업종별 맞춤 랜딩에서 자세한 내용을 확인하세요.</p>
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-5 max-h-72 sm:max-h-80 overflow-y-auto overscroll-behavior-contain">
              {grouped.map(({ industry, keywords }) => (
                <div key={industry}>
                  <h3 className="text-sm font-medium text-foreground">{industry}</h3>
                  <ul className="mt-1 space-y-0.5" role="list">
                    {keywords.map((kw) => (
                      <li key={kw.slug}>
                        <Link
                          href={`/landing/${kw.slug}`}
                          className="min-touch inline-block py-0.5 text-sm text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                          aria-label={`${kw.title} - ${industry}`}
                        >
                          {kw.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 sm:pt-8 md:flex-row">
          <p className="text-center md:text-left text-base text-gray-600">
            © {new Date().getFullYear()} ETERNAL SIX. OWNER ONE-TOOL. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link href="/terms" className="min-touch inline-flex py-2 text-base text-gray-600 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded" aria-label="이용약관">
              이용약관
            </Link>
            <Link href="/privacy" className="min-touch inline-flex py-2 text-base text-gray-600 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded" aria-label="개인정보 처리방침">
              개인정보 처리방침
            </Link>
            <Link href="/solution" className="min-touch inline-flex py-2 text-base text-gray-600 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded" aria-label="솔루션">
              솔루션
            </Link>
            <Link href="/pricing" className="min-touch inline-flex py-2 text-base text-gray-600 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded" aria-label="가격">
              가격
            </Link>
            <Link href="/faq" className="min-touch inline-flex py-2 text-base text-gray-600 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded" aria-label="FAQ">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
