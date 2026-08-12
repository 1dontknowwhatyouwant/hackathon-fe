import type {
  ProductCategoryFilter,
  RecommendedProduct,
} from "@/types/product";

export const dummyRecommendedProducts: readonly RecommendedProduct[] = [
  {
    id: "mcm-item-01",
    name: "MCM Item 1",
    category: "BAG",
    utilityScore: 82,
  },
  {
    id: "mcm-item-02",
    name: "MCM Item 2",
    category: "CLOTHING",
    utilityScore: 75,
  },
  {
    id: "mcm-item-03",
    name: "MCM Item 3",
    category: "BAG",
    utilityScore: 68,
  },
  {
    id: "mcm-item-04",
    name: "MCM Item 4",
    category: "CLOTHING",
    utilityScore: 61,
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
