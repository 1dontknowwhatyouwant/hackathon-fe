import type {
  CurrentSeasonTag,
  FeatureTag,
  ItemCategory,
  OccasionTag,
} from "@/types/api";

export const productCategories = ["BAG", "CLOTHING"] as const;

export type ProductCategory = (typeof productCategories)[number];
export type ProductCategoryFilter = "ALL" | ProductCategory;

export type RecommendedProduct = {
  id: string;
  name: string;
  brand: string;
  modelName: string;
  displayName: string;
  category: ItemCategory;
  recommendationScore: number;
  recommendationScoreBreakdown: {
    style: number;
    occasion: number;
    season: number;
    feature: number;
  };
  recommendationReason: string;
  utilityScore: number;
  closetMatchScore: number;
  expectedUseCount: number;
  valueScore: number;
  preferenceTagFitScore: number;
  styleCombinationScore: number;
  seasonUsabilityScore: number;
  ownedCategoryCombinationScore: number;
  price: number;
  imageUrl?: string;
};

export type RecommendationCriteria = {
  occasion: OccasionTag | "";
  season: CurrentSeasonTag | "";
  preferredFeatures: FeatureTag[];
};
