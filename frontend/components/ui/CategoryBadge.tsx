import type { FindingType } from "../../lib/types";

const LABELS: Record<string, string> = {
  brand_mention: "Brand mention",
  fake_domain: "Fake domain",
  social_impersonation: "Impersonation",
  negative_mention: "Negative mention",
  unauthorized_use: "Unauthorized use",
};

export default function CategoryBadge({ type }: { type: string | null | undefined }) {
  const safeType = type ?? "brand_mention";
  const label = LABELS[safeType] ?? safeType.replace(/_/g, " ");
  return <span className="ui-badge ui-badge--category">{label}</span>;
}

export function isFindingType(t: string): t is FindingType {
  return t in LABELS;
}
