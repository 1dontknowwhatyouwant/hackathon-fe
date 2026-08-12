export const productCategories = ["BAG", "CLOTHING"] as const;

export type ProductCategory = (typeof productCategories)[number];
export type ProductCategoryFilter = "ALL" | ProductCategory;

export type RecommendedProduct = {
  id: string;
  name: string;
  brand: string;
  modelName: string;
  displayName: string;
  category: ProductCategory;
  utilityScore: number;
  closetMatchScore: number;
  expectedUseCount: number;
  price: number;
  imageUrl?: string;
};
