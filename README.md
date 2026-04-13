# Brand Monitoring Tool

Multi-layered full-stack prototype for monitoring brand misuse and reputational risk.

## Architecture

- Frontend: Next.js dashboard and search flow
- Backend: FastAPI with clean, layered modules
  - API Layer: request/response endpoints
  - Service Layer: orchestration and business logic
  - Integration Layer: source adapters for data collection
  - AI Layer: risk categorization and severity scoring
  - Database Layer: persistence helpers

## Project Structure

- `frontend/` Next.js application
- `backend/` FastAPI application
- `docs/` Notes for assumptions and improvements

## Backend Setup

1. Create and activate virtual environment
2. Install dependencies:
   - `pip install -r backend/requirements.txt`
3. Configure environment in `.env` or `backend/.env`:
   - `DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/brand_monitoring`
   - `NEWS_API_KEY=...`
   - `SERPAPI_API_KEY=...`
4. Run API:
   - `uvicorn app.main:app --reload --port 8000` from `backend/`

### Backend Endpoints

- `POST /api/scan` run brand monitoring scan
- `GET /api/dashboard/summary` aggregate counts for dashboard
- `GET /api/dashboard/recent?limit=10` recent scans for timeline table

## Frontend Setup

1. Install dependencies:
   - `npm install` from `frontend/`
2. Run app:
   - `npm run dev`

The frontend expects backend URL in `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8000`).

## Notes

- Integrations use real NewsAPI and SerpAPI when keys are present.
- If keys are missing or calls fail, fallback data is used so demos still work.
- Scan records are persisted to PostgreSQL and used in dashboard summary widgets.
