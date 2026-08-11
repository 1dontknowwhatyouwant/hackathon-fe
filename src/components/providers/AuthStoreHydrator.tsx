"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/store/useAuthStore";

export function AuthStoreHydrator() {
  useEffect(() => {
    void useAuthStore.persist.rehydrate();
  }, []);

  return null;
}
