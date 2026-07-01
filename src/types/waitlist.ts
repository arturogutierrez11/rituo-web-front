export type WaitlistInterest = "personal" | "family" | "business";

export interface WaitlistPayload {
  name: string;
  email: string;
  phone?: string;
  interest: WaitlistInterest;
  quantity?: number;
  company?: string;
  message?: string;
  source: "web-presale";
}

export interface WaitlistResponse {
  id?: string;
  ok?: boolean;
}
