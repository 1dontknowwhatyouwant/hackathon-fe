export const dummyCareGuide = {
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
    recommendedNextCareAt: "2026-08-31T09:00:00+09:00",
  },
};

export const dummyCareCalendar = {
  referenceDate: "2026-08-19T09:00:00+09:00",
  monthLabel: "AUGUST 2026",
  highlightedDay: 19,
  reminders: [
    {
      id: "conditioning-2026-08-19",
      dateLabel: "8/19",
      title: "가죽 컨디셔닝",
    },
    {
      id: "cleaning-2026-08-31",
      dateLabel: "8/31",
      title: "클리닝 예정",
    },
  ],
} as const;
