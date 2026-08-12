import type { UserInfo } from "@/store/useAuthStore";

export type StoredAccount = {
  id: string;
  password: string;
  email?: string;
  nickname?: string;
  gender?: "female" | "male";
  provider?: "local" | "kakao" | "naver";
  privacyConsent: boolean;
  marketingConsent: boolean;
};

const ACCOUNTS_KEY = "auth-accounts";

function readAccounts(): StoredAccount[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    return raw ? (JSON.parse(raw) as StoredAccount[]) : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: StoredAccount[]) {
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function registerLocalAccount(account: StoredAccount) {
  const accounts = readAccounts();
  const nextAccounts = accounts.filter((item) => item.id !== account.id);
  nextAccounts.push(account);
  writeAccounts(nextAccounts);

  return account;
}

export function findLocalAccount(id: string, password: string) {
  const accounts = readAccounts();
  return accounts.find((account) => account.id === id && account.password === password) ?? null;
}

export function createUserInfo(account: StoredAccount): UserInfo {
  return {
    id: account.id,
    email: account.email ?? null,
    nickname: account.nickname ?? null,
    profileImageUrl: null,
  };
}

