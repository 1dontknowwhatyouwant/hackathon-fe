import { ProductPassportScreen } from "@/components/passport/ProductPassportScreen";

type ItemPassportPageProps = { params: Promise<{ itemId: string }> };

export default async function ItemPassportPage({ params }: ItemPassportPageProps) {
  const { itemId } = await params;
  return <ProductPassportScreen itemId={itemId} />;
}
