import { Hero } from "@/components/sections/Hero";
import { PainPoints } from "@/components/sections/PainPoints";
import { SolutionSteps } from "@/components/sections/SolutionSteps";
import { Features } from "@/components/sections/Features";
import { CTA } from "@/components/sections/CTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PainPoints />
      <SolutionSteps />
      <Features />
      <CTA />
    </>
  );
}
