"use client";

import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PiCameraBold } from "react-icons/pi";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BackButton } from "@/components/common/navigation/BackButton";
import { dummyUser } from "@/data/menuPageDummies";
import { getApiErrorMessage } from "@/lib/apiError";
import { backendApi } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";

const useApiMocks = process.env.NEXT_PUBLIC_USE_API_MOCKS !== "false";
const nicknamePattern = /^[가-힣A-Za-z0-9_]{2,20}$/;

type NicknameStatus = "IDLE" | "AVAILABLE";

export function ProfileEditScreen() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setUser = useAuthStore((state) => state.setUser);
  const currentUser = useAuthStore((state) => state.user);
  const initialNickname = currentUser?.nickname?.trim() || "유연";
  const [nickname, setNickname] = useState(initialNickname);
  const [nicknameStatus, setNicknameStatus] = useState<NicknameStatus>("IDLE");
  const [profilePreview, setProfilePreview] = useState<string | null>(
    currentUser?.profileImageUrl ?? null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setPhotoError("이미지 파일만 선택할 수 있어요.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("5MB 이하의 이미지를 선택해 주세요.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfilePreview(reader.result);
        setPhotoError(null);
      }
    };
    reader.onerror = () => {
      setPhotoError("사진을 불러오지 못했어요. 사진 없이도 저장할 수 있어요.");
    };
    reader.readAsDataURL(file);
  };

  const handleNicknameCheck = () => {
    const normalizedNickname = nickname.trim();

    if (!nicknamePattern.test(normalizedNickname)) {
      setNicknameStatus("IDLE");
      setError("닉네임은 한글, 영문, 숫자, 밑줄로 2~20자까지 입력해 주세요.");
      return;
    }

    // TODO(API): 닉네임 중복 확인 엔드포인트가 확정되면 이 지점에서 조회합니다.
    setNickname(normalizedNickname);
    setNicknameStatus("AVAILABLE");
    setError(null);
  };

  const handleSave = async () => {
    const normalizedNickname = nickname.trim();

    if (isSaving) {
      return;
    }

    if (!nicknamePattern.test(normalizedNickname)) {
      setError("닉네임은 한글, 영문, 숫자, 밑줄로 2~20자까지 입력해 주세요.");
      return;
    }

    if (nicknameStatus !== "AVAILABLE" && normalizedNickname !== initialNickname) {
      setError("변경한 닉네임의 확인 버튼을 눌러 주세요.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (useApiMocks) {
        const fallbackUser = currentUser ?? dummyUser;
        setUser({
          ...fallbackUser,
          nickname: normalizedNickname,
          profileImageUrl: profilePreview,
        });
      } else {
        const response = await backendApi.profile.updateMe({
          nickname: normalizedNickname,
        });
        setUser({
          ...response.data.data,
          profileImageUrl: currentUser?.profileImageUrl ?? null,
        });

        // TODO(API): 프로필 이미지 업로드·연결 엔드포인트가 확정되면
        // 선택한 이미지를 별도로 전송합니다. 이미지 실패 여부와 관계없이 닉네임 저장은 유지합니다.
      }

      router.back();
      router.refresh();
    } catch (saveError) {
      setError(
        getApiErrorMessage(
          saveError,
          "프로필을 저장하지 못했습니다. 다시 시도해 주세요.",
        ),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MobileScreenLayout
      figmaNodeId="311:163"
      contentClassName="flex min-h-full flex-col bg-white px-6 pt-4 pb-[88px] text-[#121217]"
    >
      <LuxuryReveal>
        <div className="flex items-center">
          <BackButton variant="plain" />
        </div>
        <h1 className="mt-2 text-[28px] leading-[34px] font-bold tracking-[-0.04em]">
          프로필 수정
        </h1>
        <p className="mt-[6px] text-[13px] leading-5 text-[#7a7a85]">
          닉네임과 저장된 취향을 변경할 수 있어요.
        </p>
      </LuxuryReveal>

      <LuxuryReveal className="mt-8 flex flex-col items-center" delay={50}>
        <div
          aria-label="프로필 사진 미리보기"
          className="relative flex size-[76px] items-center justify-center overflow-hidden rounded-full bg-[#e9e5df] text-[24px] font-bold text-[#4a433a]"
        >
          {profilePreview ? (
            <Image
              src={profilePreview}
              alt="프로필 사진"
              fill
              sizes="76px"
              unoptimized
              className="object-cover"
            />
          ) : (
            "S"
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="sr-only"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-3 flex items-center gap-1.5 text-[12px] font-bold text-[#55555d] transition-colors hover:text-[#121217]"
        >
          <PiCameraBold aria-hidden="true" className="size-4" />
          프로필 사진 변경
        </button>
        {photoError ? (
          <p role="alert" className="mt-2 text-center text-[11px] leading-4 text-[#c72e2e]">
            {photoError}
          </p>
        ) : null}
      </LuxuryReveal>

      <LuxuryReveal className="mt-8" delay={90}>
        <label htmlFor="profile-nickname" className="text-[13px] font-bold">
          닉네임
        </label>
        <div className="mt-2 flex h-[54px] items-center rounded-[14px] border border-[#dbdbe0] bg-white px-4 focus-within:border-[#121217]">
          <input
            id="profile-nickname"
            value={nickname}
            maxLength={20}
            onChange={(event) => {
              setNickname(event.target.value);
              setNicknameStatus("IDLE");
              setError(null);
            }}
            className="min-w-0 flex-1 bg-transparent text-[14px] text-[#121217] outline-none"
          />
          <button
            type="button"
            onClick={handleNicknameCheck}
            className={`ml-3 shrink-0 text-[12px] font-bold ${
              nicknameStatus === "AVAILABLE" ? "text-[#6e845f]" : "text-[#121217]"
            }`}
          >
            {nicknameStatus === "AVAILABLE" ? "확인 완료" : "확인"}
          </button>
        </div>
      </LuxuryReveal>

      <LuxuryReveal className="mt-6" delay={120}>
        <Link
          href="/preferences"
          className="flex h-[72px] items-center rounded-[16px] border border-[#dedee2] bg-[#f8f8f9] px-4 transition-colors hover:border-[#c8c2b9] hover:bg-[#f5f3f0]"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] font-bold text-[#15151a]">
              취향 프로필
            </span>
            <span className="mt-[7px] block text-[11px] text-[#888890]">
              색상 · 카테고리 · 스타일 변경
            </span>
          </span>
          <span aria-hidden="true" className="ml-3 text-[22px] text-[#777780]">
            ›
          </span>
        </Link>
      </LuxuryReveal>

      {error ? (
        <p className="mt-4 text-[12px] font-medium text-[#c23535]" role="alert">
          {error}
        </p>
      ) : null}

      <LuxuryReveal className="mt-auto pt-10" delay={160}>
        <button
          type="button"
          disabled={isSaving}
          onClick={handleSave}
          className="flex h-[52px] w-full items-center justify-center rounded-[14px] bg-[#121217] text-[14px] font-bold text-white transition-colors hover:bg-[#26262c] disabled:cursor-wait disabled:opacity-50"
        >
          {isSaving ? "저장 중" : "변경사항 저장"}
        </button>
      </LuxuryReveal>
    </MobileScreenLayout>
  );
}
