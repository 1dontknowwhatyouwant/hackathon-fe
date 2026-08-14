import { notFound } from "next/navigation";

import { ItemDetailScreen } from "@/components/items/ItemDetailScreen";
import {
  dummyClosetItems,
  getDummyClosetItemById,
} from "@/data/menuPageDummies";

type ItemDetailPageProps = {
  params: Promise<{ itemId: string }>;
};

export function generateStaticParams() {
  return dummyClosetItems.map((item) => ({ itemId: item.id }));
}

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
  const { itemId } = await params;
  const item = getDummyClosetItemById(itemId);

  if (!item) {
    notFound();
  }

  return <ItemDetailScreen item={item} />;
}
