export type MapCoordinates = {
  latitude: number;
  longitude: number;
};

export type PlaceRecommendation = {
  id: string;
  name: string;
  description: string;
  category: string;
  area: string;
  coordinates: MapCoordinates;
};

export type PlaceDetail = PlaceRecommendation & {
  summary: string;
  businessHours: string;
  address: string;
  walkingMinutes: number | null;
  recommendationCount: number;
  thumbnailColor: string;
};

export type PlaceMatchedProduct = {
  id: string;
  name: string;
  matchScore: number;
  priceLabel: string;
  thumbnailColor: string;
};
