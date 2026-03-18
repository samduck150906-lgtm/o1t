import type { Metadata } from "next";
import { STATIC_SEO_MAP, getSiteUrl } from "@/lib/seo";
import { ToolCalculator } from "@/components/sections/ToolCalculator";
import { DashboardShowcase } from "@/components/sections/DashboardShowcase";
import { IndustryHook } from "@/components/sections/IndustryHook";
import { FounderStory } from "@/components/sections/FounderStory";
import { ActionCTA } from "@/components/sections/ActionCTA";
import { Hero } from "@/components/sections/Hero";
import { PainPoints } from "@/components/sections/PainPoints";
import { SolutionSteps } from "@/components/sections/SolutionSteps";
import { Features } from "@/components/sections/Features";
import { CTA } from "@/components/sections/CTA";

const home = STATIC_SEO_MAP[""];
const base = getSiteUrl();

export const metadata: Metadata = {
  title: home.title,
  description: home.description,
  keywords: home.keywords,
  alternates: { canonical: base },
  openGraph: {
    title: home.ogTitle ?? home.title,
    description: home.description,
    url: base,
  },
};

export default function HomePage() {
  return (
    <>
      <ToolCalculator />
      <DashboardShowcase />
      <IndustryHook />
      <FounderStory />
      <ActionCTA />
      <Hero />
      <PainPoints />
      <SolutionSteps />
      <Features />
      <CTA />
    </>
  );
}
