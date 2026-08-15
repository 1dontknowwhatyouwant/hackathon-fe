import { intelligenceApi } from "@/services/api/intelligenceApi";
import { aiJobPollingPolicy } from "@/services/api/intelligenceApi";
import type { AiJob } from "@/types/api";

export class AiJobPollingTimeoutError extends Error {
  constructor() {
    super("AI 처리 시간이 30초를 초과했습니다. 같은 작업을 다시 확인해 주세요.");
    this.name = "AiJobPollingTimeoutError";
  }
}

function waitForNextPoll(durationMs: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const handleAbort = () => {
      globalThis.clearTimeout(timeoutId);
      reject(signal?.reason ?? new DOMException("요청이 취소되었습니다.", "AbortError"));
    };
    const timeoutId = globalThis.setTimeout(() => {
      signal?.removeEventListener("abort", handleAbort);
      resolve();
    }, durationMs);

    signal?.addEventListener("abort", handleAbort, { once: true });
  });
}

async function getJobBeforeDeadline(
  jobId: string,
  deadline: number,
  signal?: AbortSignal,
) {
  signal?.throwIfAborted();

  const remainingMs = deadline - Date.now();
  if (remainingMs <= 0) {
    throw new AiJobPollingTimeoutError();
  }

  const requestController = new AbortController();
  let deadlineExceeded = false;
  const handleAbort = () => requestController.abort(signal?.reason);
  const deadlineTimer = globalThis.setTimeout(
    () => {
      deadlineExceeded = true;
      requestController.abort(new AiJobPollingTimeoutError());
    },
    remainingMs,
  );

  signal?.addEventListener("abort", handleAbort, { once: true });

  try {
    return await intelligenceApi.getAiJob(jobId, requestController.signal);
  } catch (error) {
    if (!signal?.aborted && (deadlineExceeded || Date.now() >= deadline)) {
      throw new AiJobPollingTimeoutError();
    }

    throw error;
  } finally {
    globalThis.clearTimeout(deadlineTimer);
    signal?.removeEventListener("abort", handleAbort);
  }
}

export async function pollAiJob(
  jobId: string,
  signal?: AbortSignal,
): Promise<AiJob> {
  const deadline = Date.now() + aiJobPollingPolicy.timeoutMs;

  for (
    let attempt = 0;
    attempt < aiJobPollingPolicy.maxAttempts;
    attempt += 1
  ) {
    const response = await getJobBeforeDeadline(jobId, deadline, signal);
    const job = response.data.data;

    if (job.status === "SUCCEEDED" || job.status === "FAILED") {
      return job;
    }

    const remainingMs = deadline - Date.now();
    if (remainingMs <= 0) {
      throw new AiJobPollingTimeoutError();
    }

    await waitForNextPoll(
      Math.min(aiJobPollingPolicy.intervalMs, remainingMs),
      signal,
    );
  }

  throw new AiJobPollingTimeoutError();
}
