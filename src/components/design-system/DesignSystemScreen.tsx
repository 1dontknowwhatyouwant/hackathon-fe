"use client";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";

const DesignSystemScreen = () => {
  return (
    <MobileScreenLayout contentClassName="px-6 pt-[47px] pb-8 text-[#17181d]">
      <ScreenHeader
        eyebrow="FOUNDATION"
        title="Design System"
        description="MCM-inspired neutral wireframe"
      />

      <div className="mt-[30px] flex gap-[10px]">
        <div className="h-[56px] w-[56px] rounded-[14px] bg-[#17181d]" />
        <div className="h-[56px] w-[56px] rounded-[14px] bg-[#9b8059]" />
        <div className="h-[56px] w-[56px] rounded-[14px] bg-[#e9e3db]" />
        <div className="h-[56px] w-[56px] rounded-[14px] bg-[#f4f4f6]" />
      </div>

      <h2 className="mt-[24px] text-[13px] font-semibold tracking-[-0.03em] text-[#17181d]">
        Typography
      </h2>
      <p className="mt-[8px] text-[22px] font-black tracking-[-0.06em] text-[#17181d]">
        Display / 28 Bold
      </p>
      <p className="mt-[12px] text-[13px] font-normal tracking-[-0.03em] text-[#17181d]">
        Body / 14 Regular
      </p>

      <h2 className="mt-[24px] text-[13px] font-semibold tracking-[-0.03em] text-[#17181d]">
        Components
      </h2>

      <button
        type="button"
        className="mt-[16px] flex h-[50px] w-full items-center justify-center rounded-[16px] bg-[#17181d] text-[16px] font-semibold tracking-[-0.04em] text-white"
      >
        Primary Button
      </button>

      <div className="mt-[16px] flex gap-[8px]">
        <button
          type="button"
          className="h-[40px] rounded-full bg-[#17181d] px-[18px] text-[13px] font-semibold tracking-[-0.03em] text-white"
        >
          Selected
        </button>
        <button
          type="button"
          className="h-[40px] rounded-full border border-[#d1d1d8] bg-white px-[18px] text-[13px] font-semibold tracking-[-0.03em] text-[#6b6d76]"
        >
          Default
        </button>
      </div>

      <div className="mt-[16px] space-y-[10px]">
        {["Product Card", "Passport Card"].map((title) => (
          <div
            key={title}
            className="flex h-[86px] items-center rounded-[18px] border border-[#e2e2e7] bg-[#f9f9fa] px-[14px]"
          >
            <div className="h-[40px] w-[40px] rounded-[12px] bg-[#e8e1d8]" />
            <div className="ml-[14px]">
              <p className="text-[15px] font-semibold tracking-[-0.04em] text-[#17181d]">
                {title}
              </p>
              <p className="mt-[4px] text-[11px] font-normal tracking-[-0.03em] text-[#8d8f98]">
                세부 정보를 확인하세요
              </p>
            </div>
            <span className="ml-auto text-[22px] leading-none text-[#8d8f98]">
              ›
            </span>
          </div>
        ))}
      </div>
    </MobileScreenLayout>
  );
};

export default DesignSystemScreen;
