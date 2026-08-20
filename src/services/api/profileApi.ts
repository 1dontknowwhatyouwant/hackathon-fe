import { api } from "@/lib/axios";
import type {
  ApiSuccessResponse,
  ColorGroup,
  Gender,
  HomeData,
  ItemCategory,
  PreferenceProfile,
  StyleTag,
  UserNotificationSettings,
  UserProfile,
} from "@/types/api";

type UpdateMyProfileRequest = {
  nickname?: string;
  gender?: Gender;
};

type SavePreferenceRequest = {
  preferredColors: ColorGroup[];
  preferredCategories: ItemCategory[];
  preferredStyleTags: StyleTag[];
  version: number;
};

export const profileApi = {
  getMe: () => api.get<ApiSuccessResponse<UserProfile>>("/users/me"),

  updateMe: (body: UpdateMyProfileRequest) =>
    api.patch<ApiSuccessResponse<UserProfile>>("/users/me", body),

  getNotificationSettings: (signal?: AbortSignal) =>
    api.get<ApiSuccessResponse<UserNotificationSettings>>(
      "/users/me/notification-settings",
      { signal },
    ),

  updateNotificationSettings: (body: UserNotificationSettings) =>
    api.patch<ApiSuccessResponse<UserNotificationSettings>>(
      "/users/me/notification-settings",
      body,
    ),

  deleteMe: () => api.delete<void>("/users/me"),

  getPreferences: () =>
    api.get<ApiSuccessResponse<PreferenceProfile>>("/preferences"),

  savePreferences: (body: SavePreferenceRequest) =>
    api.put<ApiSuccessResponse<PreferenceProfile>>("/preferences", body),

  getHome: () => api.get<ApiSuccessResponse<HomeData>>("/home"),
};
