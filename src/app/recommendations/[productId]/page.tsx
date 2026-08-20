import { ProductDetailScreen } from "@/components/products/ProductDetailScreen";

type ProductDetailPageProps = {
  params: Promise<{ productId: string }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { productId } = await params;
  return <ProductDetailScreen productId={productId} />;
}
