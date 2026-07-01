import type { WaitlistPayload, WaitlistResponse } from "@/types/waitlist";

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const text = await response.text();

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

export function joinWaitlist(payload: WaitlistPayload) {
  return apiFetch<WaitlistResponse>("/api/waitlist-leads", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
