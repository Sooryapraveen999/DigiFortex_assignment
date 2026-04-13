import os
from typing import Dict, List

import requests


def fetch_search_results(company_name: str, domain_name: str) -> List[Dict[str, str]]:
    api_key = os.getenv("SERPAPI_API_KEY")
    query = f"{company_name} {domain_name} login support"

    if not api_key:
        raise ValueError("Missing SERPAPI_API_KEY in environment")

    response = requests.get(
        "https://serpapi.com/search.json",
        params={
            "engine": "google",
            "q": query,
            "api_key": api_key,
            "num": 10,
        },
        timeout=10,
    )
    response.raise_for_status()
    payload = response.json()
    organic = payload.get("organic_results", [])
    return [
        {
            "source": "search",
            "title": item.get("title") or "Untitled result",
            "url": item.get("link") or "",
            "snippet": item.get("snippet") or "No snippet available.",
        }
        for item in organic
        if item.get("link")
    ]
