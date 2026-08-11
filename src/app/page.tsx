import Cover from "@/pages/cover/Cover";

export default function Home() {
  return <Cover />;
import { PlaceResultScreen } from "@/components/place/PlaceResultScreen";
import {
  placeRecommendations,
  placeResultKeywords,
} from "@/data/placeRecommendations";

export default function Home() {
  return (
    <PlaceResultScreen
      keywords={placeResultKeywords}
      places={placeRecommendations}
    />
  );
}
