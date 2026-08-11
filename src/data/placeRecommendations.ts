import type { PlaceRecommendation } from "@/types/place";

export const placeResultKeywords = ["성수", "전시", "카페"];

export const placeRecommendations: PlaceRecommendation[] = [
  {
    id: "daelim-warehouse-gallery",
    name: "대림창고 갤러리",
    description: "성수의 산업적인 무드와 전시를 함께 즐겨요",
    category: "전시",
    area: "성수",
    mapPosition: { x: 33, y: 34 },
  },
  {
    id: "yeonmujang-cafe",
    name: "성수 연무장길 카페",
    description: "룩의 분위기와 어울리는 카페에서 쉬어가요",
    category: "카페",
    area: "성수",
    mapPosition: { x: 69, y: 42 },
  },
  {
    id: "seoul-forest-walk",
    name: "서울숲 산책",
    description: "여유로운 산책으로 오늘의 룩을 완성해요",
    category: "산책",
    area: "성수",
    mapPosition: { x: 52, y: 72 },
  },
];
