"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Radar } from "lucide-react";

import AIRiskSummary from "./AIRiskSummary";
import FindingsPanel from "./FindingsPanel";
import Card from "./ui/Card";

import { saveScanToHistory } from "../lib/history";
import { countByCategory, countRisks, overallRiskScore } from "../lib/riskMetrics";
import { runScan } from "../services/api";
import { enrichFindings } from "../lib/aiCopy";
import type { BrandScanRequest, EnrichedScanResponse } from "../lib/types";

const STEPS = ["Fetching external sources", "Correlating mentions", "AI classification", "Building report"];

function parseCsv(value: string): string[] {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export default function ScanWorkspace() {
  const [companyName, setCompanyName] = useState("");
  const [domainName, setDomainName] = useState("");
  const [keywords, setKeywords] = useState("");
  const [products, setProducts] = useState("");
  const [handles, setHandles] = useState("");
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<EnrichedScanResponse | null>(null);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!loading) {
      if (progressTimer.current) {
        clearInterval(progressTimer.current);
        progressTimer.current = null;
      }
      return;
    }
    setStepIndex(0);
    progressTimer.current = setInterval(() => {
      setStepIndex((s) => Math.min(s + 1, STEPS.length - 1));
    }, 750);
    return () => {
      if (progressTimer.current) {
        clearInterval(progressTimer.current);
        progressTimer.current = null;
      }
    };
  }, [loading]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setData(null);
    setLoading(true);
    setStepIndex(0);
    const payload: BrandScanRequest = {
      company_name: companyName,
      domain_name: domainName,
      brand_keywords: parseCsv(keywords),
      products_or_services: parseCsv(products),
      social_handles: parseCsv(handles),
    };
    const started = Date.now();
    try {
      const raw = await runScan(payload);
      const findings = enrichFindings(raw.findings);
      const result: EnrichedScanResponse = {
        ...raw,
        findings,
        overall_risk_score: overallRiskScore(raw.findings),
        filtered_count: raw.filtered_count ?? 0,
      };
      const elapsed = Date.now() - started;
      if (elapsed < 1600) {
        await new Promise((r) => setTimeout(r, 1600 - elapsed));
      }
      setStepIndex(STEPS.length);
      setData(result);
      saveScanToHistory(result);
    } finally {
      setLoading(false);
      setStepIndex(STEPS.length);
    }
  }

  const riskCounts = data ? countRisks(data.findings) : null;
  const catCounts = data ? countByCategory(data.findings) : null;

  return (
    <div className="scan-workspace">
      <div className="page-intro">
        <h1 className="page-title">Brand scan</h1>
        <p className="page-subtitle">Run a live pull from news and search, then review AI-triaged risk.</p>
      </div>

      <div className="scan-grid">
        <Card title="Brand assets" description="Provide identifiers to monitor across public sources.">
          <form className="scan-form scan-form--modern" onSubmit={onSubmit}>
            <label className="field">
              <span>Company name</span>
              <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} required placeholder="e.g. Acme Corp" />
            </label>
            <label className="field">
              <span>Primary domain</span>
              <input value={domainName} onChange={(e) => setDomainName(e.target.value)} required placeholder="example.com" />
            </label>
            <label className="field">
              <span>Brand keywords</span>
              <input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="comma-separated" />
            </label>
            <label className="field">
              <span>Products / services</span>
              <input value={products} onChange={(e) => setProducts(e.target.value)} placeholder="comma-separated" />
            </label>
            <label className="field">
              <span>Social handles</span>
              <input value={handles} onChange={(e) => setHandles(e.target.value)} placeholder="@brand, optional" />
            </label>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="spin" size={18} />
                  Scanning…
                </>
              ) : (
                <>
                  <Radar size={18} />
                  Run scan
                </>
              )}
            </button>
          </form>
        </Card>

        <Card
          title="Scan status"
          description={loading ? "Working through the pipeline…" : data ? "Last run ready below." : "Idle — submit to begin."}
        >
          {loading ? (
            <div className="scan-progress">
              <div className="scan-progress__spinner" aria-hidden>
                <Loader2 className="spin" size={40} strokeWidth={2.5} />
              </div>
              <p className="scan-progress__title">Scanning brand assets…</p>
              <ol className="scan-progress__steps">
                {STEPS.map((label, i) => (
                  <li key={label} className={i <= stepIndex ? "is-done" : ""}>
                    <span className="scan-progress__dot" />
                    {label}
                  </li>
                ))}
              </ol>
            </div>
          ) : data ? (
            <div className="scan-summary-preview">
              {data.filtered_count > 0 ? (
                <div className="banner banner--info">
                  Filtered {data.filtered_count} irrelevant results to show most relevant findings.
                </div>
              ) : null}
              <p className="muted" style={{ marginBottom: "16px", fontSize: "13px" }}>
                Results are filtered based on brand relevance and source verification.
              </p>
              <div className="overall-risk">
                <div>
                  <p className="overall-risk__label">Overall risk score</p>
                  <p className="overall-risk__hint">Weighted blend of severity and per-item scores</p>
                </div>
                <div className="overall-risk__meter" role="img" aria-label={`Overall risk ${data.overall_risk_score} out of 100`}>
                  <svg viewBox="0 0 36 36" className="overall-risk__ring">
                    <path
                      className="overall-risk__track"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="overall-risk__fill"
                      strokeDasharray={`${data.overall_risk_score}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="overall-risk__value">{data.overall_risk_score}</span>
                </div>
              </div>
              {riskCounts && catCounts ? (
                <div className="mini-metrics">
                  <div>
                    <span className="mini-metrics__label">Total findings</span>
                    <strong>{data.total_findings}</strong>
                  </div>
                  <div>
                    <span className="mini-metrics__label">High / critical</span>
                    <strong>{data.high_risk_count}</strong>
                  </div>
                  <div>
                    <span className="mini-metrics__label">Medium</span>
                    <strong>{riskCounts.medium}</strong>
                  </div>
                  <div>
                    <span className="mini-metrics__label">Low</span>
                    <strong>{riskCounts.low}</strong>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="muted">No active scan.</p>
          )}
        </Card>
      </div>

      {data ? (
        <>
          <AIRiskSummary findings={data.findings} />
          <div className="ai-report-header">
            <h2 className="ai-report-header__title">AI Risk Analysis Report</h2>
            <p className="ai-report-header__desc">
              This score reflects potential brand misuse, impersonation, and reputational risks detected across sources.
            </p>
          </div>
          <FindingsPanel findings={data.findings} />
        </>
      ) : null}
    </div>
  );
}
