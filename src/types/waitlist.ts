export type OperatingSystem = "iOS" | "Android";

export interface WaitlistPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  operatingSystem: OperatingSystem;
}

export interface WaitlistResponse {
  id?: string;
  ok?: boolean;
}
