import { createClient } from "@/lib/supabase/server";
import { Prospect } from "@/types/proposal";

export async function getProspect(id: string): Promise<Prospect | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prospects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Prospect;
}

export async function trackProposalView(prospect: Prospect): Promise<void> {
  const supabase = createClient();

  try {
    await supabase.from("proposal_views").insert({
      prospect_id: prospect.id,
    });
  } catch {
    // proposal_views 테이블이 없어도 에러 무시
  }

  await supabase
    .from("prospects")
    .update({
      proposal_visited_at: new Date().toISOString(),
      proposal_visit_count: (prospect.proposal_visit_count || 0) + 1,
      status:
        prospect.status === "email_sent" ? "visited" : prospect.status,
    })
    .eq("id", prospect.id);
}
