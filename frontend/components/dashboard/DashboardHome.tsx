"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, RefreshCw } from "lucide-react";

import CategoryBarChart from "../charts/CategoryBarChart";
import RiskPieChart from "../charts/RiskPieChart";
import Card from "../ui/Card";

import { loadLastScan } from "../../lib/history";
import { countByCategory, countRisks } from "../../lib/riskMetrics";
import type { EnrichedScanResponse } from "../../lib/types";
import type { DashboardSummary, ScanHistoryItem } from "../../services/api";
import { fetchDashboardSummary, fetchRecentScans } from "../../services/api";

const emptySummary: DashboardSummary = {
  total_scans: 0,
  total_findings: 0,
  total_high_risk: 0,
};

export default function DashboardHome() {
  const pathname = usePathname();
  const [summary, setSummary] = useState<DashboardSummary>(emptySummary);
  const [recent, setRecent] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastScan, setLastScan] = useState<EnrichedScanResponse | null>(null);
  const [riskForCharts, setRiskForCharts] = useState(() => countRisks([]));
  const [catsForCharts, setCatsForCharts] = useState<Record<string, number>>({});

  const syncLocalCharts = useCallback(() => {
    const last = loadLastScan();
    setLastScan(last);
    if (last && last.findings.length > 0) {
      setRiskForCharts(countRisks(last.findings));
      setCatsForCharts(countByCategory(last.findings));
    }
  }, []);

  async function load() {
    setLoading(true);
    try {
      const [s, r] = await Promise.all([fetchDashboardSummary(), fetchRecentScans(10)]);
      setSummary(s);
      setRecent(r);
    } catch {
      setSummary(emptySummary);
      setRecent([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    syncLocalCharts();
    const onFocus = () => syncLocalCharts();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [syncLocalCharts]);

  useEffect(() => {
    if (pathname === "/dashboard") {
      syncLocalCharts();
    }
  }, [pathname, syncLocalCharts]);

  const localRisk = lastScan ? countRisks(lastScan.findings) : { critical: 0, high: 0, medium: 0, low: 0 };

  return (
    <div className="dashboard-home">
      <div className="page-intro dashboard-intro">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Operational snapshot across stored scans and your latest triage run.</p>
        </div>
        <Link href="/scan" className="btn-primary btn-primary--ghost">
          New scan
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="metric-row">
        <MetricTile label="Total findings (all scans)" value={summary.total_findings} loading={loading} accent="violet" />
        <MetricTile label="High risk (all scans)" value={summary.total_high_risk} loading={loading} accent="rose" />
        <MetricTile
          label="Medium (last scan)"
          value={localRisk.medium}
          loading={loading}
          accent="amber"
          hint={!lastScan ? "Run a scan to see results" : undefined}
        />
        <MetricTile
          label="Low (last scan)"
          value={localRisk.low}
          loading={loading}
          accent="emerald"
          hint={!lastScan ? "Run a scan to see results" : undefined}
        />
      </div>

      <div className="dashboard-grid">
        <Card
          title="Risk distribution"
          description="Based on your most recent scan."
        >
          <RiskPieChart counts={riskForCharts} />
        </Card>
        <Card title="Findings by category" description="Grouped counts for quick posture checks.">
          <CategoryBarChart counts={catsForCharts} />
        </Card>
      </div>

      <Card
        title="Recent activity"
        description="Previously completed scans."
        action={
          <button type="button" className="btn-icon" onClick={() => void load()} title="Refresh">
            <RefreshCw size={16} />
          </button>
        }
      >
        {recent.length === 0 ? (
          <p className="muted">Recent scans will appear here. Try running a scan from the Scan page.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Findings</th>
                  <th>High risk</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((row) => (
                  <tr key={row.id}>
                    <td>{row.company_name}</td>
                    <td>{row.total_findings}</td>
                    <td>{row.high_risk_count}</td>
                    <td>{new Date(row.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function MetricTile({
  label,
  value,
  loading,
  accent,
  hint,
}: {
  label: string;
  value: number;
  loading?: boolean;
  accent: "violet" | "rose" | "amber" | "emerald";
  hint?: string;
}) {
  return (
    <article className={`metric-tile metric-tile--${accent}`}>
      <p className="metric-tile__label">{label}</p>
      <p className="metric-tile__value">{loading ? "…" : value}</p>
      {hint ? <p className="metric-tile__hint">{hint}</p> : null}
    </article>
  );
}
