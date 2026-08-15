import { Suspense } from "react";

import { AccountDeletionScreen } from "@/components/auth/AccountDeletionScreen";

export default function AccountDeletionPage() {
  return (
    <Suspense>
      <AccountDeletionScreen />
    </Suspense>
  );
}
