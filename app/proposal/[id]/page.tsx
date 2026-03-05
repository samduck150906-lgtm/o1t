import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import {
  MessageSquare,
  Sheet,
  ShieldAlert,
  Clock,
  TrendingDown,
  Sparkles,
} from "lucide-react";

// ========== proposal_copy (JSONB) 스키마 타입 ==========
export interface ProposalCopyHero {
  headline: string;
  sub_headline: string;
}

export interface ProposalCopyBeforeAfter {
  current_hours: number;
  saved_hours: number;
  pain_points: string[];
}

export interface ProposalCopySolution {
  title: string;
  description: string;
}

export interface ProposalCopyCta {
  message: string;
  button_text: string;
}

export interface ProposalCopy {
  hero: ProposalCopyHero;
  before_after: ProposalCopyBeforeAfter;
  solutions: ProposalCopySolution[];
  cta: ProposalCopyCta;
}

export interface ProposalRow {
  id: string;
  seller_id: string;
  store_name: string;
  category: string;
  proposal_copy: ProposalCopy;
  created_at: string;
}

// ========== 데이터 페칭 ==========
async function getProposal(id: string): Promise<ProposalRow | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("proposals")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as ProposalRow;
}

// ========== 메타데이터 ==========
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const proposal = await getProposal(id);
  if (!proposal) return { title: "제안서를 찾을 수 없습니다" };
  return {
    title: `${proposal.store_name} 맞춤 제안 | 원툴러`,
    description: proposal.proposal_copy?.hero?.sub_headline ?? "맞춤 자동화 제안서",
  };
}

// ========== 페이지 컴포넌트 ==========
export default async function ProposalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const proposal = await getProposal(id);

  if (!proposal) notFound();

  const copy = proposal.proposal_copy;
  const { hero, before_after, solutions, cta } = copy;
  const afterHours = Math.max(0, before_after.current_hours - before_after.saved_hours);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero: 어두운 톤, 스토어명 브랜드 컬러 하이라이트 */}
      <section className="relative overflow-hidden bg-navy px-4 py-16 text-white sm:py-20 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
            {hero.headline.split(proposal.store_name).map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className="text-primary">{proposal.store_name}</span>
                )}
              </span>
            ))}
          </h1>
          <p className="mt-4 text-lg text-gray-300 sm:text-xl">{hero.sub_headline}</p>
        </div>
      </section>

      {/* Before/After: 붉은색(Before) vs 푸른/녹색(After) 카드 */}
      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {/* Before 카드 — 붉은 톤 */}
          <div className="rounded-2xl border border-red-200 bg-red-50/80 p-6 shadow-sm dark:border-red-900/40 dark:bg-red-950/30">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <Clock className="h-5 w-5" aria-hidden />
              <span className="font-semibold">Before</span>
            </div>
            <p className="mt-3 text-2xl font-bold text-red-800 dark:text-red-300">
              주당 <span className="text-3xl">{before_after.current_hours}</span>시간
            </p>
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">업무에 쏟는 시간</p>
            <ul className="mt-4 space-y-2">
              {before_after.pain_points.map((point, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-red-800 dark:text-red-200"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* After 카드 — 푸른/녹색 톤 */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/30">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <TrendingDown className="h-5 w-5" aria-hidden />
              <span className="font-semibold">After</span>
            </div>
            <p className="mt-3 text-2xl font-bold text-emerald-800 dark:text-emerald-300">
              주당 <span className="text-3xl">{afterHours}</span>시간
            </p>
            <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">
              <span className="font-medium">{before_after.saved_hours}시간</span> 절감
            </p>
            <p className="mt-4 text-sm text-emerald-700 dark:text-emerald-300">
              원툴러로 반복 업무를 줄이고, 중요한 일에 집중하세요.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions: 3열 그리드, 아이콘 카드 */}
      <section className="bg-gray-50 px-4 py-12 dark:bg-gray-900/30 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-xl font-bold text-foreground sm:text-2xl">
            이런 솔루션으로 가능해요
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {solutions.slice(0, 3).map((sol, i) => {
              const Icon =
                i === 0 ? MessageSquare : i === 1 ? Sheet : ShieldAlert;
              return (
                <div
                  key={i}
                  className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{sol.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {sol.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA: 그라데이션 버튼 → /diagnosis?source=proposal&id={id} */}
      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl rounded-2xl bg-navy px-6 py-10 text-center text-white sm:px-8 sm:py-12">
          <Sparkles className="mx-auto h-10 w-10 text-primary" aria-hidden />
          <p className="mt-4 text-lg font-medium sm:text-xl">{cta.message}</p>
          <Link
            href={`/diagnosis?source=proposal&id=${id}`}
            className="mt-6 inline-flex min-h-touch items-center justify-center rounded-xl bg-primary px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-navy"
          >
            {cta.button_text}
          </Link>
        </div>
      </section>
    </div>
  );
}
