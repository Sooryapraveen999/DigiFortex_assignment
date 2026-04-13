export type BrandScanRequest = {
  company_name: string;
  brand_keywords: string[];
  domain_name: string;
  products_or_services: string[];
  social_handles: string[];
};

export type Finding = {
  source: string;
  title: string;
  url: string;
  snippet: string;
  finding_type: string;
  risk_level: "low" | "medium" | "high" | "critical";
  score: number;
  verification_status: "verified" | "suspicious" | "irrelevant";
};

export type BrandScanResponse = {
  company_name: string;
  total_findings: number;
  high_risk_count: number;
  filtered_count: number;
  findings: Finding[];
};

export type DashboardSummary = {
  total_scans: number;
  total_findings: number;
  total_high_risk: number;
};

export type ScanHistoryItem = {
  id: number;
  company_name: string;
  total_findings: number;
  high_risk_count: number;
  created_at: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function runScan(payload: BrandScanRequest): Promise<BrandScanResponse> {
  try {
    const response = await fetch(`${API_URL}/api/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Scan failed: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error in runScan:", error);
    throw error;
  }
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  try {
    const response = await fetch(`${API_URL}/api/dashboard/summary`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Dashboard summary failed: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error in fetchDashboardSummary:", error);
    return { total_scans: 0, total_findings: 0, total_high_risk: 0 };
  }
}

export async function fetchRecentScans(limit = 10): Promise<ScanHistoryItem[]> {
  try {
    const response = await fetch(`${API_URL}/api/dashboard/recent?limit=${limit}`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Recent scans failed: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error in fetchRecentScans:", error);
    return [];
  }
}
