"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type UserInfo = {
  id: string;
  email?: string | null;
  nickname?: string | null;
  profileImageUrl?: string | null;
};

type AuthState = {
  user: UserInfo | null;
  hasHydrated: boolean;
  setUser: (user: UserInfo) => void;
  clearUser: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

const toStoredUser = (user: UserInfo): UserInfo => ({
  id: user.id,
  email: user.email,
  nickname: user.nickname,
  profileImageUrl: user.profileImageUrl,
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hasHydrated: false,
      setUser: (user) => set({ user: toStoredUser(user) }),
      clearUser: () => set({ user: null }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "auth-user",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
      skipHydration: true,
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);
