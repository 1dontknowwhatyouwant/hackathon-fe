export type MapPosition = {
  x: number;
  y: number;
};

export type PlaceRecommendation = {
  id: string;
  name: string;
  description: string;
  category: string;
  area: string;
  mapPosition: MapPosition;
};
