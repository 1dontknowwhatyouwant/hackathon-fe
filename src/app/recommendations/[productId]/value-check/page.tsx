import { ProductValueCheckScreen } from "@/components/products/ProductValueCheckScreen";

type ProductValueCheckPageProps = {
  params: Promise<{ productId: string }>;
};

export default async function ProductValueCheckPage({
  params,
}: ProductValueCheckPageProps) {
  const { productId } = await params;
  return <ProductValueCheckScreen productId={productId} />;
}
