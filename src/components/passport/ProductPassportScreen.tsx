"use client";

import { useEffect, useState } from "react";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BackButton } from "@/components/common/navigation/BackButton";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";
import { backendApi } from "@/services/api";
import type { ProductPassport } from "@/types/api";

type ProductPassportScreenProps = { itemId: string };
const priceFormatter = new Intl.NumberFormat("ko-KR");

function valueOrEmpty(value: string | number | null) {
  if (value === null || value === "") return "정보 없음";
  return String(value);
}

export function ProductPassportScreen({ itemId }: ProductPassportScreenProps) {
  const [passport, setPassport] = useState<ProductPassport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void backendApi.closet
      .getProductPassport(itemId)
      .then((response) => setPassport(response.data.data))
      .catch(() => setError("제품 패스포트를 불러오지 못했습니다."));
  }, [itemId]);

  const details = passport
    ? [
        ["내 아이템 ID", passport.myItemId],
        ["카테고리", passport.productInfo.category],
        ["색상", valueOrEmpty(passport.productInfo.primaryColor)],
        ["소재", valueOrEmpty(passport.productInfo.material)],
        ["SKU", valueOrEmpty(passport.productInfo.sku)],
        ["구매일", valueOrEmpty(passport.purchaseInfo.purchaseDate)],
        ["구매처", valueOrEmpty(passport.purchaseInfo.purchasePlace)],
        ["주문번호", valueOrEmpty(passport.purchaseInfo.purchaseOrderNumber)],
        ["구매가격", passport.purchaseInfo.purchasePrice === null ? "정보 없음" : `₩ ${priceFormatter.format(passport.purchaseInfo.purchasePrice)}`],
      ]
    : [];

  return (
    <MobileScreenLayout contentClassName="bg-white px-6 pt-4 pb-10">
      <LuxuryReveal><BackButton /></LuxuryReveal>
      <LuxuryReveal className="mt-4" delay={40}>
        <ScreenHeader eyebrow="PRODUCT PASSPORT" title="제품 패스포트" description="등록된 제품과 구매 정보를 확인해요" />
      </LuxuryReveal>

      {!passport && !error ? <p className="mt-10 text-center text-[12px] text-[#777780]">패스포트를 불러오는 중입니다.</p> : null}
      {error ? <p role="alert" className="mt-8 rounded-[14px] bg-[#f8eeee] px-4 py-3 text-[12px] text-[#9a4545]">{error}</p> : null}

      {passport ? (
        <>
          <LuxuryReveal className="mt-8" delay={90}>
            <section className="relative overflow-hidden rounded-[24px] bg-black p-6 text-white shadow-[0_18px_40px_rgba(0,0,0,0.2)]">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_25%,rgba(255,255,255,0.12)_48%,transparent_70%)]" aria-hidden="true" />
              <div className="relative z-10 flex min-h-[210px] flex-col">
                <div className="flex justify-between gap-4">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-white/70">DIGITAL PRODUCT PASSPORT</span>
                  <span className="font-bold">{passport.productInfo.brandName ?? "MCM"}</span>
                </div>
                <div className="mt-auto">
                  <h2 className="text-[20px] font-bold">{passport.productInfo.name}</h2>
                  <p className="mt-2 font-mono text-[10px] tracking-[0.08em] text-white/70">{passport.myItemId}</p>
                </div>
              </div>
            </section>
          </LuxuryReveal>

          <LuxuryReveal className="mt-8" delay={150}>
            <dl className="overflow-hidden rounded-[20px] border border-[#e2ded8] bg-white px-4">
              {details.map(([label, value], index) => (
                <div key={label} className={`flex items-start justify-between gap-5 py-4 ${index < details.length - 1 ? "border-b border-[#ece9e5]" : ""}`}>
                  <dt className="shrink-0 text-[11px] text-[#8c8c94]">{label}</dt>
                  <dd className="text-right text-[12px] font-bold text-[#27272c]">{value}</dd>
                </div>
              ))}
            </dl>
          </LuxuryReveal>
        </>
      ) : null}
    </MobileScreenLayout>
  );
}
