import { Suspense } from "react";

import { AccountDeletionOAuthCallbackScreen } from "@/components/auth/AccountDeletionOAuthCallbackScreen";

export default function AccountReauthenticationSuccessPage() {
  return (
    <Suspense>
      <AccountDeletionOAuthCallbackScreen />
    </Suspense>
  );
}
