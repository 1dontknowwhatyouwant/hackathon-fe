import type {
  CareGuide,
  ItemUtilization,
  ReuseRecommendations,
  UsageRecord,
} from "@/types/api";

export const dummyItemUtilization: ItemUtilization = {
  myItemId: "item-04",
  calculable: true,
  usageCount: 12,
  lastUsedAt: "2026-07-20T02:00:00Z",
  daysSinceLastUse: 25,
  utilizationScore: 72,
  utilizationLevel: "MEDIUM",
  policyVersion: "utilization-v1",
  missingData: [],
};

export const dummyReuseRecommendations: ReuseRecommendations = {
  generationType: "RULE_BASED",
  items: [
    {
      myItemId: "item-01",
      name: "오프화이트 셔츠",
      lastUsedAt: "2026-06-10T02:00:00Z",
      usageCount: 2,
      reasonCode: "LONG_UNUSED",
    },
  ],
};

export const dummyRecentUsageRecords: UsageRecord[] = [
  {
    usageRecordId: "usage-1001",
    wornAt: "2026-07-20T02:00:00Z",
    occasion: "DATE",
    placeName: "성수",
    weatherSummary: "맑음 · 27°",
    memo: "쇼퍼백과 데님을 함께 매치",
    items: [
      {
        myItemId: "item-04",
        name: "Aren Shopper in Visetos",
        sortOrder: 0,
      },
      {
        myItemId: "item-02",
        name: "와이드 데님",
        sortOrder: 1,
      },
    ],
    version: 0,
    createdAt: "2026-07-20T09:00:00Z",
  },
];

export const dummyCareGuide: CareGuide = {
  myItemId: "item-04",
  available: true,
  material: "LEATHER",
  guide: [
    {
      code: "STORAGE",
      title: "보관",
      description: "직사광선과 습기를 피해 더스트백에 보관해 주세요.",
    },
    {
      code: "CLEANING",
      title: "표면 관리",
      description: "마른 부드러운 천으로 결을 따라 가볍게 닦아 주세요.",
    },
    {
      code: "MOISTURE",
      title: "수분 주의",
      description: "물에 젖으면 문지르지 말고 그늘에서 자연 건조해 주세요.",
    },
  ],
  schedule: {
    recommendedIntervalDays: 28,
    recommendedNextCareAt: null,
  },
};
