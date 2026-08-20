import { CareScheduleScreen } from "@/components/care/CareScheduleScreen";

export default async function CareCalendarPage({ searchParams }: { searchParams: Promise<{ itemId?: string }> }) {
  const { itemId } = await searchParams;
  return <CareScheduleScreen itemId={itemId} />;
}
