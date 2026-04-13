from typing import List, Set, Literal

from app.ai.classifier import classify_text
from app.database.db import save_scan_result
from app.integrations.domain_checker import detect_typosquatting
from app.integrations.news_api import fetch_news_mentions
from app.integrations.serp_api import fetch_search_results
from app.models.schemas import BrandScanRequest, BrandScanResponse, Finding
from app.utils.helpers import normalize_keywords

VerificationStatus = Literal["verified", "suspicious", "irrelevant"]


def compute_verification_status(url: str, official_domain: str, risk_level: str) -> VerificationStatus:
    url_lower = url.lower()
    domain_lower = official_domain.lower()
    
    if domain_lower in url_lower:
        return "verified"
    
    if risk_level in ("high", "critical"):
        return "suspicious"
    
    return "irrelevant"


def is_relevant(title: str, snippet: str, company_name: str, keywords: List[str]) -> bool:
    text = f"{title} {snippet}".lower()
    company_lower = company_name.lower()
    keywords_lower = [k.lower() for k in keywords]
    
    if company_lower in text:
        return True
    
    for keyword in keywords_lower:
        if keyword in text:
            return True
    
    return False


def calculate_confidence(title: str, snippet: str, finding_type: str, risk_level: str) -> int:
    text = f"{title} {snippet}"
    
    risk_bonus = {
        "critical": 30,
        "high": 20,
        "medium": 10,
        "low": 0,
    }.get(risk_level, 0)
    
    text_length_bonus = min(10, len(text) // 50)
    
    high_confidence_keywords = ["official", "verified", "scam", "phishing", "impersonation", "fake"]
    keyword_bonus = sum(5 for kw in high_confidence_keywords if kw in text.lower())
    
    base_score = 50 + risk_bonus + text_length_bonus + keyword_bonus
    return min(100, max(0, base_score))


def deduplicate_findings(findings: List[Finding]) -> List[Finding]:
    seen_urls: Set[str] = set()
    unique_findings = []
    
    for finding in findings:
        url = finding.url.lower()
        if url not in seen_urls:
            seen_urls.add(url)
            unique_findings.append(finding)
    
    return unique_findings


def run_brand_scan(payload: BrandScanRequest) -> BrandScanResponse:
    keywords = normalize_keywords(payload.brand_keywords)
    news_hits = fetch_news_mentions(payload.company_name, keywords)
    search_hits = fetch_search_results(payload.company_name, payload.domain_name)
    raw_hits = [*news_hits, *search_hits]

    observed_domains = [item["url"].replace("https://", "").split("/")[0] for item in search_hits if item.get("url")]
    suspicious_domains = set(detect_typosquatting(payload.domain_name, observed_domains))

    relevant_hits = []
    for item in raw_hits:
        if not item.get("url"):
            continue
        if is_relevant(item.get("title", ""), item.get("snippet", ""), payload.company_name, keywords):
            relevant_hits.append(item)

    filtered_count = len(raw_hits) - len(relevant_hits)

    findings: List[Finding] = []
    for item in relevant_hits:
        finding_type, risk_level, score = classify_text(
            item["title"],
            item["snippet"],
            item["url"],
            payload.domain_name,
            payload.company_name,
        )
        domain = item["url"].replace("https://", "").split("/")[0]
        if domain in suspicious_domains:
            finding_type = "fake_domain"
            risk_level = "high"
            score = max(score, 82)

        confidence = calculate_confidence(item["title"], item["snippet"], finding_type, risk_level)
        verification_status = compute_verification_status(item["url"], payload.domain_name, risk_level)

        findings.append(
            Finding(
                source=item["source"],
                title=item["title"],
                url=item["url"],
                snippet=item["snippet"],
                finding_type=finding_type,
                risk_level=risk_level,
                score=score,
                verification_status=verification_status,
            )
        )

    findings = deduplicate_findings(findings)
    findings.sort(key=lambda f: f.score, reverse=True)
    findings = findings[:20]

    result = BrandScanResponse(
        company_name=payload.company_name,
        total_findings=len(findings),
        high_risk_count=len([f for f in findings if f.risk_level in {"high", "critical"}]),
        filtered_count=filtered_count,
        findings=findings,
    )
    save_scan_result(result.model_dump())
    return result
