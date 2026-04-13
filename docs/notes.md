# Documentation Notes

## Data Sources

- News API adapter (prototype/mock fallback)
- Search results adapter (prototype/mock fallback)
- Domain similarity checker for typosquatting heuristics

## Assumptions

- Prototype mode can run without external API keys
- Severity is heuristic-based with optional AI-style categorization
- Dashboard prioritizes quick analyst triage over deep forensic workflows

## Limitations

- Public data connectors are simplified
- Social impersonation checks are keyword-driven, not account-verified
- No screenshot/logo image analysis in this prototype

## Suggested Improvements

- Add async task queue for scheduled monitoring
- Introduce auth and multi-tenant org support
- Add richer LLM-based summarization and analyst feedback loop
