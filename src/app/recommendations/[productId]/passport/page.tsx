import { notFound } from "next/navigation";

import { ProductPassportScreen } from "@/components/passport/ProductPassportScreen";
import {
  dummyRecommendedProducts,
  getDummyRecommendedProductById,
} from "@/data/productRecommendations";

type ProductPassportPageProps = {
  params: Promise<{ productId: string }>;
};

export function generateStaticParams() {
  return dummyRecommendedProducts.map((product) => ({
    productId: product.id,
  }));
}

export default async function ProductPassportPage({
  params,
}: ProductPassportPageProps) {
  const { productId } = await params;
  const product = getDummyRecommendedProductById(productId);

  if (!product) {
    notFound();
  }

  return <ProductPassportScreen product={product} />;
}
