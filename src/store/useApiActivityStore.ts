"use client";

import { create } from "zustand";

type ApiActivityState = {
  activeRequestIds: Record<string, true>;
  beginRequest: (requestId: string) => void;
  finishRequest: (requestId: string) => void;
};

export const useApiActivityStore = create<ApiActivityState>((set) => ({
  activeRequestIds: {},
  beginRequest: (requestId) =>
    set((state) => ({
      activeRequestIds: {
        ...state.activeRequestIds,
        [requestId]: true,
      },
    })),
  finishRequest: (requestId) =>
    set((state) => {
      if (!state.activeRequestIds[requestId]) {
        return state;
      }

      const activeRequestIds = { ...state.activeRequestIds };
      delete activeRequestIds[requestId];

      return { activeRequestIds };
    }),
}));

let requestSequence = 0;

export function createApiRequestId() {
  requestSequence += 1;
  return `api-request-${requestSequence}`;
}
