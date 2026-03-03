import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProspect, trackProposalView } from "@/lib/supabase/proposal";
import ProposalContent from "./ProposalContent";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const prospect = await getProspect(params.id);
  return {
    title: prospect
      ? `${prospect.store_name} 맞춤 AI 자동화 제안서 | OWNER ONE-TOOL`
      : "AI 자동화 제안서 | OWNER ONE-TOOL",
    robots: "noindex, nofollow",
  };
}

export default async function ProposalPage({ params }: Props) {
  const prospect = await getProspect(params.id);
  if (!prospect) return notFound();

  await trackProposalView(prospect);

  return <ProposalContent prospect={prospect} />;
}
