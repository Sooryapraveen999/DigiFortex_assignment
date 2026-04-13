import type { Finding } from "./types";

export type RiskCounts = {
  critical: number;
  high: number;
  medium: number;
  low: number;
};

export function countRisks(findings: Finding[] | null | undefined): RiskCounts {
  const safe = findings ?? [];
  return {
    critical: safe.filter((f) => f?.risk_level === "critical").length,
    high: safe.filter((f) => f?.risk_level === "high").length,
    medium: safe.filter((f) => f?.risk_level === "medium").length,
    low: safe.filter((f) => f?.risk_level === "low").length,
  };
}

/** Weighted 0–100: emphasizes critical/high findings. */
export function overallRiskScore(findings: Finding[] | null | undefined): number {
  const safe = findings ?? [];
  if (safe.length === 0) {
    return 0;
  }
  const weights: Record<string, number> = {
    critical: 1,
    high: 0.85,
    medium: 0.5,
    low: 0.15,
  };
  let sum = 0;
  for (const f of safe) {
    const level = f?.risk_level ?? "low";
    const score = f?.score ?? 0;
    sum += (weights[level] ?? 0.3) * (score / 100);
  }
  const raw = (sum / safe.length) * 100;
  return Math.min(100, Math.round(raw));
}

export function countByCategory(findings: Finding[] | null | undefined): Record<string, number> {
  const safe = findings ?? [];
  const map: Record<string, number> = {};
  for (const f of safe) {
    const type = f?.finding_type ?? "brand_mention";
    map[type] = (map[type] ?? 0) + 1;
  }
  return map;
}

export type RiskSummary = {
  level: "low" | "medium" | "high" | "critical";
  summary: string;
  recommendations: string[];
};

export function generateRiskSummary(findings: Finding[] | null | undefined): RiskSummary {
  const safe = findings ?? [];
  const counts = countRisks(safe);
  const cats = countByCategory(safe);
  const total = safe.length;

  if (total === 0) {
    return {
      level: "low",
      summary: "No risk signals detected. Your brand appears clean across monitored sources.",
      recommendations: ["Continue regular monitoring", "Schedule periodic scans"],
    };
  }

  const highRiskCount = counts.critical + counts.high;
  const hasFakeDomains = (cats.fake_domain ?? 0) > 0;
  const hasImpersonation = (cats.social_impersonation ?? 0) > 0;
  const hasNegative = (cats.negative_mention ?? 0) > 0;

  let level: RiskSummary["level"] = "low";
  let summary = "";
  const recommendations: string[] = [];

  if (counts.critical > 0 || counts.high >= 2) {
    level = highRiskCount >= 3 ? "critical" : "high";
    summary = `This scan identified ${highRiskCount} high-risk signals`;
    if (hasFakeDomains) {
      summary += " including potential domain impersonation";
      recommendations.push("Monitor suspicious domains immediately");
    }
    if (hasImpersonation) {
      summary += hasFakeDomains ? " and social media impersonation" : " including social media impersonation";
      recommendations.push("Verify all social media accounts");
    }
    if (hasNegative && !hasFakeDomains && !hasImpersonation) {
      summary += " including negative brand mentions";
      recommendations.push("Investigate negative mentions");
    }
    summary += ". Immediate attention recommended.";
    if (recommendations.length === 0) {
      recommendations.push("Review high-risk findings immediately");
    }
  } else if (counts.medium > 0 || counts.high === 1) {
    level = "medium";
    summary = `This scan found ${counts.medium + counts.high} medium-risk items requiring monitoring.`;
    if (hasFakeDomains) {
      summary += " Suspicious domain activity detected.";
      recommendations.push("Monitor domains for changes");
    }
    if (hasImpersonation) {
      recommendations.push("Verify social account authenticity");
    }
    if (recommendations.length === 0) {
      recommendations.push("Schedule follow-up scan", "Monitor for changes");
    }
  } else {
    level = "low";
    summary = "Minimal risk detected. Most findings are routine brand mentions with no immediate concerns.";
    recommendations.push("Continue regular monitoring", "Schedule weekly scans");
  }

  return { level, summary, recommendations };
}

export function getConfidenceLevel(score: number): "High" | "Medium" | "Low" {
  if (score >= 75) return "High";
  if (score >= 50) return "Medium";
  return "Low";
}
