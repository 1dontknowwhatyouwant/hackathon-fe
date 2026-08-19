import type {
  PlaceDetail,
  PlaceMatchedProduct,
  PlaceRecommendation,
} from "@/types/place";

export const placeResultKeywords = ["성수", "전시", "카페"];

export const placeRecommendations: PlaceRecommendation[] = [
  {
    id: "daelim-warehouse-gallery",
    name: "대림창고 갤러리",
    description: "성수의 산업적인 무드와 전시를 함께 즐겨요",
    category: "전시",
    area: "성수",
    coordinates: { latitude: 37.5415, longitude: 127.0563 },
  },
  {
    id: "yeonmujang-cafe",
    name: "성수 연무장길 카페",
    description: "룩의 분위기와 어울리는 카페에서 쉬어가요",
    category: "카페",
    area: "성수",
    coordinates: { latitude: 37.5434, longitude: 127.0548 },
  },
  {
    id: "seoul-forest-walk",
    name: "서울숲 산책",
    description: "여유로운 산책으로 오늘의 룩을 완성해요",
    category: "산책",
    area: "성수",
    coordinates: { latitude: 37.5444, longitude: 127.0374 },
  },
];

export const placeDetails: PlaceDetail[] = [
  {
    ...placeRecommendations[0],
    summary: "전시와 카페를 함께 즐길 수 있는 공간이에요.",
    businessHours: "11:00–22:00",
    address: "서울 성동구 성수이로 78",
    walkingMinutes: 8,
    recommendationCount: 3,
    thumbnailColor: "#e8e3d9",
  },
  {
    ...placeRecommendations[1],
    name: "연무장길 카페",
    summary: "성수의 분위기와 여유로운 커피를 함께 즐겨요.",
    businessHours: "10:00–22:00",
    address: "서울 성동구 연무장길 28",
    walkingMinutes: 10,
    recommendationCount: 4,
    thumbnailColor: "#e5e0d8",
  },
  {
    ...placeRecommendations[2],
    name: "서울숲",
    summary: "도심 속 산책과 자연스러운 룩을 즐기기 좋은 공간이에요.",
    businessHours: "24시간 개방",
    address: "서울 성동구 뚝섬로 273",
    walkingMinutes: 14,
    recommendationCount: 5,
    thumbnailColor: "#dfe5dc",
  },
];

export const placeMatchedProducts: PlaceMatchedProduct[] = [
  {
    id: "place-product-aren-shopper",
    name: "Aren Shopper",
    matchScore: 96,
    priceLabel: "예상가 450,000원",
    thumbnailColor: "#e8e3d9",
  },
  {
    id: "place-product-sunglasses",
    name: "MCM Sunglasses",
    matchScore: 91,
    priceLabel: "예상가 확인",
    thumbnailColor: "#e4dfd6",
  },
  {
    id: "place-product-jacket",
    name: "Other Brand Jacket",
    matchScore: 88,
    priceLabel: "예상가 198,000원",
    thumbnailColor: "#e7e2da",
  },
];
