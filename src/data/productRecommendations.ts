import type {
  ProductCategoryFilter,
  RecommendedProduct,
} from "@/types/product";

export const dummyRecommendedProducts: readonly RecommendedProduct[] = [
  {
    id: "mcm-item-01",
    name: "MCM Item 1",
    brand: "MCM",
    modelName: "Aren Shopper",
    displayName: "Aren Shopper in Visetos",
    category: "BAG",
    recommendationScore: 90,
    recommendationScoreBreakdown: {
      style: 30,
      occasion: 25,
      season: 25,
      feature: 10,
    },
    recommendationReason:
      "선호 스타일과 현재 상황, 가을 시즌에 잘 맞는 제품입니다.",
    utilityScore: 82,
    closetMatchScore: 92,
    expectedUseCount: 12,
    valueScore: 87,
    preferenceTagFitScore: 27,
    styleCombinationScore: 22,
    seasonUsabilityScore: 22,
    ownedCategoryCombinationScore: 16,
    price: 950_000,
  },
  {
    id: "mcm-item-02",
    name: "MCM Item 2",
    brand: "MCM",
    modelName: "Lauretos Bomber",
    displayName: "Lauretos Bomber Jacket",
    category: "CLOTHING",
    recommendationScore: 85,
    recommendationScoreBreakdown: {
      style: 27,
      occasion: 23,
      season: 21,
      feature: 14,
    },
    recommendationReason:
      "선호하는 분위기와 데일리 활용에 어울리는 제품입니다.",
    utilityScore: 75,
    closetMatchScore: 86,
    expectedUseCount: 9,
    valueScore: 82,
    preferenceTagFitScore: 25,
    styleCombinationScore: 21,
    seasonUsabilityScore: 21,
    ownedCategoryCombinationScore: 15,
    price: 1_190_000,
  },
  {
    id: "mcm-item-03",
    name: "MCM Item 3",
    brand: "MCM",
    modelName: "Stark Backpack",
    displayName: "Stark Backpack in Visetos",
    category: "BAG",
    recommendationScore: 80,
    recommendationScoreBreakdown: {
      style: 24,
      occasion: 22,
      season: 19,
      feature: 15,
    },
    recommendationReason:
      "현재 상황과 선호 기능을 고르게 충족하는 제품입니다.",
    utilityScore: 68,
    closetMatchScore: 84,
    expectedUseCount: 10,
    valueScore: 80,
    preferenceTagFitScore: 24,
    styleCombinationScore: 20,
    seasonUsabilityScore: 20,
    ownedCategoryCombinationScore: 16,
    price: 1_250_000,
  },
  {
    id: "mcm-item-04",
    name: "MCM Item 4",
    brand: "MCM",
    modelName: "Logo Patch Denim",
    displayName: "Logo Patch Denim Jacket",
    category: "CLOTHING",
    recommendationScore: 74,
    recommendationScoreBreakdown: {
      style: 22,
      occasion: 19,
      season: 18,
      feature: 15,
    },
    recommendationReason:
      "선호 스타일과 계절 분위기를 자연스럽게 반영한 제품입니다.",
    utilityScore: 61,
    closetMatchScore: 78,
    expectedUseCount: 7,
    valueScore: 74,
    preferenceTagFitScore: 22,
    styleCombinationScore: 19,
    seasonUsabilityScore: 18,
    ownedCategoryCombinationScore: 15,
    price: 1_050_000,
  },
];

export function getDummyRecommendedProducts(
  category: ProductCategoryFilter,
): RecommendedProduct[] {
  if (category === "ALL") {
    return [...dummyRecommendedProducts];
  }

  return dummyRecommendedProducts.filter(
    (product) => product.category === category,
  );
}

export function getDummyRecommendedProductById(
  productId: string,
): RecommendedProduct | undefined {
  return dummyRecommendedProducts.find((product) => product.id === productId);
}
