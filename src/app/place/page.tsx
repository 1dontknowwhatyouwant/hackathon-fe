import { PlaceResultScreen } from "@/components/place/PlaceResultScreen";
import {
  placeRecommendations,
  placeResultKeywords,
} from "@/data/placeRecommendations";

type PlacePageProps = {
  searchParams: Promise<{
    stylePlanId?: string;
    latitude?: string;
    longitude?: string;
  }>;
};

function parseCoordinate(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const coordinate = Number(value);
  return Number.isFinite(coordinate) ? coordinate : undefined;
}

export default async function PlacePage({ searchParams }: PlacePageProps) {
  const query = await searchParams;

  return (
    <PlaceResultScreen
      keywords={placeResultKeywords}
      places={placeRecommendations}
      stylePlanId={query.stylePlanId}
      latitude={parseCoordinate(query.latitude)}
      longitude={parseCoordinate(query.longitude)}
    />
  );
}
