import { notFound } from "next/navigation";

import { ProductValueCheckScreen } from "@/components/products/ProductValueCheckScreen";
import {
  dummyRecommendedProducts,
  getDummyRecommendedProductById,
} from "@/data/productRecommendations";

type ProductValueCheckPageProps = {
  params: Promise<{ productId: string }>;
};

export function generateStaticParams() {
  return dummyRecommendedProducts.map((product) => ({
    productId: product.id,
  }));
}

export default async function ProductValueCheckPage({
  params,
}: ProductValueCheckPageProps) {
  const { productId } = await params;
  const product = getDummyRecommendedProductById(productId);

  if (!product) {
    notFound();
  }

  return <ProductValueCheckScreen product={product} />;
}
