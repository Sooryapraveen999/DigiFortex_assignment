import { AlertTriangle, CheckCircle, Info, ShieldAlert } from "lucide-react";
import Card from "./ui/Card";
import type { EnrichedFinding } from "../lib/types";
import { generateRiskSummary } from "../lib/riskMetrics";

const ICONS = {
  critical: ShieldAlert,
  high: AlertTriangle,
  medium: Info,
  low: CheckCircle,
};

const COLORS = {
  critical: { border: "#fecaca", bg: "linear-gradient(135deg, #fef2f2, #fff)" },
  high: { border: "#fed7aa", bg: "linear-gradient(135deg, #fff7ed, #fff)" },
  medium: { border: "#fde68a", bg: "linear-gradient(135deg, #fffbeb, #fff)" },
  low: { border: "#bbf7d0", bg: "linear-gradient(135deg, #f0fdf4, #fff)" },
};

export default function AIRiskSummary({ findings }: { findings: EnrichedFinding[] }) {
  const { level, summary, recommendations } = generateRiskSummary(findings);
  const Icon = ICONS[level];
  const colors = COLORS[level];

  return (
    <Card
      title="AI Risk Summary"
      description="Intelligent analysis of brand threat landscape"
    >
      <div
        className="ai-summary-box"
        style={{
          borderColor: colors.border,
          background: colors.bg,
        }}
      >
        <div className="ai-summary-header">
          <Icon size={20} />
          <span className={`ai-summary-level ai-summary-level--${level}`}>
            {level.charAt(0).toUpperCase() + level.slice(1)} Risk
          </span>
        </div>
        <p className="ai-summary-text">{summary}</p>
        <div className="ai-summary-recommendations">
          <p className="ai-summary-recommendations__title">Recommended Actions:</p>
          <ul>
            {recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
