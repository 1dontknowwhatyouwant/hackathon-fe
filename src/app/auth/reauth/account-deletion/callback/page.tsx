import { Suspense } from "react";

import { AccountDeletionOAuthCallbackScreen } from "@/components/auth/AccountDeletionOAuthCallbackScreen";

export default function AccountDeletionOAuthCallbackPage() {
  return (
    <Suspense>
      <AccountDeletionOAuthCallbackScreen />
    </Suspense>
  );
}
