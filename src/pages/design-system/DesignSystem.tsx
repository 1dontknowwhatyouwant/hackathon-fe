"use client";

const DesignSystem = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f5f3] text-[#17181d]">
      <div className="relative mx-auto h-[844px] w-[390px] overflow-hidden">
        <section className="absolute inset-0 flex items-start justify-center pt-[18px]">
          <div className="w-[390px] px-[22px]">
            <div className="mt-[40px] h-[786px] rounded-[34px] border border-[#d9d9df] bg-white px-[22px] py-[26px]">
              <p className="text-[12px] font-semibold tracking-[-0.03em] text-[#987b54]">
                FOUNDATION
              </p>
              <h2 className="mt-[6px] text-[30px] font-black tracking-[-0.06em] text-[#17181d]">
                Design System
              </h2>
              <p className="mt-[6px] text-[14px] font-normal tracking-[-0.03em] text-[#8f919c]">
                MCM-inspired neutral wireframe
              </p>

              <div className="mt-[30px] flex gap-[10px]">
                <div className="h-[56px] w-[56px] rounded-[14px] bg-[#17181d]" />
                <div className="h-[56px] w-[56px] rounded-[14px] bg-[#9b8059]" />
                <div className="h-[56px] w-[56px] rounded-[14px] bg-[#e9e3db]" />
                <div className="h-[56px] w-[56px] rounded-[14px] bg-[#f4f4f6]" />
              </div>

              <h3 className="mt-[24px] text-[13px] font-semibold tracking-[-0.03em] text-[#17181d]">
                Typography
              </h3>
              <p className="mt-[8px] text-[22px] font-black tracking-[-0.06em] text-[#17181d]">
                Display / 28 Bold
              </p>
              <p className="mt-[12px] text-[13px] font-normal tracking-[-0.03em] text-[#17181d]">
                Body / 14 Regular
              </p>

              <h3 className="mt-[24px] text-[13px] font-semibold tracking-[-0.03em] text-[#17181d]">
                Components
              </h3>

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
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default DesignSystem;
