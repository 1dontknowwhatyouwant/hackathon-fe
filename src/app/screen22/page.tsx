import { AnalysisProgressScreen } from "@/components/analysis/AnalysisProgressScreen";
import { RecommendationAnalysisProgressScreen } from "@/components/analysis/RecommendationAnalysisProgressScreen";

type Screen22PageProps = {
  searchParams: Promise<{ source?: string }>;
};

export default async function Screen22Page({ searchParams }: Screen22PageProps) {
  const { source } = await searchParams;

  if (source === "recommendation") {
    return <RecommendationAnalysisProgressScreen />;
  }

  return <AnalysisProgressScreen />;
}
