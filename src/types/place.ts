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
  summary: string | null;
  businessHours: string | null;
  address: string;
  walkingMinutes: number | null;
  thumbnailColor: string;
};
