import { api } from "@/lib/axios";
import type {
  ApiSuccessResponse,
  Gender,
  HomeData,
  ItemCategory,
  PreferenceProfile,
  StyleTag,
  UserProfile,
} from "@/types/api";

type UpdateMyProfileRequest = {
  nickname?: string;
  gender?: Gender;
  version: number;
};

type SavePreferenceRequest = {
  preferredColors: string[];
  preferredCategories: ItemCategory[];
  preferredStyleTags: StyleTag[];
  aiJobId: string | null;
  version: number;
};

export const profileApi = {
  getMe: () => api.get<ApiSuccessResponse<UserProfile>>("/users/me"),

  updateMe: (body: UpdateMyProfileRequest) =>
    api.patch<ApiSuccessResponse<UserProfile>>("/users/me", body),

  getPreferences: () =>
    api.get<ApiSuccessResponse<PreferenceProfile>>("/preferences/me"),

  savePreferences: (body: SavePreferenceRequest) =>
    api.put<ApiSuccessResponse<PreferenceProfile>>("/preferences/me", body),

  getHome: () => api.get<ApiSuccessResponse<HomeData>>("/home"),
};
