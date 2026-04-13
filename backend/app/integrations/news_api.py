import os
from typing import Dict, List

import requests


def fetch_news_mentions(company_name: str, keywords: List[str]) -> List[Dict[str, str]]:
    api_key = os.getenv("NEWS_API_KEY")
    query = " OR ".join([company_name, *keywords][:5]) or company_name

    if not api_key:
        raise ValueError("Missing NEWS_API_KEY in environment")

    response = requests.get(
        "https://newsapi.org/v2/everything",
        params={
            "q": query,
            "language": "en",
            "sortBy": "publishedAt",
            "pageSize": 10,
            "apiKey": api_key,
        },
        timeout=10,
    )
    response.raise_for_status()
    payload = response.json()
    articles = payload.get("articles", [])
    return [
        {
            "source": "news",
            "title": item.get("title") or "Untitled article",
            "url": item.get("url") or "",
            "snippet": item.get("description") or item.get("content") or "No description available.",
        }
        for item in articles
        if item.get("url")
    ]
