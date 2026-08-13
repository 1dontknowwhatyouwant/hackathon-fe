"use client";

import { useEffect } from "react";

const RELOAD_KEY = "development-cache-reset";

export function DevelopmentCacheReset() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    const resetStaleBrowserState = async () => {
      const registrations =
        "serviceWorker" in navigator
          ? await navigator.serviceWorker.getRegistrations()
          : [];

      await Promise.all(
        registrations.map((registration) => registration.unregister()),
      );

      const cacheNames = "caches" in window ? await caches.keys() : [];
      await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));

      if (
        (registrations.length > 0 || cacheNames.length > 0) &&
        sessionStorage.getItem(RELOAD_KEY) !== "done"
      ) {
        sessionStorage.setItem(RELOAD_KEY, "done");
        window.location.reload();
      }
    };

    void resetStaleBrowserState();
  }, []);

  return null;
}
