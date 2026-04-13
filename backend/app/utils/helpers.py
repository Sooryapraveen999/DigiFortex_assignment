from typing import Iterable, List


def normalize_keywords(values: Iterable[str]) -> List[str]:
    return [v.strip().lower() for v in values if v and v.strip()]
