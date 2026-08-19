"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";
import { analyzeItemPhoto } from "@/services/itemRegistrationWorkflow";
import { useItemRegistrationStore } from "@/store/useItemRegistrationStore";

const useApiMocks = process.env.NEXT_PUBLIC_USE_API_MOCKS !== "false";

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

export function ItemRegisterScreen() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const transitionLockRef = useRef(false);
  const draft = useItemRegistrationStore((state) => state.draft);
  const photoFile = useItemRegistrationStore((state) => state.photoFile);
  const photoPreviewUrl = useItemRegistrationStore(
    (state) => state.photoPreviewUrl,
  );
  const setPhoto = useItemRegistrationStore((state) => state.setPhoto);
  const clearPhoto = useItemRegistrationStore((state) => state.clearPhoto);
  const startAnalysis = useItemRegistrationStore((state) => state.startAnalysis);
  const applyAnalysis = useItemRegistrationStore((state) => state.applyAnalysis);
  const failAnalysis = useItemRegistrationStore((state) => state.failAnalysis);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setPhoto(file, await readImage(file));
      setError(null);
    } catch {
      setError("사진을 읽지 못했습니다. 다른 사진을 선택해 주세요.");
    }
  };

  const moveToConfirmation = () => {
    router.push("/items/new/confirm");
  };

  const handlePrimaryAction = async () => {
    if (!photoFile) {
      fileInputRef.current?.click();
      return;
    }

    if (transitionLockRef.current) {
      return;
    }

    transitionLockRef.current = true;
    setIsRecognizing(true);
    setError(null);
    startAnalysis();

    if (useApiMocks) {
      applyAnalysis(
        {
          name: draft.name || "Aren Shopper",
          brandName: draft.brandName || "MCM",
          category: draft.category || "BAG",
          primaryColor: draft.primaryColor || "BLACK",
          material: draft.material || "LEATHER",
        },
        "1",
        {
          imageAssetId: `preview-${Date.now()}`,
          url: photoPreviewUrl ?? "",
        },
      );
      moveToConfirmation();
      return;
    }

    try {
      const outcome = await analyzeItemPhoto(photoFile);

      if (outcome.status === "SUCCEEDED") {
        applyAnalysis(outcome.values, outcome.jobId, outcome.image);
      } else {
        failAnalysis(outcome.message, outcome.image);
      }

      moveToConfirmation();
    } catch (recognitionError) {
      const message =
        recognitionError instanceof Error
          ? recognitionError.message
          : "제품 정보를 인식하지 못했어요. 직접 입력해 주세요.";
      failAnalysis(message);
      moveToConfirmation();
    }
  };

  return (
    <MobileScreenLayout
      figmaNodeId="390:351"
      contentClassName="flex bg-white px-6 pt-[47px] pb-8"
    >
      <div className="flex min-h-full w-full flex-col">
        <LuxuryReveal>
          <ScreenHeader
            eyebrow="ADD TO CLOSET"
            title="제품 사진 등록"
            description="사진 한 장으로 제품 정보를 인식해요"
          />
        </LuxuryReveal>

        <LuxuryReveal className="mt-8" delay={60}>
          <label
            className="relative flex h-[430px] cursor-pointer items-center justify-center overflow-hidden rounded-[20px] border border-[#dbdee3] bg-[#f6f6f8] bg-cover bg-center"
            style={
              photoPreviewUrl
                ? { backgroundImage: `url("${photoPreviewUrl}")` }
                : undefined
            }
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              capture="environment"
              className="sr-only"
              onChange={(event) => void handleImageChange(event)}
            />
            {photoPreviewUrl ? (
              <>
                <span className="rounded-full bg-black/55 px-4 py-2 text-[11px] font-bold text-white backdrop-blur-sm">
                  다른 사진 선택
                </span>
                <button
                  type="button"
                  className="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-2 text-[10px] font-bold text-[#55555d] shadow-sm"
                  onClick={(event) => {
                    event.preventDefault();
                    clearPhoto();
                  }}
                >
                  삭제
                </button>
              </>
            ) : (
              <span className="flex flex-col items-center text-center">
                <span className="text-[48px] leading-none font-light text-[#b89666]">
                  ＋
                </span>
                <span className="mt-5 text-[13px] text-[#6e707a]">
                  제품을 정면에서 촬영해 주세요
                </span>
              </span>
            )}
          </label>
        </LuxuryReveal>

        {error ? (
          <p
            role="alert"
            className="mt-4 rounded-[14px] bg-[#f8eeee] px-4 py-3 text-[11px] text-[#9a4545]"
          >
            {error}
          </p>
        ) : null}

        <div className="mt-auto pt-8">
          <button
            type="button"
            disabled={isRecognizing}
            className="flex h-[52px] w-full items-center justify-center rounded-[14px] bg-[#0e0e12] text-[14px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-55"
            onClick={() => void handlePrimaryAction()}
          >
            {isRecognizing
              ? "제품 정보 인식 중..."
              : photoFile
                ? "제품 정보 확인"
                : "사진 촬영"}
          </button>
          {!photoFile ? (
            <button
              type="button"
              className="mt-3 flex h-9 w-full items-center justify-center text-[11px] font-bold text-[#777780]"
              onClick={moveToConfirmation}
            >
              사진 없이 직접 입력
            </button>
          ) : null}
        </div>
      </div>
    </MobileScreenLayout>
  );
}
