"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";

import AIRiskSummary from "../../../../components/AIRiskSummary";
import FindingsPanel from "../../../../components/FindingsPanel";
import Card from "../../../../components/ui/Card";
import { getStoredScanById } from "../../../../lib/history";
import { countRisks } from "../../../../lib/riskMetrics";

export default function HistoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";

  const entry = useMemo(() => (id ? getStoredScanById(id) : null), [id]);

  if (!entry) {
    return (
      <div className="history-page">
        <Card title="Not found" description="This scan is not in local history.">
          <p className="muted">It may have been cleared or the link is invalid.</p>
          <button type="button" className="btn-primary btn-primary--ghost" onClick={() => router.push("/history")}>
            Back to history
          </button>
        </Card>
      </div>
    );
  }

  const { payload } = entry;
  const risks = countRisks(payload.findings);

  return (
    <div className="history-page">
      <Link href="/history" className="back-link">
        <ArrowLeft size={16} />
        All scans
      </Link>

      <div className="page-intro">
        <h1 className="page-title">{payload.company_name}</h1>
        <p className="page-subtitle">Saved {new Date(entry.savedAt).toLocaleString()}</p>
      </div>

      <div className="metric-row metric-row--tight">
        <article className="metric-tile metric-tile--violet">
          <p className="metric-tile__label">Overall risk</p>
          <p className="metric-tile__value">{payload.overall_risk_score}</p>
        </article>
        <article className="metric-tile metric-tile--rose">
          <p className="metric-tile__label">High + critical</p>
          <p className="metric-tile__value">{risks.high + risks.critical}</p>
        </article>
        <article className="metric-tile metric-tile--amber">
          <p className="metric-tile__label">Medium</p>
          <p className="metric-tile__value">{risks.medium}</p>
        </article>
        <article className="metric-tile metric-tile--emerald">
          <p className="metric-tile__label">Low</p>
          <p className="metric-tile__value">{risks.low}</p>
        </article>
      </div>

      {payload.filtered_count > 0 ? (
        <div className="banner banner--info">
          Filtered {payload.filtered_count} irrelevant results to show most relevant findings.
        </div>
      ) : null}
      <p className="muted" style={{ marginBottom: "16px", fontSize: "13px" }}>
        Results are filtered based on brand relevance and source verification.
      </p>

      <AIRiskSummary findings={payload.findings} />

      <div className="ai-report-header">
        <h2 className="ai-report-header__title">AI Risk Analysis Report</h2>
        <p className="ai-report-header__desc">
          This score reflects potential brand misuse, impersonation, and reputational risks detected across sources.
        </p>
      </div>

      <FindingsPanel findings={payload.findings} />
    </div>
  );
}
