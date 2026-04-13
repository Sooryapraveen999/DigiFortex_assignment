from difflib import SequenceMatcher
from typing import Iterable, List


def detect_typosquatting(base_domain: str, observed_domains: Iterable[str]) -> List[str]:
    suspicious: List[str] = []
    clean_base = base_domain.replace("www.", "").lower()
    for domain in observed_domains:
        clean = domain.replace("www.", "").lower()
        similarity = SequenceMatcher(None, clean_base, clean).ratio()
        if clean != clean_base and similarity > 0.72:
            suspicious.append(domain)
    return suspicious
