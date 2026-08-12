export const productCategories = ["BAG", "CLOTHING"] as const;

export type ProductCategory = (typeof productCategories)[number];
export type ProductCategoryFilter = "ALL" | ProductCategory;

export type RecommendedProduct = {
  id: string;
  name: string;
  category: ProductCategory;
  utilityScore: number;
  imageUrl?: string;
};
