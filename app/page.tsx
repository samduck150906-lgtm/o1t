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

export default function HomePage() {
  return (
    <>
      {/* 새 섹션: 상단부터 순서대로 */}
      <ToolCalculator />
      <DashboardShowcase />
      <IndustryHook />
      <FounderStory />
      <ActionCTA />

      {/* 기존 섹션 유지 */}
      <Hero />
      <PainPoints />
      <SolutionSteps />
      <Features />
      <CTA />
    </>
  );
}
