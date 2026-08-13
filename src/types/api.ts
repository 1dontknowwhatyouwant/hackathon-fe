export type ApiFieldError = {
  field: string;
  reason: string;
};

export type ApiErrorDetail = {
  code: string;
  message: string;
  fields?: ApiFieldError[];
  retryable?: boolean;
};

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  error: ApiErrorDetail;
};

export type ApiPage<T> = {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type PageQuery = {
  page?: number;
  size?: number;
  sort?: string | string[];
};

export type Gender = "MALE" | "FEMALE" | "NOT_SPECIFIED";
export type TermsType =
  | "SERVICE_TERMS"
  | "PRIVACY_POLICY"
  | "EMAIL_MARKETING";
export type OAuthProvider = "kakao" | "naver";

export type AccountDeletionReauthentication = {
  reauthenticated: true;
  expiresInSeconds: number;
};

export type AccountDeletionAccepted = {
  status: "DELETION_PENDING";
};

export type SessionUser = {
  userId: string;
  email?: string | null;
  nickname?: string | null;
  gender?: Gender | null;
  profileImageUrl?: string | null;
};

export type AuthTokenData = {
  accessToken: string;
  tokenType: "Bearer";
  expiresInSeconds: number;
  user?: SessionUser;
};

export type LoginRequest = {
  loginId: string;
  password: string;
};

export type TermsAgreement = {
  termsType: TermsType;
  termsVersion: string;
  agreed: boolean;
};

export type SignupRequest = {
  signupToken: string;
  loginId: string;
  password: string;
  passwordConfirm: string;
  termsAgreements: TermsAgreement[];
  nickname: string;
  gender: Gender;
};

export type EmailVerificationPurpose = "SIGNUP";

export type UserProfile = SessionUser & {
  loginType: "LOCAL" | "KAKAO" | "NAVER";
  loginId: string | null;
  email: string | null;
  preferenceCompleted: boolean;
  status: "ACTIVE" | "SUSPENDED" | "DELETION_PENDING" | "DELETED";
  version: number;
  createdAt: string;
};

export const itemCategories = [
  "BAG",
  "BACKPACK",
  "WALLET",
  "CARD_HOLDER",
  "CLOTHING",
  "SHOES",
  "JEWELRY",
  "ACCESSORY",
  "OTHER",
] as const;
export type ItemCategory = (typeof itemCategories)[number];

export const styleTags = ["CASUAL", "FORMAL", "NEAT", "GLAMOROUS"] as const;
export type StyleTag = (typeof styleTags)[number];

export const seasonTags = [
  "SPRING",
  "SUMMER",
  "AUTUMN",
  "WINTER",
  "ALL_SEASON",
] as const;
export type SeasonTag = (typeof seasonTags)[number];

export const occasionTags = [
  "DAILY",
  "DATE",
  "TRAVEL",
  "GATHERING",
  "CEREMONY",
  "OUTDOOR",
  "OTHER",
] as const;
export type OccasionTag = (typeof occasionTags)[number];

export const featureTags = [
  "COMPACT",
  "SPACIOUS",
  "MULTIWAY",
] as const;
export type FeatureTag = (typeof featureTags)[number];

export type CurrentSeasonTag = Exclude<SeasonTag, "ALL_SEASON">;

export const productTagLabels = {
  style: {
    CASUAL: "캐주얼",
    FORMAL: "포멀",
    NEAT: "깔끔한",
    GLAMOROUS: "화려한",
  },
  season: {
    SPRING: "봄",
    SUMMER: "여름",
    AUTUMN: "가을",
    WINTER: "겨울",
    ALL_SEASON: "사계절",
  },
  occasion: {
    DAILY: "데일리",
    DATE: "데이트",
    TRAVEL: "여행",
    GATHERING: "모임",
    CEREMONY: "격식 있는 자리",
    OUTDOOR: "야외 활동",
    OTHER: "기타",
  },
  feature: {
    COMPACT: "컴팩트",
    SPACIOUS: "넉넉한 수납",
    MULTIWAY: "멀티웨이",
  },
} as const satisfies {
  style: Record<StyleTag, string>;
  season: Record<SeasonTag, string>;
  occasion: Record<OccasionTag, string>;
  feature: Record<FeatureTag, string>;
};

export type PreferenceProfile = {
  completed: boolean;
  preferredColors: string[];
  preferredCategories: ItemCategory[];
  preferredStyleTags: StyleTag[];
  summary: string | null;
  confidence: number | null;
  analysisVersion: string | null;
  analyzedAt: string | null;
  version: number;
};

export type ProductSummary = {
  productId: string;
  brand: "MCM" | "OTHER";
  sku: string;
  name: string;
  category: ItemCategory;
  price: number;
  primaryColor: string;
  material: string;
  primaryImageUrl: string | null;
  favorited: boolean;
  isSample: boolean;
};

export type ProductDetail = ProductSummary & {
  description: string | null;
  productUrl: string | null;
  images: Array<{
    url: string;
    altText: string | null;
    sortOrder: number;
    primary: boolean;
  }>;
  tags: {
    style: StyleTag[];
    season: SeasonTag[];
    occasion: OccasionTag[];
    feature: FeatureTag[];
  };
};

export const productRecommendationScoreWeights = {
  style: 30,
  occasion: 25,
  season: 25,
  feature: 20,
} as const;

export type ProductRecommendationScore = {
  style: number;
  occasion: number;
  season: number;
  feature: number;
};

export type Recommendation = {
  recommendationId: string;
  generationType: "RULE_BASED";
  scorePolicyVersion: string;
  products: Array<{
    rank: number;
    score: number;
    scoreBreakdown: ProductRecommendationScore;
    reason: string;
    product: Pick<
      ProductSummary,
      | "productId"
      | "name"
      | "category"
      | "price"
      | "primaryImageUrl"
      | "favorited"
    >;
  }>;
  generatedAt: string;
};

export type MyItemSummary = {
  myItemId: string;
  name: string;
  brandName: string | null;
  category: ItemCategory;
  primaryColor: string;
  material: string;
  primaryImageUrl: string | null;
  createdAt: string;
};

export type MyItemDetail = Omit<MyItemSummary, "primaryImageUrl"> & {
  linkedProductId: string | null;
  materialSource: "PRODUCT_DATA" | "USER_CONFIRMED" | "AI_ESTIMATED";
  purchaseDate: string | null;
  purchasePrice: number | null;
  memo: string | null;
  images: Array<{ imageId: string; url: string; sortOrder: number }>;
  version: number;
  updatedAt: string;
};

export type ImagePurpose = "PROFILE" | "ITEM" | "AI_INPUT";
export type ImageAssetStatus =
  | "TEMPORARY"
  | "ACTIVE"
  | "DELETE_PENDING"
  | "DELETED";

export type AiJobType =
  | "PREFERENCE_ANALYSIS"
  | "ITEM_ANALYSIS"
  | "PURCHASE_UTILITY"
  | "STYLE_PLAN";
export type AiJobStatus = "PENDING" | "PROCESSING" | "SUCCEEDED" | "FAILED";

type AiJobIdentity = {
  jobId: string;
  type: AiJobType;
  createdAt: string;
};

export type AiJobAccepted = AiJobIdentity & {
  status: "PENDING";
  cached: boolean;
};

export type AiJobFallback = {
  type: "RULE_BASED" | "MANUAL";
  result: unknown;
};

export type AiJob =
  | (AiJobIdentity & {
      status: "PENDING" | "PROCESSING";
      result: null;
      fallback: null;
      error: null;
      completedAt: null;
    })
  | (AiJobIdentity & {
      status: "SUCCEEDED";
      result: unknown;
      fallback: null;
      error: null;
      completedAt: string;
    })
  | (AiJobIdentity & {
      status: "FAILED";
      result: null;
      fallback: AiJobFallback | null;
      error: ApiErrorDetail;
      completedAt: string;
    });

export type PurchaseUtilityAnalysis = {
  analysisId: string;
  product: Pick<
    ProductSummary,
    "productId" | "name" | "category" | "price" | "primaryImageUrl"
  >;
  utilityScore: number;
  compatibleItemCount: number;
  factors: {
    preferenceTagFitScore: number;
    styleCombinationScore: number;
    seasonUsabilityScore: number;
    ownedCategoryCombinationScore: number;
  };
  compatibleItems: Array<{
    myItemId: string;
    name: string;
    imageUrl: string | null;
    reason: string;
  }>;
  summary: string;
  explanationGenerationType: "AI" | "RULE_BASED";
  analyzedAt: string;
};

export type PurchaseUtilityJobResult =
  | {
      status: "READY";
      analysisId: string;
    }
  | {
      status: "INSUFFICIENT_DATA";
      analysisId: null;
      message: string;
    };

export type PlaceCategory =
  | "CAFE"
  | "RESTAURANT"
  | "CULTURE"
  | "ATTRACTION"
  | "SHOPPING"
  | "OTHER";

export type ApiPlace = {
  placeId: string;
  provider?: "KAKAO";
  providerPlaceId?: string;
  name: string;
  category: PlaceCategory;
  categoryName: string;
  address: string | null;
  roadAddress: string | null;
  latitude: number;
  longitude: number;
  placeUrl: string;
  saved: boolean;
};

export type ApiPlaceRecommendation = {
  rank: number;
  score: number;
  scoreBreakdown: {
    categorySuitability: number;
    distance: number;
  };
  reasonCode: string;
  place: ApiPlace;
};

export type UsageRecordItem = {
  myItemId: string;
  name: string;
  sortOrder: number;
};

export type UsageRecord = {
  usageRecordId: string;
  wornAt: string;
  occasion: OccasionTag;
  placeName: string | null;
  weatherSummary: string | null;
  memo: string | null;
  items: UsageRecordItem[];
  version: number;
  createdAt: string;
};

export type ItemUtilization =
  | {
      myItemId: string;
      calculable: true;
      usageCount: number;
      lastUsedAt: string | null;
      daysSinceLastUse: number | null;
      utilizationScore: number;
      utilizationLevel: "LOW" | "MEDIUM" | "HIGH";
      policyVersion: string;
      missingData: [];
    }
  | {
      myItemId: string;
      calculable: false;
      usageCount: number;
      lastUsedAt: string | null;
      daysSinceLastUse: null;
      utilizationScore: null;
      utilizationLevel: null;
      policyVersion: string;
      missingData: string[];
    };

export type ReuseRecommendations = {
  generationType: "RULE_BASED";
  items: Array<{
    myItemId: string;
    name: string;
    lastUsedAt: string | null;
    usageCount: number;
    reasonCode: "LONG_UNUSED";
  }>;
};

export type ProductPassport = {
  myItemId: string;
  productInfo: {
    linkedProductId: string | null;
    brandName: string | null;
    name: string;
    category: ItemCategory;
    primaryColor: string;
    material: string;
    images: Array<{ imageId: string; url: string; sortOrder: number }>;
  };
  purchaseInfo: {
    purchaseDate: string | null;
    purchasePrice: number | null;
  };
  usageSummary: {
    usageCount: number;
    lastUsedAt: string | null;
  };
  recentUsageRecords: UsageRecord[];
};

export type CareGuide = {
  myItemId: string;
  available: boolean;
  material: string;
  guide: Array<{
    code: string;
    title: string;
    description: string;
  }>;
  schedule: {
    recommendedIntervalDays: number | null;
    recommendedNextCareAt: string | null;
  };
};

export type StylePlanSummary = {
  stylePlanId: string;
  title: string;
  occasion: OccasionTag;
  plannedAt: string | null;
  status: "DRAFT" | "CONFIRMED" | "COMPLETED" | "CANCELED";
  thumbnailImageUrl: string | null;
  ownedItemCount: number;
  recommendedProductCount: number;
  createdAt: string;
};

export type HomeData = {
  user: {
    nickname: string;
    preferenceCompleted: boolean;
    myItemCount: number;
  };
  latestStylePlan: Pick<
    StylePlanSummary,
    "stylePlanId" | "title" | "thumbnailImageUrl"
  > | null;
  preferenceProducts: Array<{
    productId: string;
    name: string;
    preferenceMatchScore: number;
    primaryImageUrl: string | null;
  }>;
};
