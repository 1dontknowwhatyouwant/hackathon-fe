"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BackButton } from "@/components/common/navigation/BackButton";

type NotificationMarketingSettings = {
  serviceNotifications: boolean;
  careReminders: boolean;
  marketingMessages: boolean;
};

const defaultSettings: NotificationMarketingSettings = {
  serviceNotifications: true,
  careReminders: true,
  marketingMessages: false,
};

const storageKey = "mock-notification-marketing-settings";

type SettingToggleProps = {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function SettingToggle({
  title,
  description,
  checked,
  onChange,
}: SettingToggleProps) {
  return (
    <label className="flex min-h-[82px] cursor-pointer items-center gap-4 border-b border-[#ececef] py-4 last:border-b-0">
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-bold text-[#15151a]">{title}</span>
        <span className="mt-1 block text-[11px] leading-4 text-[#888890]">
          {description}
        </span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span className="relative h-7 w-12 shrink-0 rounded-full bg-[#d8d8dc] transition-colors peer-checked:bg-[#15151a] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#15151a] after:absolute after:top-1 after:left-1 after:size-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:after:translate-x-5" />
    </label>
  );
}

export function NotificationMarketingSettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const restoreSettings = window.setTimeout(() => {
      const storedSettings = window.localStorage.getItem(storageKey);

      if (!storedSettings) {
        return;
      }

      try {
        setSettings({
          ...defaultSettings,
          ...(JSON.parse(storedSettings) as Partial<NotificationMarketingSettings>),
        });
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }, 0);

    return () => window.clearTimeout(restoreSettings);
  }, []);

  const updateSetting = (
    key: keyof NotificationMarketingSettings,
    value: boolean,
  ) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      // TODO(API): API v0.4에는 알림·마케팅 설정 조회/수정 엔드포인트가 없습니다.
      // 계약 확정 후 이 저장 지점을 실제 API 호출로 교체합니다.
      window.localStorage.setItem(storageKey, JSON.stringify(settings));
      router.back();
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MobileScreenLayout contentClassName="flex min-h-full flex-col bg-white px-6 pt-4 pb-[88px] text-[#121217]">
      <LuxuryReveal>
        <BackButton variant="plain" />
        <h1 className="mt-2 text-[28px] leading-[34px] font-bold tracking-[-0.04em]">
          알림·마케팅 설정
        </h1>
        <p className="mt-2 text-[13px] leading-5 text-[#777780]">
          받고 싶은 소식만 선택할 수 있어요.
        </p>
      </LuxuryReveal>

      <LuxuryReveal className="mt-10" delay={60}>
        <section
          aria-label="알림 수신 설정"
          className="rounded-[18px] border border-[#dedee2] bg-[#f8f8f9] px-4"
        >
          <SettingToggle
            title="서비스 알림"
            description="계정과 서비스 이용에 필요한 소식을 받아요."
            checked={settings.serviceNotifications}
            onChange={(checked) => updateSetting("serviceNotifications", checked)}
          />
          <SettingToggle
            title="아이템 활용 알림"
            description="보유 아이템 활용과 추천 소식을 받아요."
            checked={settings.careReminders}
            onChange={(checked) => updateSetting("careReminders", checked)}
          />
          <SettingToggle
            title="마케팅 정보 수신"
            description="이벤트와 혜택 정보를 선택적으로 받아요."
            checked={settings.marketingMessages}
            onChange={(checked) => updateSetting("marketingMessages", checked)}
          />
        </section>
      </LuxuryReveal>

      <LuxuryReveal className="mt-auto pt-10" delay={110}>
        <button
          type="button"
          disabled={isSaving}
          onClick={handleSave}
          className="h-[52px] w-full rounded-[14px] bg-[#0e0e12] text-[14px] font-bold text-white transition-colors hover:bg-[#26262c] disabled:cursor-wait disabled:opacity-55"
        >
          {isSaving ? "저장 중" : "설정 저장"}
        </button>
      </LuxuryReveal>
    </MobileScreenLayout>
  );
}
