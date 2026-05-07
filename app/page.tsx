import { Hero } from "@/components/marketing/hero";
import { ProblemStrip } from "@/components/marketing/problem-strip";
import { SolutionTriad } from "@/components/marketing/solution-triad";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { AIScoreTeaser } from "@/components/marketing/ai-score-teaser";
import { BPRMap } from "@/components/marketing/bpr-map";
import { ComparisonTable } from "@/components/marketing/comparison-table";
import { TestimonialCarousel } from "@/components/marketing/testimonial-carousel";
import { ProjectionChart } from "@/components/marketing/projection-chart";
import { FinalCTA } from "@/components/marketing/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProblemStrip />
      <SolutionTriad />
      <HowItWorks />
      <AIScoreTeaser />
      <BPRMap />
      <ComparisonTable />
      <TestimonialCarousel />
      <ProjectionChart />
      <FinalCTA />
    </>
  );
}
