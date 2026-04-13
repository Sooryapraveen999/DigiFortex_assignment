import type { EnrichedScanResponse, StoredScan } from "./types";

const KEY = "brand_monitor_scan_history_v1";
const LAST_KEY = "brand_monitor_last_scan_v1";

export function loadHistory(): StoredScan[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as StoredScan[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveScanToHistory(payload: EnrichedScanResponse): StoredScan {
  const entry: StoredScan = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    savedAt: new Date().toISOString(),
    payload,
  };
  const prev = loadHistory();
  const next = [entry, ...prev].slice(0, 50);
  localStorage.setItem(KEY, JSON.stringify(next));
  localStorage.setItem(LAST_KEY, JSON.stringify(entry.payload));
  return entry;
}

export function loadLastScan(): EnrichedScanResponse | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = localStorage.getItem(LAST_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as EnrichedScanResponse;
  } catch {
    return null;
  }
}

export function getStoredScanById(id: string): StoredScan | null {
  return loadHistory().find((s) => s.id === id) ?? null;
}
