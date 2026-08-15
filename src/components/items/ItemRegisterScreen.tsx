"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BottomNavigation } from "@/components/common/navigation/BottomNavigation";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";
import { backendApi } from "@/services/api";
import { uploadItemImage } from "@/services/itemRegistrationWorkflow";
import { useItemRegistrationStore } from "@/store/useItemRegistrationStore";
import { useMenuDataStore } from "@/store/useMenuDataStore";
import type { ItemCategory } from "@/types/api";

const categories: ReadonlyArray<{ value: ItemCategory; label: string }> = [
  { value: "BAG", label: "가방" },
  { value: "BACKPACK", label: "백팩" },
  { value: "WALLET", label: "지갑" },
  { value: "CARD_HOLDER", label: "카드지갑" },
  { value: "CLOTHING", label: "의류" },
  { value: "SHOES", label: "신발" },
  { value: "JEWELRY", label: "주얼리" },
  { value: "ACCESSORY", label: "액세서리" },
  { value: "OTHER", label: "기타" },
];

const colors = [
  { value: "BLACK", label: "블랙", hex: "#222226" },
  { value: "OFF_WHITE", label: "오프화이트", hex: "#ece8df" },
  { value: "BEIGE", label: "베이지", hex: "#c9b89f" },
  { value: "BROWN", label: "브라운", hex: "#806a51" },
  { value: "NAVY", label: "네이비", hex: "#3f4b62" },
  { value: "RED", label: "레드", hex: "#9a4e4e" },
] as const;

const fieldClassName =
  "mt-2 h-[50px] w-full rounded-[15px] border border-[#dedee2] bg-[#fafafa] px-4 text-[13px] text-[#15151a] outline-none transition-colors placeholder:text-[#b0b0b7] focus:border-[#8b7355]";

function readImage(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("사진을 읽지 못했습니다."));
      }
    });
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

function getCategoryLabel(category: ItemCategory) {
  return categories.find((option) => option.value === category)?.label ?? category;
}

function getColorPresentation(primaryColor: string) {
  const color = colors.find((option) => option.value === primaryColor);
  return {
    label: color?.label ?? primaryColor,
    hex: color?.hex ?? "#d7cec2",
  };
}

export function ItemRegisterScreen() {
  const router = useRouter();
  const draft = useItemRegistrationStore((state) => state.draft);
  const photoFile = useItemRegistrationStore((state) => state.photoFile);
  const photoPreviewUrl = useItemRegistrationStore(
    (state) => state.photoPreviewUrl,
  );
  const photoName = useItemRegistrationStore((state) => state.photoName);
  const analysisStatus = useItemRegistrationStore(
    (state) => state.analysisStatus,
  );
  const analysisMessage = useItemRegistrationStore(
    (state) => state.analysisMessage,
  );
  const aiJobId = useItemRegistrationStore((state) => state.aiJobId);
  const materialSource = useItemRegistrationStore(
    (state) => state.materialSource,
  );
  const createdItemId = useItemRegistrationStore(
    (state) => state.createdItemId,
  );
  const updateDraft = useItemRegistrationStore((state) => state.updateDraft);
  const updateMaterial = useItemRegistrationStore(
    (state) => state.updateMaterial,
  );
  const setPhoto = useItemRegistrationStore((state) => state.setPhoto);
  const clearPhoto = useItemRegistrationStore((state) => state.clearPhoto);
  const startAnalysis = useItemRegistrationStore((state) => state.startAnalysis);
  const markItemCreated = useItemRegistrationStore(
    (state) => state.markItemCreated,
  );
  const markImageUploadPending = useItemRegistrationStore(
    (state) => state.markImageUploadPending,
  );
  const clearPendingImageUpload = useItemRegistrationStore(
    (state) => state.clearPendingImageUpload,
  );
  const resetDraft = useItemRegistrationStore((state) => state.resetDraft);
  const addCreatedItem = useMenuDataStore((state) => state.addCreatedItem);
  const updateItemImage = useMenuDataStore((state) => state.updateItemImage);
  const [submissionStatus, setSubmissionStatus] = useState<
    "IDLE" | "CREATING" | "UPLOADING" | "IMAGE_FAILED"
  >("IDLE");
  const [isRetryingImage, setIsRetryingImage] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setPhoto(file, await readImage(file));
    } catch {
      setSubmitError("사진을 읽지 못했습니다. 다른 사진을 선택해 주세요.");
    }
  };

  const handleStartAnalysis = () => {
    if (!photoFile) {
      return;
    }

    startAnalysis();
    router.push("/screen22");
  };

  const finishRegistration = () => {
    clearPendingImageUpload();
    resetDraft();
    router.push(
      createdItemId
        ? `/items?registered=${encodeURIComponent(createdItemId)}`
        : "/items",
    );
  };

  const deferImageUpload = () => {
    const registeredItemId = createdItemId;
    resetDraft();
    router.push(
      registeredItemId
        ? `/items?registered=${encodeURIComponent(registeredItemId)}`
        : "/items",
    );
  };

  const handleRetryImage = async () => {
    if (!createdItemId || !photoFile) {
      return;
    }

    setIsRetryingImage(true);
    setSubmitError(null);

    try {
      const uploadedImage = await uploadItemImage(photoFile, createdItemId);
      updateItemImage(createdItemId, uploadedImage.url);
      finishRegistration();
    } catch {
      setSubmitError("사진 업로드에 다시 실패했어요. 아이템 정보는 이미 저장되어 있습니다.");
    } finally {
      setIsRetryingImage(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedName = draft.name.trim();
    const normalizedMaterial = draft.material.trim();
    const normalizedColor = draft.primaryColor.trim();
    if (!normalizedName || !draft.category || !normalizedColor || !normalizedMaterial) {
      setSubmitError("이름, 카테고리, 대표 색상, 소재를 모두 입력해 주세요.");
      return;
    }

    setSubmissionStatus("CREATING");
    setSubmitError(null);

    try {
      const response = await backendApi.closet.createItem({
        productId: null,
        name: normalizedName,
        brandName: draft.brandName.trim() || null,
        category: draft.category,
        primaryColor: normalizedColor,
        material: normalizedMaterial,
        materialSource,
        purchaseDate: draft.purchaseDate || null,
        purchasePrice: draft.purchasePrice ? Number(draft.purchasePrice) : null,
        memo: draft.memo.trim() || null,
        aiJobId: analysisStatus === "SUCCEEDED" ? aiJobId : null,
      });
      const myItemId = response.data.data.myItemId;
      const colorPresentation = getColorPresentation(normalizedColor);

      markItemCreated(myItemId);
      addCreatedItem({
        id: myItemId,
        name: normalizedName,
        category: getCategoryLabel(draft.category),
        color: colorPresentation.label,
        colorHex: colorPresentation.hex,
        brandName: draft.brandName.trim() || null,
        material: normalizedMaterial,
        purchaseDate: draft.purchaseDate || null,
        purchasePrice: draft.purchasePrice ? Number(draft.purchasePrice) : null,
        memo: draft.memo.trim() || null,
      });

      if (!photoFile) {
        clearPendingImageUpload();
        resetDraft();
        router.push(`/items?registered=${encodeURIComponent(myItemId)}`);
        return;
      }

      setSubmissionStatus("UPLOADING");
      try {
        const uploadedImage = await uploadItemImage(photoFile, myItemId);
        updateItemImage(myItemId, uploadedImage.url);
        clearPendingImageUpload();
        resetDraft();
        router.push(`/items?registered=${encodeURIComponent(myItemId)}`);
      } catch {
        markImageUploadPending(myItemId);
        setSubmissionStatus("IMAGE_FAILED");
      }
    } catch (error) {
      setSubmissionStatus("IDLE");
      setSubmitError(
        error instanceof Error
          ? error.message
          : "아이템을 등록하지 못했습니다. 다시 시도해 주세요.",
      );
    }
  };

  if (createdItemId && submissionStatus === "IMAGE_FAILED") {
    return (
      <MobileScreenLayout contentClassName="bg-white px-6 pt-[47px] pb-8">
        <LuxuryReveal>
          <ScreenHeader
            eyebrow="ITEM SAVED"
            title="아이템은 등록됐어요"
            description="사진 업로드만 실패했어요. 입력한 정보는 다시 작성하지 않아도 됩니다."
          />
        </LuxuryReveal>

        <LuxuryReveal className="mt-9" delay={70}>
          <div
            role="img"
            aria-label={`${draft.name} 선택 사진`}
            className="h-[260px] rounded-[24px] bg-[#f2eee8] bg-cover bg-center"
            style={
              photoPreviewUrl
                ? { backgroundImage: `url("${photoPreviewUrl}")` }
                : undefined
            }
          />
          <div className="mt-5 rounded-[18px] bg-[#f8eeee] px-5 py-4">
            <p className="text-[12px] font-bold text-[#914b4b]">
              UserItem 저장 완료 · 이미지 업로드 실패
            </p>
            <p className="mt-2 text-[11px] leading-[17px] text-[#7f6b6b]">
              지금 다시 시도하거나 이미지 없이 유지한 뒤 나중에 사진만 올릴 수 있어요.
            </p>
          </div>
          {submitError ? (
            <p role="alert" className="mt-3 text-[11px] text-[#9a4545]">
              {submitError}
            </p>
          ) : null}
        </LuxuryReveal>

        <LuxuryReveal className="mt-8 space-y-3" delay={130}>
          <button
            type="button"
            disabled={isRetryingImage}
            className="flex h-[52px] w-full items-center justify-center rounded-[16px] bg-[#15151a] text-[15px] font-bold text-white disabled:opacity-45"
            onClick={() => void handleRetryImage()}
          >
            {isRetryingImage ? "사진 업로드 중..." : "사진 업로드 다시 시도"}
          </button>
          <button
            type="button"
            className="flex h-[52px] w-full items-center justify-center rounded-[16px] border border-[#d8d8dc] bg-white text-[14px] font-bold text-[#55555d]"
            onClick={deferImageUpload}
          >
            나중에 사진만 업로드하기
          </button>
        </LuxuryReveal>
      </MobileScreenLayout>
    );
  }

  const formIsValid = Boolean(
    draft.name.trim() &&
      draft.category &&
      draft.primaryColor.trim() &&
      draft.material.trim(),
  );
  const isSubmitting = submissionStatus === "CREATING" || submissionStatus === "UPLOADING";

  return (
    <MobileScreenLayout
      contentClassName="bg-white px-6 pt-[47px] pb-8"
      bottomNavigation={<BottomNavigation activeItem="register" />}
    >
      <LuxuryReveal>
        <ScreenHeader
          eyebrow="ADD TO CLOSET"
          title="아이템 등록"
          description="AI가 채운 값도 확인 후 자유롭게 수정할 수 있어요"
        />
      </LuxuryReveal>

      <form className="mt-8" onSubmit={handleSubmit}>
        <LuxuryReveal delay={60}>
          <section aria-labelledby="item-photo-title">
            <div className="flex items-end justify-between">
              <h2 id="item-photo-title" className="text-[15px] font-bold text-[#25252a]">
                아이템 사진
              </h2>
              <span className="text-[10px] text-[#929299]">선택 사항</span>
            </div>

            <label
              className="mt-3 flex h-[178px] cursor-pointer items-center justify-center overflow-hidden rounded-[20px] border border-dashed border-[#cfcac4] bg-[#f5f2ed] bg-cover bg-center transition-colors hover:border-[#9f8d75]"
              style={photoPreviewUrl ? { backgroundImage: `url("${photoPreviewUrl}")` } : undefined}
            >
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(event) => void handleImageChange(event)}
              />
              {photoPreviewUrl ? (
                <span className="rounded-full bg-black/55 px-4 py-2 text-[11px] font-bold text-white backdrop-blur-sm">
                  다른 사진 선택
                </span>
              ) : (
                <span className="flex flex-col items-center text-center">
                  <span className="flex size-11 items-center justify-center rounded-full bg-white text-[25px] font-light text-[#8b7355] shadow-[0_6px_18px_rgba(36,31,25,0.08)]">
                    +
                  </span>
                  <span className="mt-3 text-[12px] font-bold text-[#55555d]">사진 추가하기</span>
                  <span className="mt-1 text-[10px] text-[#9999a1]">사진 없이도 직접 등록할 수 있어요</span>
                </span>
              )}
            </label>

            {photoFile ? (
              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <p className="min-w-0 truncate text-[10px] text-[#929299]">{photoName}</p>
                  <button type="button" className="ml-3 shrink-0 text-[10px] font-bold text-[#8b7355]" onClick={clearPhoto}>
                    사진 삭제
                  </button>
                </div>
                <button
                  type="button"
                  className="mt-3 flex h-[46px] w-full items-center justify-center rounded-[15px] bg-[#ede7de] text-[13px] font-bold text-[#6f573a]"
                  onClick={handleStartAnalysis}
                >
                  AI로 카테고리·색상·소재 채우기
                </button>
              </div>
            ) : null}
          </section>
        </LuxuryReveal>

        {analysisMessage ? (
          <LuxuryReveal className="mt-5" delay={90}>
            <p
              role="status"
              className={`rounded-[15px] px-4 py-3 text-[11px] leading-[17px] ${
                analysisStatus === "SUCCEEDED"
                  ? "bg-[#edf3ed] text-[#4f7154]"
                  : "bg-[#f8eeee] text-[#914b4b]"
              }`}
            >
              {analysisMessage}
            </p>
          </LuxuryReveal>
        ) : null}

        <LuxuryReveal className="mt-8" delay={120}>
          <section aria-labelledby="item-information-title">
            <div className="flex items-center gap-2">
              <h2 id="item-information-title" className="text-[15px] font-bold text-[#25252a]">
                아이템 정보
              </h2>
              <span className="text-[10px] font-bold text-[#9a8060]">ITEM DETAILS</span>
            </div>

            <label className="mt-5 block">
              <span className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#55555d]">브랜드명</span>
                <span className="text-[9px] text-[#9999a1]">직접 입력 · 선택</span>
              </span>
              <input
                value={draft.brandName}
                maxLength={50}
                placeholder="예: MCM"
                className={fieldClassName}
                onChange={(event) => updateDraft({ brandName: event.target.value })}
              />
            </label>

            <label className="mt-5 block">
              <span className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#55555d]">아이템 이름</span>
                <span className="text-[9px] font-bold text-[#9a8060]">직접 입력 · 필수</span>
              </span>
              <input
                value={draft.name}
                maxLength={50}
                placeholder="예: 브라운 토트백"
                className={fieldClassName}
                onChange={(event) => updateDraft({ name: event.target.value })}
              />
            </label>

            <fieldset className="mt-5">
              <legend className="w-full">
                <span className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#55555d]">카테고리</span>
                  <span className="text-[9px] font-bold text-[#8b7355]">직접 입력 / AI 제안 가능</span>
                </span>
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {categories.map((option) => {
                  const isSelected = option.value === draft.category;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={isSelected}
                      className={`h-9 rounded-full border px-4 text-[11px] font-bold transition-colors ${
                        isSelected
                          ? "border-[#15151a] bg-[#15151a] text-white"
                          : "border-[#d8d8de] bg-white text-[#66666e]"
                      }`}
                      onClick={() => updateDraft({ category: option.value })}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <label className="mt-5 block">
              <span className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#55555d]">대표 색상</span>
                <span className="text-[9px] font-bold text-[#8b7355]">직접 입력 / AI 제안 가능</span>
              </span>
              <input
                value={draft.primaryColor}
                placeholder="예: BROWN"
                className={`${fieldClassName} uppercase`}
                onChange={(event) => updateDraft({ primaryColor: event.target.value.toUpperCase() })}
              />
            </label>
            <div className="mt-3 flex items-start justify-between" aria-label="대표 색상 빠른 선택">
              {colors.map((color) => {
                const isSelected = color.value === draft.primaryColor;
                return (
                  <button
                    key={color.value}
                    type="button"
                    aria-label={color.label}
                    aria-pressed={isSelected}
                    className="flex w-10 flex-col items-center gap-2 text-[9px] text-[#777780]"
                    onClick={() => updateDraft({ primaryColor: color.value })}
                  >
                    <span
                      aria-hidden="true"
                      className={`size-8 rounded-full border-2 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] ${
                        isSelected ? "scale-110 border-[#15151a] p-[3px]" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                    {color.label}
                  </button>
                );
              })}
            </div>

            <label className="mt-5 block">
              <span className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#55555d]">소재</span>
                <span className="text-[9px] font-bold text-[#8b7355]">직접 입력 / AI 제안 가능</span>
              </span>
              <input
                value={draft.material}
                placeholder="예: LEATHER"
                className={`${fieldClassName} uppercase`}
                onChange={(event) => updateMaterial(event.target.value.toUpperCase())}
              />
            </label>
          </section>
        </LuxuryReveal>

        <LuxuryReveal className="mt-9" delay={180}>
          <section aria-labelledby="optional-information-title">
            <div className="flex items-end justify-between">
              <h2 id="optional-information-title" className="text-[15px] font-bold text-[#25252a]">구매 및 메모</h2>
              <span className="text-[10px] text-[#929299]">선택 사항</span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[11px] font-bold text-[#55555d]">구매일</span>
                <input
                  type="date"
                  value={draft.purchaseDate}
                  className={`${fieldClassName} text-[11px]`}
                  onChange={(event) => updateDraft({ purchaseDate: event.target.value })}
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-bold text-[#55555d]">구매 가격</span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={draft.purchasePrice}
                  inputMode="numeric"
                  placeholder="원"
                  className={fieldClassName}
                  onChange={(event) => updateDraft({ purchasePrice: event.target.value })}
                />
              </label>
            </div>

            <label className="mt-5 block">
              <span className="text-[11px] font-bold text-[#55555d]">메모</span>
              <textarea
                value={draft.memo}
                maxLength={200}
                placeholder="아이템에 대해 기억할 내용을 적어주세요"
                className="mt-2 min-h-[92px] w-full resize-none rounded-[15px] border border-[#dedee2] bg-[#fafafa] px-4 py-3 text-[13px] leading-5 text-[#15151a] outline-none placeholder:text-[#b0b0b7] focus:border-[#8b7355]"
                onChange={(event) => updateDraft({ memo: event.target.value })}
              />
            </label>
          </section>
        </LuxuryReveal>

        {submitError ? (
          <p role="alert" className="mt-5 rounded-[14px] bg-[#f8eeee] px-4 py-3 text-[11px] text-[#9a4545]">
            {submitError}
          </p>
        ) : null}

        <LuxuryReveal className="mt-7" delay={240}>
          <button
            type="submit"
            disabled={isSubmitting || !formIsValid}
            className="flex h-[52px] w-full items-center justify-center rounded-[16px] bg-[#15151a] text-[15px] font-bold text-white transition-colors hover:bg-[#2a2a30] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {submissionStatus === "CREATING"
              ? "아이템 정보 저장 중..."
              : submissionStatus === "UPLOADING"
                ? "사진 업로드 중..."
                : "내 아이템에 등록하기"}
          </button>
          <p className="mt-3 text-center text-[10px] text-[#9999a1]">
            아이템 정보가 먼저 저장되고 사진은 이후에 업로드돼요
          </p>
        </LuxuryReveal>
      </form>
    </MobileScreenLayout>
  );
}
