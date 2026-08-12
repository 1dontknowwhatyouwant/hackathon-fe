import { authApi } from "@/services/api/authApi";
import { catalogApi } from "@/services/api/catalogApi";
import { closetApi } from "@/services/api/closetApi";
import { intelligenceApi } from "@/services/api/intelligenceApi";
import { profileApi } from "@/services/api/profileApi";

export { authApi, catalogApi, closetApi, intelligenceApi, profileApi };

export const backendApi = {
  auth: authApi,
  profile: profileApi,
  catalog: catalogApi,
  closet: closetApi,
  intelligence: intelligenceApi,
};
