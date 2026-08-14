"use client";

import { create } from "zustand";

import type { ItemCategory } from "@/types/api";

export type ItemAnalysisValues = {
  category: ItemCategory;
  primaryColor: string;
  material: string;
};

export type ItemRegistrationDraft = {
  name: string;
  brandName: string;
  category: ItemCategory | "";
  primaryColor: string;
  material: string;
  purchaseDate: string;
  purchasePrice: string;
  memo: string;
};

export type PendingItemImageUpload = {
  myItemId: string;
  itemName: string;
  file: File | null;
  previewUrl: string | null;
  fileName: string | null;
};

type AnalysisStatus = "IDLE" | "PROCESSING" | "SUCCEEDED" | "FAILED";

type ItemRegistrationState = {
  draft: ItemRegistrationDraft;
  photoFile: File | null;
  photoPreviewUrl: string | null;
  photoName: string | null;
  analysisStatus: AnalysisStatus;
  analysisMessage: string | null;
  aiJobId: string | null;
  materialSource: "USER_CONFIRMED" | "AI_ESTIMATED";
  createdItemId: string | null;
  pendingImageUpload: PendingItemImageUpload | null;
  updateDraft: (patch: Partial<ItemRegistrationDraft>) => void;
  updateMaterial: (material: string) => void;
  setPhoto: (file: File, previewUrl: string) => void;
  clearPhoto: () => void;
  startAnalysis: () => void;
  applyAnalysis: (values: ItemAnalysisValues, aiJobId: string) => void;
  failAnalysis: (message: string) => void;
  markItemCreated: (myItemId: string) => void;
  markImageUploadPending: (myItemId: string) => void;
  setPendingImageFile: (file: File, previewUrl: string) => void;
  clearPendingImageUpload: () => void;
  resetDraft: () => void;
};

const emptyDraft: ItemRegistrationDraft = {
  name: "",
  brandName: "",
  category: "",
  primaryColor: "",
  material: "",
  purchaseDate: "",
  purchasePrice: "",
  memo: "",
};

export const useItemRegistrationStore = create<ItemRegistrationState>((set) => ({
  draft: { ...emptyDraft },
  photoFile: null,
  photoPreviewUrl: null,
  photoName: null,
  analysisStatus: "IDLE",
  analysisMessage: null,
  aiJobId: null,
  materialSource: "USER_CONFIRMED",
  createdItemId: null,
  pendingImageUpload: null,

  updateDraft: (patch) =>
    set((state) => ({ draft: { ...state.draft, ...patch } })),

  updateMaterial: (material) =>
    set((state) => ({
      draft: { ...state.draft, material },
      materialSource:
        state.analysisStatus === "SUCCEEDED"
          ? "USER_CONFIRMED"
          : state.materialSource,
    })),

  setPhoto: (file, previewUrl) =>
    set({
      photoFile: file,
      photoPreviewUrl: previewUrl,
      photoName: file.name,
      analysisStatus: "IDLE",
      analysisMessage: null,
      aiJobId: null,
    }),

  clearPhoto: () =>
    set({
      photoFile: null,
      photoPreviewUrl: null,
      photoName: null,
      analysisStatus: "IDLE",
      analysisMessage: null,
      aiJobId: null,
    }),

  startAnalysis: () =>
    set({ analysisStatus: "PROCESSING", analysisMessage: null }),

  applyAnalysis: (values, aiJobId) =>
    set((state) => ({
      draft: { ...state.draft, ...values },
      analysisStatus: "SUCCEEDED",
      analysisMessage:
        "AI가 카테고리·대표 색상·소재를 채웠어요. 모든 값은 수정할 수 있어요.",
      aiJobId,
      materialSource: "AI_ESTIMATED",
    })),

  failAnalysis: (message) =>
    set({
      analysisStatus: "FAILED",
      analysisMessage: message,
      aiJobId: null,
      materialSource: "USER_CONFIRMED",
    }),

  markItemCreated: (myItemId) => set({ createdItemId: myItemId }),

  markImageUploadPending: (myItemId) =>
    set((state) => ({
      pendingImageUpload: {
        myItemId,
        itemName: state.draft.name,
        file: state.photoFile,
        previewUrl: state.photoPreviewUrl,
        fileName: state.photoName,
      },
    })),

  setPendingImageFile: (file, previewUrl) =>
    set((state) =>
      state.pendingImageUpload
        ? {
            pendingImageUpload: {
              ...state.pendingImageUpload,
              file,
              previewUrl,
              fileName: file.name,
            },
          }
        : {},
    ),

  clearPendingImageUpload: () => set({ pendingImageUpload: null }),

  resetDraft: () =>
    set({
      draft: { ...emptyDraft },
      photoFile: null,
      photoPreviewUrl: null,
      photoName: null,
      analysisStatus: "IDLE",
      analysisMessage: null,
      aiJobId: null,
      materialSource: "USER_CONFIRMED",
      createdItemId: null,
    }),
}));
