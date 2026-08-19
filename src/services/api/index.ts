import { authApi } from "@/services/api/authApi";
import { catalogApi } from "@/services/api/catalogApi";
import { closetApi } from "@/services/api/closetApi";
import { intelligenceApi } from "@/services/api/intelligenceApi";
import { notificationApi } from "@/services/api/notificationApi";
import { profileApi } from "@/services/api/profileApi";
import { utilityApi } from "@/services/api/utilityApi";

export {
  authApi,
  catalogApi,
  closetApi,
  intelligenceApi,
  notificationApi,
  profileApi,
  utilityApi,
};

export const backendApi = {
  auth: authApi,
  profile: profileApi,
  catalog: catalogApi,
  closet: closetApi,
  intelligence: intelligenceApi,
  notifications: notificationApi,
  utility: utilityApi,
};
