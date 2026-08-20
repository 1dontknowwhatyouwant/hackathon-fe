"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ConfirmDialog } from "@/components/common/feedback/ConfirmDialog";
import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BottomNavigation } from "@/components/common/navigation/BottomNavigation";
import { HomePreferenceProducts } from "@/components/dashboard/HomePreferenceProducts";
import { useAuthStore } from "@/store/useAuthStore";
import { useHomeStore } from "@/store/useHomeStore";
import { useMenuDataStore } from "@/store/useMenuDataStore";
import { useProductRecommendationStore } from "@/store/useProductRecommendationStore";

type WeatherSummary = {
  locationLabel: string;
  temperature: number;
  condition: string;
};

const openMeteoWeatherCodeMap: Record<number, { label: string; icon: string }> =
  {
    0: { label: "맑음", icon: "☀" },
    1: { label: "대체로 맑음", icon: "🌤" },
    2: { label: "구름 조금", icon: "⛅" },
    3: { label: "흐림", icon: "☁" },
    45: { label: "안개", icon: "🌫" },
    48: { label: "서리 낀 안개", icon: "🌫" },
    51: { label: "이슬비", icon: "🌦" },
    53: { label: "이슬비", icon: "🌦" },
    55: { label: "강한 이슬비", icon: "🌧" },
    61: { label: "비", icon: "🌧" },
    63: { label: "비", icon: "🌧" },
    65: { label: "강한 비", icon: "🌧" },
    66: { label: "어는 비", icon: "🌧" },
    67: { label: "강한 어는 비", icon: "🌧" },
    71: { label: "눈", icon: "🌨" },
    73: { label: "눈", icon: "🌨" },
    75: { label: "강한 눈", icon: "🌨" },
    77: { label: "진눈깨비", icon: "🌨" },
    80: { label: "소나기", icon: "🌦" },
    81: { label: "소나기", icon: "🌦" },
    82: { label: "강한 소나기", icon: "🌧" },
    85: { label: "눈 소나기", icon: "🌨" },
    86: { label: "강한 눈 소나기", icon: "🌨" },
    95: { label: "뇌우", icon: "⛈" },
    96: { label: "뇌우", icon: "⛈" },
    99: { label: "강한 뇌우", icon: "⛈" },
  };


function getGeolocationErrorMessage(error: GeolocationPositionError) {
  if (error.code === error.PERMISSION_DENIED) {
    return "위치 권한이 허용되지 않았습니다.";
  }

  if (error.code === error.POSITION_UNAVAILABLE) {
    return "현재 위치를 찾지 못했습니다.";
  }

  if (error.code === error.TIMEOUT) {
    return "위치 확인 시간이 초과되었습니다.";
  }

  return "위치 정보를 불러오지 못했습니다.";
}

function pickLocationLabel(parts: Array<string | undefined>, fallback: string) {
  const candidates = parts
    .flatMap((part) => (part ? part.split(/[\s·,/()-]+/) : []))
    .map((part) => part.trim())
    .filter(Boolean);

  const administrativeSuffixes = ["동", "읍", "면", "리", "구", "군", "시"];

  for (const suffix of administrativeSuffixes) {
    const matchedLocation = candidates.find((part) => part.endsWith(suffix));
    if (matchedLocation) {
      return matchedLocation;
    }
  }

  return candidates[0] ?? fallback;
}

function pickBestLocationLabel(
  address: Partial<{
    neighbourhood: string;
    suburb: string;
    quarter: string;
    city_district: string;
    borough: string;
    town: string;
    village: string;
    city: string;
    county: string;
    state: string;
  }>,
  fallback: string,
) {
  return pickLocationLabel(
    [
      address.neighbourhood,
      address.suburb,
      address.quarter,
      address.city_district,
      address.borough,
      address.town,
      address.village,
      address.city,
      address.county,
      address.state,
    ],
    fallback,
  );
}

async function fetchWeatherSummary(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<WeatherSummary> {
  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`,
    { signal },
  );

  if (!weatherResponse.ok) {
    throw new Error("날씨 정보를 불러오지 못했습니다.");
  }

  const weatherData: {
    current?: { temperature_2m?: number; weather_code?: number };
  } = await weatherResponse.json();

  const weatherCode = weatherData.current?.weather_code ?? -1;
  const weatherInfo =
    openMeteoWeatherCodeMap[weatherCode] ?? openMeteoWeatherCodeMap[0];

  return {
    temperature: Math.round(weatherData.current?.temperature_2m ?? 0),
    condition: weatherInfo.label,
    locationLabel: "현재 위치",
  };
}

async function fetchLocationLabel(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
) {
  const geocodeResponse = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=ko`,
    { signal },
  );

  if (!geocodeResponse.ok) {
    throw new Error("위치 정보를 불러오지 못했습니다.");
  }

  const geocodeData: {
    address?: Partial<{
      neighbourhood: string;
      suburb: string;
      quarter: string;
      city_district: string;
      borough: string;
      town: string;
      village: string;
      city: string;
      county: string;
      state: string;
    }>;
  } = await geocodeResponse.json();

  return pickBestLocationLabel(geocodeData.address ?? {}, "현재 위치");
}

const actionCards = [
  {
    title: "스마트 착용 추천",
    description: "세부 정보를 확인하세요",
    href: "/personalize",
  },
  {
    title: "내 제품 관리 알림",
    description: "소재별 관리 안내와 일정을 확인하세요",
    href: "/items",
  },
  {
    title: "구매 전 활용 체크",
    description: "세부 정보를 확인하세요",
    href: "/recommendations",
  },
];

function ActionCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex h-[72px] items-center gap-3 rounded-[18px] border border-[#e5e2de] bg-[#faf9f7] px-[14px] transition-transform active:scale-[0.99]"
    >
      <div className="h-[44px] w-[44px] shrink-0 rounded-[14px] bg-[#ece6dc]" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-bold leading-[18px] text-[#15151a]">
          {title}
        </p>
        <p className="mt-[3px] text-[12px] leading-[14px] text-[#9898a0]">
          {description}
        </p>
      </div>
      <span
        aria-hidden="true"
        className="text-[28px] leading-none text-[#7d7d86]"
      >
        ›
      </span>
    </Link>
  );
}

function ProductRowCard({
  title,
  subtitle,
  href,
  imageUrl,
}: {
  title: string;
  subtitle: string;
  href: string;
  imageUrl?: string;
}) {
  return (
    <Link
      href={href}
      className="flex h-[72px] items-center gap-3 rounded-[18px] border border-[#e5e2de] bg-[#faf9f7] px-[14px] transition-transform active:scale-[0.99]"
    >
      <div
        className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[14px] bg-[#ece6dc] bg-cover bg-center"
        style={imageUrl ? { backgroundImage: `url("${imageUrl}")` } : undefined}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-bold leading-[18px] text-[#15151a]">
          {title}
        </p>
        <p className="mt-[3px] truncate text-[12px] leading-[14px] text-[#9898a0]">
          {subtitle}
        </p>
      </div>
      <span
        aria-hidden="true"
        className="text-[28px] leading-none text-[#7d7d86]"
      >
        ›
      </span>
    </Link>
  );
}

export function DashboardScreen() {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const profile = useMenuDataStore((state) => state.profile);
  const loadProfile = useMenuDataStore((state) => state.loadProfile);
  const homeData = useHomeStore((state) => state.data);
  const isHomeLoading = useHomeStore((state) => state.isLoading);
  const homeError = useHomeStore((state) => state.error);
  const loadHome = useHomeStore((state) => state.loadHome);
  const products = useProductRecommendationStore((state) => state.products);
  const productStatus = useProductRecommendationStore((state) => state.status);
  const loadProducts = useProductRecommendationStore(
    (state) => state.loadProducts,
  );
  const [weather, setWeather] = useState<WeatherSummary | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [locationRequestVersion, setLocationRequestVersion] = useState(0);
  const [showLocationPermissionDialog, setShowLocationPermissionDialog] =
    useState(false);

  useEffect(() => {
    if (hasHydrated && !profile) {
      void loadProfile();
    }
    if (hasHydrated && !homeData) {
      void loadHome();
    }
  }, [hasHydrated, homeData, loadHome, loadProfile, profile]);

  useEffect(() => {
    if (!hasHydrated) return;
    return loadProducts("ALL");
  }, [hasHydrated, loadProducts]);

  useEffect(() => {
    const controller = new AbortController();

    const loadWeather = async () => {
      try {
        if (!navigator.geolocation) {
          throw new Error("현재 위치를 사용할 수 없습니다.");
        }

        if (locationRequestVersion === 0 && navigator.permissions) {
          try {
            const permission = await navigator.permissions.query({
              name: "geolocation",
            });

            if (permission.state !== "granted") {
              setWeatherError("위치 허용 시 현재 날씨를 보여드려요.");
              setShowLocationPermissionDialog(true);
              return;
            }
          } catch {
            // Permissions API를 지원하지 않는 브라우저는 위치 요청 단계로 진행합니다.
          }
        }

        const coordinates = await new Promise<{
          latitude: number;
          longitude: number;
        }>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) =>
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }),
          (error) => {
            if (error.code === error.PERMISSION_DENIED) {
              setShowLocationPermissionDialog(true);
            }
            reject(new Error(getGeolocationErrorMessage(error)));
          },
          {
            enableHighAccuracy: false,
            timeout: 10_000,
            maximumAge: 30 * 60 * 1_000,
            },
          );
        });

        const summary = await fetchWeatherSummary(
          coordinates.latitude,
          coordinates.longitude,
          controller.signal,
        );
        let locationLabel = "현재 위치";

        try {
          locationLabel = await fetchLocationLabel(
            coordinates.latitude,
            coordinates.longitude,
            controller.signal,
          );
        } catch {
          locationLabel = "현재 위치";
        }

        if (!controller.signal.aborted) {
          setWeather({ ...summary, locationLabel });
          setWeatherError(null);
          setShowLocationPermissionDialog(false);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setWeather(null);
          setWeatherError(
            error instanceof Error
              ? error.message
              : "날씨 정보를 불러오지 못했습니다.",
          );
        }
      }
    };

    void loadWeather();

    return () => controller.abort();
  }, [locationRequestVersion]);

  const nickname = profile?.nickname?.trim() || "사용자";

  return (
    <MobileScreenLayout
      figmaNodeId="96:142"
      contentClassName="bg-white px-6 pt-[46px] pb-8"
      bottomNavigation={<BottomNavigation activeItem="home" />}
    >
      <section className="text-[#15151a]">
        <LuxuryReveal>
          <div>
            <p className="text-[11px] font-bold tracking-[0.02em] text-[#8b7355]">
              GOOD MORNING, {nickname.toUpperCase()}
            </p>
            <h1 className="mt-[6px] text-[28px] leading-[1.14] font-bold tracking-[-0.05em]">
              오늘 뭐 입을래?
            </h1>
            <p className="mt-[8px] text-[14px] leading-[1.35] text-[#777780]">
              {weather ? (
                <span className="whitespace-nowrap">
                  {weather.temperature}° · {weather.condition} ·{" "}
                  {weather.locationLabel}
                </span>
              ) : (
                weatherError ?? "위치 허용 시 현재 날씨를 보여드려요."
              )}
            </p>
          </div>
        </LuxuryReveal>

        <LuxuryReveal className="mt-10" delay={80}>
          <article className="overflow-hidden rounded-[22px] bg-[#16161b] px-5 py-[22px] shadow-[0_12px_30px_rgba(22,22,27,0.12)]">
            <p className="text-[12px] font-bold tracking-[0.02em] text-[#b89a72]">
              최근 스타일 플랜
            </p>
            <h2 className="mt-4 max-w-[230px] text-[22px] font-bold leading-[1.2] tracking-[-0.04em] text-white">
              {homeData?.latestStylePlan?.title ??
                "아직 저장한 스타일 플랜이 없어요"}
            </h2>
          </article>
        </LuxuryReveal>

        <div className="mt-8 space-y-4">
          {actionCards.map((card, index) => (
            <LuxuryReveal key={card.title} delay={160 + index * 70}>
              <ActionCard {...card} />
            </LuxuryReveal>
          ))}
        </div>

        <LuxuryReveal className="mt-10" delay={390}>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="mt-1 text-[20px] font-bold tracking-[-0.035em]">
                MCM 제품
              </h2>
              <p className="mt-[10px] text-[13px] leading-4 text-[#777780]">
                취향과 잘 맞는 제품을 더 둘러보세요
              </p>
            </div>
            <Link
              href="/recommendations"
              className="text-[11px] font-bold text-[#777780]"
            >
              더보기
            </Link>
          </div>
          <ul className="space-y-[10px]">
            {products.slice(0, 4).map((product) => (
              <li key={product.id}>
                <ProductRowCard
                  href={`/recommendations/${product.id}`}
                  title={product.displayName}
                  subtitle={product.modelName}
                  imageUrl={product.imageUrl}
                />
              </li>
            ))}
          </ul>
          {productStatus === "loading" && products.length === 0 ? (
            <p className="py-6 text-center text-[12px] text-[#777780]">
              제품을 불러오는 중입니다.
            </p>
          ) : null}
          {productStatus === "error" ? (
            <p className="py-6 text-center text-[12px] text-[#9a4545]">
              제품 목록을 불러오지 못했습니다.
            </p>
          ) : null}
        </LuxuryReveal>

        <LuxuryReveal className="mt-10" delay={460}>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.04em] text-[#8b7355]">
                FOR YOUR TASTE
              </p>
              <h2 className="mt-1 text-[20px] font-bold tracking-[-0.035em]">
                취향에 맞는 제품
              </h2>
            </div>
            <Link
              href="/preferences"
              className="text-[11px] font-bold text-[#777780]"
            >
              취향 수정
            </Link>
          </div>
          {homeError ? (
            <p className="mb-3 text-[10px] leading-4 text-[#9a6d45]">
              {homeError}
            </p>
          ) : null}
          <HomePreferenceProducts
            products={homeData?.recommendedProducts ?? []}
            isLoading={isHomeLoading}
          />
        </LuxuryReveal>
      </section>

      <ConfirmDialog
        open={showLocationPermissionDialog}
        title="현재 위치를 허용해 주세요"
        description="현재 위치의 날씨와 지역 정보를 보여드리기 위해 위치 접근이 필요해요. 이미 차단했다면 브라우저의 사이트 설정에서 위치 권한을 허용한 뒤 다시 눌러 주세요."
        cancelLabel="나중에"
        confirmLabel="위치 허용"
        onCancel={() => setShowLocationPermissionDialog(false)}
        onConfirm={() => {
          setShowLocationPermissionDialog(false);
          setWeatherError(null);
          setLocationRequestVersion((current) => current + 1);
        }}
      />
    </MobileScreenLayout>
  );
}
