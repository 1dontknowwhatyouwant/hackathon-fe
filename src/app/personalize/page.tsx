import { Personalize } from "@/components/ai-smart-recommendations/Personalize";

type PersonalizePageProps = {
  searchParams: Promise<{ mode?: string }>;
};

export default async function PersonalizePage({
  searchParams,
}: PersonalizePageProps) {
  const { mode } = await searchParams;

  return <Personalize isEditMode={mode === "edit"} />;
}
