from typing import List, Literal, Optional

from pydantic import BaseModel, Field


RiskLevel = Literal["low", "medium", "high", "critical"]
FindingType = Literal[
    "brand_mention",
    "fake_domain",
    "social_impersonation",
    "negative_mention",
    "unauthorized_use",
]

VerificationStatus = Literal["verified", "suspicious", "irrelevant"]


class BrandScanRequest(BaseModel):
    company_name: str = Field(min_length=2)
    brand_keywords: List[str] = Field(default_factory=list)
    domain_name: str = Field(min_length=3)
    products_or_services: List[str] = Field(default_factory=list)
    social_handles: Optional[List[str]] = None


class Finding(BaseModel):
    source: str
    title: str
    url: str
    snippet: str
    finding_type: FindingType
    risk_level: RiskLevel
    score: int = Field(ge=0, le=100)
    verification_status: VerificationStatus = "irrelevant"


class BrandScanResponse(BaseModel):
    company_name: str
    total_findings: int
    high_risk_count: int
    filtered_count: int = 0
    findings: List[Finding]


class ScanHistoryItem(BaseModel):
    id: int
    company_name: str
    total_findings: int
    high_risk_count: int
    created_at: str


class DashboardSummary(BaseModel):
    total_scans: int
    total_findings: int
    total_high_risk: int
