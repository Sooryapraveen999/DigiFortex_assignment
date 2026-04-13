import { ExternalLink, Sparkles } from "lucide-react";

import type { EnrichedFinding } from "../lib/types";
import { getConfidenceLevel } from "../lib/riskMetrics";
import CategoryBadge from "./ui/CategoryBadge";
import RiskBadge from "./RiskBadge";
import VerificationBadge, { getVerificationStatus } from "./VerificationBadge";

export default function ResultCard({ finding }: { finding: EnrichedFinding }) {
  if (!finding) {
    return null;
  }

  const safeFinding = {
    title: finding.title ?? "Untitled finding",
    snippet: finding.snippet ?? "No description available.",
    url: finding.url ?? "#",
    source: finding.source ?? "unknown",
    score: finding.score ?? 0,
    finding_type: finding.finding_type ?? "brand_mention",
    risk_level: finding.risk_level ?? "low",
    verification_status: finding.verification_status ?? "irrelevant",
    ai_explanation: finding.ai_explanation ?? "Analysis pending.",
  };

  const confidence = getConfidenceLevel(safeFinding.score);

  return (
    <article className="result-card result-card--elevated">
      <div className="result-card__head">
        <h3 className="result-card__title">{safeFinding.title}</h3>
        <div className="result-card__badges">
          <CategoryBadge type={safeFinding.finding_type} />
          <RiskBadge level={safeFinding.risk_level} />
          <VerificationBadge status={safeFinding.verification_status} />
        </div>
      </div>
      <p className="result-card__snippet">{safeFinding.snippet}</p>
      <p className="result-card__meta">
        Score <strong>{safeFinding.score}</strong> · Source <strong>{safeFinding.source}</strong> · Confidence <strong className={`confidence--${confidence.toLowerCase()}`}>{confidence}</strong>
      </p>
      <a className="result-card__link" href={safeFinding.url} target="_blank" rel="noreferrer">
        <ExternalLink size={14} />
        {safeFinding.url}
      </a>
      <div className="result-card__ai">
        <div className="result-card__ai-label">
          <Sparkles size={14} />
          AI Analysis
        </div>
        <p className="result-card__ai-text">{safeFinding.ai_explanation}</p>
      </div>
    </article>
  );
}
