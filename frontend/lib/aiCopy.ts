import type { EnrichedFinding, Finding } from "./types";

const TYPE_COPY: Record<string, string> = {
  fake_domain:
    "This domain closely resembles your official brand and may be used for phishing or impersonation attempts.",
  social_impersonation:
    "This account appears to impersonate your brand and is soliciting sensitive information — a common credential-harvesting tactic.",
  negative_mention:
    "Negative sentiment detected in content referencing your brand. This could influence public perception if left unaddressed.",
  unauthorized_use:
    "A third party is referencing or using your brand assets without clear authorization. The legitimacy of this association should be verified.",
  brand_mention:
    "Your brand is mentioned in this source. No threat indicators were detected — this appears to be a routine reference.",
};

const RISK_SUFFIX: Record<string, string> = {
  critical: " This warrants immediate investigation by your security team.",
  high: " We recommend reviewing this finding promptly to assess potential impact.",
  medium: " Continue monitoring this signal and validate the source if concerns persist.",
  low: " No immediate action is needed at this time.",
};

export function explainFinding(f: Finding): string {
  const base = TYPE_COPY[f.finding_type] ?? "Pattern analyzed for brand misuse and impersonation indicators.";
  const suffix = RISK_SUFFIX[f.risk_level] ?? " Further review may be warranted.";
  return `${base}${suffix}`;
}

export function enrichFindings(findings: Finding[]): EnrichedFinding[] {
  return findings.map((f) => ({
    ...f,
    ai_explanation: explainFinding(f),
  }));
}
