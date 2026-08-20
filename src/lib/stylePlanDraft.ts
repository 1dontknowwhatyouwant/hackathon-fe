import type { OccasionTag, StylePlanSliderContext } from "@/types/api";

export const personalizeTagsStorageKey = "personalize:selected-tags";
export const stylePlanContextStorageKey = "personalize:style-plan-context";
export const stylePlanIdempotencyStorageKey = "personalize:style-plan-idempotency";

function readOccasion(values: string[]): OccasionTag {
  const occasion = values[0] as OccasionTag | undefined;
  return occasion ?? "DAILY";
}

export function createStylePlanSliderContext(
  selectedTags: string[],
  casualFormalLevel: number,
  neatGlamorousLevel: number,
  prioritizeOwnedItems: boolean,
): StylePlanSliderContext {
  return {
    occasion: readOccasion(selectedTags),
    casualFormalLevel,
    neatGlamorousLevel,
    prioritizeOwnedItems,
    language: "ko",
  };
}

export function readStylePlanSliderContext(): StylePlanSliderContext | null {
  const serialized = window.localStorage.getItem(stylePlanContextStorageKey);
  if (!serialized) {
    return null;
  }

  try {
    const context = JSON.parse(serialized) as Partial<StylePlanSliderContext>;
    const validLevels = [
      context.casualFormalLevel,
      context.neatGlamorousLevel,
    ].every(
      (level) =>
        typeof level === "number" &&
        Number.isInteger(level) &&
        level >= 1 &&
        level <= 10,
    );

    if (
      !validLevels ||
      !context.occasion ||
      context.prioritizeOwnedItems === undefined ||
      context.language !== "ko"
    ) {
      return null;
    }

    return context as StylePlanSliderContext;
  } catch {
    return null;
  }
}
