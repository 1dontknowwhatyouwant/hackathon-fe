"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BackButton } from "@/components/common/navigation/BackButton";
import { getApiErrorCode, getApiErrorMessage } from "@/lib/apiError";
import { useMenuDataStore } from "@/store/useMenuDataStore";
import type { ClosetItem } from "@/types/menu";
import type { ItemCategory } from "@/types/api";

type ItemEditScreenProps = {
  itemId: string;
};

type EditDraft = {
  name: string;
  brandName: string;
  category: ItemCategory;
  purchaseDate: string;
  memo: string;
};

const categoryOptions: Array<{ value: ItemCategory; label: string }> = [
  { value: "BAG", label: "가방" },
  { value: "LEATHER_GOODS", label: "가죽 소품" },
  { value: "FASHION_ACCESSORY", label: "패션 액세서리" },
  { value: "CLOTHING", label: "의류" },
  { value: "SHOES", label: "신발" },
];

const emptyDraft: EditDraft = {
  name: "",
  brandName: "",
  category: "BAG",
  purchaseDate: "",
  memo: "",
};

const fieldShellClassName =
  "flex h-14 items-center rounded-[12px] border border-[#dbdee3] bg-white px-4 text-[13px] leading-4 transition-colors focus-within:border-[#8b7355]";

const fieldControlClassName =
  "min-w-0 flex-1 bg-transparent text-[13px] text-[#15151a] outline-none placeholder:text-[#aaaab1]";

function findCategory(item: ClosetItem): ItemCategory {
  return (
    categoryOptions.find(
      (option) => option.value === item.category || option.label === item.category,
    )?.value ?? "BAG"
  );
}

function toDraft(item: ClosetItem): EditDraft {
  return {
    name: item.name,
    brandName: item.brandName ?? "",
    category: findCategory(item),
    purchaseDate: item.purchaseDate ?? "",
    memo: item.memo ?? "",
  };
}

export function ItemEditScreen({ itemId }: ItemEditScreenProps) {
  const router = useRouter();
  const loadItem = useMenuDataStore((state) => state.loadItem);
  const updateItem = useMenuDataStore((state) => state.updateItem);
  const [draft, setDraft] = useState<EditDraft>(emptyDraft);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    void loadItem(itemId).then((item) => {
      if (!isActive) {
        return;
      }

      if (item) {
        setDraft(toDraft(item));
      } else {
        setErrorMessage("수정할 아이템을 찾을 수 없습니다.");
      }
      setHasLoaded(true);
    });

    return () => {
      isActive = false;
    };
  }, [itemId, loadItem]);

  const updateDraft = (patch: Partial<EditDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSaving || !draft.name.trim()) {
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      await updateItem(itemId, {
        name: draft.name.trim(),
        brandName: draft.brandName.trim() || null,
        category: draft.category,
        purchaseDate: draft.purchaseDate || null,
        memo: draft.memo.trim() || null,
      });
      router.replace(`/items/${encodeURIComponent(itemId)}?updated=1`);
      router.refresh();
    } catch (error) {
      const errorCode = getApiErrorCode(error);
      const isVersionConflict =
        errorCode?.includes("VERSION") || errorCode?.includes("CONFLICT");
      setErrorMessage(
        isVersionConflict
          ? "다른 곳에서 제품 정보가 먼저 수정됐어요. 이전 화면에서 최신 정보를 다시 불러와 주세요."
          : getApiErrorMessage(error, "변경사항을 저장하지 못했습니다."),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MobileScreenLayout
      figmaNodeId="390:337"
      contentClassName="bg-white px-6 pt-4 pb-[88px] text-[#121217]"
    >
      <form className="flex min-h-full flex-col" onSubmit={handleSubmit}>
        <LuxuryReveal>
          <div className="flex items-center gap-2">
            <BackButton variant="plain" />
            <h1 className="text-[17px] leading-5 font-bold tracking-[-0.02em]">
              제품 정보 수정
            </h1>
          </div>
        </LuxuryReveal>

        {!hasLoaded ? (
          <div className="mt-[60px] space-y-3" aria-label="제품 정보 불러오는 중">
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="h-14 animate-pulse rounded-[12px] bg-[#efede9]"
              />
            ))}
          </div>
        ) : (
          <LuxuryReveal className="mt-[60px] space-y-3" delay={60}>
            <label className={fieldShellClassName}>
              <span className="mr-1 shrink-0 text-[#85858f]">제품명 ·</span>
              <input
                required
                maxLength={50}
                value={draft.name}
                className={fieldControlClassName}
                placeholder="제품명을 입력해 주세요"
                onChange={(event) => updateDraft({ name: event.target.value })}
              />
            </label>

            <label className={fieldShellClassName}>
              <span className="mr-1 shrink-0 text-[#85858f]">브랜드 ·</span>
              <input
                maxLength={50}
                value={draft.brandName}
                className={fieldControlClassName}
                placeholder="브랜드를 입력해 주세요"
                onChange={(event) =>
                  updateDraft({ brandName: event.target.value })
                }
              />
            </label>

            <label className={fieldShellClassName}>
              <span className="mr-1 shrink-0 text-[#85858f]">카테고리 ·</span>
              <select
                value={draft.category}
                className={fieldControlClassName}
                onChange={(event) =>
                  updateDraft({ category: event.target.value as ItemCategory })
                }
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className={fieldShellClassName}>
              <span className="mr-1 shrink-0 text-[#85858f]">구매일 ·</span>
              <input
                type="date"
                value={draft.purchaseDate}
                className={fieldControlClassName}
                onChange={(event) =>
                  updateDraft({ purchaseDate: event.target.value })
                }
              />
            </label>

            <label className={fieldShellClassName}>
              <span className="mr-1 shrink-0 text-[#85858f]">메모 ·</span>
              <input
                maxLength={200}
                value={draft.memo}
                className={fieldControlClassName}
                placeholder="제품에 대해 기억할 내용을 적어 주세요"
                onChange={(event) => updateDraft({ memo: event.target.value })}
              />
            </label>
          </LuxuryReveal>
        )}

        {errorMessage ? (
          <p
            role="alert"
            className="mt-5 rounded-[14px] bg-[#f8eeee] px-4 py-3 text-[11px] leading-[17px] text-[#9a4545]"
          >
            {errorMessage}
          </p>
        ) : null}

        <LuxuryReveal className="mt-auto pt-8" delay={140}>
          <button
            type="submit"
            disabled={!hasLoaded || isSaving || !draft.name.trim()}
            className="flex h-[52px] w-full items-center justify-center rounded-[14px] bg-[#15151a] text-[14px] font-bold text-white transition-colors hover:bg-[#2a2a30] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {isSaving ? "변경사항 저장 중" : "변경사항 저장"}
          </button>
        </LuxuryReveal>
      </form>
    </MobileScreenLayout>
  );
}
