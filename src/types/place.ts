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
