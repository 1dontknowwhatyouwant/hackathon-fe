"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AuthTokenData, SessionUser } from "@/types/api";

export type UserInfo = SessionUser;

type AuthState = {
  accessToken: string | null;
  user: UserInfo | null;
  hasHydrated: boolean;
  setAccessToken: (accessToken: string | null) => void;
  setSession: (session: AuthTokenData) => void;
  setUser: (user: UserInfo) => void;
  clearSession: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

const toStoredUser = (user: UserInfo): UserInfo => ({
  userId: user.userId,
  email: user.email,
  nickname: user.nickname,
  gender: user.gender,
  profileImageUrl: user.profileImageUrl,
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      hasHydrated: false,
      setAccessToken: (accessToken) => set({ accessToken }),
      setSession: ({ accessToken, user }) =>
        set((state) => ({
          accessToken,
          user: user ? toStoredUser(user) : state.user,
        })),
      setUser: (user) => set({ user: toStoredUser(user) }),
      clearSession: () => set({ accessToken: null, user: null }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "auth-user",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
      skipHydration: true,
      version: 2,
      migrate: (persistedState) => {
        const state = persistedState as {
          user?: (Partial<UserInfo> & { id?: string }) | null;
        };
        const user = state.user;

        if (!user) {
          return { user: null };
        }

        const userId = user.userId ?? user.id;

        if (!userId) {
          return { user: null };
        }

        return {
          user: toStoredUser({
            userId,
            email: user.email,
            nickname: user.nickname,
            gender: user.gender,
            profileImageUrl: user.profileImageUrl,
          }),
        };
      },
    },
  ),
);
