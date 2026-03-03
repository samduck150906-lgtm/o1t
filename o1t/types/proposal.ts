export interface Prospect {
  id: string;
  store_name: string;
  store_url: string | null;
  category: string;
  owner_name: string | null;
  email: string;
  review_count: number;
  monthly_sales_tier: string;
  pain_keywords: string[] | null;
  status: string;
  proposal_visited_at: string | null;
  proposal_visit_count: number;
  created_at: string;
}

export interface AutomationScenario {
  pain: string;
  solution: string;
  timeSaved: number;
  monthlySaved: string;
  icon: string;
}
