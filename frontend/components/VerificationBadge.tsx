import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

type VerificationStatus = "verified" | "suspicious" | "irrelevant";

const CONFIG = {
  verified: {
    icon: CheckCircle,
    label: "Verified",
    className: "verification-badge--verified",
  },
  suspicious: {
    icon: AlertTriangle,
    label: "Suspicious",
    className: "verification-badge--suspicious",
  },
  irrelevant: {
    icon: XCircle,
    label: "Irrelevant",
    className: "verification-badge--irrelevant",
  },
};

export default function VerificationBadge({ status }: { status: VerificationStatus }) {
  const config = CONFIG[status];
  const Icon = config.icon;

  return (
    <span className={`verification-badge ${config.className}`}>
      <Icon size={12} />
      {config.label}
    </span>
  );
}

export function getVerificationStatus(url: string, officialDomain: string, riskLevel: string): VerificationStatus {
  const urlLower = url.toLowerCase();
  const domainLower = officialDomain.toLowerCase();

  if (urlLower.includes(domainLower)) {
    return "verified";
  }

  if (riskLevel === "high" || riskLevel === "critical") {
    return "suspicious";
  }

  return "irrelevant";
}
