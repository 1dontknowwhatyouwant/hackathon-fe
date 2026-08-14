import Link from "next/link";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BackButton } from "@/components/common/navigation/BackButton";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";
import type { ClosetItem } from "@/types/menu";

type ItemDetailScreenProps = {
  item: ClosetItem;
};

const priceFormatter = new Intl.NumberFormat("ko-KR");
const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function formatDate(value: string | null) {
  return value ? dateFormatter.format(new Date(value)) : "기록 없음";
}

export function ItemDetailScreen({ item }: ItemDetailScreenProps) {
  const imageStyle = item.imageUrl
    ? { backgroundImage: `url("${item.imageUrl}")` }
    : {
        backgroundColor: item.colorHex,
        backgroundImage:
          "linear-gradient(145deg, rgba(255,255,255,0.52), transparent 46%, rgba(21,21,26,0.1))",
      };

  const itemDetails = [
    { label: "브랜드", value: item.brandName ?? "직접 등록" },
    { label: "카테고리", value: item.category },
    { label: "색상", value: item.color },
    { label: "소재", value: item.material },
    { label: "구매일", value: formatDate(item.purchaseDate) },
    {
      label: "구매 가격",
      value:
        item.purchasePrice === null
          ? "기록 없음"
          : `₩ ${priceFormatter.format(item.purchasePrice)}`,
    },
  ];

  return (
    <MobileScreenLayout contentClassName="bg-white pt-4 pb-10">
      <div className="px-6">
        <LuxuryReveal>
          <BackButton fallbackHref="/items" />
        </LuxuryReveal>

        <LuxuryReveal className="mt-3" delay={40}>
          <ScreenHeader
            eyebrow="MY ITEM"
            title={item.name}
            description={`${item.category} · ${item.color}`}
          />
        </LuxuryReveal>
      </div>

      <LuxuryReveal className="mt-5" delay={80}>
        <div
          role="img"
          aria-label={`${item.name} 아이템 이미지`}
          className="flex h-[304px] w-full items-center justify-center bg-cover bg-center"
          style={imageStyle}
        >
          {!item.imageUrl ? (
            <span className="rounded-full border border-black/10 bg-white/25 px-4 py-2 text-[10px] font-bold tracking-[0.16em] text-black/35 backdrop-blur-sm">
              MY ITEM
            </span>
          ) : null}
        </div>
      </LuxuryReveal>

      <div className="px-6 pt-6">
        <LuxuryReveal delay={130}>
          <section aria-labelledby="usage-summary-title">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-[0.12em] text-[#8b7355]">
                  USAGE SUMMARY
                </p>
                <h2
                  id="usage-summary-title"
                  className="mt-1 text-[20px] font-bold tracking-[-0.035em] text-[#15151a]"
                >
                  아이템 활용 현황
                </h2>
              </div>
              <p className="text-right text-[10px] leading-4 text-[#8b8b93]">
                최근 사용
                <br />
                <strong className="font-bold text-[#55555d]">
                  {formatDate(item.lastUsedAt)}
                </strong>
              </p>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-[18px] bg-[#f3f0eb] px-4 py-4">
                <dt className="text-[10px] text-[#85858d]">누적 사용</dt>
                <dd className="mt-2 text-[24px] font-bold tracking-[-0.04em] text-[#15151a]">
                  {item.usageCount}
                  <span className="ml-1 text-[12px] font-bold text-[#777780]">
                    회
                  </span>
                </dd>
              </div>
              <div className="rounded-[18px] bg-[#17171c] px-4 py-4 text-white">
                <dt className="text-[10px] text-white/55">활용도</dt>
                <dd className="mt-2 text-[24px] font-bold tracking-[-0.04em]">
                  {item.utilizationScore ?? "-"}
                  <span className="ml-1 text-[12px] font-bold text-white/55">
                    점
                  </span>
                </dd>
              </div>
            </dl>
          </section>
        </LuxuryReveal>

        <LuxuryReveal className="mt-8" delay={190}>
          <section aria-labelledby="item-information-title">
            <p className="text-[10px] font-bold tracking-[0.12em] text-[#8b7355]">
              ITEM INFORMATION
            </p>
            <h2
              id="item-information-title"
              className="mt-1 text-[20px] font-bold tracking-[-0.035em] text-[#15151a]"
            >
              등록 정보
            </h2>

            <dl className="mt-4 overflow-hidden rounded-[20px] border border-[#e3e0dc] bg-[#faf9f7] px-4">
              {itemDetails.map((detail, index) => (
                <div
                  key={detail.label}
                  className={`flex items-center justify-between gap-5 py-[15px] ${
                    index < itemDetails.length - 1
                      ? "border-b border-[#e8e5e1]"
                      : ""
                  }`}
                >
                  <dt className="shrink-0 text-[11px] text-[#8c8c94]">
                    {detail.label}
                  </dt>
                  <dd className="truncate text-right text-[12px] font-bold text-[#27272c]">
                    {detail.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </LuxuryReveal>

        {item.memo ? (
          <LuxuryReveal className="mt-5" delay={240}>
            <section className="rounded-[18px] bg-[#eee8df] px-5 py-4">
              <p className="text-[10px] font-bold tracking-[0.1em] text-[#8b7355]">
                MEMO
              </p>
              <p className="mt-2 text-[12px] leading-[18px] text-[#5f5b58]">
                {item.memo}
              </p>
            </section>
          </LuxuryReveal>
        ) : null}

        {item.passportAvailable ? (
          <LuxuryReveal className="mt-6" delay={290}>
            <Link
              href="/screen24"
              className="flex h-[52px] w-full items-center justify-center rounded-[16px] bg-[#15151a] text-[15px] font-bold text-white transition-colors hover:bg-[#2a2a30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15151a]"
            >
              제품 패스포트 보기
            </Link>
          </LuxuryReveal>
        ) : null}
      </div>
    </MobileScreenLayout>
  );
}
