import Link from "next/link";
import { INDUSTRIES, landingKeywords, type SeoKeyword } from "@/lib/seo-keywords";

const industryOrder = INDUSTRIES.map((i) => i.name);

function getIndustryGroupedKeywords(): { industry: string; keywords: SeoKeyword[] }[] {
  const map = new Map<string, SeoKeyword[]>();
  for (const kw of landingKeywords) {
    const list = map.get(kw.industry) ?? [];
    list.push(kw);
    map.set(kw.industry, list);
  }
  const result: { industry: string; keywords: SeoKeyword[] }[] = [];
  for (const industry of industryOrder) {
    const keywords = map.get(industry);
    if (keywords?.length) result.push({ industry, keywords });
  }
  const remaining = Array.from(map.entries()).filter(([ind]) => !(industryOrder as string[]).includes(ind));
  for (const [industry, keywords] of remaining) result.push({ industry, keywords });
  return result;
}

const grouped = getIndustryGroupedKeywords();

export function Footer() {
  return (
    <footer className="border-t border-amber-100 bg-white mt-auto" role="contentinfo" aria-label="사이트 하단 정보">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-base font-semibold uppercase tracking-wider text-foreground">서비스</h2>
            <ul className="mt-4 space-y-1 sm:space-y-2" role="list">
              <li>
                <Link href="/solution" className="min-touch inline-flex py-2 text-base text-gray-700 hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded">
                  솔루션 소개
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="min-touch inline-flex py-2 text-base text-gray-700 hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded">
                  가격보기
                </Link>
              </li>
              <li>
                <Link href="/o1t" className="min-touch inline-flex py-2 text-base text-gray-700 hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded">
                  제품 소개
                </Link>
              </li>
              <li>
                <Link href="/diagnosis" className="min-touch inline-flex py-2 text-base text-gray-700 hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded">
                  무료 진단
                </Link>
              </li>
              <li>
                <Link href="/faq" className="min-touch inline-flex py-2 text-base text-gray-700 hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-base font-semibold uppercase tracking-wider text-foreground">고객지원</h2>
            <ul className="mt-4 space-y-1 sm:space-y-2" role="list">
              <li>
                <Link href="/faq" className="min-touch inline-flex py-2 text-base text-gray-700 hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/diagnosis" className="min-touch inline-flex py-2 text-base text-gray-700 hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded">
                  도입 문의
                </Link>
              </li>
              <li>
                <Link href="/terms" className="min-touch inline-flex py-2 text-base text-gray-700 hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="min-touch inline-flex py-2 text-base text-gray-700 hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded">
                  개인정보 처리방침
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h2 className="text-base font-semibold uppercase tracking-wider text-foreground">자동화 솔루션</h2>
            <p className="mt-1 text-base text-gray-700">업종별 자동화 도입 사례를 확인하세요.</p>
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-5 max-h-72 sm:max-h-80 overflow-y-auto overscroll-behavior-contain">
              {grouped.map(({ industry, keywords }) => (
                <div key={industry}>
                  <h3 className="text-sm font-medium text-foreground">{industry}</h3>
                  <ul className="mt-1 space-y-0.5" role="list">
                    {keywords.map((kw) => (
                      <li key={kw.slug}>
                        <Link
                          href={`/landing/${kw.locationId}/${kw.industryId}/${kw.painId}`}
                          className="min-touch inline-block py-0.5 text-sm text-gray-700 hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
                          aria-label={`${kw.keyword} - ${industry}`}
                        >
                          {kw.keyword}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 border-t border-gray-200 pt-6 sm:pt-8 space-y-6">
          <div className="rounded-lg bg-gray-50 px-4 py-4 text-sm text-gray-700">
            <h3 className="font-semibold text-foreground mb-2">사업자정보</h3>
            <ul className="space-y-1 break-keep" aria-label="사업자 정보">
              <li>상호: 에터널식스</li>
              <li>대표: 성아름</li>
              <li>사업자등록번호: 3032865658</li>
              <li>전화: 010-8111-9370</li>
              <li>주소: 경기도 화성시 봉담읍 186 4층</li>
            </ul>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center md:text-left text-base text-gray-600">
              © {new Date().getFullYear()} ETERNAL SIX. 원툴러. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <Link href="/terms" className="min-touch inline-flex py-2 text-base text-gray-600 hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded" aria-label="이용약관">
                이용약관
              </Link>
              <Link href="/privacy" className="min-touch inline-flex py-2 text-base text-gray-600 hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded" aria-label="개인정보 처리방침">
                개인정보 처리방침
              </Link>
              <Link href="/solution" className="min-touch inline-flex py-2 text-base text-gray-600 hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded" aria-label="솔루션">
                솔루션
              </Link>
              <Link href="/pricing" className="min-touch inline-flex py-2 text-base text-gray-600 hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded" aria-label="가격보기">
                가격보기
              </Link>
              <Link href="/faq" className="min-touch inline-flex py-2 text-base text-gray-600 hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded" aria-label="FAQ">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
