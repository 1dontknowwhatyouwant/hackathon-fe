export type ApiFieldError = {
  field: string;
  reason: string;
};

export type ApiErrorDetail = {
  code: string;
  message: string;
  fields?: ApiFieldError[];
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
  "LIGHTWEIGHT",
  "COMPACT",
  "SPACIOUS",
  "MULTIWAY",
  "STATEMENT",
  "LOGO",
] as const;
export type FeatureTag = (typeof featureTags)[number];

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

export type Recommendation = {
  recommendationId: string;
  generationType: "AI" | "RULE_BASED" | "MANUAL";
  summary: string;
  products: Array<{
    rank: number;
    score: number;
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

export type MyItemDetail = MyItemSummary & {
  linkedProductId: string | null;
  materialSource: "PRODUCT_DATA" | "USER_CONFIRMED" | "AI_ESTIMATED";
  status: "OWNED" | "REPAIRING" | "SOLD" | "DISPOSED";
  purchaseDate: string | null;
  purchasePrice: number | null;
  memo: string | null;
  images: Array<{ imageId: string; url: string; sortOrder: number }>;
  version: number;
  updatedAt: string;
};

export type ImagePurpose = "PROFILE" | "ITEM" | "AI_INPUT";

export type AiJobType =
  | "PREFERENCE_ANALYSIS"
  | "ITEM_ANALYSIS"
  | "PURCHASE_UTILITY"
  | "STYLE_PLAN";
export type AiJobStatus = "PENDING" | "PROCESSING" | "SUCCEEDED" | "FAILED";

export type AiJobAccepted = {
  jobId: string;
  type: AiJobType;
  status: AiJobStatus;
  cached: boolean;
  createdAt: string;
};

export type AiJob = AiJobAccepted & {
  result: unknown | null;
  fallback: unknown | null;
  error: ApiErrorDetail | null;
  completedAt: string | null;
};

export type PurchaseUtilityAnalysis = {
  analysisId: string;
  product: Pick<
    ProductSummary,
    "productId" | "name" | "category" | "price" | "primaryImageUrl"
  >;
  utilityScore: number;
  compatibleItemCount: number;
  duplicateSimilarityScore: number;
  factors: {
    categoryCompatibility: number;
    colorCompatibility: number;
    styleCompatibility: number;
    duplicationPenalty: number;
  };
  compatibleItems: Array<{
    myItemId: string;
    name: string;
    imageUrl: string | null;
    reason: string;
  }>;
  summary: string;
  analyzedAt: string;
};

export type PlaceCategory =
  | "EXHIBITION"
  | "CAFE"
  | "SHOPPING"
  | "RESTAURANT"
  | "OTHER";

export type ApiPlace = {
  placeId: string;
  provider?: "KAKAO";
  providerPlaceId?: string;
  name: string;
  categoryName: string;
  address?: string;
  roadAddress: string | null;
  latitude: number;
  longitude: number;
  placeUrl: string;
  saved: boolean;
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
  recommendedProducts: Array<{
    productId: string;
    name: string;
    matchScore: number;
    primaryImageUrl: string | null;
  }>;
};
