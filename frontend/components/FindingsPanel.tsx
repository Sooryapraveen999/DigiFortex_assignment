"use client";

import { useMemo, useState } from "react";
import { Filter } from "lucide-react";

import ResultCard from "./ResultCard";
import Card from "./ui/Card";

import type { EnrichedFinding, FindingType } from "../lib/types";

const GROUPS: Array<{ type: FindingType | "all"; label: string }> = [
  { type: "all", label: "All categories" },
  { type: "fake_domain", label: "Fake domains" },
  { type: "social_impersonation", label: "Impersonation" },
  { type: "negative_mention", label: "Negative mentions" },
  { type: "brand_mention", label: "Brand mentions" },
  { type: "unauthorized_use", label: "Unauthorized use" },
];

const RISKS = ["all", "critical", "high", "medium", "low"] as const;
type RiskFilter = (typeof RISKS)[number];

const SECTION_ORDER: Array<{ type: FindingType; label: string }> = [
  { type: "fake_domain", label: "Fake domains / typosquatting" },
  { type: "social_impersonation", label: "Social impersonation" },
  { type: "negative_mention", label: "Negative mentions" },
  { type: "unauthorized_use", label: "Unauthorized use" },
  { type: "brand_mention", label: "Brand mentions" },
];

export default function FindingsPanel({ findings }: { findings: EnrichedFinding[] }) {
  const [category, setCategory] = useState<FindingType | "all">("all");
  const [risk, setRisk] = useState<RiskFilter>("all");

  const safeFindings = useMemo(() => findings ?? [], [findings]);

  const filtered = useMemo(() => {
    return safeFindings.filter((f) => {
      if (category !== "all" && f.finding_type !== category) {
        return false;
      }
      if (risk === "all") {
        return true;
      }
      if (risk === "high") {
        return f.risk_level === "high" || f.risk_level === "critical";
      }
      return f.risk_level === risk;
    });
  }, [findings, category, risk]);

  return (
    <Card
      title="Findings"
      description="Filter by severity and category. Each card includes AI triage rationale."
      action={
        <span className="findings-count">
          <Filter size={14} />
          {filtered.length} shown
        </span>
      }
    >
      <div className="findings-toolbar">
        <label className="findings-field">
          <span>Risk</span>
          <select value={risk} onChange={(e) => setRisk(e.target.value as RiskFilter)}>
            <option value="all">All</option>
            <option value="critical">Critical</option>
            <option value="high">High (includes critical)</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>
        <label className="findings-field">
          <span>Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value as FindingType | "all")}>
            {GROUPS.map((g) => (
              <option key={g.type} value={g.type}>
                {g.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="muted">No findings match these filters.</p>
      ) : (
        SECTION_ORDER.map(({ type, label }) => {
          const items = filtered.filter((f) => f.finding_type === type);
          if (items.length === 0) {
            return null;
          }
          return (
            <div key={type} className="finding-section">
              <h3 className="finding-section__title">
                {label} <span className="finding-section__count">{items.length}</span>
              </h3>
              {items.map((f) => (
                <ResultCard key={`${f.url}-${f.title}`} finding={f} />
              ))}
            </div>
          );
        })
      )}
    </Card>
  );
}
