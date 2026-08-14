"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BottomNavigation } from "@/components/common/navigation/BottomNavigation";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";
import { useMenuDataStore } from "@/store/useMenuDataStore";

const categories = ["상의", "하의", "아우터", "신발", "가방"] as const;

const colors = [
  { label: "블랙", hex: "#222226" },
  { label: "오프화이트", hex: "#ece8df" },
  { label: "베이지", hex: "#c9b89f" },
  { label: "브라운", hex: "#806a51" },
  { label: "네이비", hex: "#3f4b62" },
  { label: "레드", hex: "#9a4e4e" },
] as const;

const fieldClassName =
  "mt-2 h-[50px] w-full rounded-[15px] border border-[#dedee2] bg-[#fafafa] px-4 text-[13px] text-[#15151a] outline-none transition-colors placeholder:text-[#b0b0b7] focus:border-[#8b7355]";

export function ItemRegisterScreen() {
  const router = useRouter();
  const createItem = useMenuDataStore((state) => state.createItem);
  const isLoading = useMenuDataStore((state) => state.isLoading);
  const error = useMenuDataStore((state) => state.error);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("상의");
  const [selectedColor, setSelectedColor] =
    useState<(typeof colors)[number]>(colors[1]);
  const [brandName, setBrandName] = useState("");
  const [material, setMaterial] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [memo, setMemo] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        setImagePreview(reader.result);
        setImageName(file.name);
      }
    });
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedName = name.trim();
    if (!normalizedName) {
      return;
    }

    const createdItem = await createItem({
      name: normalizedName,
      category,
      color: selectedColor.label,
      colorHex: selectedColor.hex,
      imageUrl: imagePreview ?? undefined,
      brandName: brandName.trim() || null,
      material: material.trim() || "미입력",
      purchaseDate: purchaseDate || null,
      purchasePrice: purchasePrice ? Number(purchasePrice) : null,
      memo: memo.trim() || null,
    });

    router.push(`/items?registered=${encodeURIComponent(createdItem.id)}`);
  };

  return (
    <MobileScreenLayout
      contentClassName="bg-white px-6 pt-[47px] pb-8"
      bottomNavigation={<BottomNavigation activeItem="register" />}
    >
      <LuxuryReveal>
        <ScreenHeader
          eyebrow="ADD TO CLOSET"
          title="아이템 등록"
          description="사진과 정보를 추가해 나만의 옷장을 채워보세요"
        />
      </LuxuryReveal>

      <form className="mt-8" onSubmit={handleSubmit}>
        <LuxuryReveal delay={60}>
          <section aria-labelledby="item-photo-title">
            <div className="flex items-end justify-between">
              <h2
                id="item-photo-title"
                className="text-[15px] font-bold text-[#25252a]"
              >
                아이템 사진
              </h2>
              <span className="text-[10px] text-[#929299]">선택 사항</span>
            </div>

            <label
              className="mt-3 flex h-[178px] cursor-pointer items-center justify-center overflow-hidden rounded-[20px] border border-dashed border-[#cfcac4] bg-[#f5f2ed] bg-cover bg-center transition-colors hover:border-[#9f8d75]"
              style={
                imagePreview
                  ? { backgroundImage: `url("${imagePreview}")` }
                  : undefined
              }
            >
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={handleImageChange}
              />
              {imagePreview ? (
                <span className="rounded-full bg-black/55 px-4 py-2 text-[11px] font-bold text-white backdrop-blur-sm">
                  다른 사진 선택
                </span>
              ) : (
                <span className="flex flex-col items-center text-center">
                  <span className="flex size-11 items-center justify-center rounded-full bg-white text-[25px] font-light text-[#8b7355] shadow-[0_6px_18px_rgba(36,31,25,0.08)]">
                    +
                  </span>
                  <span className="mt-3 text-[12px] font-bold text-[#55555d]">
                    사진 추가하기
                  </span>
                  <span className="mt-1 text-[10px] text-[#9999a1]">
                    JPG, PNG, WEBP
                  </span>
                </span>
              )}
            </label>
            {imageName ? (
              <p className="mt-2 truncate text-[10px] text-[#929299]">
                선택한 파일 · {imageName}
              </p>
            ) : null}
          </section>
        </LuxuryReveal>

        <LuxuryReveal className="mt-8" delay={120}>
          <section aria-labelledby="required-information-title">
            <div className="flex items-center gap-2">
              <h2
                id="required-information-title"
                className="text-[15px] font-bold text-[#25252a]"
              >
                필수 정보
              </h2>
              <span className="text-[10px] font-bold text-[#9a8060]">
                REQUIRED
              </span>
            </div>

            <label className="mt-5 block">
              <span className="text-[11px] font-bold text-[#55555d]">
                아이템 이름
              </span>
              <input
                value={name}
                maxLength={50}
                placeholder="예: 라이트 베이지 재킷"
                className={fieldClassName}
                onChange={(event) => setName(event.target.value)}
              />
            </label>

            <fieldset className="mt-5">
              <legend className="text-[11px] font-bold text-[#55555d]">
                카테고리
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {categories.map((itemCategory) => {
                  const isSelected = itemCategory === category;

                  return (
                    <button
                      key={itemCategory}
                      type="button"
                      aria-pressed={isSelected}
                      className={`h-9 rounded-full border px-4 text-[11px] font-bold transition-colors ${
                        isSelected
                          ? "border-[#15151a] bg-[#15151a] text-white"
                          : "border-[#d8d8de] bg-white text-[#66666e]"
                      }`}
                      onClick={() => setCategory(itemCategory)}
                    >
                      {itemCategory}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="mt-5">
              <legend className="text-[11px] font-bold text-[#55555d]">
                대표 색상
              </legend>
              <div className="mt-3 flex items-start justify-between">
                {colors.map((itemColor) => {
                  const isSelected = itemColor.label === selectedColor.label;

                  return (
                    <button
                      key={itemColor.label}
                      type="button"
                      aria-label={itemColor.label}
                      aria-pressed={isSelected}
                      className="flex w-10 flex-col items-center gap-2 text-[9px] text-[#777780]"
                      onClick={() => setSelectedColor(itemColor)}
                    >
                      <span
                        aria-hidden="true"
                        className={`size-8 rounded-full border-2 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] transition-transform ${
                          isSelected
                            ? "scale-110 border-[#15151a] p-[3px]"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: itemColor.hex }}
                      />
                      {itemColor.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </section>
        </LuxuryReveal>

        <LuxuryReveal className="mt-9" delay={180}>
          <section aria-labelledby="optional-information-title">
            <div className="flex items-end justify-between">
              <h2
                id="optional-information-title"
                className="text-[15px] font-bold text-[#25252a]"
              >
                추가 정보
              </h2>
              <span className="text-[10px] text-[#929299]">선택 사항</span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[11px] font-bold text-[#55555d]">
                  브랜드
                </span>
                <input
                  value={brandName}
                  placeholder="예: MCM"
                  className={fieldClassName}
                  onChange={(event) => setBrandName(event.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-bold text-[#55555d]">
                  소재
                </span>
                <input
                  value={material}
                  placeholder="예: 레더"
                  className={fieldClassName}
                  onChange={(event) => setMaterial(event.target.value)}
                />
              </label>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[11px] font-bold text-[#55555d]">
                  구매일
                </span>
                <input
                  type="date"
                  value={purchaseDate}
                  className={`${fieldClassName} text-[11px]`}
                  onChange={(event) => setPurchaseDate(event.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-bold text-[#55555d]">
                  구매 가격
                </span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={purchasePrice}
                  inputMode="numeric"
                  placeholder="원"
                  className={fieldClassName}
                  onChange={(event) => setPurchasePrice(event.target.value)}
                />
              </label>
            </div>

            <label className="mt-5 block">
              <span className="text-[11px] font-bold text-[#55555d]">
                메모
              </span>
              <textarea
                value={memo}
                maxLength={200}
                placeholder="아이템에 대해 기억할 내용을 적어주세요"
                className="mt-2 min-h-[92px] w-full resize-none rounded-[15px] border border-[#dedee2] bg-[#fafafa] px-4 py-3 text-[13px] leading-5 text-[#15151a] outline-none transition-colors placeholder:text-[#b0b0b7] focus:border-[#8b7355]"
                onChange={(event) => setMemo(event.target.value)}
              />
            </label>
          </section>
        </LuxuryReveal>

        {error ? (
          <p
            role="alert"
            className="mt-5 rounded-[14px] bg-[#f8eeee] px-4 py-3 text-[11px] text-[#9a4545]"
          >
            {error}
          </p>
        ) : null}

        <LuxuryReveal className="mt-7" delay={240}>
          <button
            type="submit"
            disabled={isLoading || !name.trim()}
            className="flex h-[52px] w-full items-center justify-center rounded-[16px] bg-[#15151a] text-[15px] font-bold text-white transition-colors hover:bg-[#2a2a30] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15151a]"
          >
            {isLoading ? "등록 중..." : "내 아이템에 등록하기"}
          </button>
          <p className="mt-3 text-center text-[10px] text-[#9999a1]">
            사진 없이도 아이템을 등록할 수 있어요
          </p>
        </LuxuryReveal>
      </form>
    </MobileScreenLayout>
  );
}
