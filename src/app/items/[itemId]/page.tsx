import { ItemDetailScreen } from "@/components/items/ItemDetailScreen";

type ItemDetailPageProps = {
  params: Promise<{ itemId: string }>;
};

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
  const { itemId } = await params;

  return <ItemDetailScreen itemId={itemId} />;
}
