import { Hero } from "@/components/marketing/hero";
import { ProblemStrip } from "@/components/marketing/problem-strip";
import { StatMarquee } from "@/components/marketing/stat-marquee";
import { SpatialDeck } from "@/components/marketing/spatial-deck";
import { Manifesto } from "@/components/marketing/manifesto";
import { SolutionTriad } from "@/components/marketing/solution-triad";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { AIScoreTeaser } from "@/components/marketing/ai-score-teaser";
import { BPRMap } from "@/components/marketing/bpr-map";
import { ComparisonTable } from "@/components/marketing/comparison-table";
import { ProjectionChart } from "@/components/marketing/projection-chart";
import { FinalCTA } from "@/components/marketing/final-cta";
import { CursorSpotlight } from "@/components/marketing/cursor-spotlight";
import { ScrollProgress } from "@/components/marketing/scroll-progress";

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <CursorSpotlight />
      <Hero />
      <StatMarquee />
      <SpatialDeck />
      <Manifesto />
      <ProblemStrip />
      <SolutionTriad />
      <HowItWorks />
      <AIScoreTeaser />
      <BPRMap />
      <ComparisonTable />
      <ProjectionChart />
      <FinalCTA />
    </>
  );
}
