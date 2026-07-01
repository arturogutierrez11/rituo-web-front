import type { WaitlistPayload, WaitlistResponse } from "@/types/waitlist";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
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
  return apiFetch<WaitlistResponse>("/waitlist", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
