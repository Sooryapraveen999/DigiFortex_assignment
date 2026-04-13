"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, Clock } from "lucide-react";

import Card from "../../../components/ui/Card";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { fetchRecentScans } from "../../../services/api";
import type { ScanHistoryItem } from "../../../services/api";

export default function HistoryPage() {
  const [items, setItems] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchRecentScans(20);
        setItems(data);
      } catch (error) {
        console.error("Failed to load history:", error);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <ProtectedRoute>
      <div className="history-page">
        <div className="page-intro">
          <h1 className="page-title">History</h1>
          <p className="page-subtitle">Recent brand scans from the database, newest first.</p>
        </div>

        <Card title="Recent scans" description="View recent scan results and findings.">
          {loading ? (
            <p className="muted">Loading...</p>
          ) : items.length === 0 ? (
            <p className="muted">No scans found. Run a scan on the Scan page or via API.</p>
          ) : (
            <ul className="history-list">
              {items.map((item) => (
                <li key={item.id}>
                  <div className="history-list__row">
                    <div>
                      <strong>{item.company_name}</strong>
                      <p className="history-list__meta">
                        <Clock size={14} />
                        {new Date(item.created_at).toLocaleString()} · {item.total_findings} findings · {item.high_risk_count} high risk
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </ProtectedRoute>
  );
}
