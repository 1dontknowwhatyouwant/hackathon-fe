import { ItemEditScreen } from "@/components/items/ItemEditScreen";

type ItemEditPageProps = {
  params: Promise<{ itemId: string }>;
};

export default async function ItemEditPage({ params }: ItemEditPageProps) {
  const { itemId } = await params;

  return <ItemEditScreen itemId={itemId} />;
}
