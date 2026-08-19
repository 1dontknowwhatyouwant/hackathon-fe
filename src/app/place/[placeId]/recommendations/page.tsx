import { PlaceTailoredRecommendationsScreen } from "@/components/place/PlaceTailoredRecommendationsScreen";

type PlaceTailoredRecommendationsPageProps = {
  params: Promise<{ placeId: string }>;
};

export default async function PlaceTailoredRecommendationsPage({
  params,
}: PlaceTailoredRecommendationsPageProps) {
  const { placeId } = await params;
  return <PlaceTailoredRecommendationsScreen placeId={placeId} />;
}
