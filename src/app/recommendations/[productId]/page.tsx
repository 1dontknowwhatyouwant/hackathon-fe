import { notFound } from "next/navigation";

import { ProductDetailScreen } from "@/components/products/ProductDetailScreen";
import {
  dummyRecommendedProducts,
  getDummyRecommendedProductById,
} from "@/data/productRecommendations";

type ProductDetailPageProps = {
  params: Promise<{ productId: string }>;
};

export function generateStaticParams() {
  return dummyRecommendedProducts.map((product) => ({
    productId: product.id,
  }));
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { productId } = await params;
  const product = getDummyRecommendedProductById(productId);

  if (!product) {
    notFound();
  }

  return <ProductDetailScreen product={product} />;
}
