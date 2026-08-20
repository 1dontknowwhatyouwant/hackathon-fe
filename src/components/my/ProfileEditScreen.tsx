"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BackButton } from "@/components/common/navigation/BackButton";
import { dummyUser } from "@/data/menuPageDummies";
import { getApiErrorMessage } from "@/lib/apiError";
import { backendApi } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";
import type { Gender } from "@/types/api";

const moodOptions = ["미니멀", "클래식", "전시", "스트릿", "카페"] as const;
type Mood = (typeof moodOptions)[number];

const useApiMocks = process.env.NEXT_PUBLIC_USE_API_MOCKS !== "false";
const mockProfileOptionsKey = "mock-profile-options";

type StoredProfileOptions = {
  moods: Mood[];
  marketingConsent: "AGREED" | "DECLINED";
};

export function ProfileEditScreen() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState<Gender>("NOT_SPECIFIED");
  const [moods, setMoods] = useState<Mood[]>(["미니멀", "클래식", "전시"]);
  const [marketingConsent, setMarketingConsent] = useState<
    StoredProfileOptions["marketingConsent"]
  >("DECLINED");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const profile = useApiMocks
          ? (useAuthStore.getState().user ?? dummyUser)
          : (await backendApi.profile.getMe()).data.data;

        if (!active) {
          return;
        }

        setNickname(profile.nickname?.trim() || "SUJEONG");
        setGender(profile.gender ?? "NOT_SPECIFIED");

        if (useApiMocks) {
          const storedOptions = window.localStorage.getItem(mockProfileOptionsKey);

          if (storedOptions) {
            const parsed = JSON.parse(storedOptions) as StoredProfileOptions;
            setMoods(parsed.moods);
            setMarketingConsent(parsed.marketingConsent);
          }
        }
      } catch {
        if (active) {
          setError("프로필 정보를 불러오지 못했습니다.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const toggleMood = (mood: Mood) => {
    setMoods((current) =>
      current.includes(mood)
        ? current.filter((item) => item !== mood)
        : [...current, mood],
    );
  };

  const handleSave = async () => {
    const normalizedNickname = nickname.trim();

    if (!normalizedNickname || isSaving) {
      setError("닉네임을 입력해 주세요.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (useApiMocks) {
        const currentUser = useAuthStore.getState().user ?? dummyUser;
        setUser({ ...currentUser, nickname: normalizedNickname, gender });
        window.localStorage.setItem(
          mockProfileOptionsKey,
          JSON.stringify({ moods, marketingConsent } satisfies StoredProfileOptions),
        );
      } else {
        const response = await backendApi.profile.updateMe({
          nickname: normalizedNickname,
          gender,
        });
        setUser(response.data.data);
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
        <div className="flex items-center gap-1">
          <BackButton variant="plain" />
          <span className="text-[11px] font-bold text-[#bda178]">
            21 · 프로필 수정
          </span>
        </div>
        <h1 className="mt-2 text-[28px] leading-[34px] font-bold tracking-[-0.04em]">
          프로필 수정
        </h1>
        <p className="mt-[6px] text-[13px] leading-4 text-[#7a7a85]">
          닉네임과 취향을 변경할 수 있어요
        </p>
      </LuxuryReveal>

      <LuxuryReveal className="mt-11 space-y-4" delay={50}>
        <label className="block">
          <span className="sr-only">닉네임</span>
          <input
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="닉네임 · SUJEONG"
            disabled={isLoading}
            className="h-[54px] w-full rounded-[12px] border border-[#dbdbe0] bg-white px-[17px] text-[13px] text-[#121217] outline-none transition-colors placeholder:text-[#7a7a85] focus:border-[#121217] disabled:opacity-50"
          />
        </label>

        <label className="block">
          <span className="sr-only">성별</span>
          <select
            value={gender}
            onChange={(event) => setGender(event.target.value as Gender)}
            disabled={isLoading}
            className="h-[54px] w-full appearance-none rounded-[12px] border border-[#dbdbe0] bg-white px-[17px] text-[13px] text-[#7a7a85] outline-none transition-colors focus:border-[#121217] disabled:opacity-50"
          >
            <option value="NOT_SPECIFIED">성별 · 선택 안 함</option>
            <option value="FEMALE">성별 · 여성</option>
            <option value="MALE">성별 · 남성</option>
          </select>
        </label>
      </LuxuryReveal>

      <LuxuryReveal className="mt-7" delay={90}>
        <fieldset>
          <legend className="text-[14px] font-bold">선호 무드</legend>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {moodOptions.map((mood) => {
              const selected = moods.includes(mood);

              return (
                <button
                  key={mood}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleMood(mood)}
                  className={`flex h-[38px] items-center justify-center rounded-full border text-[12px] font-bold transition-colors ${
                    selected
                      ? "border-[#121217] bg-[#121217] text-white"
                      : "border-[#dbdbe0] bg-white text-[#121217]"
                  }`}
                >
                  {mood}
                </button>
              );
            })}
          </div>
        </fieldset>
      </LuxuryReveal>

      <LuxuryReveal className="mt-[54px]" delay={130}>
        <label className="block">
          <span className="sr-only">마케팅 수신 동의</span>
          <select
            value={marketingConsent}
            onChange={(event) =>
              setMarketingConsent(
                event.target.value as StoredProfileOptions["marketingConsent"],
              )
            }
            className="h-[54px] w-full appearance-none rounded-[12px] border border-[#dbdbe0] bg-white px-[17px] text-[13px] text-[#7a7a85] outline-none transition-colors focus:border-[#121217]"
          >
            <option value="DECLINED">마케팅 수신동의 · 미동의</option>
            <option value="AGREED">마케팅 수신동의 · 동의</option>
          </select>
        </label>
      </LuxuryReveal>

      {error ? (
        <p className="mt-4 text-[12px] font-medium text-[#c23535]" role="alert">
          {error}
        </p>
      ) : null}

      <LuxuryReveal className="mt-auto pt-10" delay={170}>
        <button
          type="button"
          disabled={isLoading || isSaving}
          onClick={handleSave}
          className="flex h-[52px] w-full items-center justify-center rounded-[14px] bg-[#121217] text-[14px] font-bold text-white transition-colors hover:bg-[#26262c] disabled:cursor-wait disabled:opacity-50"
        >
          {isSaving ? "저장 중" : "변경사항 저장"}
        </button>
      </LuxuryReveal>
    </MobileScreenLayout>
  );
}
