"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { useAuthStore } from "@/store/useAuthStore";

const publicRoutePrefixes = ["/login", "/signup", "/auth/"];

function isPublicRoute(pathname: string) {
  return pathname === "/" || publicRoutePrefixes.some((prefix) => pathname.startsWith(prefix));
}

type AuthRouteGuardProps = {
  children: ReactNode;
};

export function AuthRouteGuard({ children }: AuthRouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!hasHydrated || isPublicRoute(pathname) || accessToken) {
      return;
    }

    const query = window.location.search.slice(1);
    const returnTo = query ? `${pathname}?${query}` : pathname;
    router.replace(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  }, [accessToken, hasHydrated, pathname, router]);

  if (!hasHydrated && !isPublicRoute(pathname)) {
    return null;
  }

  if (!isPublicRoute(pathname) && !accessToken) {
    return null;
  }

  return <>{children}</>;
}
