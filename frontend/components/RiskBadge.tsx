export default function RiskBadge({ level }: { level: "low" | "medium" | "high" | "critical" | null | undefined }) {
  const safeLevel = level ?? "low";
  const map = {
    critical: { bg: "#dc2626", label: "Critical" },
    high: { bg: "#ea580c", label: "High" },
    medium: { bg: "#ca8a04", label: "Medium" },
    low: { bg: "#16a34a", label: "Low" },
  } as const;
  const { bg, label } = map[safeLevel];
  return (
    <span className="risk-badge" style={{ background: bg }} title={`Risk: ${label}`}>
      {label.toUpperCase()}
    </span>
  );
}
