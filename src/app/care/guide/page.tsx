import { CareOverviewScreen } from "@/components/care/CareOverviewScreen";

export default async function CareGuidePage({ searchParams }: { searchParams: Promise<{ itemId?: string }> }) {
  const { itemId } = await searchParams;
  return <CareOverviewScreen itemId={itemId} />;
}
