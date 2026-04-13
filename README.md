# BrandGuard - Brand Monitoring System

A comprehensive full-stack brand monitoring and risk detection system that identifies brand misuse, domain impersonation, and reputational risks across multiple sources.

## Overview

BrandGuard provides real-time monitoring of brand mentions, detects potential impersonation attempts, and delivers AI-powered risk analysis to help organizations protect their brand reputation. The system aggregates data from news sources and search engines, classifies findings by risk level, and provides actionable insights through an intuitive dashboard.

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect)
- **Authentication**: localStorage-based session management
- **Build Tool**: Next.js built-in bundler

### Backend
- **Framework**: FastAPI (Python 3.13)
- **Database**: PostgreSQL with psycopg2
- **External APIs**: NewsAPI, SerpAPI
- **AI/ML**: Custom text classification for risk detection
- **Environment**: python-dotenv for configuration

## Features

### Brand Scanning & Analysis
- **Multi-source data collection**: Aggregates brand mentions from news articles and search results
- **Relevance filtering**: Automatically filters results based on brand keywords and domain verification
- **Risk classification**: Categorizes findings into Low, Medium, High, and Critical risk levels
- **Verification status**: Marks findings as Verified (official domain), Suspicious (high risk), or Irrelevant
- **Confidence scoring**: Provides confidence scores for each finding based on text quality and risk indicators
- **Deduplication**: Removes duplicate findings based on URL similarity
- **Result limiting**: Returns top 20-30 most relevant findings to focus on high-priority risks

### AI-Powered Analysis
- **Text classification**: Custom AI classifier identifies finding types (brand_mention, fake_domain, social_impersonation, negative_mention, unauthorized_use)
- **Risk scoring**: Weighted scoring system based on severity indicators and context
- **AI risk summaries**: Generates human-readable risk reports with recommendations
- **Typosquatting detection**: Identifies suspicious domain variations that may impersonate the brand

### Authentication & Security
- **Basic authentication**: Simple login system with hardcoded credentials
- **Session management**: Uses localStorage for authentication state persistence
- **Route protection**: Protected routes for dashboard, scan, and history pages
- **Logout functionality**: Secure logout with session clearing and redirection

### Dashboard & Analytics
- **Real-time metrics**: Displays total scans, findings, and high-risk counts
- **Risk distribution**: Visual charts showing risk level breakdown
- **Recent activity**: Timeline of recent scans with quick access to details
- **AI risk reports**: Comprehensive analysis with actionable recommendations

### Scan Management
- **Scan workspace**: Intuitive form for configuring brand scans
- **Company details**: Input for company name, brand keywords, domain, products/services, and social handles
- **Progress tracking**: Multi-step scan execution with status updates
- **Results display**: Organized findings with badges, snippets, and AI analysis
- **History tracking**: View and revisit past scans with full details

### UI/UX Design
- **Modern interface**: Clean, professional design with consistent styling
- **Responsive layout**: Works across desktop and mobile devices
- **Intuitive navigation**: Sidebar-based navigation with clear route indicators
- **Visual indicators**: Color-coded badges for risk levels and verification status

## Architecture

### Backend Layers
- **API Layer**: RESTful endpoints for scan execution and data retrieval
- **Service Layer**: Business logic orchestration and data processing
- **Integration Layer**: External API adapters for NewsAPI and SerpAPI
- **AI Layer**: Text classification and risk assessment algorithms
- **Database Layer**: PostgreSQL persistence with connection pooling

### Frontend Structure
- **App Router**: Next.js 14 App Router for file-based routing
- **Route Groups**: Organized routes with shared layouts
- **Component Library**: Reusable UI components (Card, Badge, Charts)
- **Service Layer**: API client with error handling and fallback data
- **Utility Layer**: Helper functions for risk metrics, history management, and AI text generation

## Project Structure

```
Assignment/
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   │   └── classifier.py          # AI text classification
│   │   ├── api/
│   │   │   └── routes.py              # API endpoints
│   │   ├── database/
│   │   │   └── db.py                  # Database connection and operations
│   │   ├── integrations/
│   │   │   ├── domain_checker.py      # Typosquatting detection
│   │   │   ├── news_api.py            # NewsAPI integration
│   │   │   └── serp_api.py            # SerpAPI integration
│   │   ├── models/
│   │   │   └── schemas.py             # Pydantic models
│   │   ├── services/
│   │   │   └── monitoring_service.py  # Brand scan orchestration
│   │   ├── utils/
│   │   │   └── helpers.py             # Utility functions
│   │   └── main.py                    # FastAPI application entry
│   ├── .env.example                   # Environment variables template
│   └── requirements.txt               # Python dependencies
├── frontend/
│   ├── app/
│   │   ├── (app)/                     # Route group for main application
│   │   │   ├── dashboard/
│   │   │   ├── history/
│   │   │   ├── scan/
│   │   │   └── layout.tsx             # Shared layout with AppShell
│   │   ├── login/
│   │   ├── layout.tsx                 # Root layout with AuthProvider
│   │   └── page.tsx                   # Landing page
│   ├── components/
│   │   ├── layout/                   # Layout components
│   │   ├── ui/                       # Reusable UI components
│   │   ├── charts/                   # Chart components
│   │   └── dashboard/                # Dashboard-specific components
│   ├── lib/
│   │   ├── auth.tsx                  # Authentication context
│   │   ├── history.ts                # History management
│   │   ├── types.ts                  # TypeScript types
│   │   └── utilities                 # Helper functions
│   ├── services/
│   │   └── api.ts                    # API client
│   └── styles/
│       ├── globals.css               # Global styles
│       └── app-shell.css             # App shell styles
├── .gitignore                        # Git ignore rules
└── README.md                         # This file
```

## Setup Instructions

### Prerequisites
- Python 3.13 or higher
- Node.js 18 or higher
- PostgreSQL database

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   source venv/bin/activate  # Linux/Mac
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the backend directory with your database URL and API keys.

5. **Run the backend server**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## API Endpoints

### POST /api/scan
Run a brand monitoring scan.

**Request Body:**
```json
{
  "company_name": "Stripe",
  "brand_keywords": ["stripe", "payments", "fintech"],
  "domain_name": "stripe.com",
  "products_or_services": ["payment processing", "subscriptions"],
  "social_handles": ["@stripe", "stripe"]
}
```

**Response:**
```json
{
  "company_name": "Stripe",
  "total_findings": 15,
  "high_risk_count": 3,
  "filtered_count": 8,
  "findings": [
    {
      "source": "search",
      "title": "Example finding",
      "url": "https://example.com",
      "snippet": "Example snippet",
      "finding_type": "brand_mention",
      "risk_level": "low",
      "score": 25,
      "verification_status": "verified"
    }
  ]
}
```

### GET /api/dashboard/summary
Get aggregate counts for the dashboard.

**Response:**
```json
{
  "total_scans": 42,
  "total_findings": 315,
  "total_high_risk": 28
}
```

### GET /api/dashboard/recent?limit=10
Get recent scans for the history timeline.

**Response:**
```json
[
  {
    "id": 1,
    "company_name": "Shopify",
    "total_findings": 12,
    "high_risk_count": 4,
    "created_at": "2026-04-13T12:00:00"
  }
]
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

## Authentication

The application uses a basic authentication system for demonstration purposes with localStorage-based session management.

**Protected Routes:**
- `/dashboard` - Main dashboard with metrics and recent activity
- `/scan` - Scan configuration and execution
- `/history` - Scan history and detailed results

**Authentication Flow:**
1. User enters credentials on login page
2. Credentials are validated against hardcoded values
3. On successful login, authentication state is stored in localStorage
4. User is redirected to dashboard
5. Protected routes check authentication status and redirect to login if not authenticated
6. Logout clears localStorage and redirects to login page

## Testing the Application

### Manual Testing via Web Interface

1. **Start both servers**
   - Backend: `cd backend && uvicorn app.main:app --reload --port 8000`
   - Frontend: `cd frontend && npm run dev`

2. **Login to the application**
   - Navigate to `http://localhost:3000/login`
   - Enter credentials: `admin@brandguard.com` / `admin123`

3. **Run a brand scan**
   - Navigate to Scan page
   - Fill in company details (e.g., Stripe, Shopify, Notion, Figma)
   - Submit the scan
   - Review results with risk analysis and AI summaries

4. **View scan history**
   - Navigate to History page
   - View recent scans from the database
   - Click on any scan to view detailed findings

### API Testing via PowerShell

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:8000/api/scan" -ContentType "application/json" -Body '{
    "company_name": "Stripe",
    "brand_keywords": ["stripe", "payments", "fintech", "online payments"],
    "domain_name": "stripe.com",
    "products_or_services": ["payment processing", "subscriptions", "financial infrastructure"],
    "social_handles": ["@stripe", "stripe"]
}'
```

## Build & Deployment

### Frontend Build

```bash
cd frontend
npm run build
```

The build output is optimized for production and includes:
- Minified JavaScript and CSS
- Static page generation
- Optimized assets
- TypeScript type checking

### Production Deployment

For production deployment, ensure:
1. Environment variables are properly configured
2. PostgreSQL database is accessible
3. API keys for NewsAPI and SerpAPI are provided
4. Build the frontend and serve with a production web server (e.g., Nginx)
5. Run the backend with a production ASGI server (e.g., Gunicorn with Uvicorn workers)

## Error Handling & Stability

### Backend Error Handling
- Comprehensive try-catch blocks in all API endpoints
- Graceful fallback to empty data when external APIs fail
- Environment variable validation at startup
- Detailed error logging for debugging

### Frontend Error Handling
- Try-catch blocks in all API calls
- Fallback data when backend is unavailable
- User-friendly error messages
- Loading states for better UX

## Notes & Considerations

- **API Keys**: The system works with or without API keys. When keys are missing, it uses fallback data for demonstration purposes.
- **Database**: PostgreSQL is required for persistent scan storage. Without it, scans are only stored in localStorage.
- **Authentication**: The current authentication system is basic and intended for demonstration. For production, implement proper authentication with JWT or OAuth.
- **Rate Limiting**: External APIs have rate limits. Consider implementing caching and rate limiting for production use.
- **Data Privacy**: Ensure compliance with data privacy regulations when processing brand-related data.

## Future Enhancements

- **Advanced Authentication**: Implement OAuth/JWT for production-grade security
- **Real-time Monitoring**: WebSocket support for real-time scan updates
- **Alert System**: Email/SMS notifications for high-risk findings
- **Custom Brand Rules**: Allow users to configure custom detection rules
- **Multi-brand Support**: Support monitoring multiple brands simultaneously
- **Export Functionality**: Export scan results as PDF or CSV reports
- **API Rate Limiting**: Implement rate limiting for external API calls
- **Caching Layer**: Add Redis caching for improved performance
- **User Management**: Multi-user support with role-based access control
