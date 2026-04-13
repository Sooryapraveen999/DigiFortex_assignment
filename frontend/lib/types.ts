import type { BrandScanRequest, BrandScanResponse, Finding } from "../services/api";

export type { BrandScanRequest, BrandScanResponse, Finding };

export type FindingType =
  | "brand_mention"
  | "fake_domain"
  | "social_impersonation"
  | "negative_mention"
  | "unauthorized_use";

export type EnrichedFinding = Finding & {
  ai_explanation: string;
};

export type EnrichedScanResponse = Omit<BrandScanResponse, "findings"> & {
  findings: EnrichedFinding[];
  overall_risk_score: number;
  filtered_count: number;
};

export type StoredScan = {
  id: string;
  savedAt: string;
  payload: EnrichedScanResponse;
};
