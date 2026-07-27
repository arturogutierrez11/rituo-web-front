export type LegalDocumentType = "terms" | "privacy";

export interface LegalDocument {
  id: string;
  type: LegalDocumentType;
  version: string;
  title: string;
  content: string;
  contentHash: string;
  sourceUrl: string | null;
  effectiveAt: string;
  publishedAt: string;
  isActive: boolean;
  createdAt: string;
}

export interface PublishLegalDocumentPayload {
  type: LegalDocumentType;
  version: string;
  title: string;
  content: string;
  sourceUrl?: string;
  effectiveAt: string;
}
