export interface SupportResetUser {
  id: string;
  email: string;
  displayName: string | null;
  status: string;
  createdAt: string;
  ritualCount: number;
  modeCount: number;
  hasNfcTag: boolean;
  pendingResetId: string | null;
}

export interface SupportResetRequest {
  id: string;
  userId: string;
  userEmail: string;
  reason: string;
  status: "pending" | "applied";
  revokeTag: boolean;
  deletedCounts: Record<string, number>;
  requestedAt: string;
  appliedAt: string | null;
}

export interface CreateSupportResetPayload {
  userId: string;
  confirmationEmail: string;
  reason: string;
  revokeTag: boolean;
}
