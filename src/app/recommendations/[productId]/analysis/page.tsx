import { notFound } from "next/navigation";

import { RecommendationAnalysisProgressScreen } from "@/components/analysis/RecommendationAnalysisProgressScreen";
import {
  dummyRecommendedProducts,
  getDummyRecommendedProductById,
} from "@/data/productRecommendations";

type ProductAnalysisPageProps = {
  params: Promise<{ productId: string }>;
};

export function generateStaticParams() {
  return dummyRecommendedProducts.map((product) => ({
    productId: product.id,
  }));
}

export default async function ProductAnalysisPage({
  params,
}: ProductAnalysisPageProps) {
  const { productId } = await params;

  if (!getDummyRecommendedProductById(productId)) {
    notFound();
  }

  return <RecommendationAnalysisProgressScreen productId={productId} />;
}
