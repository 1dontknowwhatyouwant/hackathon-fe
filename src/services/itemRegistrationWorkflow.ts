import { backendApi } from "@/services/api";
import { aiJobPollingPolicy } from "@/services/api/intelligenceApi";
import { itemCategories, type AiJob, type ImagePurpose } from "@/types/api";
import type { ItemAnalysisValues } from "@/store/useItemRegistrationStore";

type CloudinaryUploadResult = {
  public_id: string;
  secure_url: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
  version: number;
  signature: string;
};

type UploadedImage = {
  imageId: string;
  url: string;
};

export type ItemAnalysisOutcome =
  | {
      status: "SUCCEEDED";
      jobId: string;
      values: ItemAnalysisValues;
    }
  | {
      status: "FAILED";
      jobId: string | null;
      message: string;
    };

function createIdempotencyKey() {
  return globalThis.crypto?.randomUUID?.() ?? `item-analysis-${Date.now()}`;
}

function isCloudinaryUploadResult(value: unknown): value is CloudinaryUploadResult {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<CloudinaryUploadResult>;
  return (
    typeof candidate.public_id === "string" &&
    typeof candidate.secure_url === "string" &&
    typeof candidate.format === "string" &&
    typeof candidate.bytes === "number" &&
    typeof candidate.width === "number" &&
    typeof candidate.height === "number" &&
    typeof candidate.version === "number" &&
    typeof candidate.signature === "string"
  );
}

function parseItemAnalysisResult(value: unknown): ItemAnalysisValues | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<Record<keyof ItemAnalysisValues, unknown>>;
  if (
    typeof candidate.category !== "string" ||
    !itemCategories.includes(candidate.category as (typeof itemCategories)[number]) ||
    typeof candidate.primaryColor !== "string" ||
    !candidate.primaryColor.trim() ||
    typeof candidate.material !== "string" ||
    !candidate.material.trim()
  ) {
    return null;
  }

  return {
    category: candidate.category as ItemAnalysisValues["category"],
    primaryColor: candidate.primaryColor.trim(),
    material: candidate.material.trim(),
  };
}

function waitForNextPoll(signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const handleAbort = () => {
      window.clearTimeout(timeoutId);
      reject(new DOMException("AI 분석 요청이 취소되었습니다.", "AbortError"));
    };
    const timeoutId = window.setTimeout(() => {
      signal?.removeEventListener("abort", handleAbort);
      resolve();
    }, aiJobPollingPolicy.intervalMs);

    signal?.addEventListener(
      "abort",
      handleAbort,
      { once: true },
    );
  });
}

async function pollAiJob(jobId: string, signal?: AbortSignal): Promise<AiJob> {
  for (let attempt = 0; attempt < aiJobPollingPolicy.maxAttempts; attempt += 1) {
    signal?.throwIfAborted();
    const response = await backendApi.intelligence.getAiJob(jobId, signal);
    const job = response.data.data;

    if (job.status === "SUCCEEDED" || job.status === "FAILED") {
      return job;
    }

    await waitForNextPoll(signal);
  }

  throw new Error("AI 분석 시간이 초과되었습니다. 직접 입력해 주세요.");
}

export async function uploadRegistrationImage(
  file: File,
  purpose: ImagePurpose,
  referenceId: string | null,
  signal?: AbortSignal,
): Promise<UploadedImage> {
  const signatureResponse = await backendApi.closet.createImageUploadSignature(
    purpose,
    referenceId,
  );
  const signature = signatureResponse.data.data;
  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", String(signature.timestamp));
  formData.append("signature", signature.signature);
  formData.append("folder", signature.folder);
  formData.append("public_id", signature.publicId);

  const cloudinaryResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(signature.cloudName)}/image/upload`,
    { method: "POST", body: formData, signal },
  );
  const cloudinaryResult: unknown = await cloudinaryResponse.json();

  if (!cloudinaryResponse.ok || !isCloudinaryUploadResult(cloudinaryResult)) {
    throw new Error("이미지 업로드 응답을 확인하지 못했습니다.");
  }

  const normalizedFormat = cloudinaryResult.format.toLowerCase();
  if (!["jpg", "jpeg", "png", "webp"].includes(normalizedFormat)) {
    throw new Error("지원하지 않는 이미지 형식입니다.");
  }

  const completeResponse = await backendApi.closet.completeImageUpload({
    purpose,
    referenceId,
    ...(purpose === "ITEM" ? { sortOrder: 0 } : {}),
    publicId: cloudinaryResult.public_id,
    secureUrl: cloudinaryResult.secure_url,
    format: normalizedFormat as "jpg" | "jpeg" | "png" | "webp",
    bytes: cloudinaryResult.bytes,
    width: cloudinaryResult.width,
    height: cloudinaryResult.height,
    version: cloudinaryResult.version,
    responseSignature: cloudinaryResult.signature,
  });

  return {
    imageId: completeResponse.data.data.imageId,
    url: completeResponse.data.data.url,
  };
}

export async function analyzeItemPhoto(
  file: File,
  signal?: AbortSignal,
): Promise<ItemAnalysisOutcome> {
  let jobId: string | null = null;

  try {
    const aiInputImage = await uploadRegistrationImage(
      file,
      "AI_INPUT",
      null,
      signal,
    );
    const acceptedResponse = await backendApi.intelligence.createAiJob(
      {
        type: "ITEM_ANALYSIS",
        imageIds: [aiInputImage.imageId],
        context: { language: "ko" },
      },
      createIdempotencyKey(),
    );

    jobId = acceptedResponse.data.data.jobId;
    const job = await pollAiJob(jobId, signal);

    if (job.status === "FAILED") {
      return {
        status: "FAILED",
        jobId,
        message: "AI 분석에 실패했어요. 세 가지 정보를 직접 입력해 주세요.",
      };
    }

    const values = parseItemAnalysisResult(job.result);
    if (!values) {
      return {
        status: "FAILED",
        jobId,
        message: "분석 결과를 확인하지 못했어요. 세 가지 정보를 직접 입력해 주세요.",
      };
    }

    return { status: "SUCCEEDED", jobId, values };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    return {
      status: "FAILED",
      jobId,
      message:
        error instanceof Error
          ? error.message
          : "AI 분석을 진행하지 못했어요. 직접 입력해 주세요.",
    };
  }
}

export function uploadItemImage(
  file: File,
  myItemId: string,
  signal?: AbortSignal,
) {
  return uploadRegistrationImage(file, "ITEM", myItemId, signal);
}
