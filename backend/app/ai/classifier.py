from typing import Literal, Tuple, Optional

RiskLevel = Literal["low", "medium", "high", "critical"]
FindingType = Literal[
    "brand_mention",
    "fake_domain",
    "social_impersonation",
    "negative_mention",
    "unauthorized_use",
]


def classify_text(title: str, snippet: str, url: str, official_domain: str, company_name: Optional[str] = None) -> Tuple[FindingType, RiskLevel, int]:
    text = f"{title} {snippet} {url}".lower()
    
    if "credential" in text or "verify account" in text or "confirm identity" in text:
        return "fake_domain", "critical", 92
    
    if official_domain.lower() not in url.lower():
        if "support" in text or "login" in text or "account" in text:
            return "social_impersonation", "high", 80
        
        if company_name and company_name.lower() in text:
            return "unauthorized_use", "high", 74
    
    if "complaint" in text or "delay" in text or "issue" in text:
        return "negative_mention", "medium", 58
    
    return "brand_mention", "low", 25
