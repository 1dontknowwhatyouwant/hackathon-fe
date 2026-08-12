"use client";

import { useEffect } from "react";

import { initializeAuthSession } from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";

export function AuthStoreHydrator() {
  useEffect(() => {
    let active = true;

    void (async () => {
      await useAuthStore.persist.rehydrate();

      if (active) {
        await initializeAuthSession();
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return null;
}
