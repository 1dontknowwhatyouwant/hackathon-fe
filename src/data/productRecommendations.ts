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
    utilityScore: 82,
    closetMatchScore: 92,
    expectedUseCount: 12,
    valueScore: 87,
    outfitCombinationCount: 9,
    resaleValueLabel: "높음",
    careDifficultyLabel: "보통",
    price: 950_000,
  },
  {
    id: "mcm-item-02",
    name: "MCM Item 2",
    brand: "MCM",
    modelName: "Lauretos Bomber",
    displayName: "Lauretos Bomber Jacket",
    category: "CLOTHING",
    utilityScore: 75,
    closetMatchScore: 86,
    expectedUseCount: 9,
    valueScore: 82,
    outfitCombinationCount: 7,
    resaleValueLabel: "높음",
    careDifficultyLabel: "쉬움",
    price: 1_190_000,
  },
  {
    id: "mcm-item-03",
    name: "MCM Item 3",
    brand: "MCM",
    modelName: "Stark Backpack",
    displayName: "Stark Backpack in Visetos",
    category: "BAG",
    utilityScore: 68,
    closetMatchScore: 84,
    expectedUseCount: 10,
    valueScore: 80,
    outfitCombinationCount: 8,
    resaleValueLabel: "높음",
    careDifficultyLabel: "보통",
    price: 1_250_000,
  },
  {
    id: "mcm-item-04",
    name: "MCM Item 4",
    brand: "MCM",
    modelName: "Logo Patch Denim",
    displayName: "Logo Patch Denim Jacket",
    category: "CLOTHING",
    utilityScore: 61,
    closetMatchScore: 78,
    expectedUseCount: 7,
    valueScore: 74,
    outfitCombinationCount: 6,
    resaleValueLabel: "보통",
    careDifficultyLabel: "보통",
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
